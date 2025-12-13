@echo off
REM Setup script for CareerOpen development environment

echo Setting up CareerOpen development environment...
echo.

REM Create a virtual environment if it doesn't exist
if not exist "venv\" (
    echo Creating virtual environment...
    python -m venv venv
) else (
    echo Virtual environment already exists.
)

REM Activate the virtual environment
call venv\Scripts\activate

echo.
echo Installing dependencies...
pip install --upgrade pip
pip install -e .

REM Install development dependencies
if exist "requirements-dev.txt" (
    pip install -r requirements-dev.txt
)

echo.
echo Setting up Python path...
set PYTHONPATH=%~dp0careeropen-backend;%PYTHONPATH%

echo.
echo Verifying setup...
python -c "import sys; print('\nPython path:'); [print(p) for p in sys.path]"

echo.
echo Setup complete! Activate the virtual environment with:
echo    venv\Scripts\activate
echo.
pause
