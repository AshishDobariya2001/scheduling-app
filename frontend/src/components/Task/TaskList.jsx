import React, { useState, useMemo } from 'react';
import { Plus, Search, Filter, Clock, Globe, Trash2, Edit, Eye } from 'lucide-react';
import { formatDateTime, capitalizeFirst } from '../../utils/helpers';
import { TASK_STATUS_COLORS, TASK_STATUS } from '../../utils/constants';
import CreateTaskModal from './CreateTaskModal';
import UpdateTaskModal from './UpdateTaskModal';
import Loading from '../Common/Loading';

const TaskList = React.memo(({ tasks, loading, error, onCreateTask, onDeleteTask, onViewHistory, onUpdateTask }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter tasks based on search and status
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    return filtered;
  }, [tasks, searchTerm, statusFilter]);

  const handleCreateTask = async (taskData) => {
    try {
      await onCreateTask(taskData);
      setShowCreateModal(false);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await onDeleteTask(taskId);
    }
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowUpdateModal(true);
  };

  const handleUpdateTask = async (taskData) => {
    try {
      await onUpdateTask(selectedTask.id, taskData);
      setShowUpdateModal(false);
      setSelectedTask(null);
    } catch (error) {
      // Error handling is done in the parent component
    }
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setSelectedTask(null);
  };

  const getStatusBadge = (status) => {
    const colorClass = TASK_STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
        {capitalizeFirst(status)}
      </span>
    );
  };

  if (loading) {
    return <Loading text="Loading tasks..." />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-600">Manage your scheduled tasks</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Status</option>
              {Object.values(TASK_STATUS).map((status) => (
                <option key={status} value={status}>
                  {capitalizeFirst(status)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Task Count */}
      <div className="text-sm text-gray-600">
        {filteredTasks.length} of {tasks.length} tasks
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {tasks.length === 0 ? 'Get started by creating your first task.' : 'Try adjusting your search or filter criteria.'}
          </p>
          {tasks.length === 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Task
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map((task) => (
              <li key={task.id} className="px-6 py-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <Globe className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {task.name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {formatDateTime(task.scheduledTime)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {task.id}
                        </span>
                        {getStatusBadge(task.status)}
                      </div>
                    </div>
                    
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {formatDateTime(task.scheduledTime)}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onViewHistory(task.id, task.name)}
                          className="text-gray-400 hover:text-gray-600"
                          title="View History"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleEditTask(task)}
                            className="text-gray-400 hover:text-blue-600"
                            title="Edit Task"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-gray-400 hover:text-red-600"
                          title="Delete Task"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateTask}
        loading={loading}
      />

      {/* Update Task Modal */}
      <UpdateTaskModal
        isOpen={showUpdateModal}
        onClose={handleCloseUpdateModal}
        onSubmit={handleUpdateTask}
        loading={loading}
        task={selectedTask}
      />
    </div>
  );
});

export default TaskList; 