import os
import django

# Set up the Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Now we can import the Job model
from jobs.models import Job

# Activate the job with ID 1
try:
    job = Job.objects.get(id=1)
    job.is_active = True
    job.save()
    print(f"Job '{job.title}' has been activated. is_active is now {job.is_active}")
except Job.DoesNotExist:
    print("Job with ID 1 does not exist.")
