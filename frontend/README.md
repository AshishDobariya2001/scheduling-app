# Task Scheduler Frontend

A modern React application for scheduling and managing HTTP tasks with a beautiful, responsive UI.

## Features

- 🔐 **Authentication System**
  - User registration with first name, last name, email, and password
  - User login with email and password
  - JWT token-based authentication
  - Protected routes

- 📋 **Task Management**
  - Create new tasks with comprehensive configuration
  - View all tasks with filtering and search
  - Delete tasks
  - Real-time status updates

- ⏰ **Scheduling**
  - Schedule tasks with UTC time conversion
  - Support for all HTTP methods (GET, POST, PUT, DELETE, PATCH)
  - Advanced options (headers, body, tokens, retry configuration)

- 📊 **Task History**
  - View detailed execution history for each task
  - Status tracking and response analysis
  - Performance metrics

- 🎨 **Modern UI/UX**
  - Responsive design with Tailwind CSS
  - Clean and intuitive interface
  - Toast notifications
  - Loading states and error handling

## Tech Stack

- **React 18** - Modern React with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client for API calls
- **Lucide React** - Beautiful icons
- **React Hot Toast** - Toast notifications
- **Date-fns** - Date manipulation utilities

## Project Structure

```
src/
├── components/
│   ├── Auth/
│   │   ├── LoginForm.jsx
│   │   └── SignupForm.jsx
│   ├── Common/
│   │   ├── Loading.jsx
│   │   └── Modal.jsx
│   ├── Layout/
│   │   └── Header.jsx
│   └── Task/
│       ├── CreateTaskModal.jsx
│       ├── TaskHistory.jsx
│       └── TaskList.jsx
├── hooks/
│   ├── useAuth.js
│   └── useTasks.js
├── pages/
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   └── Signup.jsx
├── services/
│   ├── api.js
│   ├── authService.js
│   └── taskService.js
├── utils/
│   ├── constants.js
│   └── helpers.js
├── App.jsx
├── index.js
└── index.css
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd scheduling-app/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   # Create .env file with the following content:
   REACT_APP_API_BASE_URL=http://localhost:3000/api/v1
   REACT_APP_BACKEND_URL=http://localhost:3000
   REACT_APP_APP_NAME=Task Scheduler
   REACT_APP_VERSION=1.0.0
   REACT_APP_DEBUG=true
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Integration

The frontend integrates with the backend API through the following services:

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login

### Tasks
- `GET /tasks` - Get all tasks
- `POST /tasks` - Create new task
- `GET /tasks/:id` - Get task by ID
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/:id/history` - Get task history
- `GET /tasks/history/all` - Get all task history

## Key Features Implementation

### 1. Authentication Flow
- JWT token storage in localStorage
- Automatic token injection in API requests
- Route protection for authenticated users
- Automatic logout on token expiration

### 2. Task Creation
- Comprehensive form with validation
- UTC time conversion for scheduled times
- Support for all HTTP methods
- Advanced options (headers, body, tokens, retry)

### 3. Task Management
- Real-time task list with filtering
- Search functionality
- Status-based filtering
- Delete confirmation

### 4. Task History
- Detailed execution history
- Status tracking with visual indicators
- Response time and status code display
- Retry information

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api/v1` |
| `REACT_APP_BACKEND_URL` | Backend server URL | `http://localhost:3000` |
| `REACT_APP_APP_NAME` | Application name | `Task Scheduler` |
| `REACT_APP_VERSION` | Application version | `1.0.0` |
| `REACT_APP_DEBUG` | Debug mode | `true` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License. 