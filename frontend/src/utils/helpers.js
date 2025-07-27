import { format, parseISO } from 'date-fns';

// Date and Time Helpers
export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy HH:mm:ss');
  } catch (error) {
    return dateString;
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'MMM dd, yyyy');
  } catch (error) {
    return dateString;
  }
};

export const formatTime = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, 'HH:mm:ss');
  } catch (error) {
    return dateString;
  }
};

// Convert local date to UTC ISO string
export const toUTCISOString = (date) => {
  if (!date) return null;
  const localDate = new Date(date);
  return localDate.toISOString();
};

// Format date for datetime-local input (YYYY-MM-DDTHH:mm)
export const formatDateTimeForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
    return format(date, "yyyy-MM-dd'T'HH:mm");
  } catch (error) {
    return '';
  }
};

// Get current UTC time plus offset
export const getScheduledTime = (minutesOffset = 5) => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesOffset);
  return toUTCISOString(now);
};

// Validation Helpers
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

// Local Storage Helpers
export const getFromStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// String Helpers
export const capitalizeFirst = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Object Helpers
export const isEmpty = (obj) => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (obj instanceof Map || obj instanceof Set) return obj.size === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Error Handling
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  // Handle the actual API response structure
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.response?.data?.error) return error.response.data.error;
  if (error?.message) return error.message;
  return 'An unexpected error occurred';
};

// Response Handling Functions
export const detectResponseType = (response) => {
  if (!response) return 'empty';
  
  // Check if it's binary data (contains non-printable characters)
  if (typeof response === 'string') {
    const hasBinaryChars = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(response);
    if (hasBinaryChars) return 'binary';
    
    // Check if it's JSON
    try {
      JSON.parse(response);
      return 'json';
    } catch {
      // Check if it's HTML
      if (response.includes('<html') || response.includes('<!DOCTYPE')) {
        return 'html';
      }
      // Check if it's XML
      if (response.includes('<?xml') || response.startsWith('<')) {
        return 'xml';
      }
      return 'text';
    }
  }
  
  return 'unknown';
};

export const formatResponseData = (response, type) => {
  if (!response) return { display: 'No response data', type: 'empty' };
  
  switch (type) {
    case 'json':
      try {
        const parsed = JSON.parse(response);
        return {
          display: JSON.stringify(parsed, null, 2),
          type: 'json',
          size: response.length
        };
      } catch {
        return { display: response, type: 'text', size: response.length };
      }
    
    case 'binary':
      return {
        display: 'Binary data detected',
        type: 'binary',
        size: response.length,
        preview: response.substring(0, 100) + (response.length > 100 ? '...' : '')
      };
    
    case 'html':
    case 'xml':
      return {
        display: response,
        type: type,
        size: response.length
      };
    
    case 'text':
    default:
      return {
        display: response,
        type: 'text',
        size: response.length
      };
  }
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const categorizeError = (error) => {
  if (!error) return { type: 'unknown', category: 'Unknown Error' };
  
  const errorStr = error.toLowerCase();
  
  // Network errors
  if (errorStr.includes('network') || errorStr.includes('timeout') || errorStr.includes('connection')) {
    return { type: 'network', category: 'Network Error' };
  }
  
  // HTTP status errors
  if (errorStr.includes('404')) return { type: 'not_found', category: 'Resource Not Found' };
  if (errorStr.includes('403')) return { type: 'forbidden', category: 'Access Forbidden' };
  if (errorStr.includes('401')) return { type: 'unauthorized', category: 'Unauthorized' };
  if (errorStr.includes('500')) return { type: 'server', category: 'Server Error' };
  if (errorStr.includes('400')) return { type: 'bad_request', category: 'Bad Request' };
  
  // Client errors
  if (errorStr.includes('invalid') || errorStr.includes('validation')) {
    return { type: 'validation', category: 'Validation Error' };
  }
  
  return { type: 'other', category: 'Error' };
}; 