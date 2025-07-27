import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { getErrorMessage } from '../utils/helpers';

const TasksContext = createContext();

export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within a TasksProvider');
  }
  return context;
};

export const TasksProvider = ({ children }) => {
  const [state, setState] = useState({
    tasks: [],
    loading: false,
    error: null,
    lastFetched: null,
    retryCount: 0
  });

  const pendingRequests = new Map();

  const fetchTasks = useCallback(async (force = false) => {
    const now = Date.now();
    const timeSinceLastFetch = now - state.lastFetched;
    
    // Cache for 30 seconds unless forced
    if (!force && timeSinceLastFetch < 30000 && state.tasks.length > 0) {
      return;
    }

    const requestKey = 'fetchTasks';
    
    // Prevent duplicate requests
    if (pendingRequests.has(requestKey)) {
      return pendingRequests.get(requestKey);
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const promise = (async () => {
      try {
        const response = await taskService.getAllTasks();
        const tasks = response.data?.tasks || [];
        
        setState(prev => ({
          ...prev,
          tasks,
          loading: false,
          lastFetched: Date.now(),
          retryCount: 0
        }));
        
        return tasks;
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
          retryCount: prev.retryCount + 1
        }));
        throw error;
      } finally {
        pendingRequests.delete(requestKey);
      }
    })();

    pendingRequests.set(requestKey, promise);
    return promise;
  }, [state.lastFetched, state.tasks.length]);

  const createTask = useCallback(async (taskData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await taskService.createTask(taskData);
      const newTask = response.data?.data || response.data;
      
      setState(prev => ({
        ...prev,
        tasks: [newTask, ...prev.tasks],
        loading: false
      }));
      
      return newTask;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const deleteTask = useCallback(async (taskId) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      await taskService.deleteTask(taskId);
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.filter(task => task.id !== taskId),
        loading: false
      }));
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const updateTask = useCallback(async (taskId, taskData) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const response = await taskService.updateTask(taskId, taskData);
      const updatedTask = response.data?.data || response.data;
      
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(task => 
          task.id === taskId ? updatedTask : task
        ),
        loading: false
      }));
      
      // If task status changed, we might want to refresh history
      // This could be enhanced with a callback system
      
      return updatedTask;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const value = {
    ...state,
    fetchTasks,
    createTask,
    deleteTask,
    updateTask,
    clearError
  };

  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
}; 