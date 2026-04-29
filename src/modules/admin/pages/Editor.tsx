/**
 * ADMIN/EDITOR.TSX
 * 
 * What it does:
 * The content management interface for editing a specific page's 
 * title, content, and SEO metadata.
 * 
 * Why it exists:
 * To allow administrators to update the website's content without 
 * needing to touch the code.
 * 
 * How it works:
 * - Uses React state (useState) to track the current 'editPage' data.
 * - Organizes editing fields into tabs (Content, SEO).
 * - Handles image uploads for Open Graph (OG) images.
 * - Communicates with the backend to save changes.
 * 
 * Connections:
 * - Depends on 'src/lib/api.ts' for saving page updates.
 * - Depends on 'src/modules/admin/components/EditorTabs.tsx' and other field components.
 * 
 * Module: Admin / Pages
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Save } from 'lucide-react';
import { PageContent } from '../../../types';
import { EditorTabs } from '../components/EditorTabs';
import { ContentEditorFields } from '../components/ContentEditorFields';
import { SEOEditorFields } from '../components/SEOEditorFields';
import * as api from '../../../lib/api';

const DEFAULT_HERO_TAGLINE = "Describe anything you want to find";
const DEFAULT_DEMO_VIDEO_ID = "Q3Fv3N5gxbU";

const PAGE_CONTENT_DEFAULTS: Record<string, any> = {
  pricing: {
    heroLabel: "Pricing Plans",
    mainTitle: "Simple, Transparent Pricing",
    subtitle: "Choose the plan that's right for your memory scale.",
  },
  features: {
    heroLabel: "Features & Capabilities",
    mainTitle: "Everything you need to find anything.",
    description: "Unlocking the power of your memory with advanced AI indexing and retrieval.",
  },
  about: {
    heroLabel: "Our Story",
    heroTitle: "About",
    heroTitleAccent: "Flash Index",
  },
  contact: {
    heroLabel: "Contact Us",
    heroTitle: "Get in",
    heroTitleAccent: "Touch",
    heroDescription: "Have questions? We are here to help you find your way. Our team is ready to assist with any inquiries.",
  },
};

const getEditableContent = (page: PageContent) => {
  if (!page.content) return page.content;

  let content = {
    ...(PAGE_CONTENT_DEFAULTS[page.id] || {}),
    ...page.content,
  };

  if (page.id === 'home') {
    content = {
      ...content,
      heroTagline: content.heroTagline || DEFAULT_HERO_TAGLINE,
    };

    if (Array.isArray(content.demo)) {
      content.demo = content.demo.map((item: any, index: number) => (
        index === 0 ? { videoId: DEFAULT_DEMO_VIDEO_ID, ...item } : item
      ));
    }
  }

  return content;
};

interface AdminEditorProps {
  selectedPage: PageContent;
  onUpdate: (
    id: string, 
    title: string, 
    content: any,
    meta_title?: string,
    meta_description?: string,
    meta_keywords?: string,
    og_image?: string
  ) => Promise<boolean>;
}

/**
 * AdminEditor Component
 * 
 * Provides a dynamic interface for editing page content.
 * It automatically generates input fields based on the JSON structure of the page content.
 */
export const AdminEditor = ({ selectedPage, onUpdate }: AdminEditorProps) => {
  const [editTitle, setEditTitle] = useState(selectedPage.title);
  const [editContent, setEditContent] = useState<any>(getEditableContent(selectedPage));
  const [metaTitle, setMetaTitle] = useState(selectedPage.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(selectedPage.meta_description || '');
  const [metaKeywords, setMetaKeywords] = useState(selectedPage.meta_keywords || '');
  const [ogImage, setOgImage] = useState(selectedPage.og_image || '');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'content' | 'seo'>('content');

  // Synchronize local state with selectedPage prop
  useEffect(() => {
    setEditTitle(selectedPage.title);
    setEditContent(getEditableContent(selectedPage));
    setMetaTitle(selectedPage.meta_title || '');
    setMetaDescription(selectedPage.meta_description || '');
    setMetaKeywords(selectedPage.meta_keywords || '');
    setOgImage(selectedPage.og_image || '');
    setStatus(null);
  }, [selectedPage]);

  // Handle saving changes to the backend
  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const success = await onUpdate(
      selectedPage.id, 
      editTitle, 
      editContent,
      metaTitle,
      metaDescription,
      metaKeywords,
      ogImage
    );
    setSaving(false);
    
    if (success) {
      setStatus({ type: 'success', message: 'Changes saved successfully!' });
    } else {
      setStatus({ type: 'error', message: 'Failed to save changes. Please try again.' });
    }
  };

  // Update a single field in the content object
  const updateContentField = (key: string, value: any) => {
    setEditContent({ ...editContent, [key]: value });
  };

  // Update a field within an array (e.g., features list, pricing plans)
  const updateArrayField = (key: string, index: number, field: string, value: any) => {
    const newArray = [...editContent[key]];
    if (typeof newArray[index] === 'object') {
      newArray[index] = { ...newArray[index], [field]: value };
    } else {
      newArray[index] = value;
    }
    setEditContent({ ...editContent, [key]: newArray });
  };

  // Handle image uploads and update the corresponding content field
  const handleImageUpload = async (key: string, file: File, index?: number, field?: string) => {
    try {
      const url = await api.uploadImage(file);
      if (url) {
        if (index !== undefined && field !== undefined) {
          updateArrayField(key, index, field, url);
        } else if (index !== undefined) {
          updateArrayField(key, index, '', url);
        } else {
          updateContentField(key, url);
        }
      }
    } catch (err) {
      console.error("Upload failed", err);
      setStatus({ type: 'error', message: 'Image upload failed.' });
    }
  };

  const handleOGImageUpload = async (file: File) => {
    try {
      const url = await api.uploadImage(file);
      if (url) setOgImage(url);
    } catch (err) {
      console.error("OG Upload failed", err);
      setStatus({ type: 'error', message: 'OG Image upload failed.' });
    }
  };

  // Add a new item to an array (e.g., new feature, new pricing plan)
  const addItemToArray = (key: string) => {
    const currentArray = editContent[key] || [];
    let newItem: any = '';
    
    // If the array contains objects, try to clone the structure of the first item
    if (currentArray.length > 0 && typeof currentArray[0] === 'object') {
      newItem = {};
      Object.keys(currentArray[0]).forEach(field => {
        if (Array.isArray(currentArray[0][field])) {
          newItem[field] = [];
        } else if (typeof currentArray[0][field] === 'number') {
          newItem[field] = 0;
        } else {
          newItem[field] = '';
        }
      });
    }
    
    setEditContent({ ...editContent, [key]: [...currentArray, newItem] });
  };

  // Remove an item from an array
  const removeItemFromArray = (key: string, index: number) => {
    const newArray = [...editContent[key]];
    newArray.splice(index, 1);
    setEditContent({ ...editContent, [key]: newArray });
  };

  // Add a sub-item to a nested array (e.g., a feature within a pricing plan)
  const addSubItemToArray = (key: string, index: number, field: string) => {
    const newArray = [...editContent[key]];
    const currentSubArray = newArray[index][field] || [];
    newArray[index] = { ...newArray[index], [field]: [...currentSubArray, ''] };
    setEditContent({ ...editContent, [key]: newArray });
  };

  // Remove a sub-item from a nested array
  const removeSubItemFromArray = (key: string, index: number, field: string, subIndex: number) => {
    const newArray = [...editContent[key]];
    const newSubArray = [...newArray[index][field]];
    newSubArray.splice(subIndex, 1);
    newArray[index] = { ...newArray[index], [field]: newSubArray };
    setEditContent({ ...editContent, [key]: newArray });
  };

  // Reorder an item in an array
  const reorderItemInArray = (key: string, index: number, direction: 'up' | 'down') => {
    const newArray = [...editContent[key]];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    
    if (newIndex < 0 || newIndex >= newArray.length) return;
    
    const temp = newArray[index];
    newArray[index] = newArray[newIndex];
    newArray[newIndex] = temp;
    
    setEditContent({ ...editContent, [key]: newArray });
  };

  return (
    <div className="space-y-8">
      {/* Editor Header: Title and Save Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#262626]">Editing: {selectedPage.id}</h2>
        <button 
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center space-x-2 px-8 py-3 bg-[#fb5b15] text-white rounded-xl font-bold hover:shadow-lg transition-all ${
            saving ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {saving ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
              <Zap className="w-5 h-5" />
            </motion.div>
          ) : (
            <Save className="w-5 h-5" />
          )}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Status Feedback Message */}
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

      <EditorTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="space-y-6">
        {activeTab === 'content' ? (
          <ContentEditorFields 
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            editContent={editContent}
            updateContentField={updateContentField}
            updateArrayField={updateArrayField}
            handleImageUpload={handleImageUpload}
            addItemToArray={addItemToArray}
            removeItemFromArray={removeItemFromArray}
            addSubItemToArray={addSubItemToArray}
            removeSubItemFromArray={removeSubItemFromArray}
            reorderItemInArray={reorderItemInArray}
          />
        ) : (
          <SEOEditorFields 
            metaTitle={metaTitle}
            setMetaTitle={setMetaTitle}
            metaDescription={metaDescription}
            setMetaDescription={setMetaDescription}
            metaKeywords={metaKeywords}
            setMetaKeywords={setMetaKeywords}
            ogImage={ogImage}
            setOgImage={setOgImage}
            onImageUpload={handleOGImageUpload}
          />
        )}
      </div>
    </div>
  );
};

