// Test script to verify API call with token
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzUzNjIwNDQzLCJleHAiOjE3NTQyMjUyNDN9.M44_Jo7qN6S1OQBGtrZZmieq0v--A42bd34cz_oPJ_M';

// Set token in localStorage
localStorage.setItem('auth_token', token);

// Test API call
fetch('http://localhost:3000/api/v1/task', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  console.log('API Response:', data);
})
.catch(error => {
  console.error('API Error:', error);
}); 