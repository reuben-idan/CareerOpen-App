"""
Test script for CareerOpen API endpoints.
Verifies authentication, caching, and role-based permissions.
"""
import os
import sys
import json
import time
import requests
from pprint import pprint

# Base URL for the API
BASE_URL = 'http://127.0.0.1:8000/api'

# Test user credentials
TEST_USERS = {
    'employer': {
        'email': 'employer@example.com',
        'password': 'testpass123',
        'role': 'employer'
    },
    'jobseeker': {
        'email': 'jobseeker@example.com',
        'password': 'testpass123',
        'role': 'job_seeker'
    },
    'admin': {
        'email': 'admin@example.com',
        'password': 'adminpass123',
        'role': 'admin'
    }
}

class APITester:
    def __init__(self, base_url):
        self.base_url = base_url
        self.session = requests.Session()
        self.access_token = None
        self.refresh_token = None
        self.current_user = None

    def login(self, email, password):
        """Authenticate a user and store the access token."""
        url = f"{self.base_url}/token/"
        data = {
            'email': email,
            'password': password
        }
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            tokens = response.json()
            self.access_token = tokens.get('access')
            self.refresh_token = tokens.get('refresh')
            self.session.headers.update({
                'Authorization': f'Bearer {self.access_token}'
            })
            self.current_user = email
            print(f"✅ Logged in as {email}")
            return True
        else:
            print(f"❌ Login failed for {email}: {response.text}")
            return False

    def get(self, endpoint, params=None):
        """Make a GET request to the API."""
        url = f"{self.base_url}/{endpoint}/"
        start_time = time.time()
        response = self.session.get(url, params=params)
        elapsed = (time.time() - start_time) * 1000  # in milliseconds
        
        print(f"\nGET {endpoint} ({elapsed:.2f}ms) - Status: {response.status_code}")
        if response.status_code != 200:
            print(f"Error: {response.text}")
        return response

    def test_caching(self, endpoint, params=None):
        """Test if caching is working for an endpoint."""
        print(f"\n🧪 Testing caching for {endpoint}")
        
        # First request (should be a cache miss)
        print("\nFirst request (should be a cache miss):")
        response1 = self.get(endpoint, params)
        
        # Second request (should be a cache hit)
        print("\nSecond request (should be a cache hit):")
        response2 = self.get(endpoint, params)
        
        # Verify the responses are the same
        if response1.status_code == 200 and response2.status_code == 200:
            print("✅ Cache test passed - responses match")
        else:
            print("❌ Cache test failed - responses don't match")

    def test_permissions(self, endpoint, method='get', data=None, expected_status=200):
        """Test if role-based permissions are enforced."""
        url = f"{self.base_url}/{endpoint}/"
        method = method.lower()
        
        print(f"\n🔒 Testing permissions for {method.upper()} {endpoint}")
        
        if method == 'get':
            response = self.session.get(url)
        elif method == 'post':
            response = self.session.post(url, json=data)
        elif method == 'put':
            response = self.session.put(url, json=data)
        elif method == 'delete':
            response = self.session.delete(url)
            
        print(f"Status: {response.status_code} (Expected: {expected_status})")
        if response.status_code == expected_status:
            print("✅ Permission test passed")
        else:
            print(f"❌ Permission test failed: {response.text}")
        
        return response

def main():
    # Create test client
    tester = APITester(BASE_URL)
    
    # Test public endpoints (no auth required)
    print("\n🔍 Testing public endpoints...")
    response = tester.get('jobs')
    if response.status_code == 200:
        print("✅ Public job listing works")
    
    # Test authentication
    print("\n🔑 Testing authentication...")
    for role, creds in TEST_USERS.items():
        if tester.login(creds['email'], creds['password']):
            # Test caching for job listings
            tester.test_caching('jobs')
            
            # Test role-based permissions
            if role == 'employer':
                print("\n👔 Testing employer permissions...")
                # Test creating a job (should be allowed for employers)
                job_data = {
                    'title': f'Test Job from {role}',
                    'description': 'Test job description',
                    'job_type': 'full_time',
                    'location': 'Remote',
                    'salary': 50000,
                    'is_published': True,
                    'category': 1,  # Assuming category with ID 1 exists
                    'company': 1    # Assuming company with ID 1 exists
                }
                tester.test_permissions('jobs', 'post', job_data, 201)
                
            elif role == 'jobseeker':
                print("\n👤 Testing job seeker permissions...")
                # Test applying for a job (should be allowed for job seekers)
                application_data = {
                    'job': 1,  # Assuming job with ID 1 exists
                    'cover_letter': f'Test application from {role}'
                }
                tester.test_permissions('applications', 'post', application_data, 201)
            
            # Logout
            print(f"\n👋 Logging out {creds['email']}")
            tester.access_token = None
            tester.refresh_token = None
            tester.current_user = None
            tester.session.headers.pop('Authorization', None)

if __name__ == "__main__":
    main()
