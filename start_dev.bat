@echo off
echo 🚀 Starting CareerOpen Development Environment...

echo.
echo 📦 Installing Frontend Dependencies...
cd frontend
call npm install

echo.
echo 🔧 Installing Backend Dependencies...
cd ..\backend
pip install -r requirements.txt

echo.
echo 🗄️ Setting up Database...
python run_setup.py

echo.
echo 👤 Creating Superuser...
python create_superuser.py

echo.
echo ✅ Setup Complete!
echo.
echo 🌐 Frontend: http://localhost:3001
echo 🔧 Backend: http://localhost:8000
echo 📚 API Docs: http://localhost:8000/api/docs/
echo 👤 Admin: http://localhost:8000/admin/ (admin@careeropen.com / admin123)
echo.
echo To start servers:
echo   Frontend: cd frontend && npm run dev
echo   Backend:  cd backend && python manage.py runserver
pause