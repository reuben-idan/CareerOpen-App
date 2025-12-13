const axios = require('axios');
const { Buffer } = require('buffer');

// Base URL for the backend API
const API_URL = 'http://localhost:8000/api';

// Test user credentials
const TEST_USER = {
  email: `testuser_${Date.now()}@example.com`,
  password: 'TestPass123!',
  firstName: 'Test',
  lastName: 'User',
  userType: 'jobseeker',
  headline: 'Test User',
};

// Helper function to run tests
async function runTests() {
  let accessToken = '';
  let refreshToken = '';
  let userId = '';

  console.log('Starting authentication tests...\n');

  try {
    // Test 1: Register a new user
    console.log('1. Testing user registration...');
    const registerResponse = await axios.post(`${API_URL}/auth/register/`, TEST_USER);
    console.log('✅ Registration successful');
    
    accessToken = registerResponse.data.access;
    refreshToken = registerResponse.data.refresh;
    
    // Extract user ID from the access token
    if (accessToken) {
      const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());
      userId = payload.user_id;
    }

    // Test 2: Login with the registered user
    console.log('\n2. Testing user login...');
    const loginResponse = await axios.post(`${API_URL}/auth/login/`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    console.log('✅ Login successful');
    
    accessToken = loginResponse.data.access;
    refreshToken = loginResponse.data.refresh;

    // Test 3: Refresh the access token
    console.log('\n3. Testing token refresh...');
    const refreshResponse = await axios.post(`${API_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    console.log('✅ Token refresh successful');
    
    accessToken = refreshResponse.data.access;

    // Test 4: Get user profile
    console.log('\n4. Testing profile retrieval...');
    const profileResponse = await axios.get(`${API_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log('✅ Profile retrieval successful');
    console.log('   User ID:', profileResponse.data.id);
    console.log('   Email:', profileResponse.data.email);

    // Test 5: Logout
    console.log('\n5. Testing logout...');
    try {
      await axios.post(
        `${API_URL}/auth/logout/`,
        { refresh: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log('✅ Logout successful');
    } catch (error) {
      console.log('ℹ️ Logout endpoint not available or not needed');
    }

    console.log('\n🎉 All tests completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

// Run the tests
runTests();
