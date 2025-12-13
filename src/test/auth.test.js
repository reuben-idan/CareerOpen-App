import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import axios from 'axios';

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

describe('Authentication API', () => {
  let accessToken = '';
  let refreshToken = '';
  let userId = '';

  // Test user registration
  it('should register a new user', async () => {
    const response = await axios.post(`${API_URL}/auth/register/`, TEST_USER);
    
    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('access');
    expect(response.data).toHaveProperty('refresh');
    
    accessToken = response.data.access;
    refreshToken = response.data.refresh;
    
    // Extract user ID from the access token (this is a simplified example)
    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      userId = payload.user_id;
    }
  });

  // Test user login
  it('should log in the registered user', async () => {
    const response = await axios.post(`${API_URL}/auth/login/`, {
      email: TEST_USER.email,
      password: TEST_USER.password,
    });
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access');
    expect(response.data).toHaveProperty('refresh');
    
    // Update tokens
    accessToken = response.data.access;
    refreshToken = response.data.refresh;
  });

  // Test token refresh
  it('should refresh the access token', async () => {
    const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
      refresh: refreshToken,
    });
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('access');
    
    // Update access token
    accessToken = response.data.access;
  });

  // Test getting user profile
  it('should get user profile with valid token', async () => {
    const response = await axios.get(`${API_URL}/users/me/`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    
    expect(response.status).toBe(200);
    expect(response.data).toHaveProperty('id');
    expect(response.data.email).toBe(TEST_USER.email);
  });

  // Test logout (if your API has a logout endpoint)
  it('should log out the user', async () => {
    const response = await axios.post(
      `${API_URL}/auth/logout/`,
      { refresh: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    
    expect([200, 204]).toContain(response.status);
  });
});
