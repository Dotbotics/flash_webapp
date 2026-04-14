/**
 * API.TS
 * 
 * What it does:
 * A utility library containing helper functions for interacting with the backend API.
 * 
 * Why it exists:
 * To centralize all fetch calls related to page management, making the code 
 * cleaner and easier to maintain.
 * 
 * How it works:
 * - Uses the native 'fetch' API to communicate with Express endpoints.
 * - Handles JSON parsing and basic error logging.
 * 
 * Connections:
 * - Used primarily by 'src/app/App.tsx' and 'src/modules/admin/pages/Dashboard.tsx'.
 * - Connects to endpoints defined in 'server.ts'.
 * 
 * Module: Shared Logic / Lib
 */

import { PageContent } from '../types';

export const fetchPages = async (): Promise<PageContent[]> => {
  try {
    const res = await fetch('/api/pages');
    const data = await res.json();
    if (!Array.isArray(data)) {
      console.error("Expected array from /api/pages, got:", data);
      return [];
    }
    return data.map((p: any) => ({
      ...p,
      content: typeof p.content === 'string' ? JSON.parse(p.content) : p.content
    }));
  } catch (err) {
    console.error("Failed to fetch pages", err);
    return [];
  }
};

export const updatePage = async (
  id: string, 
  title: string, 
  content: any, 
  meta_title?: string, 
  meta_description?: string, 
  meta_keywords?: string, 
  og_image?: string
): Promise<boolean> => {
  try {
    const res = await fetch(`/api/pages/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        title, 
        content, 
        meta_title, 
        meta_description, 
        meta_keywords, 
        og_image 
      })
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("Update failed", err);
    return false;
  }
};

export const createPage = async (id: string, title: string): Promise<boolean> => {
  try {
    const res = await fetch('/api/pages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        id, 
        title, 
        content: { 
          title: title, 
          body: 'New page content goes here...' 
        } 
      })
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error("Create failed", err);
    return false;
  }
};

export const fetchSettings = async (key: string): Promise<any> => {
  try {
    const res = await fetch(`/api/settings/${key}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error(`Failed to fetch settings: ${key}`, err);
    return null;
  }
};

export const updateSettings = async (key: string, value: any): Promise<boolean> => {
  try {
    const res = await fetch(`/api/settings/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(value)
    });
    const data = await res.json();
    return data.success;
  } catch (err) {
    console.error(`Failed to update settings: ${key}`, err);
    return false;
  }
};

export const uploadImage = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append('image', file);
  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const { url } = await res.json();
      return url;
    }
    return null;
  } catch (err) {
    console.error("Upload failed", err);
    return null;
  }
};
