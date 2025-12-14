# Free Deployment Guide

## Stack
- **Frontend**: Vercel (Free)
- **Backend**: Render (Free) 
- **Database**: Supabase PostgreSQL (Free)

## 1. Database Setup (Supabase)

1. Go to [supabase.com](https://supabase.com) and create account
2. Create new project
3. Go to Settings > Database
4. Copy connection string: `postgresql://postgres:[password]@[host]:5432/postgres`

## 2. Backend Deployment (Render)

1. Go to [render.com](https://render.com) and connect GitHub
2. Create new Web Service
3. Connect your repository
4. Configure:
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `cd backend && python manage.py migrate && python manage.py collectstatic --noinput && gunicorn careeropen.wsgi:application`
5. Add environment variables:
   ```
   DEBUG=False
   SECRET_KEY=[generate-random-key]
   DATABASE_URL=[supabase-connection-string]
   ALLOWED_HOSTS=your-app-name.onrender.com
   CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
   ```
6. Deploy

## 3. Frontend Deployment (Vercel)

1. Go to [vercel.com](https://vercel.com) and connect GitHub
2. Import your repository
3. Configure:
   - **Framework**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
5. Deploy

## 4. Update CORS Settings

After frontend deployment, update backend environment:
```
CORS_ALLOWED_ORIGINS=https://your-actual-frontend-url.vercel.app
```

## Free Tier Limits
- **Render**: 750 hours/month, sleeps after 15min inactivity
- **Vercel**: 100GB bandwidth/month
- **Supabase**: 500MB database, 2GB bandwidth/month

## URLs
- Frontend: `https://your-app.vercel.app`
- Backend: `https://your-backend.onrender.com`
- API Docs: `https://your-backend.onrender.com/api/docs/`