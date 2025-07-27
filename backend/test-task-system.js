const axios = require('axios');

// Test the task scheduling system
async function testTaskSystem() {
  try {
    console.log('🧪 Testing Task Scheduling System...\n');

    // Test 1: Check if server is running
    console.log('1. Testing server connectivity...');
    try {
      const response = await axios.get('http://localhost:3000/api-docs/v1/web');
      console.log('✅ Server is running and accessible');
    } catch (error) {
      console.log('❌ Server is not running or not accessible');
      console.log('   Please start the server with: npm start');
      return;
    }

    // Test 2: Test authentication (if you have a test user)
    console.log('\n2. Testing authentication...');
    console.log('   You can test authentication by:');
    console.log('   - Registering a user: POST /auth/register');
    console.log('   - Logging in: POST /auth/login');
    console.log('   - Using the JWT token for task operations');

    // Test 3: Show available endpoints
    console.log('\n3. Available Task Endpoints:');
    console.log('   POST   /api/v1/task          - Create a new task');
    console.log('   GET    /api/v1/task          - Get all tasks');
    console.log('   GET    /api/v1/task/:id      - Get task by ID');
    console.log('   PUT    /api/v1/task/:id      - Update task');
    console.log('   DELETE /api/v1/task/:id      - Delete task');
    console.log('   GET    /api/v1/task/:id/history - Get task history');
    console.log('   GET    /api/v1/task/history/all - Get all task history');

    // Test 4: Show example task creation
    console.log('\n4. Example Task Creation:');
    console.log('   POST /api/v1/tasks');
    console.log('   Authorization: Bearer <JWT_TOKEN>');
    console.log('   Content-Type: application/json');
    console.log('   {');
    console.log('     "name": "Test Ping Task",');
    console.log('     "url": "https://httpbin.org/post",');
    console.log('     "method": "POST",');
    console.log('     "headers": {');
    console.log('       "Content-Type": "application/json"');
    console.log('     },');
    console.log('     "body": {');
    console.log('       "message": "Hello from scheduled task"');
    console.log('     },');
    console.log('     "scheduledTime": "2024-01-15T10:30:00.000Z",');
    console.log('     "maxRetry": 3');
    console.log('   }');

    console.log('\n✅ Task Scheduling System is ready for testing!');
    console.log('\n📋 Next Steps:');
    console.log('   1. Start MongoDB (required for Agenda.js)');
    console.log('   2. Configure your .env file with MongoDB and SMTP settings');
    console.log('   3. Create a user account');
    console.log('   4. Create and test tasks using the API endpoints');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testTaskSystem(); 