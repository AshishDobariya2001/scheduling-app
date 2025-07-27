import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, Globe, Clock, Settings } from 'lucide-react';
import Modal from '../Common/Modal';
import { HTTP_METHODS, DEFAULT_VALUES } from '../../utils/constants';
import { validateURL, toUTCISOString, formatDateTimeForInput } from '../../utils/helpers';

const UpdateTaskModal = ({ isOpen, onClose, onSubmit, loading, task }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    defaultValues: {
      method: HTTP_METHODS.GET,
      maxRetry: DEFAULT_VALUES.MAX_RETRY,
    },
  });

  const selectedMethod = watch('method');

  // Pre-populate form when task changes
  useEffect(() => {
    if (task && isOpen) {
      setValue('name', task.name);
      setValue('url', task.url);
      setValue('method', task.method);
      setValue('maxRetry', task.maxRetry || DEFAULT_VALUES.MAX_RETRY);
      setValue('token', task.token || '');
      
      // Format scheduled time for datetime-local input
      if (task.scheduledTime) {
        const localDateTime = formatDateTimeForInput(task.scheduledTime);
        setValue('scheduledTime', localDateTime);
      }

      // Format headers and body for display
      if (task.headers) {
        setValue('headers', typeof task.headers === 'string' 
          ? task.headers 
          : JSON.stringify(task.headers, null, 2)
        );
      }

      if (task.body) {
        setValue('body', typeof task.body === 'string' 
          ? task.body 
          : JSON.stringify(task.body, null, 2)
        );
      }
    }
  }, [task, isOpen, setValue]);

  const handleFormSubmit = (data) => {
    // Convert scheduled time to UTC
    if (data.scheduledTime) {
      data.scheduledTime = toUTCISOString(data.scheduledTime);
    }

    // Convert headers and body to objects if they're strings
    if (data.headers && typeof data.headers === 'string') {
      try {
        data.headers = JSON.parse(data.headers);
      } catch (error) {
        data.headers = {};
      }
    }

    if (data.body && typeof data.body === 'string') {
      try {
        data.body = JSON.parse(data.body);
      } catch (error) {
        data.body = {};
      }
    }

    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  // Check if task can be updated
  const canUpdateTask = task && task.status === 'pending';

  if (!task) {
    return null;
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Task" size="lg">
      {!canUpdateTask && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <X className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                Task Cannot Be Updated
              </h3>
              <p className="mt-1 text-sm text-yellow-700">
                Only tasks with "pending" status can be updated. Current status: {task.status}
              </p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-900">Basic Information</h4>
          
          {/* Task Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Task Name *
            </label>
            <input
              id="name"
              type="text"
              {...register('name', {
                required: 'Task name is required',
                minLength: {
                  value: 2,
                  message: 'Task name must be at least 2 characters',
                },
              })}
              disabled={!canUpdateTask}
              className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              } ${!canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              placeholder="Enter task name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* URL */}
          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="url"
                type="url"
                {...register('url', {
                  required: 'URL is required',
                  validate: (value) => validateURL(value) || 'Please enter a valid URL',
                })}
                disabled={!canUpdateTask}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                } ${!canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="https://example.com/api/endpoint"
              />
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
            )}
          </div>

          {/* HTTP Method */}
          <div>
            <label htmlFor="method" className="block text-sm font-medium text-gray-700 mb-2">
              HTTP Method *
            </label>
            <select
              id="method"
              {...register('method', { required: 'HTTP method is required' })}
              disabled={!canUpdateTask}
              className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                !canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
            >
              {Object.values(HTTP_METHODS).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          {/* Scheduled Time */}
          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700 mb-2">
              Scheduled Time *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="scheduledTime"
                type="datetime-local"
                {...register('scheduledTime', {
                  required: 'Scheduled time is required',
                })}
                disabled={!canUpdateTask}
                className={`block w-full pl-10 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.scheduledTime ? 'border-red-300' : 'border-gray-300'
                } ${!canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''}`}
              />
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Time will be converted to UTC format
            </p>
            {errors.scheduledTime && (
              <p className="mt-1 text-sm text-red-600">{errors.scheduledTime.message}</p>
            )}
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            disabled={!canUpdateTask}
            className="flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            <Settings className="h-4 w-4 mr-2" />
            Advanced Options
            <X className={`h-4 w-4 ml-2 transition-transform ${showAdvanced ? 'rotate-45' : ''}`} />
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-4 border-t border-gray-200 pt-4">
            <h4 className="text-sm font-medium text-gray-900">Advanced Options</h4>
            
            {/* Max Retry */}
            <div>
              <label htmlFor="maxRetry" className="block text-sm font-medium text-gray-700 mb-2">
                Max Retry
              </label>
              <input
                id="maxRetry"
                type="number"
                min="1"
                max="10"
                {...register('maxRetry', {
                  min: { value: 1, message: 'Min retry is 1' },
                  max: { value: 10, message: 'Max retry is 10' },
                })}
                disabled={!canUpdateTask}
                className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  errors.maxRetry ? 'border-red-300' : 'border-gray-300'
                } ${!canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                placeholder="3"
              />
              {errors.maxRetry && (
                <p className="mt-1 text-sm text-red-600">{errors.maxRetry.message}</p>
              )}
            </div>

            {/* Token */}
            <div>
              <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                Token (Optional)
              </label>
              <input
                id="token"
                type="text"
                {...register('token')}
                disabled={!canUpdateTask}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  !canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder="Bearer token or API key"
              />
            </div>

            {/* Headers */}
            <div>
              <label htmlFor="headers" className="block text-sm font-medium text-gray-700 mb-2">
                Headers (Optional)
              </label>
              <textarea
                id="headers"
                {...register('headers')}
                rows="3"
                disabled={!canUpdateTask}
                className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                  !canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                placeholder='{"Content-Type": "application/json", "Authorization": "Bearer token"}'
              />
              <p className="mt-1 text-xs text-gray-500">
                Enter as valid JSON object
              </p>
            </div>

            {/* Body - Only show for POST, PUT, PATCH */}
            {(selectedMethod === HTTP_METHODS.POST || 
              selectedMethod === HTTP_METHODS.PUT || 
              selectedMethod === HTTP_METHODS.PATCH) && (
              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-2">
                  Request Body (Optional)
                </label>
                <textarea
                  id="body"
                  {...register('body')}
                  rows="4"
                  disabled={!canUpdateTask}
                  className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 ${
                    !canUpdateTask ? 'bg-gray-100 cursor-not-allowed' : ''
                  }`}
                  placeholder='{"key": "value", "data": "example"}'
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter as valid JSON object
                </p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || !canUpdateTask}
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Updating...' : 'Update Task'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateTaskModal; 