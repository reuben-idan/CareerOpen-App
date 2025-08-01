from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import AccessToken

from .models import Job, JobApplication

User = get_user_model()

class JobAPITestCase(APITestCase):
    """Test cases for the Job API endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_employer=False
        )
        self.employer = User.objects.create_user(
            email='employer@example.com',
            password='testpass123',
            first_name='Employer',
            last_name='User',
            is_employer=True
        )
        
        # Generate JWT tokens for testing
        self.user_token = str(AccessToken.for_user(self.user))
        self.employer_token = str(AccessToken.for_user(self.employer))
        
        self.job1 = Job.objects.create(
            title='Software Engineer',
            description='We are looking for a skilled software engineer.',
            company='Tech Corp',
            location='New York, NY',
            job_type='full_time',
            salary_min=90000,
            salary_max=120000,
            is_remote=False,
            is_active=True,
            poster=self.employer,
            requirements='Python, Django, React, JavaScript experience required',
            responsibilities='Develop and maintain web applications',
            status='published'
        )
        
        self.client = APIClient()
    
    def test_list_jobs(self):
        # Test listing jobs
        url = reverse('job-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_create_job_authenticated_employer(self):
        # Test job creation by employer
        url = reverse('job-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employer_token}')
        
        data = {
            'title': 'New Job',
            'description': 'This is a new job posting',
            'company': 'New Company',
            'location': 'Remote',
            'job_type': 'full_time',
            'salary_min': 80000,
            'salary_max': 100000,
            'is_remote': True,
            'required_skills': 'Python, Django, AWS'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Job.objects.count(), 2)

class JobSearchAPITestCase(APITestCase):
    """Test cases for the Job Search API endpoint."""
    
    @classmethod
    def setUpTestData(cls):
        cls.employer = User.objects.create_user(
            email='employer@example.com',
            password='testpass123',
            is_employer=True
        )
        
        cls.job1 = Job.objects.create(
            title='Python Developer',
            description='Python developer with Django experience',
            company='Tech Corp',
            location='Remote',
            job_type='full_time',
            salary_min=100000,
            salary_max=150000,
            is_remote=True,
            is_active=True,
            poster=cls.employer,
            requirements='Python, Django, REST APIs experience required',
            responsibilities='Develop and maintain backend services',
            status='published'
        )
        
        cls.job2 = Job.objects.create(
            title='Frontend Developer',
            description='Frontend developer with React',
            company='Web Solutions',
            location='New York',
            job_type='full_time',
            salary_min=90000,
            salary_max=130000,
            is_remote=False,
            is_active=True,
            poster=cls.employer,
            requirements='JavaScript, React, HTML, CSS experience required',
            responsibilities='Develop and maintain user interfaces',
            status='published'
        )
    
    def test_search_by_keyword(self):
        # Test searching by keyword
        url = reverse('job_search')
        # Create a JWT token for the employer to use in the test
        token = str(AccessToken.for_user(self.employer))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(f"{url}?search=python")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Python Developer')
    
    def test_filter_by_remote(self):
        # Test filtering remote jobs
        url = reverse('job_search')
        # Create a JWT token for the employer to use in the test
        token = str(AccessToken.for_user(self.employer))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {token}')
        response = self.client.get(f"{url}?is_remote=true")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['title'], 'Python Developer')

class JobApplicationAPITestCase(APITestCase):
    """Test cases for the Job Application API endpoints."""
    
    def setUp(self):
        self.employer = User.objects.create_user(
            email='employer@example.com',
            password='testpass123',
            is_employer=True
        )
        
        self.applicant = User.objects.create_user(
            email='applicant@example.com',
            password='testpass123',
            is_employer=False
        )
        
        # Generate JWT tokens for testing
        self.employer_token = str(AccessToken.for_user(self.employer))
        self.applicant_token = str(AccessToken.for_user(self.applicant))
        
        self.job = Job.objects.create(
            title='Software Engineer',
            description='We are looking for a skilled software engineer.',
            company='Tech Corp',
            location='New York, NY',
            job_type='full_time',
            salary_min=90000,
            salary_max=120000,
            is_remote=False,
            is_active=True,
            poster=self.employer,
            requirements='Python, Django, React, JavaScript experience required',
            responsibilities='Develop and maintain web applications',
            status='published'
        )
        
        self.client = APIClient()
    
    def test_apply_for_job(self):
        """Test applying for a job."""
        url = reverse('job_apply', args=[self.job.id])
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        
        # Create a temporary file for testing
        from django.core.files.uploadedfile import SimpleUploadedFile
        test_file = SimpleUploadedFile(
            'test_resume.pdf',
            b'This is a test resume',
            content_type='application/pdf'
        )
        
        data = {
            'job': self.job.id,
            'cover_letter': 'I am very interested in this position.',
            'resume': test_file
        }
        
        # Use format='multipart' for file uploads
        # Ensure the client is authenticated with the applicant's token
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        
        # Make the request with the test client
        response = self.client.post(url, data, format='multipart')
        
        # Check the response status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, 
                        f"Expected status code 201, but got {response.status_code}. Response: {response.data}")
        
        # Verify the job application was created
        self.assertTrue(JobApplication.objects.filter(job=self.job, applicant=self.applicant).exists())
        
        # Clean up credentials
        self.client.credentials()
