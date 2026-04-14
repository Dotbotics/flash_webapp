/**
 * APP.TSX
 * 
 * What it does:
 * The root React component that manages the application's global state, 
 * routing (page switching), and high-level admin authentication.
 * 
 * Why it exists:
 * It serves as the "brain" of the frontend, orchestrating which page to show
 * and ensuring that data fetched from the backend is distributed to the correct components.
 * 
 * How it works:
 * - Uses React state (useState) to track the 'activePage' and 'pages' data.
 * - Uses useEffect to fetch page content from the backend on initial load.
 * - Implements a 'renderPage' function that acts as a simple router, 
 *   mapping page IDs to their respective React components.
 * 
 * Connections:
 * - Depends on 'src/lib/api.ts' for data fetching.
 * - Depends on 'src/lib/auth.ts' for login/logout logic.
 * - Imports all major page components from 'src/modules/public/pages' and 'src/modules/admin/pages'.
 * 
 * Module: App / Entry
 */

import React, { useState, useEffect } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// --- Types ---
import { PageContent } from '../types';

// --- Lib ---
import * as api from '../lib/api';
import * as auth from '../lib/auth';

// --- Components ---
import { Navbar } from '../modules/public/components/Navbar';
import { Footer } from '../modules/public/components/Footer';
import { SEO } from '../modules/public/components/SEO';
import { AdminDashboard } from '../modules/admin/pages/Dashboard';

// --- Pages ---
import { HomePage } from '../modules/public/pages/Home';
import { FeaturesPage } from '../modules/public/pages/Features';
import { AboutPage } from '../modules/public/pages/About';
import { ContactPage } from '../modules/public/pages/Contact';
import { PricingPage } from '../modules/public/pages/Pricing';
import { GenericPage } from '../modules/public/pages/GenericPage';

interface SiteConfig {
  siteName: string;
  logoUrl: string;
  faviconUrl: string;
  logoSizeDesktop: number;
  logoSizeTablet: number;
  logoSizeMobile: number;
  footerDescription: string;
  footerCopyright: string;
}

interface NavItem {
  id: string;
  label: string;
  path: string;
}

interface FooterConfig {
  socialLinks: { id: string; label: string; url: string }[];
  resourceLinks: { id: string; label: string; path: string }[];
  navigationTitle: string;
  resourcesTitle: string;
}

/**
 * AppContent Component
 * 
 * Contains the main application logic and routing.
 * Separated from App to allow use of router hooks.
 */
function AppContent({ 
  pages, 
  loading, 
  isLoggedIn, 
  siteConfig,
  navigation,
  footerConfig,
  onLogin, 
  onLogout, 
  onUpdatePage, 
  onCreatePage 
}: { 
  pages: PageContent[], 
  loading: boolean,
  isLoggedIn: boolean,
  siteConfig: SiteConfig | null,
  navigation: NavItem[],
  footerConfig: FooterConfig | null,
  onLogin: (u: string, p: string) => Promise<boolean>,
  onLogout: () => void,
  onUpdatePage: any,
  onCreatePage: any
}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (siteConfig?.faviconUrl) {
      const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = siteConfig.faviconUrl;
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    if (siteConfig?.siteName) {
      document.title = siteConfig.siteName;
    }
  }, [siteConfig]);

  useEffect(() => {
    if (location.hash) {
      const target = document.querySelector(location.hash);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname, location.search, location.hash]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#eeeae9]">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-[#fb5b15] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-bold text-[#262626]/40">Loading Flash Index...</p>
        </div>
      </div>
    );
  }

  const isStandalonePath = location.pathname.startsWith('/admin-log');
  const homeTagline = pages.find(p => p.id === 'home')?.content?.heroTagline;

  return (
    <div className="min-h-screen bg-white">
      {!isStandalonePath && (
        <Navbar 
          pages={pages}
          isAdmin={isLoggedIn}
          siteConfig={siteConfig}
          navigation={navigation}
          heroTagline={homeTagline}
        />
      )}
      
      <main>
        <Routes>
          {/* Admin Route */}
          <Route path="/admin-log" element={
            <AdminDashboard 
              pages={pages} 
              onUpdate={onUpdatePage}
              onCreate={onCreatePage}
              isLoggedIn={isLoggedIn}
              onLogin={onLogin}
              onLogout={onLogout}
            />
          } />

          {/* Public Routes */}
          <Route path="/home-dark" element={<PageRenderer id="home" pages={pages} darkMode={true} />} />
          <Route path="/home-gradient" element={<PageRenderer id="home" pages={pages} darkMode={true} fullPageGradient={true} />} />
          <Route path="/" element={<PageRenderer id="home" pages={pages} />} />
          <Route path="/:id" element={<PageRenderer pages={pages} />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isStandalonePath && <Footer siteConfig={siteConfig} navigation={navigation} footerConfig={footerConfig} />}
    </div>
  );
}

/**
 * PageRenderer Component
 * 
 * Renders the appropriate page component based on the URL parameter.
 */
function PageRenderer({ id, pages, darkMode = false, fullPageGradient = false }: { id?: string, pages: PageContent[], darkMode?: boolean, fullPageGradient?: boolean }) {
  const params = useLocation().pathname.split('/').filter(Boolean);
  const pageId = id || params[0] || 'home';
  const navigate = useNavigate();

  const page = pages.find(p => p.id === pageId);
  if (!page) return <div className="pt-40 text-center">Page not found</div>;

  const seoComponent = (
    <SEO 
      title={page.meta_title || page.title}
      description={page.meta_description}
      keywords={page.meta_keywords}
      ogImage={page.og_image}
    />
  );

  let pageComponent;
  switch (pageId) {
    case 'home': {
      const featuresPage = pages.find(p => p.id === 'features');
      pageComponent = (
        <HomePage 
          content={page.content}
          featuresContent={featuresPage?.content}
          onNavigate={(p) => navigate(`/${p}`)}
          darkMode={darkMode}
          fullPageGradient={fullPageGradient}
          seo={{
            title: page.meta_title || page.title,
            description: page.meta_description,
            keywords: page.meta_keywords,
            ogImage: page.og_image
          }} 
        />
      );
      break;
    }
    case 'features': pageComponent = <FeaturesPage content={page.content} onNavigate={(p) => navigate(`/${p}`)} />; break;
    case 'pricing': pageComponent = <PricingPage content={page.content} onNavigate={(p) => navigate(`/${p}`)} />; break;
    case 'about': pageComponent = <AboutPage content={page.content} onNavigate={(p) => navigate(`/${p}`)} />; break;
    case 'contact': pageComponent = <ContactPage content={page.content} onNavigate={(p) => navigate(`/${p}`)} />; break;
    default: pageComponent = <GenericPage content={page.content} onNavigate={(p) => navigate(`/${p}`)} />; break;
  }

  return (
    <>
      {seoComponent}
      {pageComponent}
    </>
  );
}

/**
 * App Component
 * 
 * The root component of the application.
 * Manages global state and provides the Router context.
 */
export default function App() {
  const [pages, setPages] = useState<PageContent[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(() => auth.checkAuth());

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      const [pagesData, siteData, navData, footerData] = await Promise.all([
        api.fetchPages(),
        api.fetchSettings('site_config'),
        api.fetchSettings('navigation'),
        api.fetchSettings('footer_config')
      ]);
      setPages(pagesData);
      setSiteConfig(siteData);
      setNavigation(navData || []);
      setFooterConfig(footerData);
    } catch (err) {
      console.error('Failed to load initial data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const token = await auth.login(username, password);
    if (token) {
      setIsLoggedIn(true);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    auth.logout();
    setIsLoggedIn(false);
  };

  const handleUpdatePage = async (
    id: string, 
    title: string, 
    content: any, 
    meta_title?: string, 
    meta_description?: string, 
    meta_keywords?: string, 
    og_image?: string
  ): Promise<boolean> => {
    const success = await api.updatePage(id, title, content, meta_title, meta_description, meta_keywords, og_image);
    if (success) {
      await loadInitialData();
      return true;
    }
    return false;
  };

  const handleCreatePage = async (id: string, title: string): Promise<boolean> => {
    const success = await api.createPage(id, title);
    if (success) {
      await loadInitialData();
      return true;
    }
    return false;
  };

  return (
    <HelmetProvider>
      <BrowserRouter>
        <AppContent 
          pages={pages}
          loading={loading}
          isLoggedIn={isLoggedIn}
          siteConfig={siteConfig}
          navigation={navigation}
          footerConfig={footerConfig}
          onLogin={handleLogin}
          onLogout={handleLogout}
          onUpdatePage={handleUpdatePage}
          onCreatePage={handleCreatePage}
        />
      </BrowserRouter>
    </HelmetProvider>
  );
}
