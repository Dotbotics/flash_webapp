# Flash Index

AI-powered file retrieval web application that allows users to search for content across cloud storage providers using natural language.

## Tech Stack

- **Frontend:** React 19, React Router DOM v7, Tailwind CSS v4, Framer Motion, Lucide React, React Helmet Async
- **Backend:** Express.js (Node.js), TypeScript
- **Database:** SQLite (via better-sqlite3), with optional PostgreSQL support
- **Build Tool:** Vite v6
- **Package Manager:** npm

## Architecture

- Single Express server serves both the API and Vite middleware (dev) or static files (production)
- Server runs on port 5000
- SQLite database (`cms.db`) stores pages, settings, and form submissions
- File uploads stored in `public/uploads/`
- Admin dashboard accessible at `/admin-log`

## Development

```bash
npm run dev
```

Starts the Express server with Vite middleware for hot module replacement.

## Production Build

```bash
npm run build
```

Builds the React frontend to `dist/`, served statically by Express.

## Key Files

- `server.ts` - Express backend entry point with all API routes
- `src/lib/db.ts` - Database abstraction layer (SQLite/PostgreSQL)
- `src/lib/api.ts` - Frontend API client
- `src/lib/auth.ts` - Authentication utilities
- `src/app/App.tsx` - React app entry with routing
- `vite.config.mjs` - Vite configuration

## Environment Variables

See `.env.example` for required environment variables:
- `GEMINI_API_KEY` - Google Gemini AI API key
- `APP_URL` - Application URL
- `DB_TYPE` - Database type (`sqlite` or `postgres`)
- PostgreSQL connection variables (optional)

## Deployment

Configured for autoscale deployment. Build command: `npm run build`. Run command: `node --import tsx/esm server.ts`.
