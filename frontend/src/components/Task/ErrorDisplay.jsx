import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronRight, AlertTriangle, Wifi, Server, Shield, FileX } from 'lucide-react';
import { categorizeError } from '../../utils/helpers';

const ErrorDisplay = ({ error, statusCode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!error) {
    return null;
  }

  const errorInfo = categorizeError(error);

  const getErrorIcon = (type) => {
    switch (type) {
      case 'network':
        return <Wifi className="h-4 w-4" />;
      case 'server':
        return <Server className="h-4 w-4" />;
      case 'not_found':
        return <FileX className="h-4 w-4" />;
      case 'forbidden':
      case 'unauthorized':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getErrorColor = (type) => {
    switch (type) {
      case 'network':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'server':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'not_found':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'forbidden':
      case 'unauthorized':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'validation':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getErrorBackground = (type) => {
    switch (type) {
      case 'network':
        return 'bg-orange-50';
      case 'server':
        return 'bg-red-50';
      case 'not_found':
        return 'bg-blue-50';
      case 'forbidden':
      case 'unauthorized':
        return 'bg-yellow-50';
      case 'validation':
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(error);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const getErrorSuggestions = (type) => {
    switch (type) {
      case 'network':
        return [
          'Check your internet connection',
          'Verify the target URL is accessible',
          'Try again in a few moments'
        ];
      case 'server':
        return [
          'The server may be temporarily unavailable',
          'Check if the service is running',
          'Contact the service administrator'
        ];
      case 'not_found':
        return [
          'Verify the URL is correct',
          'Check if the resource still exists',
          'Ensure the endpoint is properly configured'
        ];
      case 'forbidden':
        return [
          'Check your authentication credentials',
          'Verify you have the required permissions',
          'Contact your administrator for access'
        ];
      case 'unauthorized':
        return [
          'Provide valid authentication credentials',
          'Check if your token/API key is valid',
          'Ensure you have proper authorization'
        ];
      case 'validation':
        return [
          'Check the request parameters',
          'Verify the data format is correct',
          'Review the API documentation'
        ];
      default:
        return [
          'Review the error details below',
          'Check the API documentation',
          'Contact support if the issue persists'
        ];
    }
  };

  return (
    <div className={`border rounded-md overflow-hidden ${getErrorColor(errorInfo.type)}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-3 ${getErrorBackground(errorInfo.type)} border-b`}>
        <div className="flex items-center space-x-2">
          {getErrorIcon(errorInfo.type)}
          <span className="font-medium text-sm">
            {errorInfo.category}
          </span>
          {statusCode && (
            <span className="px-2 py-1 rounded text-xs font-medium bg-white text-gray-700">
              {statusCode}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy error details"
          >
            <Copy className="h-4 w-4" />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 bg-white">
        {/* Error Message */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 font-medium mb-1">Error Message:</p>
          <p className="text-sm text-gray-600">{error}</p>
        </div>

        {/* Suggestions */}
        <div className="mb-3">
          <p className="text-sm text-gray-700 font-medium mb-2">Suggestions:</p>
          <ul className="text-sm text-gray-600 space-y-1">
            {getErrorSuggestions(errorInfo.type).map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-sm text-gray-700 font-medium mb-2">Error Details:</p>
            <div className="bg-gray-900 text-red-400 p-3 rounded text-xs font-mono overflow-x-auto">
              <pre>{error}</pre>
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {!isExpanded && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            Click to view detailed error information
          </button>
        )}
      </div>

      {/* Copy feedback */}
      {copied && (
        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs">
          Copied!
        </div>
      )}
    </div>
  );
};

export default ErrorDisplay; 