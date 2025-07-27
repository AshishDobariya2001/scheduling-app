import React, { useState } from 'react';
import { Copy, ChevronDown, ChevronRight, FileText, Code, Image, File } from 'lucide-react';
import { detectResponseType, formatResponseData, formatFileSize } from '../../utils/helpers';

const ResponseDisplay = ({ response, statusCode }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!response) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
        <div className="flex items-center text-gray-500">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm">No response data</span>
        </div>
      </div>
    );
  }

  const responseType = detectResponseType(response);
  const formattedData = formatResponseData(response, responseType);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'json':
        return <Code className="h-4 w-4" />;
      case 'binary':
        return <Image className="h-4 w-4" />;
      case 'html':
      case 'xml':
        return <FileText className="h-4 w-4" />;
      default:
        return <File className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'json':
        return 'text-blue-600 bg-blue-50';
      case 'binary':
        return 'text-purple-600 bg-purple-50';
      case 'html':
        return 'text-orange-600 bg-orange-50';
      case 'xml':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const renderContent = () => {
    if (formattedData.type === 'binary') {
      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            Binary data detected ({formatFileSize(formattedData.size)})
          </div>
          {isExpanded && (
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
              <pre>{formattedData.preview}</pre>
            </div>
          )}
        </div>
      );
    }

    if (formattedData.type === 'json') {
      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            JSON Response ({formatFileSize(formattedData.size)})
          </div>
          {isExpanded && (
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
              <pre>{formattedData.display}</pre>
            </div>
          )}
        </div>
      );
    }

    if (formattedData.type === 'html' || formattedData.type === 'xml') {
      return (
        <div className="space-y-2">
          <div className="text-sm text-gray-600">
            {formattedData.type.toUpperCase()} Response ({formatFileSize(formattedData.size)})
          </div>
          {isExpanded && (
            <div className="bg-gray-900 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto max-h-96 overflow-y-auto">
              <pre>{formattedData.display}</pre>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-2">
        <div className="text-sm text-gray-600">
          Text Response ({formatFileSize(formattedData.size)})
        </div>
        {isExpanded && (
          <div className="bg-gray-50 border border-gray-200 p-3 rounded text-sm font-mono overflow-x-auto max-h-96 overflow-y-auto">
            <pre className="whitespace-pre-wrap">{formattedData.display}</pre>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          {getTypeIcon(formattedData.type)}
          <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(formattedData.type)}`}>
            {formattedData.type.toUpperCase()}
          </span>
          {statusCode && (
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              statusCode >= 200 && statusCode < 300 
                ? 'text-green-600 bg-green-50' 
                : 'text-red-600 bg-red-50'
            }`}>
              {statusCode}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy response"
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
      <div className="p-3">
        {renderContent()}
        
        {!isExpanded && formattedData.size > 100 && (
          <button
            onClick={() => setIsExpanded(true)}
            className="text-sm text-blue-600 hover:text-blue-700 mt-2"
          >
            Click to expand ({formatFileSize(formattedData.size)})
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

export default ResponseDisplay; 