/**
 * NAVBAR.TSX
 * 
 * What it does:
 * The main navigation bar for the public website. It includes links to 
 * core pages and a link to the admin dashboard.
 * 
 * Why it exists:
 * To provide a consistent way for users to navigate between different 
 * parts of the application.
 * 
 * How it works:
 * - Dynamically renders navigation links based on the 'pages' prop.
 * - Highlights the active page.
 * - Includes a "Dashboard" link that appears if the user is logged in as an admin.
 * - Features a glassmorphism effect that activates on scroll.
 * 
 * Connections:
 * - Receives navigation state and handlers from 'src/app/App.tsx'.
 * 
 * Module: Public / Components
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Menu, X } from 'lucide-react';
import { PageContent } from '../../../types';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  pages: PageContent[];
  isAdmin: boolean;
  siteConfig: { 
    siteName: string; 
    logoUrl: string;
    logoSizeDesktop: number;
    logoSizeTablet: number;
    logoSizeMobile: number;
  } | null;
  navigation: { id: string; label: string; path: string }[];
  heroTagline?: string;
}

/**
 * Navbar Component
 * 
 * Handles navigation between different pages and provides access to the admin dashboard.
 * Includes a mobile-responsive menu.
 */
export const Navbar = ({ pages, isAdmin, siteConfig, navigation, heroTagline }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  // Use navigation from settings if available, otherwise fallback to pages
  const navItems = (navigation.length > 0 ? navigation : pages?.map(p => {
    let label = (p.id || '').split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    if (p.id === 'home') label = 'Home';
    return { id: p.id, label, path: p.id === 'home' ? '/' : `/${p.id}` };
  }) || []).filter(item => item.id !== 'home-new');

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  const displayTagline = heroTagline || "Describe anything you want to find";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {displayTagline && (
        <div className="bg-ruby-heat text-white text-center px-4 py-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] shadow-sm">
          {displayTagline}
        </div>
      )}
      <nav className="bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center group">
            <div 
              className="flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105"
              style={{
                width: 'var(--logo-w)',
              } as any}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                :root {
                  --logo-w: ${siteConfig?.logoSizeMobile || 80}px;
                }
                @media (min-width: 768px) {
                  :root {
                    --logo-w: ${siteConfig?.logoSizeTablet || 100}px;
                  }
                }
                @media (min-width: 1024px) {
                  :root {
                    --logo-w: ${siteConfig?.logoSizeDesktop || 120}px;
                  }
                }
              `}} />
              {siteConfig?.logoUrl ? (
                <img src={siteConfig.logoUrl} alt="Logo" className="w-full h-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <Zap className="text-ruby-heat w-8 h-8" />
                  <span className="text-2xl font-black tracking-tight text-graphite-night">
                    {siteConfig?.siteName || 'Flash.Index'}
                  </span>
                </div>
              )}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                className={`text-sm font-bold transition-colors hover:text-ruby-heat uppercase tracking-widest ${
                  isActive(item.path) ? 'text-ruby-heat' : 'text-graphite-night/60'
                }`}
              >
                {item.label}
              </Link>
            ))}
            
            <Link 
              to="/contact"
              className="px-6 py-2.5 bg-ruby-heat text-white text-xs font-black uppercase tracking-widest rounded-full hover:shadow-lg hover:shadow-ruby-heat/20 transition-all transform hover:-translate-y-0.5 inline-block"
            >
              Quick Connect
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-[#262626]">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-white border-b border-black/5 px-4 pt-2 pb-6 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left px-3 py-2 text-base font-bold uppercase tracking-widest transition-colors ${
                  isActive(item.path) ? 'text-ruby-heat' : 'text-graphite-night/60 hover:text-ruby-heat'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full mt-4 py-4 bg-ruby-heat text-white font-black uppercase tracking-widest rounded-2xl shadow-lg shadow-ruby-heat/20 text-center"
            >
              Quick Connect
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      </nav>
    </header>
  );
};
