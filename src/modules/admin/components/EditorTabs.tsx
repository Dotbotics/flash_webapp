/**
 * ADMIN/EDITORTABS.TSX
 * 
 * What it does:
 * A simple tab navigation component for the page editor.
 * 
 * Why it exists:
 * To separate the "Content" and "SEO" editing sections into manageable views.
 * 
 * Connections:
 * - Used by 'Editor.tsx' to switch between editing modes.
 * 
 * Module: Admin / Components
 */

interface EditorTabsProps {
  activeTab: 'content' | 'seo';
  setActiveTab: (tab: 'content' | 'seo') => void;
}

export const EditorTabs = ({ activeTab, setActiveTab }: EditorTabsProps) => {
  return (
    <div className="flex space-x-4 border-b border-black/5 pb-4">
      <button 
        onClick={() => setActiveTab('content')}
        className={`px-6 py-2 rounded-xl font-bold transition-all ${
          activeTab === 'content' ? 'bg-[#fb5b15] text-white' : 'text-[#262626]/40 hover:bg-black/5'
        }`}
      >
        Page Content
      </button>
      <button 
        onClick={() => setActiveTab('seo')}
        className={`px-6 py-2 rounded-xl font-bold transition-all ${
          activeTab === 'seo' ? 'bg-[#fb5b15] text-white' : 'text-[#262626]/40 hover:bg-black/5'
        }`}
      >
        SEO Settings
      </button>
    </div>
  );
};
