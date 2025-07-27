const { resCode } = require('../config/options');
const TaskRepository = require('../models/repositories/TaskRepostiroy');

exports.createTask = async (req, res, next) => {
  try {
    const { success, message, data } = await TaskRepository.createTask(req.body, req.user.id);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_CREATE).json({
      status: resCode.HTTP_CREATE,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskById = async (req, res, next) => {
  try {
    const { success, message, data } = await TaskRepository.getTaskById(req.params.id, req.user.id);
    if (!success) {
      return res.status(resCode.HTTP_NOT_FOUND).json({
        status: resCode.HTTP_NOT_FOUND,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTasks = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { success, message, data } = await TaskRepository.getAllTasks(req.user.id, page, limit);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { success, message, data } = await TaskRepository.updateTask(req.params.id, req.user.id, req.body);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { success, message } = await TaskRepository.deleteTask(req.params.id, req.user.id);
    if (!success) {
      return res.status(resCode.HTTP_NOT_FOUND).json({
        status: resCode.HTTP_NOT_FOUND,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
    });
  } catch (err) {
    next(err);
  }
};

exports.getTaskHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { success, message, data } = await TaskRepository.getTaskHistory(req.params.id, req.user.id, page, limit);
    if (!success) {
      return res.status(resCode.HTTP_NOT_FOUND).json({
        status: resCode.HTTP_NOT_FOUND,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllTaskHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const { success, message, data } = await TaskRepository.getAllTaskHistory(req.user.id, page, limit);
    if (!success) {
      return res.status(resCode.HTTP_BAD_REQUEST).json({
        status: resCode.HTTP_BAD_REQUEST,
        message: message,
      });
    }
    res.status(resCode.HTTP_OK).json({
      status: resCode.HTTP_OK,
      message,
      data,
    });
  } catch (err) {
    next(err);
  }
};
