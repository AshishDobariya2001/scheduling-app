const db = require('../models');
const options = require('../config/options');
const axios = require('axios');
const { Op } = require('sequelize');
const EmailService = require('./EmailService');

async function executeTask(task) {
  const start = Date.now();
  let status = options.taskStatus.COMPLETED;
  let response = null;
  let error = null;
  let statusCode = null;
  try {
    const axiosConfig = {
      method: task.method,
      url: task.url,
      headers: task.headers || {},
      timeout: options.WAIT_TIMEOUT * 1000,
      data: task.body || undefined,
    };
    if (task.token) {
      axiosConfig.headers = { ...axiosConfig.headers, Authorization: `Bearer ${task.token}` };
    }
    const res = await axios(axiosConfig);
    response = res.data;
    statusCode = res.status;
    if (res.status < 200 || res.status >= 300) {
      status = options.taskStatus.FAILED;
      error = `Non-success status code: ${res.status}`;
    }
  } catch (err) {
    status = options.taskStatus.FAILED;
    error = err.message;
    statusCode = err.response ? err.response.status : null;
  }
  const responseTime = Date.now() - start;
  await db.TaskHistory.create({
    taskId: task.id,
    status,
    attemptNumber: task.retryCount + 1,
    executedAt: new Date(),
    response,
    error,
    responseTime,
    statusCode,
  });
  return { status, response, error, statusCode };
}

async function processDueTasks() {
  const now = new Date();
  const dueTasks = await db.Task.findAll({
    where: {
      status: options.taskStatus.PENDING,
      scheduledTime: { [Op.lte]: now },
    },
  });
  for (const task of dueTasks) {
    const { status, error } = await executeTask(task);
    if (status === options.taskStatus.COMPLETED) {
      await task.update({ status: options.taskStatus.COMPLETED, lastExecutedAt: new Date() });
    } else {
      // Failure or timeout
      const newRetryCount = task.retryCount + 1;
      if (newRetryCount >= (task.maxRetry || options.MAX_RETRIES)) {
        await task.update({ status: options.taskStatus.FAILED, retryCount: newRetryCount, error, lastExecutedAt: new Date() });
        await EmailService.notifyFailure(task, error);
      } else {
        const nextExecutionAt = new Date(Date.now() + options.RETRY_OFFSET * 60 * 60 * 1000);
        await task.update({ status: options.taskStatus.RETRY, retryCount: newRetryCount, nextExecutionAt, error, lastExecutedAt: new Date() });
        await EmailService.notifyFailure(task, error);
      }
    }
  }
}

function startScheduler() {
  setInterval(processDueTasks, 60 * 1000); // Check every minute
}

module.exports = { startScheduler }; 