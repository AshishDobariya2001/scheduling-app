const nodeMailer = require('nodemailer');
const { emailSenderName } = require('../config/options');

// Email Templates
const emailTemplates = {
  taskFailure: (task, error, retryCount, maxRetries) => ({
    subject: `❌ Task Failed: ${task.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #dc3545; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h2 style="margin: 0;">🚨 Task Execution Failed</h2>
        </div>
        
        <h3 style="color: #333;">Task Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Task Name:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">URL:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.url}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Method:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.method}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Scheduled Time:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date(task.scheduledTime).toLocaleString()}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Retry Count:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${retryCount}/${maxRetries}</td>
          </tr>
        </table>

        <h3 style="color: #dc3545;">Error Details</h3>
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <pre style="margin: 0; color: #721c24; white-space: pre-wrap;">${error}</pre>
        </div>

        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c5460;">📋 What Happened?</h4>
          <p style="margin: 0; color: #0c5460;">
            The scheduled task failed to execute successfully. This could be due to network issues, 
            invalid API responses, or configuration problems.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Task Details
          </a>
        </div>
      </div>
    `,
    text: `
Task Failed: ${task.name}

Task Details:
- URL: ${task.url}
- Method: ${task.method}
- Scheduled Time: ${new Date(task.scheduledTime).toLocaleString()}
- Retry Count: ${retryCount}/${maxRetries}

Error: ${error}

View task details at: ${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}
    `
  }),

  taskRetry: (task, error, nextExecutionAt, retryCount, maxRetries) => ({
    subject: `🔄 Task Retry Scheduled: ${task.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #ffc107; color: #212529; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h2 style="margin: 0;">🔄 Task Retry Scheduled</h2>
        </div>
        
        <h3 style="color: #333;">Task Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Task Name:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">URL:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.url}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Method:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.method}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Next Retry:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date(nextExecutionAt).toLocaleString()}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Retry Count:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${retryCount}/${maxRetries}</td>
          </tr>
        </table>

        <h3 style="color: #856404;">Last Error</h3>
        <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <pre style="margin: 0; color: #856404; white-space: pre-wrap;">${error}</pre>
        </div>

        <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #0c5460;">📋 What's Next?</h4>
          <p style="margin: 0; color: #0c5460;">
            The task will automatically retry at the scheduled time. If it fails ${maxRetries} times, 
            you'll receive a final failure notification.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}" 
             style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Task Details
          </a>
        </div>
      </div>
    `,
    text: `
Task Retry Scheduled: ${task.name}

Task Details:
- URL: ${task.url}
- Method: ${task.method}
- Next Retry: ${new Date(nextExecutionAt).toLocaleString()}
- Retry Count: ${retryCount}/${maxRetries}

Last Error: ${error}

View task details at: ${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}
    `
  }),

  taskSuccess: (task, response, responseTime) => ({
    subject: `✅ Task Completed Successfully: ${task.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
        <div style="background-color: #28a745; color: white; padding: 15px; border-radius: 8px 8px 0 0; margin: -20px -20px 20px -20px;">
          <h2 style="margin: 0;">✅ Task Completed Successfully</h2>
        </div>
        
        <h3 style="color: #333;">Task Details</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Task Name:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">URL:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.url}</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Method:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${task.method}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Execution Time:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${responseTime}ms</td>
          </tr>
          <tr style="background-color: #f8f9fa;">
            <td style="padding: 10px; border: 1px solid #dee2e6; font-weight: bold;">Completed At:</td>
            <td style="padding: 10px; border: 1px solid #dee2e6;">${new Date().toLocaleString()}</td>
          </tr>
        </table>

        <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 4px; padding: 15px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #155724;">🎉 Success!</h4>
          <p style="margin: 0; color: #155724;">
            Your scheduled task executed successfully and completed without any errors.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}/history" 
             style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View Execution History
          </a>
        </div>
      </div>
    `,
    text: `
Task Completed Successfully: ${task.name}

Task Details:
- URL: ${task.url}
- Method: ${task.method}
- Execution Time: ${responseTime}ms
- Completed At: ${new Date().toLocaleString()}

View execution history at: ${process.env.BACKEND_URL || 'http://localhost:3000'}/api/v1/task/${task.id}/history
    `
  })
};

// Enhanced Email Service with better error handling and logging
class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    try {
      this.transporter = nodeMailer.createTransport({
        auth: {
          user: process.env.SMTP_USER || process.env.MAIL_SMTP_USERNAME,
          pass: process.env.SMTP_PASS || process.env.MAIL_SMTP_PASSWORD,
        },
        host: process.env.SMTP_HOST || process.env.MAIL_SMTP_HOST,
        port: process.env.SMTP_PORT || 587,
        secure: false,
        tls: {
          ciphers: 'SSLv3',
          rejectUnauthorized: false
        },
      });
    } catch (error) {
      console.error('❌ Failed to initialize email transporter:', error);
    }
  }

  async triggerEmail({ to, subject, text, html, attachments = [], cc }) {
    try {
      const mailOptions = {
        from: `"${emailSenderName || 'Task Scheduler'}" <${process.env.EMAIL_FROM || process.env.MAIL_SMTP_FROM}>`,
        to: ['adobariya009@gmail.com'],
        ...(cc && { cc: cc }),
        subject: subject,
        text: text,
        html: html,
        attachments,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email sent successfully:', { to, subject, messageId: result.messageId });
      return result;
    } catch (error) {
      console.error('❌ Failed to send email:', { to, subject, error: error.message });
      throw error;
    }
  }

  // Task-specific notification methods
  async notifyTaskFailure(task, error, retryCount = 0, maxRetries = 3) {
    try {
      const template = emailTemplates.taskFailure(task, error, retryCount, maxRetries);
      
      await this.triggerEmail({
        to: task.user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`📧 Failure notification sent for task ${task.id} to ${task.user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send failure notification for task ${task.id}:`, error);
    }
  }

  async notifyTaskRetry(task, error, nextExecutionAt, retryCount = 0, maxRetries = 3) {
    try {
      const template = emailTemplates.taskRetry(task, error, nextExecutionAt, retryCount, maxRetries);
      
      await this.triggerEmail({
        to: task.user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`📧 Retry notification sent for task ${task.id} to ${task.user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send retry notification for task ${task.id}:`, error);
    }
  }

  async notifyTaskSuccess(task, response, responseTime) {
    try {
      const template = emailTemplates.taskSuccess(task, response, responseTime);
      
      await this.triggerEmail({
        to: task.user.email,
        subject: template.subject,
        text: template.text,
        html: template.html,
      });

      console.log(`📧 Success notification sent for task ${task.id} to ${task.user.email}`);
    } catch (error) {
      console.error(`❌ Failed to send success notification for task ${task.id}:`, error);
    }
  }

  // Legacy method for backward compatibility
  async triggerEmailLegacy({ to, subject, text, html, attachments = [], cc }) {
    return this.triggerEmail({ to, subject, text, html, attachments, cc });
  }
}

// Create singleton instance
const emailService = new EmailService();

// Export both the instance and the class for flexibility
module.exports = emailService;
module.exports.EmailService = EmailService;
