# URL Shortener - Mini Bit.ly Clone

A full-stack URL shortener application built with Next.js, TypeScript, and PostgreSQL.

## Features

- ✅ Shorten URLs with custom or auto-generated codes
- ✅ Click tracking and analytics
- ✅ Link management (create, view, delete)
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ RESTful API endpoints

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Neon)
- **Styling**: Plain CSS
- **Deployment**: Vercel

## API Endpoints

- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links
- `GET /api/links/:code` - Get stats for a specific link
- `DELETE /api/links/:code` - Delete a link
- `GET /:code` - Redirect to target URL
- `GET /healthz` - Health check endpoint

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd url-shortener
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Update `.env.local` with your database URL:
   ```
   DATABASE_URL=postgresql://username:password@hostname:port/database
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

```sql
CREATE TABLE links (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  last_clicked TIMESTAMP
);
```

## Deployment

The application is configured for deployment on Vercel with Neon PostgreSQL:

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## License

MIT