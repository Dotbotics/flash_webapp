/**
 * ADMIN/SEOEDITORFIELDS.TSX
 * 
 * What it does:
 * A form component for editing a page's SEO metadata (Title, Description, Keywords, OG Image).
 * 
 * Why it exists:
 * To allow administrators to optimize each page for search engines and social sharing.
 * 
 * How it works:
 * - Provides standard text inputs for SEO fields.
 * - Includes an image upload field for the Open Graph (OG) image.
 * 
 * Connections:
 * - Used by 'Editor.tsx' to render the "SEO" tab.
 * 
 * Module: Admin / Components
 */

import { Upload } from 'lucide-react';

interface SEOEditorFieldsProps {
  metaTitle: string;
  setMetaTitle: (v: string) => void;
  metaDescription: string;
  setMetaDescription: (v: string) => void;
  metaKeywords: string;
  setMetaKeywords: (v: string) => void;
  ogImage: string;
  setOgImage: (v: string) => void;
  onImageUpload: (file: File) => Promise<void>;
}

export const SEOEditorFields = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  metaKeywords,
  setMetaKeywords,
  ogImage,
  setOgImage,
  onImageUpload
}: SEOEditorFieldsProps) => {
  return (
    <div className="space-y-8">
      <div>
        <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">Meta Title</label>
        <input 
          type="text" 
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
          placeholder="Page title for search engines"
          className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-bold"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">Meta Description</label>
        <textarea 
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Brief description for search results"
          rows={4}
          className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">Meta Keywords</label>
        <input 
          type="text" 
          value={metaKeywords}
          onChange={(e) => setMetaKeywords(e.target.value)}
          placeholder="e.g. photo management, AI search, flash index"
          className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-[#262626]/40 uppercase tracking-wider mb-2">OG Image URL (Social Sharing)</label>
        <div className="flex items-center space-x-6">
          <div className="w-48 h-32 rounded-2xl overflow-hidden bg-white border border-black/10 shadow-sm">
            {ogImage ? (
              <img src={ogImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" alt="OG Preview" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#262626]/20 text-xs font-bold">No Image</div>
            )}
          </div>
          <label className="cursor-pointer">
            <div className="flex items-center space-x-2 px-6 py-3 bg-white border border-black/10 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
              <Upload className="w-4 h-4 text-[#fb5b15]" />
              <span>Upload OG Image</span>
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
              }}
            />
          </label>
        </div>
        <input 
          type="text" 
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
          placeholder="External image URL"
          className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9] border-none focus:ring-2 focus:ring-[#fb5b15] outline-none mt-4"
        />
      </div>
    </div>
  );
};
