/**
 * HOOKS/USESEO.TS
 * 
 * What it does:
 * A custom React hook for updating the page's SEO metadata.
 * 
 * Why it exists:
 * To provide a simple, reusable way for page components to update 
 * their metadata without needing to interact with the SEO component directly.
 * 
 * How it works:
 * - Accepts an 'seo' object containing title, description, and keywords.
 * - Returns the metadata values or defaults if they are missing.
 * 
 * Connections:
 * - Used by 'Home.tsx' and other page components.
 * 
 * Module: Shared Logic / Hooks
 */

import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
}

/**
 * useSEO Hook
 * 
 * Dynamically updates the document head with SEO meta tags.
 */
export const useSEO = (seo?: SEOProps) => {
  useEffect(() => {
    if (!seo) return;

    // Update Title
    if (seo.title) {
      document.title = seo.title;
    }

    // Update Meta Description
    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta');
      descriptionTag.setAttribute('name', 'description');
      document.head.appendChild(descriptionTag);
    }
    descriptionTag.setAttribute('content', seo.description || '');

    // Update Meta Keywords
    let keywordsTag = document.querySelector('meta[name="keywords"]');
    if (!keywordsTag) {
      keywordsTag = document.createElement('meta');
      keywordsTag.setAttribute('name', 'keywords');
      document.head.appendChild(keywordsTag);
    }
    keywordsTag.setAttribute('content', seo.keywords || '');

    // Update Open Graph Image
    let ogImageTag = document.querySelector('meta[property="og:image"]');
    if (!ogImageTag) {
      ogImageTag = document.createElement('meta');
      ogImageTag.setAttribute('property', 'og:image');
      document.head.appendChild(ogImageTag);
    }
    ogImageTag.setAttribute('content', seo.ogImage || '');

  }, [seo]);
};
