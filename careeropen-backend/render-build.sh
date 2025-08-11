#!/usr/bin/env bash
# Exit on error and enable debugging
set -o errexit
set -x

# Change to the directory containing manage.py
cd "$(dirname "$0")/.." || exit 1
cd careeropen-backend || exit 1

# Print debug information
echo "=== Build Debug Information ==="
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Contents of current directory:"
ls -la

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Verify Python packages
echo "Installed Python packages:"
pip list

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput

# Apply database migrations
echo "Applying database migrations..."
python manage.py migrate --noinput

# Create necessary directories
echo "Creating necessary directories..."
mkdir -p logs

# Set proper permissions
echo "Setting file permissions..."
chmod +x ../render-start.sh

# Verify the WSGI application can be imported
echo "Verifying WSGI application can be imported..."
python -c "from core.wsgi import application; print('Successfully imported WSGI application')"
