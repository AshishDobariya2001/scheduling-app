import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import { formatDateTime, capitalizeFirst } from '../../utils/helpers';
import { TASK_STATUS_COLORS } from '../../utils/constants';
import Loading from '../Common/Loading';
import { useTaskHistoryContext } from '../../contexts/TaskHistoryContext';
import ResponseDisplay from './ResponseDisplay';
import ErrorDisplay from './ErrorDisplay';

const TaskHistory = React.memo(({ taskId, taskName, onBack }) => {
  const { fetchTaskHistory, isLoading, getError } = useTaskHistoryContext();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let isMounted = true;
    
    if (taskId) {
      const loadHistory = async () => {
        try {
          const historyData = await fetchTaskHistory(taskId);
          if (isMounted) {
            setHistory(historyData);
          }
        } catch (error) {
          // Error is handled by the context
        }
      };
      loadHistory();
    }

    return () => {
      isMounted = false;
    };
  }, [taskId, fetchTaskHistory]);

  // Get current state from context
  const loading = isLoading(taskId);
  const error = getError(taskId);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'retry':
        return <RotateCcw className="h-5 w-5 text-orange-500" />;
      case 'running':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const colorClass = TASK_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {capitalizeFirst(status)}
      </span>
    );
  };

  const getResponseCodeColor = (code) => {
    if (code >= 200 && code < 300) return 'text-green-600';
    if (code >= 400 && code < 500) return 'text-yellow-600';
    if (code >= 500) return 'text-red-600';
    return 'text-gray-600';
  };

  if (loading) {
    return <Loading text="Loading task history..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchTaskHistory(taskId, true)}
          className="mt-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task History</h2>
            <p className="text-gray-600">{taskName}</p>
          </div>
        </div>
      </div>

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-center py-12">
          <Clock className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No history found</h3>
          <p className="mt-1 text-sm text-gray-500">
            This task hasn't been executed yet.
          </p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {history.map((entry) => (
              <li key={entry.id} className="px-6 py-4">
                <div className="flex items-start space-x-4">
                  {/* Status Icon */}
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(entry.status)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(entry.status)}
                        {entry.attemptNumber > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                            Retry #{entry.attemptNumber - 1}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>Response: {entry.responseTime}ms</span>
                        <span className={getResponseCodeColor(entry.statusCode)}>
                          {entry.statusCode}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2">
                      <p className="text-sm text-gray-900">
                        {entry.error || (entry.response ? 'Task executed successfully' : 'Task executed')}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Executed at {formatDateTime(entry.executedAt)}
                      </p>
                    </div>

                    {/* Response and Error Details */}
                    <div className="mt-3 space-y-3">
                      {/* Response Display */}
                      {entry.response && (
                        <ResponseDisplay 
                          response={entry.response} 
                          statusCode={entry.statusCode}
                        />
                      )}
                      
                      {/* Error Display */}
                      {entry.error && (
                        <ErrorDisplay 
                          error={entry.error} 
                          statusCode={entry.statusCode}
                        />
                      )}
                      
                      {/* Basic Details */}
                      {entry.statusCode && (
                        <div className="p-3 bg-gray-50 rounded-md">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="font-medium text-gray-700">Response Code:</span>
                              <span className={`ml-2 ${getResponseCodeColor(entry.statusCode)}`}>
                                {entry.statusCode}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-gray-700">Response Time:</span>
                              <span className="ml-2 text-gray-600">{entry.responseTime}ms</span>
                            </div>
                            {entry.attemptNumber > 1 && (
                              <div>
                                <span className="font-medium text-gray-700">Retry Count:</span>
                                <span className="ml-2 text-gray-600">{entry.attemptNumber - 1}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Summary */}
      {history.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Executions</p>
              <p className="text-lg font-semibold text-gray-900">{history.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-lg font-semibold text-green-600">
                {history.filter(h => h.status === 'completed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-lg font-semibold text-red-600">
                {history.filter(h => h.status === 'failed').length}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Average Response</p>
              <p className="text-lg font-semibold text-gray-900">
                {Math.round(history.reduce((sum, h) => sum + h.responseTime, 0) / history.length)}ms
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default TaskHistory; 