from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from datetime import datetime, timedelta
from rest_framework_simplejwt.tokens import AccessToken
import json

from .models import Job, JobApplication, Company, Category

User = get_user_model()

class JobAPITestCase(APITestCase):
    """Test cases for the Job API endpoints."""

    @classmethod
    def setUpTestData(cls):
        # Set up data for the whole TestCase
        cls.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            first_name='Test',
            last_name='User',
            is_employer=False
        )
        cls.employer = User.objects.create_user(
            email='employer@example.com',
            password='testpass123',
            first_name='Employer',
            last_name='User',
            is_employer=True
        )
        
        # Create a company
        cls.company = Company.objects.create(
            name='Tech Corp',
            description='A leading tech company',
            website='https://techcorp.example.com',
            industry='Information Technology',
            company_size='51-200',
            founded_year=2010
        )
        
        # Create categories
        cls.category1 = Category.objects.create(
            name='Software Development',
            description='Software development jobs',
            icon='fas fa-code'
        )
        cls.category2 = Category.objects.create(
            name='Design',
            description='Design jobs',
            icon='fas fa-paint-brush'
        )
    
    def setUp(self):
        # Generate JWT tokens for testing
        self.user_token = str(AccessToken.for_user(self.user))
        self.employer_token = str(AccessToken.for_user(self.employer))
        
        # Create test jobs
        self.job1 = Job.objects.create(
            title='Senior Software Engineer',
            description='We are looking for a skilled senior software engineer.',
            company=self.company,
            location='New York, NY',
            job_type='full_time',
            salary_min=120000,
            salary_max=160000,
            is_remote=False,
            is_active=True,
            poster=self.employer,
            requirements='5+ years of Python, Django, React, JavaScript experience',
            responsibilities='Lead development of web applications',
            status='published',
            application_deadline=datetime.now() + timedelta(days=30)
        )
        self.job1.categories.add(self.category1)
        
        self.job2 = Job.objects.create(
            title='UI/UX Designer',
            description='We are looking for a creative UI/UX designer.',
            company=self.company,
            location='San Francisco, CA',
            job_type='full_time',
            salary_min=90000,
            salary_max=130000,
            is_remote=True,
            is_active=True,
            poster=self.employer,
            requirements='3+ years of UI/UX design experience, proficiency in Figma',
            responsibilities='Design user interfaces and experiences',
            status='published',
            application_deadline=datetime.now() + timedelta(days=15)
        )
        self.job2.categories.add(self.category2)
        
        self.client = APIClient()
    
    def test_list_jobs(self):
        # Test listing jobs
        url = reverse('job-list')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
    
    def test_retrieve_job(self):
        """Test retrieving a job posting."""
        # Test retrieving an active job
        url = reverse('job-detail', kwargs={'pk': self.job1.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.job1.title)
        self.assertEqual(response.data['company']['name'], self.company.name)
        self.assertIn('categories', response.data)
        self.assertEqual(len(response.data['categories']), 1)
        self.assertEqual(response.data['categories'][0]['name'], self.category1.name)
        
        # Test retrieving a non-existent job
        invalid_url = reverse('job-detail', kwargs={'pk': 999})
        response = self.client.get(invalid_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Test retrieving an inactive job (should be visible to the owner)
        self.job1.is_active = False
        self.job1.save()
        
        # Regular user should get 404
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Owner should be able to see it
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employer_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.job1.title)
        
        # Admin should also be able to see it
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        admin_token = str(AccessToken.for_user(admin))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Reset job status
        self.job1.is_active = True
        self.job1.save()
    
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

    def test_update_job(self):
        """Test updating a job posting."""
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.employer_token}')
        
        # Test partial update
        url = reverse('job-detail', kwargs={'pk': self.job1.id})
        data = {
            'title': 'Senior Software Engineer (Updated)',
            'description': 'Updated job description with more details.',
            'salary_max': 170000,
            'categories': [self.category1.id, self.category2.id]
        }
        response = self.client.patch(url, data, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job1.refresh_from_db()
        self.assertEqual(self.job1.title, 'Senior Software Engineer (Updated)')
        self.assertEqual(self.job1.salary_max, 170000)
        self.assertEqual(set(self.job1.categories.all()), {self.category1, self.category2})
        
        # Test full update
        full_data = {
            'title': 'Senior Full Stack Engineer',
            'description': 'We need a full stack engineer with Python and JavaScript experience.',
            'company': self.company.id,
            'location': 'Remote',
            'job_type': 'full_time',
            'salary_min': 120000,
            'salary_max': 170000,
            'is_remote': True,
            'requirements': '5+ years of Python, Django, React, JavaScript, AWS',
            'responsibilities': 'Develop full-stack web applications',
            'status': 'published',
            'categories': [self.category1.id],
            'is_active': True
        }
        response = self.client.put(url, full_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job1.refresh_from_db()
        self.assertEqual(self.job1.title, 'Senior Full Stack Engineer')
        self.assertEqual(self.job1.location, 'Remote')
        self.assertEqual(list(self.job1.categories.all()), [self.category1])
        
        # Test unauthorized update (non-owner)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.user_token}')
        response = self.client.patch(url, {'title': 'Unauthorized Update'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
        # Test admin update
        admin = User.objects.create_superuser(
            email='admin@example.com',
            password='adminpass123',
            first_name='Admin',
            last_name='User'
        )
        admin_token = str(AccessToken.for_user(admin))
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {admin_token}')
        response = self.client.patch(url, {'title': 'Admin Updated Title'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.job1.refresh_from_db()
        self.assertEqual(self.job1.title, 'Admin Updated Title')

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
        # Set up authentication
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        
        # Create a job application
        url = reverse('job-apply', kwargs={'job_id': self.job.id})
        data = {
            'cover_letter': 'I am very interested in this position. I have 5+ years of experience with Python and Django.',
            'resume': None,  # In a real test, you'd use SimpleUploadedFile
            'phone': '+1234567890',
            'portfolio_url': 'https://example.com/portfolio'
        }
        
        # Test successful application
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(JobApplication.objects.count(), 1)
        application = JobApplication.objects.first()
        self.assertEqual(application.job, self.job)
        self.assertEqual(application.applicant, self.applicant)
        self.assertEqual(application.status, 'applied')
        self.assertEqual(application.cover_letter, data['cover_letter'])
        
        # Test applying to the same job again (should fail)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(JobApplication.objects.count(), 1)  # No new application created
        
        # Test applying to a non-existent job
        invalid_url = reverse('job-apply', kwargs={'job_id': 999})
        response = self.client.post(invalid_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        
        # Test applying to a closed job
        self.job.status = 'closed'
        self.job.save()
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('This job is no longer accepting applications', str(response.data))
        
        # Reset job status
        self.job.status = 'published'
        self.job.save()
        
        # Test unauthenticated access
        self.client.credentials()  # Clear credentials
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
