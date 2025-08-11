import os
import sys
import subprocess

def main():
    # Set the backend directory path
    backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
    
    # Add the backend directory to Python path
    if backend_path not in sys.path:
        sys.path.insert(0, backend_path)
    
    # Set the DJANGO_SETTINGS_MODULE environment variable
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    
    # Print environment info
    print("="*50)
    print(f"Starting Django development server...")
    print(f"Python Executable: {sys.executable}")
    print(f"Working Directory: {os.getcwd()}")
    print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
    print("="*50 + "\n")
    
    try:
        # Import Django after setting up the environment
        import django
        from django.core.management import execute_from_command_line
        
        # Run the development server
        execute_from_command_line(['manage.py', 'runserver'])
    except ImportError as e:
        print(f"Error: {e}")
        print("\nMake sure you have Django installed. You can install it with:")
        print("pip install -r careeropen-backend/requirements.txt")
        sys.exit(1)
    except Exception as e:
        print(f"An error occurred: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
