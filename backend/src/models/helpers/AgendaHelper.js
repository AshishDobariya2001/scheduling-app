const Agenda = require('agenda');
const axios = require('axios');
const { Task, TaskHistory, User } = require('../index');
const { taskStatus } = require('../../config/options');
const EmailService = require('../../services/EmailService');

const mongoConnectionString = process.env.MONGODB_HOST

const agenda = new Agenda({ 
  db: { address: mongoConnectionString },
  timezone: 'UTC',
  defaultConcurrency: 5,
  maxConcurrency: 10,
  lockLifetime: 30000,
});

// Define the task execution job
const defineTaskExecutionJob = () => {
  agenda.define('executeTask', async (job) => {
    const { taskId } = job.attrs.data;
    
    try {
      // Find the task
      const task = await Task.findByPk(taskId, {
        include: [{ model: User, as: 'user', attributes: ['id', 'email', 'firstName', 'lastName'] }]
      });

      if (!task) {
        console.log(`Task ${taskId} not found`);
        return;
      }

      await task.update({ status: taskStatus.RUNNING });

      const start = Date.now();
      let status = taskStatus.COMPLETED;
      let response = null;
      let error = null;
      let statusCode = null;

      try {
        const axiosConfig = {
          method: task.method,
          url: task.url,
          headers: task.headers || {},
          timeout: (process.env.WAIT_TIMEOUT || 10) * 1000,
          data: task.body || undefined,
        };

        // Add authorization token if provided
        if (task.token) {
          axiosConfig.headers = { 
            ...axiosConfig.headers, 
            Authorization: `Bearer ${task.token}` 
          };
        }

        // Execute the HTTP request
        const res = await axios(axiosConfig);
        response = res.data;
        statusCode = res.status;

        if (res.status < 200 || res.status >= 300) {
          status = taskStatus.FAILED;
          error = `Non-success status code: ${res.status}`;
        }
      } catch (err) {
        status = taskStatus.FAILED;
        error = err.message;
        statusCode = err.response ? err.response.status : null;
      }

      const responseTime = Date.now() - start;

      // Create task history record
      await TaskHistory.create({
        taskId: task.id,
        status,
        attemptNumber: task.retryCount + 1,
        executedAt: new Date(),
        response,
        error,
        responseTime,
        statusCode,
      });

      // Handle task completion or failure
      if (status === taskStatus.COMPLETED) {
        // Task completed successfully - update status and send success notification
        await task.update({ 
          status: taskStatus.COMPLETED, 
          lastExecutedAt: new Date(),
          response: response
        });
        
        // Send success notification
        if (task.user && task.user.email) {
          await EmailService.notifyTaskSuccess(task, response, responseTime);
        }
        
        console.log(`✅ Task ${taskId} completed successfully`, new Date());
      } else {
        // Task failed - handle retry logic
        const newRetryCount = task.retryCount + 1;
        const maxRetries = parseInt(process.env.MAX_RETRIES) || 3;
        const retryOffset = parseInt(process.env.RETRY_OFFSET) || 1;

        if (newRetryCount >= maxRetries) {
          await task.update({ 
            status: taskStatus.FAILED, 
            retryCount: newRetryCount, 
            error: error, 
            lastExecutedAt: new Date() 
          });
          
          if (task.user && task.user.email) {
            await EmailService.notifyTaskFailure(task, error, newRetryCount, maxRetries);
          }
          
          console.log(`❌ Task ${taskId} failed after ${maxRetries} retries`);
        } else {
          const nextExecutionAt = new Date(Date.now() + retryOffset * 60 * 60 * 1000); // hours to milliseconds //improvement
          
          await task.update({ 
            status: taskStatus.RETRY, 
            retryCount: newRetryCount, 
            nextExecutionAt: nextExecutionAt, 
            error: error, 
            lastExecutedAt: new Date() 
          });

          await agenda.schedule(nextExecutionAt, 'executeTask', { taskId: task.id });
          
          if (task.user && task.user.email) {
            await EmailService.notifyTaskRetry(task, error, nextExecutionAt, newRetryCount, maxRetries);
          }
          
          console.log(`🔄 Task ${taskId} scheduled for retry at ${nextExecutionAt}`);
        }
      }

    } catch (error) {
      console.error(`Error executing task ${taskId}:`, error);
    }
  });

  console.log('🟩 Task execution job defined successfully');
};

// Schedule a task for execution
const scheduleTask = async (task) => {
  try {
    await agenda.schedule(task.scheduledTime, 'executeTask', { taskId: task.id });
    console.log(`📅 Task ${task.id} scheduled for ${new Date(task.scheduledTime)}`);
    return true;
  } catch (error) {
    console.error(`Error scheduling task ${task.id}:`, error);
    return false;
  }
};

// Cancel a scheduled task
const cancelTask = async (taskId) => {
  try {
    const jobs = await agenda.jobs({ 'data.taskId': taskId });
    for (const job of jobs) {
      await job.remove();
    }
    console.log(`❌ Cancelled scheduled jobs for task ${taskId}`);
    return true;
  } catch (error) {
    console.error(`Error cancelling task ${taskId}:`, error);
    return false;
  }
};

// Start Agenda service
const startAgenda = async () => {
  console.log('⭐ Initializing agenda...');
  try {
    // Define jobs
    defineTaskExecutionJob();
    
    // Start Agenda
    await agenda.start();
    console.log('🚀 Agenda service started successfully');
    
  } catch (error) {
    console.error('❌ Error initializing Agenda:', error);
  }
};

// Process any tasks that should have run but weren't scheduled
// const processPendingTasks = async () => {
//   try {
//     const now = new Date();
//     const pendingTasks = await Task.findAll({
//       where: {
//         status: [taskStatus.PENDING, taskStatus.RETRY],
//         scheduledTime: { [require('sequelize').Op.lte]: now },
//         nextExecutionAt: null
//       }
//     });

//     for (const task of pendingTasks) {
//       // For overdue tasks, schedule them to run immediately
//       await agenda.now('executeTask', { taskId: task.id });
//       console.log(`⏰ Processing overdue task ${task.id} immediately`);
//     }

//     if (pendingTasks.length > 0) {
//       console.log(`📋 Processed ${pendingTasks.length} overdue tasks`);
//     }
//   } catch (error) {
//     console.error('Error processing pending tasks:', error);
//   }
// };

module.exports = {
  agenda,
  scheduleTask,
  cancelTask,
  startAgenda
};
