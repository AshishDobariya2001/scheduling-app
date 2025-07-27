const { taskStatus, errorMessage, successMessage } = require('../../config/options');
const { Task, User, TaskHistory } = require('../index');
const { scheduleTask, cancelTask } = require('../helpers/AgendaHelper');
const { Op } = require('sequelize');

exports.createTask = async (data, loggedInUserId) => {
    const taskData = {
      name: data.name,
      userId: loggedInUserId,
      url: data.url,
      method: data.method,
      headers: data.headers || {},
      body: data.body || {},
      scheduledTime: data.scheduledTime,
      status: taskStatus.PENDING,
      retryCount: 0,
      maxRetry: data.maxRetry || 3,
      token: data.token || null
    };

    const task = await Task.create(taskData);
    
    await scheduleTask(task);
    
    return {
      success: true,
      message: successMessage.ADD_SUCCESS_MESSAGE('Task'),
      data: task,
    };
};

exports.getTaskById = async (taskId, userId) => {
  try {
    const task = await Task.findOne({
      where: { id: taskId, userId },
      include: [
        { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] },
        { model: TaskHistory, as: 'history', order: [['executedAt', 'DESC']] }
      ]
    });

    if (!task) {
      return {
        success: false,
        message: errorMessage.DOES_NOT_EXIST('Task'),
      };
    }

    return {
      success: true,
      message: successMessage.GET_SUCCESS_MESSAGE('Task'),
      data: task,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve task',
      data: null,
    };
  }
};

exports.getAllTasks = async (userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    const { count, rows: tasks } = await Task.findAndCountAll({
      where: { userId },
      attributes: ['id', 'name', 'status', 'scheduledTime', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    return {
      success: true,
      message: successMessage.GET_SUCCESS_MESSAGE('Tasks'),
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      },
    };
  
};

exports.updateTask = async (taskId, userId, updateData) => {
    const task = await Task.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      return {
        success: false,
        message: 'Task not found',
        data: null,
      };
    }

    if (task.status !== taskStatus.PENDING) {
      return {
        success: false,
        message: 'Cannot update task that is not in pending status',
        data: null,
      };
    }

    await cancelTask(taskId);

    await task.update(updateData);

    if (updateData.scheduledTime) {
      await scheduleTask(task);
    }

    return {
      success: true,
      message: successMessage.UPDATE_SUCCESS_MESSAGE('Task'),
      data: task,
    };
};

exports.deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      return {
        success: false,
        message: 'Task not found',
        data: null,
      };
    }

    await cancelTask(taskId);

    await task.destroy();

    return {
      success: true,
      message: successMessage.DELETE_SUCCESS_MESSAGE('Task'),
    };
};

exports.getTaskHistory = async (taskId, userId, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;
    
    const task = await Task.findOne({
      where: { id: taskId, userId }
    });

    if (!task) {
      return {
        success: false,
        message: errorMessage.DOES_NOT_EXIST('Task'),
      };
    }

    const { count, rows: history } = await TaskHistory.findAndCountAll({
      where: { taskId },
      order: [['executedAt', 'DESC']],
      limit,
      offset
    });

    return {
      success: true,
      message: successMessage.GET_SUCCESS_MESSAGE('Task history'),
      data: {
        history,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      },
    };

};

exports.getAllTaskHistory = async (userId, page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;
    
    const { count, rows: history } = await TaskHistory.findAndCountAll({
      include: [
        {
          model: Task,
          as: 'task',
          where: { userId },
          include: [
            { model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }
          ]
        }
      ],
      order: [['executedAt', 'DESC']],
      limit,
      offset
    });

    return {
      success: true,
      message: 'All task history retrieved successfully',
      data: {
        history,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit)
        }
      },
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || 'Failed to retrieve task history',
      data: null,
    };
  }
};