import os
import django
from django.utils import timezone

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Import models after Django setup
from jobs.models import Job, Company, Category
from accounts.models import User

def create_test_job():
    # Get or create a test company
    company, _ = Company.objects.get_or_create(
        name='Test Company',
        defaults={
            'description': 'A test company for development purposes',
            'website': 'https://testcompany.example.com',
            'is_verified': True
        }
    )
    
    # Get or create a test category
    category, _ = Category.objects.get_or_create(
        name='Software Development',
        defaults={
            'description': 'Software development jobs',
            'is_active': True
        }
    )
    
    # Get the admin user as the poster
    poster = User.objects.filter(is_superuser=True).first()
    if not poster:
        raise Exception("No admin user found. Please create a superuser first.")
    
    # Create a new job
    job = Job.objects.create(
        title='Test Job for Application',
        description='This is a test job for application submission testing.',
        company=company,
        job_type=Job.FULL_TIME,
        location='Remote',
        is_remote=True,
        salary_min=80000,
        salary_max=120000,
        status=Job.PUBLISHED,
        is_active=True,
        poster=poster,
        published_at=timezone.now()
    )
    
    # Add category to the job
    job.categories.add(category)
    
    print(f"Created test job with ID: {job.id}")
    return job

if __name__ == "__main__":
    job = create_test_job()
    print(f"Job created successfully! ID: {job.id}, Title: {job.title}")
