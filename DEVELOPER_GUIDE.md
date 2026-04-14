# Developer Guide - Flash Index

This guide is designed to help developers understand the internal workings of the Flash Index project and how to extend it.

## 🏗️ Project Architecture

Flash Index is a **data-driven Single Page Application (SPA)** built with React and Express.

- **The Brain (`App.tsx`):** The central orchestrator. It fetches all page data, site configurations, and navigation items from the backend on initial load. It uses `react-router-dom` to manage client-side routing.
- **The Pages (`src/modules/public/pages/`):** React components that represent different views. They are "dumb" components that receive their content as a `content` prop.
- **The Sections (`src/modules/public/components/sections/`):** Modular UI blocks (e.g., `HeroSection`, `FeaturesSection`). The Home page is composed of these sections, each receiving a slice of the page's JSON content.
- **The Admin (`src/modules/admin/`):** A protected area for managing content, SEO, and global settings. It features a dynamic editor that maps JSON keys to form fields.
- **The Backend (`server.ts`):** An Express server that manages the SQLite database, handles file uploads via `multer`, and serves the frontend.

## 🛣️ Routing System

### Frontend
Routing is handled in `src/app/App.tsx`.
- `/`: Renders the `home` page.
- `/:id`: Dynamically renders any page by its ID (e.g., `/about`, `/features`).
- `/admin-log`: The entry point for the administrative dashboard.

### Backend
API routes are defined in `server.ts`:
- `GET /api/pages`: Fetches all pages.
- `GET /api/settings/:key`: Fetches global settings.
- `POST /api/upload`: Handles image uploads to `/public/uploads`.
- `POST /api/submit`: Processes contact form submissions.

## 💾 Database & Storage

### SQLite Database (`cms.db`)
- **`pages`**: Stores `id`, `title`, `content` (JSON), and SEO metadata.
- **`settings`**: Stores global configs like `site_config`, `navigation`, and `email_config`.
- **`submissions`**: Stores contact form data.

### File Storage
- **Location:** All uploaded media is stored in `public/uploads/`.
- **Process:** When an image is uploaded via the Admin Dashboard, it is sent to `/api/upload`. The server saves the file and returns a URL (e.g., `/uploads/image-123.png`), which is then stored in the database.

## 🧱 Extending the System

### Adding a New Page
1. **Admin Dashboard:** Log in to `/admin-log` and click "Create Page."
2. **Page ID:** Provide a unique ID (e.g., `services`).
3. **Custom Layout (Optional):**
   - Create `src/modules/public/pages/Services.tsx`.
   - Update the `switch` statement in `PageRenderer` (`App.tsx`) to include your new component.

### Adding a New Home Section
1. **Component:** Create a new section in `src/modules/public/components/sections/`.
2. **Data:** Define the keys your section needs in the JSON content.
3. **Integration:** Import and add the section to `src/modules/public/pages/Home.tsx`.
4. **Editor:** The Admin Editor will automatically show fields for any new keys you add to the JSON.

## 🔍 SEO & Metadata

SEO is implemented using `react-helmet-async`.
- **`SEO.tsx`**: A component that wraps the Helmet logic.
- **Per-Page:** Each page component (Home, About, etc.) receives SEO data from the database and passes it to the `SEO` component.
- **Admin:** Use the "SEO" tab in the editor to update titles, descriptions, and OG images.

## 🔐 Admin Editing Flow

1. **Fetch:** When the editor opens, it fetches the page's `content` JSON.
2. **Render:** `ContentEditorFields.tsx` iterates through the JSON.
   - Strings -> Text inputs or Textareas.
   - Arrays -> List editors with add/remove functionality.
   - "image" in key -> Image upload field.
3. **Update:** Local state is updated as the user types.
4. **Save:** On save, the entire JSON object is stringified and sent to the backend to update the `pages` table.

## ✅ Best Practices

- **Modular Components:** Keep sections small and focused.
- **Data-Driven:** Never hardcode text that should be editable.
- **Type Safety:** Use the interfaces in `src/types/` to ensure data consistency.
- **Performance:** Use `motion` for smooth animations but avoid over-animating.
- **Security:** Ensure the admin dashboard remains protected at `/admin-log`.
