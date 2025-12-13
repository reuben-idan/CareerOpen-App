import requests
import os
from pathlib import Path

def test_job_application():
    # Login to get the token
    login_url = 'http://localhost:8000/api/token/'
    login_data = {
        'email': 'test_applicant@example.com',
        'password': 'testpass123'
    }
    
    print("Logging in...")
    response = requests.post(login_url, json=login_data)
    response.raise_for_status()
    token = response.json()['access']
    print(f"Successfully logged in. Token: {token[:10]}...")
    
    # Prepare the application data
    job_id = 2  # The test job we created
    application_url = f'http://localhost:8000/api/jobs/jobs/{job_id}/apply/'
    
    # Create a test resume file
    resume_content = "This is a test resume file.\nName: Test User\nSkills: Python, Django, REST APIs"
    resume_path = 'test_resume.txt'
    with open(resume_path, 'w') as f:
        f.write(resume_content)
    
    # Read the file in binary mode and ensure it's closed after reading
    with open(resume_path, 'rb') as f:
        resume_data = f.read()
    
    # Prepare the multipart form data
    files = {
        'resume': ('test_resume.txt', resume_data, 'text/plain'),
    }
    
    data = {
        'cover_letter': 'I am very interested in this position and believe my skills make me a strong candidate. This is a test cover letter for the job application.'
    }
    
    headers = {
        'Authorization': f'Bearer {token}'
    }
    
    print("\nSubmitting job application...")
    response = requests.post(
        application_url,
        headers=headers,
        data=data,
        files=files
    )
    
    print(f"Status code: {response.status_code}")
    if response.status_code >= 400:
        print(f"Error: {response.text}")
    else:
        print("\nApplication submitted successfully!")
        print("Response:")
        print(response.json())
    
    # Clean up
    try:
        if os.path.exists(resume_path):
            os.remove(resume_path)
    except Exception as e:
        print(f"Warning: Could not remove {resume_path}: {e}")

if __name__ == "__main__":
    test_job_application()
