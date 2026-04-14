/**
 * ADMIN/SIDEBAR.TSX
 * 
 * What it does:
 * The sidebar navigation for the admin dashboard.
 * 
 * Why it exists:
 * To allow administrators to switch between different pages and views 
 * within the admin interface.
 * 
 * How it works:
 * - Lists all editable pages.
 * - Provides a "Create Page" option.
 * - Highlights the currently selected page or view.
 * 
 * Connections:
 * - Receives navigation state and handlers from 'Dashboard.tsx'.
 * 
 * Module: Admin / Components
 */

import { PageContent } from '../../../types';
import { AdminView } from '../pages/Dashboard';
import { Layout, Mail, Settings, Plus } from 'lucide-react';

interface DashboardSidebarProps {
  pages: PageContent[];
  selectedPageId: string | undefined;
  currentView: AdminView;
  onSelectPage: (page: PageContent) => void;
  onNavigate: (view: AdminView) => void;
}

export const DashboardSidebar = ({ 
  pages, 
  selectedPageId, 
  currentView, 
  onSelectPage, 
  onNavigate 
}: DashboardSidebarProps) => {
  return (
    <div className="lg:col-span-1 space-y-8">
      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-black/30 uppercase tracking-widest px-6">Pages</label>
        {pages?.map(p => (
          <button
            key={p.id}
            onClick={() => onSelectPage(p)}
            className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 ${
              selectedPageId === p.id && currentView === 'editor'
                ? 'bg-[#fb5b15] text-white shadow-lg shadow-[#fb5b15]/20' 
                : 'bg-white text-[#262626]/60 hover:bg-white/80'
            }`}
          >
            <Layout size={18} className={selectedPageId === p.id && currentView === 'editor' ? 'text-white' : 'text-[#fb5b15]'} />
            <span>{p.id.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</span>
          </button>
        ))}
        
        <button
          onClick={() => onNavigate('create')}
          className={`w-full text-left px-6 py-4 rounded-2xl font-bold border-2 border-dashed transition-all flex items-center space-x-3 ${
            currentView === 'create' 
              ? 'border-[#fb5b15] text-[#fb5b15] bg-[#fb5b15]/5' 
              : 'border-black/10 text-[#262626]/40 hover:border-[#fb5b15]/40'
          }`}
        >
          <Plus size={18} />
          <span>Add New Page</span>
        </button>
      </div>

      <div className="space-y-2">
        <label className="block text-[10px] font-bold text-black/30 uppercase tracking-widest px-6">System</label>
        <button
          onClick={() => onNavigate('submissions')}
          className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 ${
            currentView === 'submissions'
              ? 'bg-[#fb5b15] text-white shadow-lg shadow-[#fb5b15]/20' 
              : 'bg-white text-[#262626]/60 hover:bg-white/80'
          }`}
        >
          <Mail size={18} className={currentView === 'submissions' ? 'text-white' : 'text-[#fb5b15]'} />
          <span>Submissions</span>
        </button>

        <button
          onClick={() => onNavigate('settings')}
          className={`w-full text-left px-6 py-4 rounded-2xl font-bold transition-all flex items-center space-x-3 ${
            currentView === 'settings'
              ? 'bg-[#fb5b15] text-white shadow-lg shadow-[#fb5b15]/20' 
              : 'bg-white text-[#262626]/60 hover:bg-white/80'
          }`}
        >
          <Settings size={18} className={currentView === 'settings' ? 'text-white' : 'text-[#fb5b15]'} />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};
