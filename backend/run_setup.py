#!/usr/bin/env python
"""Setup script to initialize the CareerOpen backend."""
import os
import sys
import django
from django.core.management import execute_from_command_line

def setup_backend():
    """Run initial setup for the backend."""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'careeropen.settings')
    
    print("🚀 Setting up CareerOpen Backend...")
    
    # Make migrations
    print("📝 Creating migrations...")
    execute_from_command_line(['manage.py', 'makemigrations'])
    
    # Run migrations
    print("🗄️ Running migrations...")
    execute_from_command_line(['manage.py', 'migrate'])
    
    print("✅ Backend setup complete!")
    print("📚 API Documentation: http://localhost:8000/api/docs/")
    print("🔧 Admin Panel: http://localhost:8000/admin/")
    print("🚀 Start server: python manage.py runserver")

if __name__ == '__main__':
    setup_backend()