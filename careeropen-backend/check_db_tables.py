"""
Check database tables and apply any pending migrations.
"""
import os
import sys
import django
from pathlib import Path

# Add the project root to the Python path
project_root = Path(__file__).resolve().parent
sys.path.insert(0, str(project_root))

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

try:
    django.setup()
    print("Django setup complete")
except Exception as e:
    print(f"Error setting up Django: {e}")
    sys.exit(1)

from django.db import connection

def check_database_tables():
    """Check if database tables exist and list them."""
    print("\n=== Checking Database Tables ===")
    
    try:
        # List all tables in the database
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """)
            tables = [row[0] for row in cursor.fetchall()]
            
            print(f"Found {len(tables)} tables in the database:")
            for table in sorted(tables):
                print(f"- {table}")
                
            return tables
            
    except Exception as e:
        print(f"Error checking database tables: {e}")
        import traceback
        traceback.print_exc()
        return []

def apply_migrations():
    """Apply any pending migrations."""
    print("\n=== Applying Migrations ===")
    
    try:
        from django.core.management import call_command
        print("Applying migrations...")
        call_command('migrate', interactive=False)
        print("Migrations applied successfully")
        return True
    except Exception as e:
        print(f"Error applying migrations: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # First, check existing tables
    tables = check_database_tables()
    
    # If no tables or expected tables are missing, try applying migrations
    if not tables or 'accounts_user' not in tables:
        print("\nSome tables are missing. Attempting to apply migrations...")
        if apply_migrations():
            print("\nMigrations applied. Re-checking tables...")
            check_database_tables()
    else:
        print("\nAll expected tables exist. No migrations needed.")
