import React, { createContext, useContext, useState, useCallback } from 'react';
import { taskService } from '../services/taskService';

const TaskHistoryContext = createContext();

export const useTaskHistoryContext = () => {
  const context = useContext(TaskHistoryContext);
  if (!context) {
    throw new Error('useTaskHistoryContext must be used within a TaskHistoryProvider');
  }
  return context;
};

export const TaskHistoryProvider = ({ children }) => {
  const [historyCache, setHistoryCache] = useState(new Map());
  const [loadingStates, setLoadingStates] = useState(new Map());
  const [errorStates, setErrorStates] = useState(new Map());
  const [pendingRequests, setPendingRequests] = useState(new Map());

  const fetchTaskHistory = useCallback(async (taskId, force = false) => {
    // Check if we have cached data and it's recent (within 30 seconds)
    const cachedData = historyCache.get(taskId);
    const now = Date.now();
    const cacheAge = cachedData ? now - cachedData.timestamp : Infinity;
    
    if (!force && cachedData && cacheAge < 30000) {
      return cachedData.history;
    }

    // Check if there's already a pending request for this taskId
    if (pendingRequests.has(taskId)) {
      return pendingRequests.get(taskId);
    }

    // Set loading state for this specific task
    setLoadingStates(prev => new Map(prev).set(taskId, true));
    setErrorStates(prev => new Map(prev).set(taskId, null));

    const requestPromise = (async () => {
      try {
        const response = await taskService.getTaskHistory(taskId);
        const history = response.data?.history || [];
        
        // Cache the result with timestamp
        setHistoryCache(prev => new Map(prev).set(taskId, {
          history,
          timestamp: now
        }));
        
        setLoadingStates(prev => new Map(prev).set(taskId, false));
        return history;
      } catch (error) {
        const errorMessage = 'Failed to load task history';
        setErrorStates(prev => new Map(prev).set(taskId, errorMessage));
        setLoadingStates(prev => new Map(prev).set(taskId, false));
        console.error('Error fetching task history:', error);
        throw error;
      } finally {
        // Remove from pending requests
        setPendingRequests(prev => {
          const newMap = new Map(prev);
          newMap.delete(taskId);
          return newMap;
        });
      }
    })();

    // Store the pending request
    setPendingRequests(prev => new Map(prev).set(taskId, requestPromise));
    return requestPromise;
  }, []); 

  const clearTaskHistory = useCallback((taskId) => {
    setHistoryCache(prev => {
      const newMap = new Map(prev);
      newMap.delete(taskId);
      return newMap;
    });
    setLoadingStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(taskId);
      return newMap;
    });
    setErrorStates(prev => {
      const newMap = new Map(prev);
      newMap.delete(taskId);
      return newMap;
    });
  }, []);

  const clearAllHistory = useCallback(() => {
    setHistoryCache(new Map());
    setLoadingStates(new Map());
    setErrorStates(new Map());
    setPendingRequests(new Map());
  }, []);

  const getTaskHistory = useCallback((taskId) => {
    return historyCache.get(taskId)?.history || [];
  }, [historyCache]);

  const isLoading = useCallback((taskId) => {
    return loadingStates.get(taskId) || false;
  }, [loadingStates]);

  const getError = useCallback((taskId) => {
    return errorStates.get(taskId) || null;
  }, [errorStates]);

  const value = {
    fetchTaskHistory,
    getTaskHistory,
    isLoading,
    getError,
    clearTaskHistory,
    clearAllHistory
  };

  return (
    <TaskHistoryContext.Provider value={value}>
      {children}
    </TaskHistoryContext.Provider>
  );
}; 