# ARK Chronicles - Quick Start Guide

## Prerequisites
- Node.js 18+
- pnpm (or npm/yarn)
- Neon PostgreSQL database (provided via DATABASE_URL)

## Setup

### 1. Environment Variables
Ensure these are set in your `.env.development.local` or Vercel project settings:
```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=<random-32-byte-string>
NEXTAUTH_URL=http://localhost:3000
```

Generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Push Database Schema
```bash
pnpm exec drizzle-kit push
```

### 4. Run Development Server
```bash
pnpm dev
```

Visit `http://localhost:3000` in your browser.

## Key Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Content
- `GET /api/articles` - List articles
- `POST /api/articles` - Create article (admin only)
- `GET /api/articles/[id]` - Get article detail

### Submissions (User-Generated Content)
- `GET /api/submissions?mine=true` - Get user's submissions
- `POST /api/submissions` - Submit new story
- `PATCH /api/submissions/[id]/review` - Admin review (admin only)

### Founders
- `GET /api/founders` - List approved founders
- `POST /api/founders` - Apply as founder
- `GET /api/founders/[id]` - Founder detail

### Admin
- `GET /api/admin/stats` - Dashboard statistics
- `GET /api/admin/users` - User management
- `PATCH /api/admin/founders/[id]` - Approve founder profiles

## User Roles

### Member (Default)
- Submit stories
- View all content
- Earn XP and badges
- View user profile

### Admin
- Approve/reject submissions
- Publish articles
- Manage users and founders
- View dashboard statistics
- Access admin panel at `/admin`

## Testing Authentication

### Create Test User
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "college": "IIT Bombay",
    "role": "member"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

## Project Structure

```
/app
  /api                    # API routes
    /articles            # Article endpoints
    /auth                # Authentication
    /admin               # Admin endpoints
  /(pages)               # Public & authenticated pages
    /page.tsx            # Home
    /login               # Login page
    /signup              # Registration
    /admin               # Admin dashboard
    /submit-story        # Story submission
    /chronicles          # Article listings
    /founders            # Founder directory
    /article/[slug]      # Article detail

/lib
  /db
    /schema.ts          # Database tables & types
    /index.ts           # Database client
  /auth.ts              # NextAuth configuration

/components
  /Header.tsx           # Main navigation
  /Footer.tsx           # Footer
  /FounderApplyButton.tsx  # Founder signup button

/middleware.ts          # NextAuth middleware
```

## Common Tasks

### Create an Article (Admin Only)
```bash
curl -X POST http://localhost:3000/api/articles \
  -H "Authorization: Bearer <session-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Article Title",
    "content": "Article content...",
    "category": "Feature Stories",
    "featured": true
  }'
```

### Submit a Story (Any User)
```bash
curl -X POST http://localhost:3000/api/submissions \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Story",
    "content": "Story content...",
    "authorName": "Your Name",
    "email": "your@email.com",
    "college": "IIT Bombay",
    "category": "Founder Stories"
  }'
```

### Get User Profile
```bash
curl http://localhost:3000/api/user/profile \
  -H "Authorization: Bearer <session-token>"
```

## Troubleshooting

### Build Fails with "DATABASE_URL not set"
- Ensure `.env.development.local` has DATABASE_URL
- Or set it in your shell: `export DATABASE_URL="..."`

### NextAuth errors
- Check NEXTAUTH_SECRET is set (32+ bytes)
- Check NEXTAUTH_URL matches your app URL
- Clear browser cookies and try again

### Database connection fails
- Verify DATABASE_URL is correct
- Check your Neon database is active
- Verify network access from your location

### Pages not loading
- Check the dev server is running (`pnpm dev`)
- Check browser console for errors
- Verify page files exist in `/app`

## Production Deployment

### Build
```bash
NODE_ENV=production NEXTAUTH_URL=https://yourdomain.com pnpm build
```

### Run Production Build
```bash
pnpm start
```

### Vercel Deployment
1. Connect GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

## Documentation
See `IMPLEMENTATION_SUMMARY.md` for complete architecture documentation.
