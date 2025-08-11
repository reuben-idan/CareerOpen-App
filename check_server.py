"""
Script to check if the Django server is running and accessible.
"""
import socket
import sys

def check_port(host='127.0.0.1', port=8000):
    """Check if a port is open on the specified host."""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(5)
        result = sock.connect_ex((host, port))
        sock.close()
        return result == 0
    except Exception as e:
        print(f"Error checking port {port}: {e}")
        return False

def main():
    print("Checking if Django server is running on port 8000...")
    if check_port():
        print("✅ Server is running and accessible on port 8000")
    else:
        print("❌ Server is not accessible on port 8000")
    
    print("\nChecking for running Python processes...")
    try:
        import psutil
        python_processes = [p for p in psutil.process_iter(['pid', 'name', 'cmdline']) 
                          if 'python' in p.info['name'].lower() or 
                          (p.info['cmdline'] and 'python' in ' '.join(p.info['cmdline']).lower())]
        
        if python_processes:
            print("\nFound Python processes:")
            for p in python_processes:
                print(f"PID: {p.info['pid']}, Name: {p.info['name']}")
                if p.info['cmdline']:
                    print(f"  Command: {' '.join(p.info['cmdline'])}")
        else:
            print("No Python processes found.")
    except ImportError:
        print("psutil module not available. Install it with 'pip install psutil' for more detailed process information.")

if __name__ == "__main__":
    main()
