# Deployment Guide

## Prerequisites

1. **Neon PostgreSQL Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create a new project
   - Copy the connection string

2. **Vercel Account**
   - Sign up at [vercel.com](https://vercel.com)
   - Connect your GitHub account

## Step-by-Step Deployment

### 1. Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech) and create an account
2. Create a new project
3. Copy the connection string (it looks like: `postgresql://username:password@hostname/database`)
4. The database table will be created automatically when the app first runs

### 2. GitHub Repository

1. Create a new repository on GitHub
2. Push your local code:
   ```bash
   git remote add origin https://github.com/yourusername/url-shortener.git
   git branch -M main
   git push -u origin main
   ```

### 3. Vercel Deployment

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `NEXT_PUBLIC_BASE_URL`: Your deployed URL (e.g., `https://your-app.vercel.app`)
5. Click "Deploy"

### 4. Post-Deployment

1. Visit your deployed URL
2. Test the health endpoint: `https://your-app.vercel.app/healthz`
3. Create a test link to verify functionality
4. Update the `NEXT_PUBLIC_BASE_URL` environment variable with your actual Vercel URL

## Environment Variables

Required environment variables for production:

```
DATABASE_URL=postgresql://username:password@hostname/database
NEXT_PUBLIC_BASE_URL=https://your-app.vercel.app
```

## Testing Endpoints

After deployment, test these endpoints:

- `GET /healthz` - Should return `{"ok": true, "version": "1.0"}`
- `POST /api/links` - Create a new link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get link stats
- `DELETE /api/links/:code` - Delete a link
- `GET /:code` - Redirect to target URL

## Troubleshooting

1. **Database Connection Issues**
   - Verify your DATABASE_URL is correct
   - Check Neon dashboard for connection details

2. **Build Failures**
   - Check Vercel build logs
   - Ensure all dependencies are in package.json

3. **Runtime Errors**
   - Check Vercel function logs
   - Verify environment variables are set correctly