import React, { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Clock, CheckCircle, XCircle, AlertCircle, Globe } from 'lucide-react';
import { useTasksContext } from '../contexts/TasksContext';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/helpers';
import { TASK_STATUS } from '../utils/constants';
import Loading from '../components/Common/Loading';

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks } = useTasksContext();

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const stats = useMemo(() => {
    if (!tasks) return { total: 0, pending: 0, running: 0, completed: 0, failed: 0 };
    
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === TASK_STATUS.PENDING).length,
      running: tasks.filter(t => t.status === TASK_STATUS.RUNNING).length,
      completed: tasks.filter(t => t.status === TASK_STATUS.COMPLETED).length,
      failed: tasks.filter(t => t.status === TASK_STATUS.FAILED).length,
    };
  }, [tasks]);

  const recentTasks = useMemo(() => {
    return tasks
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5);
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    const now = new Date();
    return tasks
      .filter(task => new Date(task.scheduledTime) > now)
      .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
      .slice(0, 5);
  }, [tasks]);

  if (loading) {
    return <Loading text="Loading dashboard..." />;
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
      {/* Welcome Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, User #{user?.id}!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your scheduled tasks.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Globe className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Running</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.running}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Task
          </Link>
          <Link
            to="/tasks"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View All Tasks
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            View History
          </Link>
        </div>
      </div>

      {/* Recent Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tasks</h3>
          </div>
          <div className="p-6">
            {recentTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tasks created yet.</p>
            ) : (
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(task.scheduledTime)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === TASK_STATUS.COMPLETED ? 'bg-green-100 text-green-800' :
                      task.status === TASK_STATUS.FAILED ? 'bg-red-100 text-red-800' :
                      task.status === TASK_STATUS.RUNNING ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/tasks"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Tasks</h3>
          </div>
          <div className="p-6">
            {upcomingTasks.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No upcoming tasks.</p>
            ) : (
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDateTime(task.scheduledTime)}
                      </p>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      task.status === TASK_STATUS.COMPLETED ? 'bg-green-100 text-green-800' :
                      task.status === TASK_STATUS.FAILED ? 'bg-red-100 text-red-800' :
                      task.status === TASK_STATUS.RUNNING ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4">
              <Link
                to="/tasks"
                className="text-sm text-primary-600 hover:text-primary-500"
              >
                View all tasks →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 