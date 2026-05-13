# Screenly - Next.js Movie Streaming App

A modern, full-stack movie streaming app (Netflix-like) built with Next.js App Router, TypeScript, Tailwind CSS, Prisma (SQLite), NextAuth, and TMDB API.

## Features

- 🎬 Real movie data from TMDB API
- 🔐 Authentication (email/password) with NextAuth
- 🎨 Modern Netflix-style UI with Tailwind CSS
- 📱 Responsive design
- 🔍 Movie search functionality
- ❤️ Personal watchlist
- 🎥 Video player with sample videos
- 📊 Movie details, ratings, and trailers
- 📧 Password reset via email

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS + Framer Motion
- Prisma + SQLite
- NextAuth.js
- TMDB API
- Radix UI + Lucide React icons
- SendGrid (Email service)

## Getting Started

### 1. Get TMDB API Key

1. Go to [TMDB](https://www.themoviedb.org/) and create an account
2. Go to Settings > API and request an API key
3. Copy your API key

### 2. Setup Environment

```bash
# Copy environment file
cp .env.example .env.local

# Edit .env.local and add your configuration:
TMDB_API_KEY="your-tmdb-api-key-here"
TMDB_BASE_URL="https://api.themoviedb.org/3"

# Database
DATABASE_URL="file:./dev.db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email Configuration (Optional - for password reset)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-16-digit-app-password"

# SendGrid (Recommended for production)
SENDGRID_API_KEY="SG.your-api-key-here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Setup Database

```bash
npx prisma db push
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Pages & Features

- **Home** (`/`) - Featured movies, trending, and popular
- **Movies** (`/movies`) - Browse popular, top-rated, and now playing
- **Search** (`/search`) - Search movies by title
- **Movie Detail** (`/movie/[id]`) - Movie details, trailer, and related movies
- **Watch** (`/watch/[id]`) - Video player (requires login)
- **Watchlist** (`/watchlist`) - Personal movie list (requires login)
- **Auth** (`/auth/signin`, `/auth/signup`) - Authentication pages

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run db:push` — Push Prisma schema to database
- `npm run db:studio` — Open Prisma Studio
- `npm run fetch:movies` — Fetch movies from TMDB API
- `npm run fetch:movies:test` — Test TMDB connection

## Email Setup (Password Reset)

### Option 1: Gmail SMTP (Development)

1. Enable 2-Factor Authentication on your Google Account
2. Generate App Password:
   - Go to Google Account Settings > Security > App passwords
   - Select "Mail" and "Other (custom name)"
   - Enter "Screenly App" as name
   - Copy the 16-digit password
3. Add to `.env.local`:
   ```bash
   EMAIL_USER="your-gmail@gmail.com"
   EMAIL_PASS="your-16-digit-app-password"
   ```

### Option 2: SendGrid (Production Recommended)

1. Create account at [SendGrid.com](https://sendgrid.com/)
2. Get API Key:
   - Settings → API Keys → Create API Key
   - Select "Restricted Access"
   - Set Mail Send to "Full Access"
3. Setup Domain Authentication (Recommended):
   - Settings → Sender Authentication → Authenticate Your Domain
   - Add DNS records to your domain
4. Add to `.env.local`:
   ```bash
   SENDGRID_API_KEY="SG.your-api-key-here"
   SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
   ```

### Email Deliverability Tips

- Use your own domain for better deliverability
- Setup SPF, DKIM, and DMARC records
- Avoid spam trigger words in email content
- Use professional from address (not Gmail/Yahoo)

## TMDB Movie Database

### Fetch Movies from TMDB

The app can automatically populate your database with movies from TMDB:

```bash
# Test connection first
npm run fetch:movies:test

# Fetch movies (adjust pages in script if needed)
npm run fetch:movies
```

### Configuration

Edit `scripts/fetch-tmdb-movies.ts` to adjust:

- Number of pages per category (default: 5 pages = ~100 movies per category)
- Rate limiting (default: 250ms delay between requests)
- Categories: Popular, Top Rated, Now Playing, Upcoming, Discover

### Features

- **Duplicate Prevention** - Skips movies already in database
- **Rate Limiting** - Respects TMDB API limits
- **Error Handling** - Retry mechanism for failed requests
- **Progress Tracking** - Real-time progress display

## Database Schema

The app uses SQLite with Prisma ORM. Key models:

- **User** - User accounts and authentication
- **Movie** - Movie data from TMDB
- **Watchlist** - User's saved movies
- **PasswordResetToken** - Password reset functionality

## Environment Variables

```bash
# Required
TMDB_API_KEY="your-tmdb-api-key-here"
TMDB_BASE_URL="https://api.themoviedb.org/3"
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Email (Optional)
EMAIL_USER="your-gmail@gmail.com"
EMAIL_PASS="your-app-password"
SENDGRID_API_KEY="SG.your-api-key-here"
SENDGRID_FROM_EMAIL="noreply@yourdomain.com"
```

## Troubleshooting

### Email Issues

- **Not sending**: Check console logs, verify credentials
- **Spam folder**: Setup domain authentication, use professional domain
- **Rate limits**: Gmail: 500/day, SendGrid: 100/day (free tier)

### TMDB Issues

- **API key invalid**: Verify key in TMDB dashboard
- **Rate limited**: Script handles this automatically with delays
- **Database errors**: Run `npx prisma db push`

### General Issues

- **Build errors**: Check TypeScript errors, run `npm run build`
- **Database connection**: Ensure `.env.local` has correct DATABASE_URL
- **Authentication**: Verify NEXTAUTH_SECRET is set

## Production Deployment

1. **Email Service**: Use SendGrid or AWS SES for reliable delivery
2. **Database**: Consider PostgreSQL for production
3. **Domain**: Setup proper domain with SSL
4. **Environment**: Use proper environment variables
5. **Monitoring**: Setup error tracking and analytics

## Notes

- Movie data is fetched from TMDB API with 1-hour caching
- Video playback uses sample videos for demo purposes
- Watchlist data is stored in local SQLite database
- Images are served from TMDB CDN
- Email templates are responsive and professional
- Search prioritizes local database over TMDB API

## License

This project is for educational purposes. Please respect TMDB's terms of service and use appropriate licensing for production use.
