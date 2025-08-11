#!/usr/bin/env python3
"""
Automated environment setup for CareerOpen development.
This script will set up the Python path and install the package in development mode.
"""
import os
import sys
import subprocess
from pathlib import Path

def setup_environment():
    """Set up the development environment."""
    # Get the project root directory
    project_root = Path(__file__).parent.absolute()
    backend_dir = project_root / "careeropen-backend"
    
    print("🚀 Setting up CareerOpen development environment...")
    
    # Add the backend directory to PYTHONPATH
    if str(backend_dir) not in sys.path:
        sys.path.insert(0, str(backend_dir))
        print(f"✅ Added {backend_dir} to PYTHONPATH")
    
    # Install the package in development mode
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-e", "."])
        print("✅ Installed CareerOpen in development mode")
    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to install in development mode: {e}")
        return False
    
    # Verify the installation
    try:
        import careeropen_backend
        print("✅ Successfully imported careeropen_backend")
        return True
    except ImportError as e:
        print(f"❌ Failed to import careeropen_backend: {e}")
        return False

if __name__ == "__main__":
    if setup_environment():
        print("\n✨ Setup completed successfully! You can now run tests and import modules.")
        print("\nTry running:")
        print("  python -m pytest")
        print("  python -m careeropen_backend.manage.py runserver")
    else:
        print("\n❌ Setup failed. Please check the error messages above.")
        sys.exit(1)
