# Deployment Guide

## Vercel Deployment Fix

This guide helps you fix the Prisma deployment issue on Vercel.

### Problem
The error occurs because Prisma Client is not generated properly during the Vercel build process.

### Solution Applied

1. **Updated package.json scripts:**
   - Added `prisma generate` to the build script
   - Added `postinstall` script to generate Prisma Client after dependency installation

2. **Updated Prisma schema:**
   - Changed database URL to use environment variable instead of hardcoded path

3. **Added vercel.json configuration:**
   - Set proper build environment variables for Prisma

### Environment Variables for Vercel

Set these environment variables in your Vercel dashboard:

#### Required Variables:
```bash
DATABASE_URL="file:./dev.db"  # For SQLite (temporary)
NEXTAUTH_URL="https://your-app-name.vercel.app"
NEXTAUTH_SECRET="your-secure-secret-key-here"
TMDB_API_KEY="c4c9c547f87ee22e5b1dd08d984bfc85"
TMDB_BASE_URL="https://api.themoviedb.org/3"
```

#### Optional Variables (for email functionality):
```bash
SENDGRID_API_KEY="your-sendgrid-api-key"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### Important Notes:

1. **SQLite Limitation:** SQLite doesn't work well in production on Vercel due to the serverless nature. For production, consider using:
   - [PlanetScale](https://planetscale.com/) (MySQL)
   - [Neon](https://neon.tech/) (PostgreSQL)
   - [Railway](https://railway.app/) (PostgreSQL/MySQL)

2. **Database Migration:** If you switch to a cloud database, update your `schema.prisma` provider and run:
   ```bash
   npx prisma db push
   ```

### Deployment Steps:

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Set the environment variables in Vercel dashboard
4. Deploy!

The build should now succeed with the Prisma Client properly generated.
