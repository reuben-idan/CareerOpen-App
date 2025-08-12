"""
Configuration file for pytest in the accounts/tests directory.
Ensures the project root is in the Python path and configures database access for all tests.
"""
import os
import sys
import pytest
from django.conf import settings
from django.test import TestCase
from django.core.management import call_command

# Add the project root to the Python path
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
if project_root not in sys.path:
    sys.path.insert(0, project_root)

# Set up Django environment variables
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

# Initialize Django
import django
django.setup()

# Configure Django's test database
@pytest.fixture(scope='session')
def django_db_setup(django_db_setup, django_db_blocker):
    """Set up the test database and run migrations."""
    with django_db_blocker.unblock():
        # Run migrations
        call_command('migrate', '--noinput')

# Ensure tests use the database and have access to the test database
@pytest.fixture(autouse=True)
def enable_db_access_for_all_tests(db):
    """Enable database access for all tests."""
    pass
