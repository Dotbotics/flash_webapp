/**
 * SEO.TSX
 * 
 * What it does:
 * A component that manages the HTML head metadata (title, description, keywords, OG tags) 
 * for the current page.
 * 
 * Why it exists:
 * To ensure the website is search-engine optimized and looks good when 
 * shared on social media.
 * 
 * How it works:
 * - Uses 'react-helmet-async' to inject tags into the <head> of the document.
 * - Accepts props for title, description, keywords, and an Open Graph image.
 * 
 * Connections:
 * - Used by 'src/app/App.tsx' to wrap every page.
 * 
 * Module: Public / Components
 */

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  url?: string;
}

export const SEO = ({ 
  title, 
  description, 
  keywords, 
  ogImage, 
  url = window.location.href 
}: SEOProps) => {
  const siteTitle = "Flash Index";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {ogImage && <meta property="og:image" content={ogImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      {description && <meta property="twitter:description" content={description} />}
      {ogImage && <meta property="twitter:image" content={ogImage} />}
    </Helmet>
  );
};
