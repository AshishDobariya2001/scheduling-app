// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api/v1';

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  TASKS: {
    CREATE: '/task',
    GET_ALL: '/task',
    GET_BY_ID: (id) => `/task/${id}`,
    UPDATE: (id) => `/task/${id}`,
    DELETE: (id) => `/task/${id}`,
    GET_HISTORY: (id) => `/task/${id}/history`,
    GET_ALL_HISTORY: '/task/history/all',
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
  PATCH: 'PATCH',
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  RUNNING: 'running',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  RETRY: 'retry',
};

// Task Status Colors
export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: 'bg-yellow-100 text-yellow-800',
  [TASK_STATUS.RUNNING]: 'bg-blue-100 text-blue-800',
  [TASK_STATUS.COMPLETED]: 'bg-green-100 text-green-800',
  [TASK_STATUS.FAILED]: 'bg-red-100 text-red-800',
  [TASK_STATUS.CANCELLED]: 'bg-gray-100 text-gray-800',
  [TASK_STATUS.RETRY]: 'bg-orange-100 text-orange-800',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
};

// Form Validation
export const VALIDATION_RULES = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  URL: /^https?:\/\/.+/,
  PASSWORD_MIN_LENGTH: 6,
};

// Default Values
export const DEFAULT_VALUES = {
  MAX_RETRY: 3,
  SCHEDULED_TIME_OFFSET: 5, // minutes from now
}; 