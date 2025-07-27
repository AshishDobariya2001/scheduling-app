# 🚀 **Task Scheduling & Monitoring System**

A modern, full-stack web application for scheduling and monitoring HTTP tasks with real-time execution tracking, detailed history, and comprehensive error handling.

## 📋 **Table of Contents**

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Features Guide](#-features-guide)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

## ✨ **Features**

### 🔐 **Authentication & Security**
- **User Registration & Login** with JWT authentication
- **Protected Routes** with automatic redirection
- **Secure Token Management** with localStorage
- **Session Management** with automatic logout

### 📅 **Task Management**
- **Create Tasks** with flexible scheduling options
- **Update Tasks** (pending tasks only) with validation
- **Delete Tasks** with confirmation dialogs
- **Task Status Tracking** (pending, running, completed, failed)
- **Advanced Configuration** (headers, request body, retry logic)

### 📊 **Task History & Monitoring**
- **Detailed Execution History** for each task
- **Response Analysis** with type detection (JSON, binary, HTML, XML)
- **Error Categorization** with helpful suggestions
- **Performance Metrics** (response time, success rate, retry tracking)
- **Real-time Status Updates** via context management

### 🎯 **Advanced Features**
- **Smart Response Display** with syntax highlighting
- **Error Handling** with categorized error types
- **API Response Caching** (30-second cache for performance)
- **Request Deduplication** to prevent duplicate API calls
- **Copy to Clipboard** functionality for responses/errors
- **Responsive Design** for all device sizes

## 🛠️ **Tech Stack**

### **Frontend**
- **React 18** - Modern React with hooks and context
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form validation and handling
- **Lucide React** - Beautiful icon library
- **Date-fns** - Date manipulation utilities

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Sequelize** - ORM for database management
- **JWT** - JSON Web Token authentication
- **Swagger** - API documentation

### **Database**
- **SQLite** - Lightweight database (development)
- **MySQL/PostgreSQL** - Production database options

### **Development Tools**
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Nodemon** - Development server with auto-reload

## 🏗️ **Architecture**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React)       │◄──►│   (Express)     │◄──►│   (SQLite)      │
│                 │    │                 │    │                 │
│ • Components    │    │ • Controllers   │    │ • Users         │
│ • Context       │    │ • Services      │    │ • Tasks         │
│ • Services      │    │ • Models        │    │ • TaskHistory   │
│ • Utils         │    │ • Middleware    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Key Design Patterns**
- **Context API** for global state management
- **Repository Pattern** for data access
- **Service Layer** for business logic
- **Middleware** for authentication and validation
- **Component Composition** for reusability

## 🚀 **Getting Started**

### **Prerequisites**
- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd scheduling-app
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Database Setup**
   ```bash
   # Run database migrations
   cd backend
   npm run migrate
   ```

5. **Start the application**
   ```bash
   # Start backend server (Terminal 1)
   cd backend
   npm start

   # Start frontend development server (Terminal 2)
   cd frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/api-docs

## 📁 **Project Structure**

```
scheduling-app/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── models/            # Database models
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── middleware/        # Custom middleware
│   │   └── utils/             # Utility functions
│   ├── migrations/            # Database migrations
│   └── package.json
│
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── Auth/         # Authentication components
│   │   │   ├── Common/       # Reusable UI components
│   │   │   ├── Layout/       # Layout components
│   │   │   └── Task/         # Task-related components
│   │   ├── contexts/         # React Context providers
│   │   ├── hooks/            # Custom React hooks
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service layer
│   │   └── utils/            # Utility functions
│   └── package.json
│
└── README.md
```

## 📖 **Features Guide**

### **🔐 Authentication**

#### **User Registration**
1. Navigate to the signup page
2. Fill in your details (name, email, password)
3. Click "Create Account"
4. You'll be automatically logged in

#### **User Login**
1. Enter your email and password
2. Click "Sign In"
3. You'll be redirected to the dashboard

### **📅 Task Management**

#### **Creating a Task**
1. Click "Create Task" button
2. Fill in basic information:
   - **Task Name**: Descriptive name for your task
   - **URL**: Target endpoint to call
   - **HTTP Method**: GET, POST, PUT, DELETE, etc.
   - **Scheduled Time**: When to execute the task
3. **Advanced Options** (optional):
   - **Max Retry**: Number of retry attempts
   - **Token**: Authentication token
   - **Headers**: Custom HTTP headers (JSON format)
   - **Body**: Request body for POST/PUT requests
4. Click "Create Task"

#### **Updating a Task**
1. Find a pending task in the task list
2. Click the edit (pencil) icon
3. Modify the desired fields
4. Click "Update Task"

**Note**: Only tasks with "pending" status can be updated.

#### **Deleting a Task**
1. Find the task in the task list
2. Click the delete (trash) icon
3. Confirm the deletion

### **📊 Task History & Monitoring**

#### **Viewing Task History**
1. Click the "View History" (eye) icon on any task
2. View detailed execution history including:
   - **Execution Status**: Success/failure indicators
   - **Response Details**: Full response data with type detection
   - **Error Information**: Detailed error messages with suggestions
   - **Performance Metrics**: Response time and retry information

#### **Response Analysis**
The system automatically detects and displays:
- **JSON Responses**: Pretty-printed with syntax highlighting
- **Binary Data**: Size information with preview
- **HTML/XML**: Formatted display
- **Text Responses**: Plain text display

#### **Error Handling**
Errors are categorized and include:
- **Network Errors**: Connection issues
- **Server Errors**: 5xx status codes
- **Client Errors**: 4xx status codes
- **Validation Errors**: Request format issues

## 📚 **API Documentation**

### **Authentication Endpoints**

#### **POST /auth/signup**
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 201,
  "message": "User created successfully",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

#### **POST /auth/login**
Authenticate user and get access token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    "token": "jwt_token_here"
  }
}
```

### **Task Management Endpoints**

#### **GET /task**
Get all tasks for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "status": 200,
  "message": "Tasks fetched successfully",
  "data": {
    "tasks": [
      {
        "id": 1,
        "name": "API Health Check",
        "url": "https://api.example.com/health",
        "method": "GET",
        "status": "pending",
        "scheduledTime": "2025-07-27T10:00:00.000Z",
        "maxRetry": 3,
        "createdAt": "2025-07-27T09:00:00.000Z"
      }
    ]
  }
}
```

#### **POST /task**
Create a new task.

**Request Body:**
```json
{
  "name": "API Health Check",
  "url": "https://api.example.com/health",
  "method": "GET",
  "scheduledTime": "2025-07-27T10:00:00.000Z",
  "maxRetry": 3,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": null
}
```

#### **PUT /task/{id}**
Update an existing task (pending tasks only).

**Request Body:**
```json
{
  "name": "Updated API Health Check",
  "url": "https://api.example.com/health",
  "method": "GET",
  "scheduledTime": "2025-07-27T11:00:00.000Z"
}
```

#### **DELETE /task/{id}**
Delete a task.

### **Task History Endpoints**

#### **GET /task/{id}/history**
Get execution history for a specific task.

**Response:**
```json
{
  "status": 200,
  "message": "Task history fetched successfully",
  "data": {
    "history": [
      {
        "id": 1,
        "taskId": 1,
        "status": "completed",
        "attemptNumber": 1,
        "executedAt": "2025-07-27T10:00:00.000Z",
        "response": "{\"status\":\"ok\"}",
        "error": null,
        "responseTime": 150,
        "statusCode": 200
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 1,
      "totalPages": 1
    }
  }
}
```

## 👨‍💻 **Development Guide**

### **Code Style & Standards**

#### **Frontend (React)**
- **Functional Components** with hooks
- **TypeScript-like** prop validation
- **Consistent naming** (camelCase for variables, PascalCase for components)
- **Component composition** over inheritance
- **Error boundaries** for graceful error handling

#### **Backend (Node.js/Express)**
- **MVC pattern** (Models, Views, Controllers)
- **Repository pattern** for data access
- **Service layer** for business logic
- **Middleware** for cross-cutting concerns
- **Consistent error handling**

### **State Management**

#### **React Context Usage**
```javascript
// Context Provider
export const TasksProvider = ({ children }) => {
  const [state, setState] = useState({ tasks: [], loading: false });
  
  const value = {
    ...state,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask
  };
  
  return (
    <TasksContext.Provider value={value}>
      {children}
    </TasksContext.Provider>
  );
};

// Context Consumer
export const useTasksContext = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasksContext must be used within TasksProvider');
  }
  return context;
};
```

#### **Performance Optimizations**
- **Request Caching**: 30-second cache for API responses
- **Request Deduplication**: Prevent duplicate simultaneous requests
- **Component Memoization**: React.memo for expensive components
- **Callback Optimization**: useCallback for stable function references

### **Component Guidelines**

#### **Component Structure**
```javascript
import React, { useState, useEffect } from 'react';
import { someIcon } from 'lucide-react';
import { someHelper } from '../../utils/helpers';

const ComponentName = ({ prop1, prop2, onAction }) => {
  // 1. State declarations
  const [state, setState] = useState(initialValue);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleAction = () => {
    // Handler logic
  };
  
  // 4. Render
  return (
    <div className="component-container">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### **Props Validation**
```javascript
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
  onAction: PropTypes.func.isRequired
};
```

### **Testing Strategy**

#### **Frontend Testing**
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

#### **Backend Testing**
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

### **Error Handling**

#### **Frontend Error Boundaries**
```javascript
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

#### **Backend Error Handling**
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  res.status(error.status || 500).json({
    status: error.status || 500,
    message: error.message || 'Internal Server Error',
    data: null
  });
});
```

## 🚀 **Deployment**

### **Frontend Deployment**

#### **Build for Production**
```bash
cd frontend
npm run build
```

#### **Deploy to Vercel**
1. Install Vercel CLI: `npm i -g vercel`
2. Deploy: `vercel --prod`

#### **Deploy to Netlify**
1. Build the project: `npm run build`
2. Upload the `build` folder to Netlify

### **Backend Deployment**

#### **Environment Variables**
```bash
# Production environment variables
NODE_ENV=production
PORT=3001
DB_HOST=your-database-host
DB_USER=your-database-user
DB_PASS=your-database-password
DB_NAME=your-database-name
JWT_SECRET=your-jwt-secret
```

#### **Deploy to Heroku**
1. Install Heroku CLI
2. Create Heroku app: `heroku create your-app-name`
3. Set environment variables
4. Deploy: `git push heroku main`

#### **Deploy to DigitalOcean**
1. Set up a Droplet
2. Install Node.js and PM2
3. Clone repository and install dependencies
4. Start with PM2: `pm2 start ecosystem.config.js`

### **Database Setup**

#### **Production Database**
```bash
# MySQL
mysql -u root -p
CREATE DATABASE task_scheduler;
CREATE USER 'task_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON task_scheduler.* TO 'task_user'@'localhost';
FLUSH PRIVILEGES;

# PostgreSQL
createdb task_scheduler
createuser task_user
psql -d task_scheduler -c "GRANT ALL PRIVILEGES ON DATABASE task_scheduler TO task_user;"
```

#### **Run Migrations**
```bash
cd backend
npm run migrate
```

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add amazing feature'`
7. Push to the branch: `git push origin feature/amazing-feature`
8. Open a Pull Request

### **Code Review Process**
1. **Automated Checks**: CI/CD pipeline runs tests and linting
2. **Code Review**: At least one maintainer must approve
3. **Testing**: All new features must include tests
4. **Documentation**: Update README and API docs if needed

### **Bug Reports**
When reporting bugs, please include:
- **Environment**: OS, Node.js version, browser
- **Steps to reproduce**: Detailed steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happens
- **Screenshots**: If applicable

### **Feature Requests**
When requesting features, please include:
- **Use case**: Why this feature is needed
- **Proposed solution**: How it should work
- **Mockups**: Visual examples if applicable

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon library
- **Express.js** for the robust web framework
- **Sequelize** for the excellent ORM

---

**Made with ❤️ by the Task Scheduler Team** 