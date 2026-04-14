/**
 * ADMIN/CREATEPAGEFORM.TSX
 * 
 * What it does:
 * A form for creating new dynamic pages.
 * 
 * Why it exists:
 * To allow administrators to expand the website's structure on the fly.
 * 
 * How it works:
 * - Collects a unique Page ID and Title.
 * - Initializes the new page with a default 'GenericPage' content structure.
 * - Communicates with the backend to save the new page.
 * 
 * Connections:
 * - Used by 'Dashboard.tsx' when the "Create Page" view is active.
 * 
 * Module: Admin / Components
 */

import { useState } from 'react';
import { motion } from 'motion/react';

interface CreatePageFormProps {
  onCreate: (id: string, title: string) => Promise<boolean>;
  status: { type: 'success' | 'error', message: string } | null;
  setStatus: (status: { type: 'success' | 'error', message: string } | null) => void;
}

export const CreatePageForm = ({ onCreate, status, setStatus }: CreatePageFormProps) => {
  const [newId, setNewId] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async () => {
    if (!newId || !newTitle) {
      setStatus({ type: 'error', message: 'Page ID and Title are required.' });
      return;
    }
    
    setSaving(true);
    const success = await onCreate(newId, newTitle);
    setSaving(false);
    
    if (success) {
      setStatus({ type: 'success', message: 'Page created successfully!' });
      setNewId('');
      setNewTitle('');
    } else {
      setStatus({ type: 'error', message: 'Failed to create page. ID might already exist.' });
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-[#262626]">Create New Page</h2>
      
      {status && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl font-bold ${
            status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </motion.div>
      )}

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">Page ID (URL Slug)</label>
          <input 
            type="text" 
            value={newId}
            onChange={(e) => setNewId(e.target.value)}
            placeholder="e.g. services"
            className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">Page Title</label>
          <input 
            type="text" 
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g. Our Services"
            className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
          />
        </div>
        <button 
          onClick={handleCreate}
          disabled={saving}
          className={`w-full py-4 bg-[#fb5b15] text-white font-bold rounded-2xl hover:shadow-lg transition-all ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? 'Creating...' : 'Create Page'}
        </button>
      </div>
    </div>
  );
};
