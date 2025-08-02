"""
Test script for verifying role-based permissions and cache invalidation.
"""
import os
import sys
import django
import requests

# Fix console output encoding on Windows
if sys.platform == 'win32':
    import io
    import sys
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
    sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now import Django modules after setup
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import RefreshToken

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

def get_auth_headers(user):
    """Generate JWT token and return headers for authenticated requests."""
    refresh = RefreshToken.for_user(user)
    return {
        'Authorization': f'Bearer {refresh.access_token}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

def create_test_user(email, password, is_employer=False, **extra_fields):
    """Create a test user with the given email and password."""
    User = get_user_model()
    try:
        user = User.objects.get(email=email)
        user.set_password(password)
        user.save()
    except User.DoesNotExist:
        user = User.objects.create_user(
            email=email,
            password=password,
            is_employer=is_employer,
            **extra_fields
        )
    return user

def test_job_seeker_permissions():
    """Test job seeker permissions and cache behavior."""
    print("\n=== Testing Job Seeker Permissions ===")
    
    # Create or get job seeker user (not an employer)
    job_seeker = create_test_user(
        email='jobseeker@example.com',
        password='testpass123',
        is_employer=False,
        first_name='Job',
        last_name='Seeker'
    )
    
    headers = get_auth_headers(job_seeker)
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    # Test 1: Job seeker can view job list
    print("\n[1/3] Testing job list access...")
    response = requests.get(f"{base_url}/jobs/", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✓ Job seeker can view job list")
    
    # Test 2: Job seeker cannot create jobs
    print("\n[2/3] Testing job creation permission...")
    job_data = {
        'title': 'New Job from Job Seeker',
        'description': 'This should be forbidden',
        'location': 'Test Location',
        'job_type': 'full_time',
        'salary': '50000-70000',
        'is_active': True
    }
    response = requests.post(
        f"{base_url}/jobs/",
        json=job_data,
        headers=headers
    )
    print(f"Status Code: {response.status_code}")
    if response.status_code == 403:
        print("✓ Job seeker cannot create jobs (as expected)")
    
    # Test 3: Job seeker cannot update jobs
    print("\n[3/3] Testing job update permission...")
    if response.status_code == 200:  # If somehow creation was allowed
        job_id = response.json().get('id')
    else:
        # Get an existing job ID
        list_response = requests.get(f"{base_url}/jobs/", headers=headers)
        if list_response.status_code == 200 and list_response.json().get('results'):
            job_id = list_response.json()['results'][0]['id']
            
            update_response = requests.patch(
                f"{base_url}/jobs/{job_id}/",
                json={'title': 'Updated by Job Seeker'},
                headers=headers
            )
            print(f"Update Status Code: {update_response.status_code}")
            if update_response.status_code == 403:
                print("✓ Job seeker cannot update jobs (as expected)")

def test_employer_permissions():
    """Test employer permissions and cache invalidation."""
    print("\n=== Testing Employer Permissions ===")
    
    # Create or get employer user
    from accounts.models import UserProfile
    
    # Create employer user
    employer = create_test_user(
        email='employer@example.com',
        password='testpass123',
        first_name='Test',
        last_name='Employer',
        is_employer=True  # This is the correct way to set employer status
    )
    
    # Create or update user profile with company information
    UserProfile.objects.update_or_create(
        user=employer,
        defaults={
            'company_name': 'Test Company',
            'company_website': 'https://testcompany.example.com',
            'company_description': 'A test company for development purposes'
        }
    )
    
    headers = get_auth_headers(employer)
    base_url = 'http://127.0.0.1:8000/api/jobs'
    
    # Test 1: Employer can view job list
    print("\n[1/4] Testing job list access...")
    response = requests.get(f"{base_url}/jobs/", headers=headers)
    print(f"Status Code: {response.status_code}")
    if response.status_code == 200:
        print("✓ Employer can view job list")
    
    # Test 2: Employer can create jobs
    print("\n[2/4] Testing job creation...")
    job_data = {
        'title': 'New Job from Employer',
        'description': 'This is a test job',
        'location': 'Test Location',
        'job_type': 'full_time',
        'salary': '50000-70000',
        'is_active': True
    }
    response = requests.post(
        f"{base_url}/jobs/",
        json=job_data,
        headers=headers
    )
    print(f"Status Code: {response.status_code}")
    
    if response.status_code == 201:
        job_id = response.json().get('id')
        print(f"✓ Employer can create jobs (ID: {job_id})")
        
        # Test 3: Employer can update their own jobs
        print("\n[3/4] Testing job update...")
        update_response = requests.patch(
            f"{base_url}/jobs/{job_id}/",
            json={'description': 'Updated description'},
            headers=headers
        )
        print(f"Update Status Code: {update_response.status_code}")
        if update_response.status_code == 200:
            print("✓ Employer can update their own jobs")
        
        # Test 4: Cache invalidation on update
        print("\n[4/4] Testing cache invalidation...")
        # Get job to cache it
        requests.get(f"{base_url}/jobs/{job_id}/", headers=headers)
        
        # Update the job
        update_response = requests.patch(
            f"{base_url}/jobs/{job_id}/",
            json={'description': 'Updated again to test cache invalidation'},
            headers=headers
        )
        
        # Get job again - should reflect the update
        get_response = requests.get(f"{base_url}/jobs/{job_id}/", headers=headers)
        if get_response.status_code == 200 and \
           'cache invalidation' in get_response.json().get('description', ''):
            print("✓ Cache properly invalidated on update")
    else:
        print(f"✗ Failed to create job: {response.text}")

if __name__ == "__main__":
    print("=== Starting Role-Based Permissions Test ===")
    
    try:
        # Test job seeker permissions
        test_job_seeker_permissions()
        
        # Test employer permissions and cache invalidation
        test_employer_permissions()
        
    except Exception as e:
        print(f"\nError during tests: {str(e)}")
    
    print("\n=== Test Complete ===")
