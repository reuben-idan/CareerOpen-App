"""
Test script to verify login functionality and diagnose issues.
This script tests the login endpoint directly to help identify any problems.
"""

import sys
import os
import requests
import json
import logging
from pprint import pprint

# Add backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Test configuration
BASE_URL = 'http://localhost:8000/api/auth/'
TEST_EMAIL = 'test@example.com'  # Update with a test user email
TEST_PASSWORD = 'testpassword123'  # Update with the test user's password

def test_login():
    """Test the login endpoint with valid credentials."""
    url = f"{BASE_URL}login/"
    
    # Test data
    data = {
        'email': TEST_EMAIL,
        'password': TEST_PASSWORD
    }
    
    logger.info("=" * 80)
    logger.info("TESTING LOGIN ENDPOINT")
    logger.info(f"URL: {url}")
    logger.info(f"Test user: {TEST_EMAIL}")
    logger.info("-" * 40)
    
    try:
        # Make the request
        logger.info("Sending login request...")
        response = requests.post(url, json=data)
        
        # Log response details
        logger.info(f"Status Code: {response.status_code}")
        logger.info("Response Headers:")
        for key, value in response.headers.items():
            logger.info(f"  {key}: {value}")
        
        # Try to parse JSON response
        try:
            response_data = response.json()
            logger.info("Response JSON:")
            pprint(response_data, indent=2)
        except ValueError:
            logger.error("Failed to parse JSON response")
            logger.info(f"Raw response: {response.text[:500]}")
        
        # Check for successful login
        if response.status_code == 200:
            logger.info("✅ Login successful!")
            return True
        else:
            logger.error(f"❌ Login failed with status code: {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return False
    finally:
        logger.info("=" * 80 + "\n")

def test_invalid_credentials():
    """Test the login endpoint with invalid credentials."""
    url = f"{BASE_URL}login/"
    
    # Test data with invalid password
    data = {
        'email': TEST_EMAIL,
        'password': 'wrongpassword123'
    }
    
    logger.info("=" * 80)
    logger.info("TESTING INVALID LOGIN")
    logger.info(f"URL: {url}")
    logger.info(f"Test user: {TEST_EMAIL}")
    logger.info("-" * 40)
    
    try:
        # Make the request
        logger.info("Sending login request with invalid password...")
        response = requests.post(url, json=data)
        
        # Log response details
        logger.info(f"Status Code: {response.status_code}")
        
        # Try to parse JSON response
        try:
            response_data = response.json()
            logger.info("Response JSON:")
            pprint(response_data, indent=2)
        except ValueError:
            logger.error("Failed to parse JSON response")
            logger.info(f"Raw response: {response.text[:500]}")
        
        # Check for expected error response
        if response.status_code == 401:
            logger.info("✅ Correctly received 401 for invalid credentials")
            return True
        else:
            logger.error(f"❌ Expected 401 but got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return False
    finally:
        logger.info("=" * 80 + "\n")

def test_missing_fields():
    """Test the login endpoint with missing required fields."""
    url = f"{BASE_URL}login/"
    
    # Test data with missing password
    data = {
        'email': TEST_EMAIL
        # password is missing
    }
    
    logger.info("=" * 80)
    logger.info("TESTING MISSING FIELDS")
    logger.info(f"URL: {url}")
    logger.info("-" * 40)
    
    try:
        # Make the request
        logger.info("Sending login request with missing password...")
        response = requests.post(url, json=data)
        
        # Log response details
        logger.info(f"Status Code: {response.status_code}")
        
        # Try to parse JSON response
        try:
            response_data = response.json()
            logger.info("Response JSON:")
            pprint(response_data, indent=2)
        except ValueError:
            logger.error("Failed to parse JSON response")
            logger.info(f"Raw response: {response.text[:500]}")
        
        # Check for expected error response
        if response.status_code == 400:
            logger.info("✅ Correctly received 400 for missing required field")
            return True
        else:
            logger.error(f"❌ Expected 400 but got {response.status_code}")
            return False
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Request failed: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}", exc_info=True)
        return False
    finally:
        logger.info("=" * 80 + "\n")

if __name__ == "__main__":
    logger.info("Starting login flow tests...\n")
    
    # Run tests
    test_results = {
        'valid_credentials': test_login(),
        'invalid_credentials': test_invalid_credentials(),
        'missing_fields': test_missing_fields()
    }
    
    # Print summary
    logger.info("\n" + "=" * 40)
    logger.info("TEST SUMMARY")
    logger.info("=" * 40)
    
    for test_name, passed in test_results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        logger.info(f"{status} - {test_name.replace('_', ' ').title()}")
    
    logger.info("=" * 40)
    
    # Exit with appropriate status code
    if all(test_results.values()):
        logger.info("All tests passed!")
        sys.exit(0)
    else:
        logger.error("Some tests failed!")
        sys.exit(1)
