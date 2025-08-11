#!/usr/bin/env bash
# Exit on error and enable debugging
set -o errexit
set -x

# Change to the project root directory
cd "$(dirname "$0")/.." || exit 1

# Set Python path to include the project root
export PYTHONPATH=$PYTHONPATH:$(pwd)

# Print debug information
echo "=== Build Debug Information ==="
echo "Current directory: $(pwd)"
echo "Python path: $PYTHONPATH"
echo "Contents of current directory:"
ls -la
echo "Contents of careeropen-backend directory:"
ls -la careeropen-backend/

# Install dependencies
echo "Installing dependencies..."
pip install -r careeropen-backend/requirements.txt

# Verify Python packages
echo "Installed Python packages:"
pip list

# Collect static files
echo "Collecting static files..."
cd careeropen-backend || exit 1
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

# Print final directory structure for debugging
echo "Final directory structure:"
find . -type d | sort
