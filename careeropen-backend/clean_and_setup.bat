@echo off
echo Cleaning up Python environment...

:: Remove existing virtual environment
if exist .venv (
    echo Removing existing virtual environment...
    rmdir /s /q .venv
)

:: Remove Python cache files
echo Cleaning Python cache...
for /d /r . %%d in (__pycache__) do @if exist "%%d" rmdir /s /q "%%d"
del /s /q *.pyc

echo Creating new virtual environment...
python -m venv .venv

call .venv\Scripts\activate

:: Upgrade pip
echo Upgrading pip and setuptools...
python -m pip install --upgrade pip setuptools wheel

:: Install dependencies
echo Installing dependencies...
pip install -r requirements-clean.txt

echo.
echo Environment setup complete! Don't forget to activate it with:
echo .venv\Scripts\activate
