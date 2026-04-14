# Flash Index - AI-Powered File Retrieval

Flash Index is a modern, high-performance web application designed to revolutionize how individuals and enterprises find their files. By connecting to various cloud storage providers, Flash Index allows users to search for content using natural language descriptions rather than exact filenames or rigid folder structures.

## 🚀 Project Overview

- **Frontend:** React 18, Vite, Tailwind CSS, Framer Motion.
- **Backend:** Node.js, Express.
- **Database:** SQLite (via `better-sqlite3`).
- **CMS:** Custom-built admin dashboard for dynamic content, navigation, and SEO management.

## 🏗️ Architecture & Routing

The project follows a modular, full-stack architecture:

### Frontend Routing (React Router)
- **Public Routes:** Handled in `App.tsx` using `react-router-dom`. Routes are dynamically mapped to page IDs stored in the database.
- **Admin Routes:** The admin dashboard is accessible via `/admin-log`. It is protected by a simple session-based authentication system.
- **Dynamic Rendering:** The `PageRenderer` component in `App.tsx` fetches the current page's content from the backend and renders the corresponding React component (e.g., `HomePage`, `FeaturesPage`).

### Backend API (Express)
- **RESTful API:** `server.ts` provides endpoints for fetching pages, settings, and handling form submissions.
- **Static Serving:** The server serves the built frontend assets and uploaded media files.
- **Middleware:** Uses `express.json()` for parsing requests and `multer` for handling file uploads.

## 📁 Folder Structure

```text
project-root/
├── cms.db                # SQLite database file
├── server.ts             # Backend entry point, API routes & file upload logic
├── index.html            # Frontend entry point
├── public/
│   └── uploads/          # Directory where all uploaded images/logos are stored
├── src/
│   ├── app/              # Core application logic & routing
│   │   ├── App.tsx       # Root component, routing & global data fetching
│   │   └── main.tsx      # React DOM mounting
│   ├── modules/          # Feature-based modules
│   │   ├── public/       # Client-facing website
│   │   │   ├── pages/    # Page components (Home, About, etc.)
│   │   │   └── components/ # Reusable UI elements, sections & SEO
│   │   └── admin/        # Admin dashboard
│   │       ├── pages/    # Dashboard, Login, Editor
│   │       └── components/ # Sidebar, Header, Form fields, Settings
│   ├── lib/              # Shared utility functions (API, Auth)
│   ├── types/            # TypeScript interfaces & global types
│   └── index.css         # Global CSS & Tailwind configuration
```

## 💾 Database Structure & Relationships

The application uses a single SQLite database (`cms.db`) with three primary tables:

### 1. `pages` Table
Stores all page-specific content and SEO metadata.
- `id` (TEXT PK): Unique identifier (e.g., 'home', 'about').
- `title` (TEXT): Display title.
- `content` (TEXT JSON): All dynamic section data.
- `meta_title`, `meta_description`, `meta_keywords`, `og_image`: SEO tags.

### 2. `settings` Table
Stores global site configurations.
- `key` (TEXT PK): Identifier (e.g., 'site_config', 'navigation', 'email_config').
- `value` (TEXT JSON): Configuration data.

### 3. `submissions` Table
Stores contact form entries.
- `id` (INTEGER PK): Auto-incrementing ID.
- `data` (TEXT JSON): Form field values.
- `created_at` (DATETIME): Submission timestamp.

## 🖼️ File Upload Handling

- **Storage:** All uploaded files (logos, favicons, OG images, section images) are stored in the `/public/uploads/` directory.
- **Handling:** The backend uses `multer` to process `multipart/form-data` requests at the `/api/upload` endpoint.
- **Access:** Files are served statically by Express and can be accessed via `/uploads/filename.ext`.

## ⚡ Dynamic Content Mapping

The system is designed to be completely data-driven:
1. **Database:** The `content` column in the `pages` table stores a JSON object.
2. **Frontend:** `App.tsx` fetches this JSON and passes it as a `content` prop to the page component.
3. **Sections:** In `Home.tsx`, this object is destructured, and relevant parts are passed to modular section components (e.g., `HeroSection`, `FeaturesSection`).

## 🔍 SEO Implementation

SEO is managed through a multi-layered approach:
- **SEO Component:** A reusable component in `src/modules/public/components/SEO.tsx` that uses `react-helmet-async` to inject tags into the `<head>`.
- **Page Integration:** Every page component uses the `SEO` component, passing data from the `meta_*` columns of the database.
- **Admin Control:** The "SEO" tab in the Admin Editor allows real-time updates to these tags and social sharing images.

## 🔐 Admin Dashboard & Editing Flow

1. **Access:** Navigate to `/admin-log` and log in (Default: Admin / Admin123).
2. **Navigation:** Use the sidebar to select a page to edit or manage global settings.
3. **Editing:** The "Content" tab dynamically generates a form based on the page's JSON structure.
4. **Saving:** Clicking "Save Changes" sends a POST request to the backend, which updates the database and triggers a data refresh on the frontend.
