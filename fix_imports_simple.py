import sys
import os

# Print current Python environment info
print("="*50)
print(f"Python Executable: {sys.executable}")
print(f"Python Version: {sys.version}")
print(f"Working Directory: {os.getcwd()}")
print("\nPython Path:")
for p in sys.path:
    print(f"- {p}")

# Add the backend directory to Python path
backend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), 'careeropen-backend'))
sys.path.insert(0, backend_path)

print("\n" + "="*50)
print(f"Added to path: {backend_path}")

# Try to import the module
try:
    import careeropen_backend
    print(f"✅ Successfully imported careeropen_backend from: {careeropen_backend.__file__}")
except ImportError as e:
    print(f"❌ Failed to import careeropen_backend: {e}")
    print("\nChecking directory structure:")
    if os.path.exists(backend_path):
        print(f"Backend directory exists: {backend_path}")
        print("Contents:")
        for item in os.listdir(backend_path):
            print(f"- {item}")
    else:
        print(f"Backend directory not found at: {backend_path}")

print("\n" + "="*50)
print("Trying to import core module directly...")
try:
    from core import settings
    print(f"✅ Successfully imported core.settings from: {settings.__file__}")
except ImportError as e:
    print(f"❌ Failed to import core.settings: {e}")
