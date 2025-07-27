import React, { useState } from 'react';
import toast from 'react-hot-toast';
import TaskHistory from '../components/Task/TaskHistory';
import TaskList from '../components/Task/TaskList';
import { useTasksContext } from '../contexts/TasksContext';

const TasksPage = () => {
  const { tasks, loading, error, fetchTasks, createTask, deleteTask, updateTask } = useTasksContext();
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [selectedTaskName, setSelectedTaskName] = useState('');

  // Fetch tasks when component mounts
  React.useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      toast.success('Task created successfully!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      toast.success('Task deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleUpdateTask = async (taskId, taskData) => {
    try {
      await updateTask(taskId, taskData);
      toast.success('Task updated successfully!');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const handleViewHistory = (taskId, taskName) => {
    setSelectedTaskId(taskId);
    setSelectedTaskName(taskName);
  };

  const handleBackFromHistory = () => {
    setSelectedTaskId(null);
    setSelectedTaskName('');
  };

  if (selectedTaskId) {
    return (
      <TaskHistory
        taskId={selectedTaskId}
        taskName={selectedTaskName}
        onBack={handleBackFromHistory}
      />
    );
  }

  return (
    <TaskList
      tasks={tasks}
      loading={loading}
      error={error}
      onCreateTask={handleCreateTask}
      onDeleteTask={handleDeleteTask}
      onUpdateTask={handleUpdateTask}
      onViewHistory={handleViewHistory}
    />
  );
};

export default TasksPage; 