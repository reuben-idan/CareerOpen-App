import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

# Import models after Django setup
from jobs.models import JobApplication

# Get all job applications
applications = JobApplication.objects.all()

print("\n=== All Job Applications ===")
for app in applications:
    print(f"\nApplication ID: {app.id}")
    print(f"Job: {app.job.title} (ID: {app.job.id})")
    print(f"Applicant: {app.applicant.email} (ID: {app.applicant.id})")
    print(f"Status: {app.status}")
    print(f"Applied at: {app.applied_at}")
    print(f"Resume: {app.resume.name if app.resume else 'None'}")
    print(f"Cover letter: {app.cover_letter[:100]}..." if app.cover_letter else "Cover letter: None")
