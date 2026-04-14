/**
 * FOOTER.TSX
 * 
 * What it does:
 * The site-wide footer component containing company info, quick links, 
 * and social media icons.
 * 
 * Why it exists:
 * To provide secondary navigation and essential company information 
 * at the bottom of every page.
 * 
 * How it works:
 * - Organizes links into columns (Product, Company, Legal).
 * - Uses the 'onNavigate' handler for internal links.
 * 
 * Connections:
 * - Receives navigation handlers from 'src/app/App.tsx'.
 * 
 * Module: Public / Components
 */

import { Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FooterProps {
  siteConfig: { 
    siteName: string; 
    logoUrl: string;
    logoSizeDesktop: number;
    logoSizeTablet: number;
    logoSizeMobile: number;
    footerDescription: string;
    footerCopyright: string;
  } | null;
  navigation: { id: string; label: string; path: string }[];
  footerConfig: {
    socialLinks: { id: string; label: string; url: string }[];
    resourceLinks: { id: string; label: string; path: string }[];
    navigationTitle: string;
    resourcesTitle: string;
  } | null;
}

/**
 * Footer Component
 * 
 * Displays site-wide footer with branding and links.
 */
export const Footer = ({ siteConfig, navigation, footerConfig }: FooterProps) => (
  <footer className="bg-graphite-night text-white pt-8 pb-5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Section */}
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center mb-4 group">
            <div className="flex items-center justify-center mr-3 overflow-hidden">
              {siteConfig?.logoUrl ? (
                <img 
                  src={siteConfig.logoUrl} 
                  alt="Logo" 
                  className="h-auto object-contain" 
                  style={{ width: '100px' }}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="text-ruby-heat w-8 h-8" />
                  <span className="text-3xl font-bold tracking-tight">
                    {siteConfig?.siteName || 'Flash.Index'}
                  </span>
                </div>
              )}
            </div>
          </Link>
          <p className="text-white/40 max-w-sm mb-5 leading-relaxed text-sm">
            {siteConfig?.footerDescription || `${siteConfig?.siteName || 'FlashIndex'} helps individuals and enterprises instantly find photos, documents, videos, and files across cloud storage — without folders, filenames, or filters.`}
          </p>
          <div className="flex space-x-4">
            {(footerConfig?.socialLinks || [
              { id: '1', label: 'X', url: '/contact' },
              { id: '2', label: 'LI', url: '/about' },
              { id: '3', label: 'IG', url: '/features' }
            ]).map((social) => (
              social.url.startsWith('/') ? (
                <Link
                  key={social.id}
                  to={social.url}
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-ruby-heat transition-all cursor-pointer border border-white/5"
                >
                  <span className="text-xs font-bold">{social.label}</span>
                </Link>
              ) : (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center hover:bg-ruby-heat transition-all cursor-pointer border border-white/5"
                >
                  <span className="text-xs font-bold">{social.label}</span>
                </a>
              )
            ))}
          </div>
        </div>

        {/* Navigation Links */}
        <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-8">
          <div>
            <h4 className="text-base font-bold mb-4">{footerConfig?.navigationTitle || "Navigation"}</h4>
            <ul className="space-y-2.5 text-white/40 text-sm">
              {navigation.map((item) => (
                <li key={item.id}>
                  <Link to={item.path} className="hover:text-ruby-heat transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-base font-bold mb-4">{footerConfig?.resourcesTitle || "Resources"}</h4>
            <ul className="space-y-2.5 text-white/40 text-sm">
              {(footerConfig?.resourceLinks || [
                { id: '1', label: 'Features', path: '/features' },
                { id: '2', label: 'Pricing', path: '/pricing' },
                { id: '3', label: 'About', path: '/about' },
                { id: '4', label: 'Contact', path: '/contact' }
              ]).map((link) => (
                <li key={link.id}>
                  <Link to={link.path} className="hover:text-ruby-heat transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mt-8 pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-3 text-white/20 text-xs font-mono">
        <span>{siteConfig?.footerCopyright || `© 2026 ${siteConfig?.siteName || 'Flash Index'}. All rights reserved.`}</span>
      </div>
    </div>
  </footer>
);
