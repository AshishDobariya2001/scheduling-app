import { apiService } from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const taskService = {
  // Create new task
  createTask: async (taskData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.TASKS.CREATE, taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all tasks
  getAllTasks: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TASKS.GET_ALL);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task by ID
  getTaskById: async (taskId) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TASKS.GET_BY_ID(taskId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update task
  updateTask: async (taskId, taskData) => {
    try {
      const response = await apiService.put(API_ENDPOINTS.TASKS.UPDATE(taskId), taskData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete task
  deleteTask: async (taskId) => {
    try {
      const response = await apiService.delete(API_ENDPOINTS.TASKS.DELETE(taskId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get task history
  getTaskHistory: async (taskId) => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TASKS.GET_HISTORY(taskId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all task history
  getAllTaskHistory: async () => {
    try {
      const response = await apiService.get(API_ENDPOINTS.TASKS.GET_ALL_HISTORY);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
}; 