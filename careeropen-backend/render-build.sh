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

# Install dependencies
pip install -r careeropen-backend/requirements.txt

# Collect static files
python careeropen-backend/manage.py collectstatic --noinput

# Apply any outstanding database migrations
python careeropen-backend/manage.py migrate --noinput
