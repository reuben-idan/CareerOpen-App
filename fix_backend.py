import os
import sys
import subprocess
import time
import signal
import platform
from pathlib import Path

def run_command(cmd, cwd=None, env=None, check=True):
    """Run a command with proper output capture and error handling."""
    print(f"\n💻 Running: {' '.join(cmd)}")
    try:
        result = subprocess.run(
            cmd,
            cwd=cwd,
            env=env,
            check=check,
            text=True,
            capture_output=True
        )
        if result.stdout:
            print(result.stdout)
        return result.returncode == 0
    except subprocess.CalledProcessError as e:
        print(f"❌ Command failed with exit code {e.returncode}")
        if e.stdout:
            print("=== STDOUT ===")
            print(e.stdout)
        if e.stderr:
            print("=== STDERR ===")
            print(e.stderr)
        return False

def check_port_in_use(port=8000):
    """Check if a port is in use."""
    try:
        import socket
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            return s.connect_ex(('127.0.0.1', port)) == 0
    except Exception as e:
        print(f"⚠️  Could not check port {port}: {e}")
        return False

def kill_process_on_port(port=8000):
    """Kill process running on the specified port."""
    if platform.system() == 'Windows':
        try:
            # Find the process ID using netstat
            result = subprocess.run(
                ['netstat', '-ano'],
                capture_output=True,
                text=True,
                check=True
            )
            
            # Find the line with our port
            for line in result.stdout.split('\n'):
                if f':{port} ' in line:
                    parts = line.split()
                    if len(parts) >= 5:
                        pid = parts[-1]
                        print(f"🔫 Killing process {pid} on port {port}")
                        subprocess.run(['taskkill', '/F', '/PID', pid], check=True)
                        time.sleep(2)  # Give it time to release the port
                        return True
            return False
        except Exception as e:
            print(f"⚠️  Could not kill process on port {port}: {e}")
            return False
    else:
        print("⚠️  Unsupported OS for process killing")
        return False

def install_dependencies():
    """Install Python and frontend dependencies."""
    print("\n📦 Installing Python dependencies...")
    if not run_command([sys.executable, '-m', 'pip', 'install', '-r', 'requirements.txt'], 
                      cwd='careeropen-backend'):
        print("⚠️  Failed to install Python dependencies")
    
    print("\n📦 Installing frontend dependencies...")
    if not run_command(['npm', 'install'], cwd='.'):
        print("⚠️  Failed to install frontend dependencies")

def run_migrations():
    """Run database migrations."""
    print("\n🔄 Running database migrations...")
    return run_command(
        [sys.executable, 'manage.py', 'migrate'],
        cwd='careeropen-backend'
    )

def start_backend():
    """Start the Django backend server."""
    print("\n🚀 Starting Django backend...")
    
    # Set environment variables
    env = os.environ.copy()
    env['PYTHONPATH'] = str(Path.cwd() / 'careeropen-backend')
    env['DJANGO_SETTINGS_MODULE'] = 'core.settings'
    env['DEPLOY_ENV'] = 'development'
    env['DEBUG'] = 'True'
    env['ALLOWED_HOSTS'] = 'localhost,127.0.0.1,0.0.0.0'
    
    # Start the server in a new process
    cmd = [
        sys.executable, 'manage.py', 'runserver',
        '0.0.0.0:8000',  # Listen on all interfaces
        '--noreload',
        '--verbosity', '2'
    ]
    
    try:
        process = subprocess.Popen(
            cmd,
            cwd='careeropen-backend',
            env=env,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Wait a bit to see if it starts successfully
        time.sleep(3)
        if process.poll() is not None:
            # Process has already exited
            _, stderr = process.communicate()
            print(f"❌ Backend failed to start:\n{stderr}")
            return False
            
        print("✅ Backend server started successfully")
        print(f"   Running at http://localhost:8000/")
        print("\nPress Ctrl+C to stop the server")
        
        # Keep the process running
        try:
            while True:
                line = process.stdout.readline()
                if line:
                    print(f"[Backend] {line.strip()}")
                time.sleep(0.1)
        except KeyboardInterrupt:
            print("\n🛑 Stopping backend server...")
            process.terminate()
            process.wait()
            
    except Exception as e:
        print(f"❌ Error starting backend: {e}")
        return False
    
    return True

def main():
    print("🔧 CareerOpen Backend Setup & Troubleshooter 🔧")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not (Path.cwd() / 'careeropen-backend' / 'manage.py').exists():
        print("❌ Error: Please run this script from the project root directory")
        print("   Expected to find: careeropen-backend/manage.py")
        return 1
    
    # Check if port 8000 is in use
    if check_port_in_use(8000):
        print(f"⚠️  Port 8000 is in use. Attempting to free it...")
        if not kill_process_on_port(8000):
            print("❌ Could not free port 8000. Please close any applications using this port.")
            return 1
    
    # Install dependencies
    install_dependencies()
    
    # Run migrations
    if not run_migrations():
        print("❌ Failed to run migrations")
        return 1
    
    # Start the backend
    if not start_backend():
        print("❌ Failed to start backend server")
        return 1
    
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except KeyboardInterrupt:
        print("\n👋 Goodbye!")
        sys.exit(0)
