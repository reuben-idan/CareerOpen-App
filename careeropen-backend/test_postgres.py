import os
import django
import psycopg2
from django.conf import settings

print("Testing PostgreSQL connection...")

# Test direct PostgreSQL connection
try:
    conn = psycopg2.connect(
        dbname='careeropen',
        user='postgres',
        password='postgres',
        host='localhost',
        port='5432'
    )
    print("✓ Successfully connected to PostgreSQL database")
    
    # Test a simple query
    cur = conn.cursor()
    cur.execute("SELECT version();")
    db_version = cur.fetchone()
    print(f"✓ PostgreSQL version: {db_version[0]}")
    
    # Close the connection
    cur.close()
    conn.close()
    
except Exception as e:
    print(f"✗ Error connecting to PostgreSQL: {e}")

# Test Django ORM connection
print("\nTesting Django ORM connection...")
try:
    # Set up Django environment
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    django.setup()
    
    from django.contrib.auth import get_user_model
    User = get_user_model()
    
    # Count users
    user_count = User.objects.count()
    print(f"✓ Successfully connected to database via Django ORM")
    print(f"✓ Total users in database: {user_count}")
    
    # List first 5 users
    print("\nFirst 5 users:")
    for user in User.objects.all()[:5]:
        print(f"- {user.email} ({user.first_name} {user.last_name})")
        
except Exception as e:
    print(f"✗ Error with Django ORM: {e}")
