import { apiService } from './api';
import { API_ENDPOINTS, STORAGE_KEYS } from '../utils/constants';
import { setToStorage, removeFromStorage } from '../utils/helpers';

export const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.REGISTER, userData);
      
      // Store token and user data if registration includes login
      if (response.data.data && response.data.data.accessToken) {
        setToStorage(STORAGE_KEYS.AUTH_TOKEN, response.data.data.accessToken);
        setToStorage(STORAGE_KEYS.USER_DATA, response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await apiService.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
      
      // Store token and user data based on actual API response structure
      if (response.data.data.accessToken) {
        setToStorage(STORAGE_KEYS.AUTH_TOKEN, response.data.data.accessToken);
        setToStorage(STORAGE_KEYS.USER_DATA, response.data.data.user);
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout user
  logout: () => {
    removeFromStorage(STORAGE_KEYS.AUTH_TOKEN);
    removeFromStorage(STORAGE_KEYS.USER_DATA);
  },

  // Get current user
  getCurrentUser: () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    return !!token;
  },

  // Get auth token
  getToken: () => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  },
}; 