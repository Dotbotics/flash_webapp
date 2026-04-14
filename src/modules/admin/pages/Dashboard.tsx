/**
 * ADMIN/DASHBOARD.TSX
 * 
 * What it does:
 * The main container for the admin interface. It handles the layout 
 * (Sidebar + Header + Content) and manages the active admin view.
 * 
 * Why it exists:
 * To provide a centralized place for administrators to manage 
 * page content and site settings.
 * 
 * How it works:
 * - Uses React state (useState) to track the current 'view' (e.g., 'pages', 'editor').
 * - Conditionally renders sub-components (Login, Editor, Sidebar) based on 
 *   authentication status and selected view.
 * 
 * Connections:
 * - Depends on 'src/lib/auth.ts' for login/logout functionality.
 * - Depends on 'src/modules/admin/components/*' for its UI.
 * 
 * Module: Admin / Pages
 */

import { useState } from 'react';
import { PageContent } from '../../../types';
import { AdminLogin } from './Login';
import { AdminEditor } from './Editor';
import { DashboardHeader } from '../components/Header';
import { DashboardSidebar } from '../components/Sidebar';
import { CreatePageForm } from '../components/CreatePageForm';
import { SubmissionsView } from '../components/SubmissionsView';
import { SettingsView } from '../components/SettingsView';

export type AdminView = 'editor' | 'create' | 'submissions' | 'settings';

interface AdminDashboardProps {
  pages: PageContent[];
  onUpdate: (
    id: string, 
    title: string, 
    content: any,
    meta_title?: string,
    meta_description?: string,
    meta_keywords?: string,
    og_image?: string
  ) => Promise<boolean>;
  onCreate: (id: string, title: string) => Promise<boolean>;
  isLoggedIn: boolean;
  onLogin: (u: string, p: string) => Promise<boolean>;
  onLogout: () => void;
}

/**
 * AdminDashboard Component
 * 
 * The main container for the administrative interface.
 * Handles page selection, page creation, and authentication routing.
 */
export const AdminDashboard = ({ 
  pages, 
  onUpdate, 
  onCreate, 
  isLoggedIn, 
  onLogin, 
  onLogout 
}: AdminDashboardProps) => {
  // Local UI states
  const [view, setView] = useState<AdminView>('editor');
  const [selectedPage, setSelectedPage] = useState<PageContent | null>(pages[0] || null);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    return <AdminLogin onLogin={onLogin} />;
  }

  return (
    <div className="pt-20 min-h-screen bg-[#eeeae9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <DashboardHeader onLogout={onLogout} />

        <div className="grid lg:grid-cols-4 gap-8">
          <DashboardSidebar 
            pages={pages}
            selectedPageId={selectedPage?.id}
            currentView={view}
            onSelectPage={(p) => { setSelectedPage(p); setView('editor'); setStatus(null); }}
            onNavigate={(v) => { setView(v); setSelectedPage(null); setStatus(null); }}
          />

          {/* Editor Area: Content Editing or New Page Creation */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-10 shadow-sm">
            {view === 'create' ? (
              <CreatePageForm 
                onCreate={onCreate} 
                status={status} 
                setStatus={setStatus} 
              />
            ) : view === 'submissions' ? (
              <SubmissionsView />
            ) : view === 'settings' ? (
              <SettingsView />
            ) : selectedPage ? (
              <AdminEditor selectedPage={selectedPage} onUpdate={onUpdate} />
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-[#262626]/40">
                <p className="font-bold">Select a page to start editing</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

