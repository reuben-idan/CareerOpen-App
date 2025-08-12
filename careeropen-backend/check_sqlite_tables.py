"""
Check SQLite database tables and apply any pending migrations.
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

def check_sqlite_tables():
    """Check if database tables exist in SQLite."""
    print("\n=== Checking SQLite Database ===")
    
    try:
        # Get the database file path from settings
        db_path = os.path.abspath('db.sqlite3')
        print(f"Database path: {db_path}")
        
        if not os.path.exists(db_path):
            print("Database file does not exist. It will be created when migrations are applied.")
            return []
            
        # List all tables in SQLite
        with connection.cursor() as cursor:
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
            tables = [row[0] for row in cursor.fetchall()]
            
            print(f"\nFound {len(tables)} tables in the database:")
            for table in sorted(tables):
                # Skip SQLite system tables
                if not table.startswith('sqlite_'):
                    print(f"- {table}")
                
            return tables
            
    except Exception as e:
        print(f"Error checking SQLite database: {e}")
        import traceback
        traceback.print_exc()
        return []

def apply_migrations():
    """Apply any pending migrations."""
    print("\n=== Applying Migrations ===")
    
    try:
        from django.core.management import call_command
        
        print("Creating migrations...")
        call_command('makemigrations', interactive=False)
        
        print("\nApplying migrations...")
        call_command('migrate', interactive=False)
        
        print("\nMigrations applied successfully")
        return True
        
    except Exception as e:
        print(f"\nError applying migrations: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    # First, check existing tables
    tables = check_sqlite_tables()
    
    # If no tables or expected tables are missing, try applying migrations
    if not tables or 'accounts_user' not in tables:
        print("\nSome tables are missing. Attempting to apply migrations...")
        if apply_migrations():
            print("\nMigrations applied. Re-checking tables...")
            check_sqlite_tables()
    else:
        print("\nAll expected tables exist. No migrations needed.")
