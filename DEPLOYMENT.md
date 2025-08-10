# CareerOpen Deployment Guide

This guide will walk you through deploying CareerOpen to production using Render.com for the backend and Vercel for the frontend.

## Prerequisites

1. GitHub account
2. Render.com account (free tier)
3. Vercel account (free tier)
4. Git installed locally

## 1. Backend Deployment (Render.com)

### 1.1 Prepare Your Repository

1. Push your code to a GitHub repository if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_GITHUB_REPO_URL
   git push -u origin main
   ```

### 1.2 Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: careeropen-api
   - **Region**: Choose the one closest to your users
   - **Branch**: main
   - **Build Command**: `./render-build.sh`
   - **Start Command**: `./render-start.sh`
   - **Plan**: Free

5. Add environment variables from `.env.prod.example` in the Render dashboard

6. Click "Create Web Service"

## 2. Frontend Deployment (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: (leave as is)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. Add environment variables:
   ```
   VITE_API_BASE_URL=https://careeropen-api.onrender.com/api
   VITE_APP_NAME=CareerOpen
   VITE_APP_ENV=production
   ```

6. Click "Deploy"

## 3. Configure CORS

Update your backend's `CORS_ALLOWED_ORIGINS` to include your Vercel frontend URL.

## 4. Verify Deployment

1. Backend: Visit `https://careeropen-api.onrender.com/api/health/`
2. Frontend: Visit your Vercel URL (e.g., `https://careeropen.vercel.app`)

## Troubleshooting

- Check logs in the Render dashboard for backend issues
- Check Vercel deployment logs for frontend issues
- Ensure all environment variables are set correctly
- Verify database migrations have run successfully

## Maintenance

- Set up monitoring in the Render dashboard
- Configure custom domains if needed
- Set up SSL certificates (automatically handled by both Render and Vercel)
