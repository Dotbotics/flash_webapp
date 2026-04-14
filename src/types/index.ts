/**
 * TYPES/INDEX.TS
 * 
 * What it does:
 * Defines the global TypeScript interfaces and types used throughout the application.
 * 
 * Why it exists:
 * To ensure type safety and consistent data structures across the frontend and backend.
 * 
 * Module: Shared Logic / Types
 */

export interface PageContent {
  id: string;
  title: string;
  content: any;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  og_image?: string;
}
