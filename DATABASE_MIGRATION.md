# Database Migration Guide

This document explains how the Flash Index database system works and how to switch from SQLite to PostgreSQL.

## Overview

The application supports two database systems:
1. **SQLite (Default)**: A lightweight, file-based database stored in `cms.db`. Ideal for development and small deployments.
2. **PostgreSQL**: A robust, server-based database. Recommended for production environments.

The system is designed to be flexible, allowing you to switch between these databases using environment variables.

## Configuration

### SQLite (Default)
No additional configuration is required. The application will automatically create `cms.db` in the root directory if it doesn't exist.

### PostgreSQL
To use PostgreSQL, you need to provide the following environment variables in your `.env` file:

```env
DB_TYPE=postgres
POSTGRES_HOST=your-postgres-host
POSTGRES_PORT=5432
POSTGRES_USER=your-username
POSTGRES_PASSWORD=your-password
POSTGRES_DB=your-database-name
POSTGRES_SSL=false # Set to true if your provider requires SSL
```

If these credentials are provided, the application will automatically connect to PostgreSQL on startup.

## Automatic Table Creation

When the application starts, it checks if the required tables exist in the connected database. If they don't, it will automatically create them:
- `pages`: Stores page content and SEO metadata.
- `submissions`: Stores contact form submissions.
- `settings`: Stores global application settings.

The schema is consistent across both SQLite and PostgreSQL, with minor adjustments for data types (e.g., `SERIAL` for PostgreSQL IDs vs `AUTOINCREMENT` for SQLite).

## Data Migration (SQLite to PostgreSQL)

If you have been using SQLite and want to move your data to a new PostgreSQL instance, follow these steps:

1. Ensure your PostgreSQL instance is running and accessible.
2. Configure the PostgreSQL environment variables in your `.env` file.
3. Run the migration script using the following command:

```bash
npx tsx migrate.ts
```

This script will:
- Connect to your local `cms.db`.
- Connect to your configured PostgreSQL instance.
- Copy all pages, submissions, and settings.
- Handle conflicts by updating existing records in PostgreSQL.

## Reverting to SQLite

To switch back to SQLite:
1. Remove or comment out the `DB_TYPE=postgres` and other `POSTGRES_*` variables in your `.env` file.
2. Restart the application.

The application will resume using the `cms.db` file. Note that any data added to PostgreSQL while it was active will NOT be automatically synced back to SQLite.

## Developer Notes

- The database abstraction layer is located in `src/lib/db.ts`.
- All database operations in `server.ts` are asynchronous and should be `await`ed.
- When adding new tables, ensure you update the `initSchema` function in `src/lib/db.ts` to handle both database types.

How to Switch to PostgreSQL
To use PostgreSQL, add the following to your .env file:
code
Env
DB_TYPE=postgres
POSTGRES_HOST=your-host
POSTGRES_PORT=5432
POSTGRES_USER=your-user
POSTGRES_PASSWORD=your-password
POSTGRES_DB=your-db-name
POSTGRES_SSL=false
How to Migrate Data
If you have existing data in SQLite and want to move it to PostgreSQL, run:
code
Bash
npx tsx migrate.ts
This will safely copy all your content, settings, and form submissions to your new PostgreSQL database.
The application remains fully compatible with SQLite by default, ensuring no disruption to existing development workflows.
