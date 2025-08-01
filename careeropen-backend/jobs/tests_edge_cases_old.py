"""
Edge case tests for the jobs application.

These tests cover various edge cases that might not be covered in the main test suite.
"""
import os
import tempfile
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from django.contrib.auth import get_user_model
from jobs.models import Job, JobApplication

User = get_user_model()

class JobApplicationEdgeCases(APITestCase):
    """Test edge cases for job applications."""
    
    def setUp(self):
        # Create test users
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
        
        # Create a job
        self.job = Job.objects.create(
            title='Software Engineer',
            company='Test Company',
            location='Remote',
            description='Job description',
            requirements='Python, Django, React',
            job_type=Job.FULL_TIME,
            status=Job.PUBLISHED,
            poster=self.employer,
            is_active=True
        )
        
        # Get JWT tokens
        self.employer_token = self.get_jwt_token('employer@example.com', 'testpass123')
        self.applicant_token = self.get_jwt_token('applicant@example.com', 'testpass123')
    
    def get_jwt_token(self, email, password):
        """Helper method to get JWT token."""
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {'email': email, 'password': password}, format='json')
        return response.data['access']
    
    def test_apply_with_invalid_file_type(self):
        """Test applying for a job with an invalid file type."""
        url = reverse('job-apply', kwargs={'job_id': self.job.id})
        
        # Create a test file with invalid type
        test_file = SimpleUploadedFile(
            'test_image.jpg',
            b'file_content',
            content_type='image/jpeg'
        )
        
        data = {
            'cover_letter': 'Test cover letter',
            'resume': test_file
        }
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume', response.data)
        
        # Clean up credentials
        self.client.credentials()
    
    def test_apply_with_large_file(self):
        """Test applying for a job with a file that's too large."""
        url = reverse('job-apply', kwargs={'job_id': self.job.id})
        
        # Create a test file that's too large (5MB + 1 byte)
        large_file = SimpleUploadedFile(
            'large_resume.pdf',
            b'0' * (5 * 1024 * 1024 + 1),  # 5MB + 1 byte
            content_type='application/pdf'
        )
        
        data = {
            'cover_letter': 'Test cover letter',
            'resume': large_file
        }
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('resume', response.data)
        
        # Clean up credentials
        self.client.credentials()
    
    def test_apply_to_inactive_job(self):
        """Test applying to an inactive job."""
        # Create an inactive job
        inactive_job = Job.objects.create(
            title='Inactive Job',
            company='Test Company',
            location='Remote',
            description='Inactive job description',
            requirements='Python, Django',
            job_type=Job.FULL_TIME,
            status=Job.PUBLISHED,
            poster=self.employer,
            is_active=False
        )
        
        url = reverse('job_apply', kwargs={'job_id': inactive_job.id})
        
        # Create a test file
        test_file = SimpleUploadedFile(
            'resume.pdf',
            b'file_content',
            content_type='application/pdf'
        )
        
        data = {
            'cover_letter': 'Test cover letter',
            'resume': test_file
        }
        
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        response = self.client.post(url, data, format='multipart')
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['detail'], 'Job not found or not accepting applications.')
        
        # Clean up credentials
        self.client.credentials()
    
    def test_apply_twice_to_same_job(self):
        """Test applying to the same job twice."""
        url = reverse('job-apply', kwargs={'job_id': self.job.id})
        
        # Create a test file
        test_file = SimpleUploadedFile(
            'resume.pdf',
            b'file_content',
            content_type='application/pdf'
        )
        
        data = {
            'cover_letter': 'Test cover letter',
            'resume': test_file
        }
        
        # First application (should succeed)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.applicant_token}')
        response1 = self.client.post(url, data, format='multipart')
        self.assertEqual(response1.status_code, status.HTTP_201_CREATED)
        
        # Second application (should fail)
        response2 = self.client.post(url, data, format='multipart')
        self.assertEqual(response2.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response2.data['detail'], 'You have already applied to this job.')
        
        # Clean up credentials
        self.client.credentials()


class JobSearchEdgeCases(APITestCase):
    """Test edge cases for job search."""
    
    def setUp(self):
        # Create test user
        self.user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            is_employer=False
        )
        
        # Create some test jobs
        self.job1 = Job.objects.create(
            title='Senior Python Developer',
            company='Company A',
            location='Remote',
            description='Senior Python developer with Django experience',
            requirements='Python, Django, PostgreSQL, AWS',
            job_type=Job.FULL_TIME,
            status=Job.PUBLISHED,
            poster=self.user,
            is_active=True
        )
        
        self.job2 = Job.objects.create(
            title='Frontend Developer',
            company='Company B',
            location='New York, NY',
            description='Frontend developer with React experience',
            requirements='JavaScript, React, Redux, CSS',
            job_type=Job.FULL_TIME,
            status=Job.PUBLISHED,
            poster=self.user,
            is_active=True
        )
        
        # Get JWT token
        self.token = self.get_jwt_token('test@example.com', 'testpass123')
    
    def get_jwt_token(self, email, password):
        """Helper method to get JWT token."""
        url = reverse('token_obtain_pair')
        response = self.client.post(url, {'email': email, 'password': password}, format='json')
        return response.data['access']
    
    def test_search_with_empty_query(self):
        """Test job search with an empty query string."""
        url = reverse('job-search')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        response = self.client.get(f"{url}?search=", format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 2)  # Should return all jobs
        
        # Clean up credentials
        self.client.credentials()
    
    def test_search_with_special_characters(self):
        """Test job search with special characters in the query."""
        url = reverse('job-search')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # Test with special characters that might cause issues
        response = self.client.get(f"{url}?search=Python&location=New+York%2C+NY", format='json')
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only return jobs matching the search criteria
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['id'], self.job1.id)
        
        # Clean up credentials
        self.client.credentials()
    
    def test_pagination(self):
        """Test that pagination works correctly."""
        # Create more jobs to test pagination
        for i in range(15):
            Job.objects.create(
                title=f'Test Job {i}',
                company=f'Company {i}',
                location='Remote',
                description=f'Test job description {i}',
                requirements=f'Requirements {i}',
                job_type=Job.FULL_TIME,
                status=Job.PUBLISHED,
                poster=self.user,
                is_active=True
            )
        
        url = reverse('job-search')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.token}')
        
        # First page
        response1 = self.client.get(f"{url}?page=1", format='json')
        self.assertEqual(response1.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response1.data['results']), 10)  # Default page size
        self.assertIsNotNone(response1.data['next'])
        
        # Second page
        response2 = self.client.get(response1.data['next'], format='json')
        self.assertEqual(response2.status_code, status.HTTP_200_OK)
        self.assertGreater(len(response2.data['results']), 0)
        self.assertIsNone(response2.data.get('next'))  # Should be the last page
        
        # Clean up credentials
        self.client.credentials()
