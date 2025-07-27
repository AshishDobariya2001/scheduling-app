# 🔧 **Backend - Task Scheduling System**

Node.js/Express backend API for the Task Scheduling & Monitoring System with robust task execution, comprehensive error handling, and scalable architecture.

## 📋 **Table of Contents**

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [Development Guide](#-development-guide)
- [Task Execution Engine](#-task-execution-engine)
- [Security](#-security)
- [Testing](#-testing)
- [Deployment](#-deployment)

## 🎯 **Overview**

The backend is built with **Node.js** and **Express.js** and provides:
- **RESTful API** for task management
- **JWT Authentication** with secure token handling
- **Task Execution Engine** with retry logic
- **Database Management** with Sequelize ORM
- **Comprehensive Logging** and error tracking
- **API Documentation** with Swagger

## Features

### ✅ Core Functionality
- **Task Creation**: Create HTTP ping tasks with custom URLs, methods, headers, and body
- **Scheduled Execution**: Tasks execute at specified times using Agenda.js
- **Retry Logic**: Automatic retry with configurable retry count and intervals
- **Email Notifications**: Notify users on task failures and retries
- **Task History**: Complete audit trail of all task executions
- **CRUD Operations**: Full task management capabilities

### ✅ Technical Features
- **Agenda.js Integration**: Reliable job scheduling with MongoDB persistence
- **HTTP Request Execution**: Support for all HTTP methods with custom headers and body
- **Timeout Handling**: Configurable request timeout (WAIT_TIMEOUT)
- **Status Tracking**: Comprehensive task status management
- **User Isolation**: Tasks are isolated per user
- **Pagination**: API responses include pagination for large datasets

## Environment Configuration

```env
# Task Scheduling Configuration
WAIT_TIMEOUT=10          # Request timeout in seconds
RETRY_OFFSET=1           # Hours between retries
MAX_RETRIES=3            # Maximum retry attempts

# MongoDB Configuration (for Agenda)
MONGODB_HOST=mongodb://localhost:27017/agenda

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_pass
EMAIL_FROM=no-reply@example.com
```

## API Endpoints

### Task Management

#### Create Task
```http
POST /api/v1/tasks
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Test Ping Task",
  "url": "https://api.example.com/ping",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "X-Custom-Header": "value"
  },
  "body": {
    "message": "Hello World"
  },
  "token": "optional_auth_token",
  "scheduledTime": "2024-01-15T10:30:00.000Z",
  "maxRetry": 3
}
```

#### Get All Tasks
```http
GET /api/v1/tasks?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Get Task by ID
```http
GET /api/v1/tasks/:id
Authorization: Bearer <JWT_TOKEN>
```

#### Update Task
```http
PUT /api/v1/tasks/:id
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "name": "Updated Task Name",
  "scheduledTime": "2024-01-15T11:00:00.000Z"
}
```

#### Delete Task
```http
DELETE /api/v1/tasks/:id
Authorization: Bearer <JWT_TOKEN>
```

### Task History

#### Get Task History
```http
GET /api/v1/tasks/:id/history?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

#### Get All Task History
```http
GET /api/v1/tasks/history/all?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>
```

## Task Execution Flow

### 1. Task Creation
1. User creates a task with scheduled time
2. Task is saved to database with `PENDING` status
3. Task is scheduled in Agenda.js for execution

### 2. Task Execution
1. Agenda.js triggers task at scheduled time
2. Task status changes to `RUNNING`
3. HTTP request is made with specified configuration
4. Response is recorded in TaskHistory

### 3. Success Scenario
- If HTTP response is successful (2xx status):
  - Task status changes to `COMPLETED`
  - Task is removed from Agenda.js schedule
  - No further retries

### 4. Failure Scenario
- If HTTP request fails or times out:
  - Task status changes to `RETRY` or `FAILED`
  - Email notification is sent to user
  - If retries remaining: Task is rescheduled for `RETRY_OFFSET` hours later
  - If max retries reached: Task status becomes `FAILED`

## Task Statuses

- **PENDING**: Task is scheduled but not yet executed
- **RUNNING**: Task is currently being executed
- **COMPLETED**: Task executed successfully
- **FAILED**: Task failed after max retries
- **CANCELLED**: Task was cancelled by user
- **RETRY**: Task failed and is scheduled for retry

## Database Schema

### Task Table
```sql
CREATE TABLE Task (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR NOT NULL,
  url VARCHAR NOT NULL,
  method ENUM('GET', 'POST', 'PUT', 'DELETE', 'PATCH') NOT NULL,
  headers JSON,
  token VARCHAR,
  scheduledTime DATETIME NOT NULL,
  maxRetry INTEGER DEFAULT 3,
  userId INTEGER NOT NULL,
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'retry') DEFAULT 'pending',
  body JSON,
  retryCount INTEGER DEFAULT 0,
  lastExecutedAt DATETIME,
  nextExecutionAt DATETIME,
  response JSON,
  error TEXT,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### TaskHistory Table
```sql
CREATE TABLE TaskHistory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  taskId INTEGER NOT NULL,
  status ENUM('pending', 'running', 'completed', 'failed', 'cancelled', 'retry') NOT NULL,
  attemptNumber INTEGER DEFAULT 1,
  executedAt DATETIME NOT NULL,
  response JSON,
  error TEXT,
  responseTime INTEGER,
  statusCode INTEGER,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

## Error Handling

### HTTP Request Errors
- Network timeouts (configurable via WAIT_TIMEOUT)
- HTTP error status codes (4xx, 5xx)
- Network connectivity issues
- Invalid URLs or malformed requests

### System Errors
- Database connection issues
- Email service failures
- Agenda.js scheduling errors
- Invalid task configurations

## Monitoring and Logging

The system provides comprehensive logging:
- Task creation and scheduling
- Task execution attempts
- Success/failure status
- Email notification delivery
- Retry scheduling
- Error details

## Security Considerations

- JWT authentication required for all endpoints
- User isolation: Users can only access their own tasks
- Input validation for all task parameters
- SQL injection protection via Sequelize ORM
- XSS protection via input sanitization

## Performance Considerations

- Pagination for large datasets
- Efficient database queries with proper indexing
- Background job processing via Agenda.js
- Configurable timeouts to prevent hanging requests
- Automatic cleanup of completed tasks

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   - Copy `.env.example` to `.env`
   - Set up MongoDB connection
   - Configure SMTP settings for email notifications

3. **Run Migrations**
   ```bash
   npm run migrate:up
   ```

4. **Start the Application**
   ```bash
   npm start
   ```

## Testing

The system includes comprehensive test coverage:
- Unit tests for all components
- Integration tests for API endpoints
- Task execution flow testing
- Error handling validation

Run tests with:
```bash
npm test
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check MONGODB_HOST configuration

2. **Email Notifications Not Working**
   - Verify SMTP configuration
   - Check email credentials

3. **Tasks Not Executing**
   - Check Agenda.js logs
   - Verify scheduled time is in the future
   - Ensure MongoDB is accessible

4. **HTTP Requests Failing**
   - Check URL validity
   - Verify network connectivity
   - Review request headers and body format 