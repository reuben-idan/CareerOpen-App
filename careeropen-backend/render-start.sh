#!/usr/bin/env bash
# Exit on error
set -o errexit

# Change to the project directory (one level up from the script location)
cd "$(dirname "$0")/.." || exit 1

# Set Python path to include the current directory
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Print current directory and Python path for debugging
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"

# Start Gunicorn with the application
# Using 2 workers for the free tier (adjust based on your needs)
exec gunicorn --worker-tmp-dir /dev/shm \
  --workers=2 \
  --threads=4 \
  --worker-class=gthread \
  --log-file=- \
  --bind=0.0.0.0:${PORT:-10000} \
  --pythonpath careeropen-backend \
  core.wsgi:application
