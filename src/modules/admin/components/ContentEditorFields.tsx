/**
 * ADMIN/CONTENTEDITORFIELDS.TSX
 * 
 * What it does:
 * A dynamic form component that renders different input fields based on 
 * the structure of the page content being edited.
 * 
 * Why it exists:
 * To provide a user-friendly way to edit complex, nested content structures 
 * (like lists of features or steps) without needing to edit raw JSON.
 * 
 * How it works:
 * - Recursively iterates through the 'content' object.
 * - Renders text inputs for strings, and specialized editors for arrays 
 *   (e.g., adding/removing items from a list).
 * - Handles nested objects by rendering them as groups of fields.
 * - Supports image uploads for fields containing "image" in their name.
 * 
 * Connections:
 * - Used by 'Editor.tsx' to render the "Content" tab.
 * 
 * Module: Admin / Components
 */

import { Upload, ChevronDown, ChevronRight, Layout, Type, List, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';

interface ContentEditorFieldsProps {
  editTitle: string;
  setEditTitle: (v: string) => void;
  editContent: any;
  updateContentField: (key: string, value: any) => void;
  updateArrayField: (key: string, index: number, field: string, value: any) => void;
  handleImageUpload: (key: string, file: File, index?: number, field?: string) => Promise<void>;
  addItemToArray: (key: string) => void;
  removeItemFromArray: (key: string, index: number) => void;
  addSubItemToArray: (key: string, index: number, field: string) => void;
  removeSubItemFromArray: (key: string, index: number, field: string, subIndex: number) => void;
  reorderItemInArray: (key: string, index: number, direction: 'up' | 'down') => void;
}

export const ContentEditorFields = ({
  editTitle,
  setEditTitle,
  editContent,
  updateContentField,
  updateArrayField,
  handleImageUpload,
  addItemToArray,
  removeItemFromArray,
  addSubItemToArray,
  removeSubItemFromArray,
  reorderItemInArray
}: ContentEditorFieldsProps) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Page Info': true,
    'Hero Section': true
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Define section mappings based on key prefixes or common names
  const sectionDefinitions: Record<string, string[]> = {
    'Hero Section': ['heroLabel', 'heroTagline', 'heroHeadline1', 'heroHeadline2Base', 'heroHeadline2Words', 'heroHeadline2Gradient', 'heroDescription', 'heroCloudSources', 'heroPrimaryButton', 'heroPrimaryButtonLink', 'heroSecondaryButton', 'heroSecondaryButtonLink', 'stats'],
    'Client Logos': ['clientLogosLabel', 'clientLogos'],
    'Problem Section': ['problemLabel', 'problemHeadline', 'problemHeadlineHighlight', 'problemDescription', 'problemPoints'],
    'Solution Section': ['solutionLabel', 'solutionHeadline', 'solutionHeadlineHighlight', 'features'],
    'How It Works': ['howItWorksLabel', 'howItWorksHeadline', 'howItWorksHeadlineHighlight', 'steps'],
    'Demo Section': ['demoLabel', 'demoHeadline', 'demo'],
    'Testimonials': ['testimonialsLabel', 'testimonialsHeadline', 'testimonialsHeadlineHighlight', 'testimonials'],
    'Use Cases': ['useCasesLabel', 'useCasesHeadline', 'useCasesHeadlineHighlight', 'useCases'],
    'Trust & Integrations': ['trustLabel', 'trustHeadline', 'trustHeadlineHighlight', 'trustBadges', 'integrations'],
    'CTA Section': ['ctaBadge', 'ctaHeadline', 'ctaHeadlineHighlight', 'ctaDescription', 'ctaPrimaryButton', 'ctaPrimaryButtonLink', 'ctaSecondaryButton', 'ctaSecondaryButtonLink'],
    'Pricing Section': ['heroLabel', 'mainTitle', 'subtitle', 'plans', 'comparisonTitle', 'comparisonDescription', 'ctaTitle', 'ctaDescription', 'ctaButtonText', 'ctaButtonLink', 'heroTitle', 'heroDescription'],
    'Features Page Content': ['heroLabel', 'mainTitle', 'description', 'oldWayLabel', 'oldWayHeadline', 'oldWayDescription', 'oldWayPoints', 'featureSections', 'ctaTitle', 'ctaTitleHighlight', 'ctaDescription', 'ctaPrimaryButtonText', 'ctaPrimaryButtonLink', 'ctaSecondaryButtonText', 'ctaSecondaryButtonLink'],
    'About Page Content': ['heroLabel', 'heroTitle', 'heroTitleAccent', 'aboutText', 'missionTitle', 'mission', 'visionTitle', 'vision', 'valuesLabel', 'valuesTitle', 'coreValues', 'ctaTitle', 'ctaDescription', 'ctaPrimaryButtonText', 'ctaPrimaryButtonLink', 'ctaSecondaryButtonText', 'ctaSecondaryButtonLink'],
    'Contact Page Content': ['heroLabel', 'heroTitle', 'heroTitleAccent', 'heroDescription', 'contactInfoTitle', 'addressLabel', 'address', 'emailLabel', 'email', 'phoneLabel', 'phone', 'enterpriseTitle', 'enterpriseDescription', 'firstNameLabel', 'firstNamePlaceholder', 'lastNameLabel', 'lastNamePlaceholder', 'emailFieldLabel', 'emailPlaceholder', 'subjectLabel', 'subjectOptions', 'messageLabel', 'messagePlaceholder', 'submitButtonText', 'submittingButtonText', 'successTitle', 'successMessage', 'resetButtonText', 'errorMessage'],
    'General Content': ['featureImage1', 'featureImage2', 'list']
  };

  const getSectionForKey = (key: string) => {
    for (const [section, keys] of Object.entries(sectionDefinitions)) {
      if (keys.includes(key)) return section;
    }
    return 'Other Content';
  };

  const groupedContent: Record<string, string[]> = {};
  if (editContent) {
    Object.keys(editContent).forEach(key => {
      const section = getSectionForKey(key);
      if (!groupedContent[section]) groupedContent[section] = [];
      groupedContent[section].push(key);
    });
  }

  const isUploadField = (field: string) => /image|logo|avatar|photo|icon/i.test(field);
  const isUploadedMediaUrl = (value: unknown) => typeof value === 'string' && (value.startsWith('http') || value.startsWith('/uploads'));

  const renderField = (key: string) => {
    const value = editContent[key];
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    const isMediaField = isUploadField(key);

    return (
      <div key={key} className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-[10px] font-black text-[#262626]/30 uppercase tracking-[0.2em]">
            {label}
          </label>
          {Array.isArray(value) && (
            <button 
              onClick={() => addItemToArray(key)}
              className="flex items-center space-x-1 px-3 py-1 bg-[#fb5b15]/10 text-[#fb5b15] rounded-lg text-[10px] font-black uppercase tracking-wider hover:bg-[#fb5b15]/20 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Item</span>
            </button>
          )}
        </div>
        
        {typeof value === 'string' ? (
          <div className="space-y-4">
            {isMediaField && (
              <div className="flex items-center space-x-6">
                {isUploadedMediaUrl(value) && (
                  <div className="w-48 h-32 rounded-2xl overflow-hidden bg-white border border-black/10 shadow-sm">
                    <img 
                      src={value} 
                      className="w-full h-full object-cover" 
                      referrerPolicy="no-referrer" 
                      alt="Preview"
                    />
                  </div>
                )}
                <label className="cursor-pointer">
                  <div className="flex items-center space-x-2 px-6 py-3 bg-white border border-black/10 rounded-xl text-sm font-bold hover:bg-black/5 transition-colors shadow-sm">
                    <Upload className="w-4 h-4 text-[#fb5b15]" />
                    <span>{isUploadedMediaUrl(value) ? 'Upload New Image' : 'Upload Image'}</span>
                  </div>
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(key, file);
                    }}
                  />
                </label>
              </div>
            )}
            {value.length > 100 || key.toLowerCase().includes('description') || key.toLowerCase().includes('desc') ? (
              <textarea 
                value={value}
                onChange={(e) => updateContentField(key, e.target.value)}
                rows={4}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm leading-relaxed"
              />
            ) : (
              <input 
                type="text" 
                value={value}
                onChange={(e) => updateContentField(key, e.target.value)}
                className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
              />
            )}
          </div>
        ) : typeof value === 'boolean' ? (
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => updateContentField(key, !value)}
              className={`w-12 h-6 rounded-full transition-colors relative ${value ? 'bg-emerald-500' : 'bg-black/10'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${value ? 'left-7' : 'left-1'}`} />
            </button>
            <span className="text-sm font-bold text-[#262626]/60">{value ? 'Enabled' : 'Disabled'}</span>
          </div>
        ) : Array.isArray(value) ? (
          <div className="space-y-4">
            {value.map((item: any, idx: number) => (
              <div key={idx} className="p-6 bg-white rounded-2xl border border-black/5 space-y-4 shadow-sm relative group/item">
                <div className="absolute top-4 right-4 flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-all">
                  <button 
                    onClick={() => reorderItemInArray(key, idx, 'up')}
                    disabled={idx === 0}
                    className="p-2 text-[#262626]/40 hover:text-[#fb5b15] hover:bg-[#fb5b15]/5 rounded-lg disabled:opacity-20"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => reorderItemInArray(key, idx, 'down')}
                    disabled={idx === value.length - 1}
                    className="p-2 text-[#262626]/40 hover:text-[#fb5b15] hover:bg-[#fb5b15]/5 rounded-lg disabled:opacity-20"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => removeItemFromArray(key, idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black text-[#fb5b15] uppercase tracking-widest">Item #{idx + 1}</span>
                </div>
                {typeof item === 'string' ? (
                  <input 
                    type="text" 
                    value={item}
                    onChange={(e) => updateArrayField(key, idx, '', e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none text-sm font-medium"
                  />
                ) : (
                  <div className="grid gap-4">
                    {Object.keys(item).map(field => (
                      <div key={field}>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[10px] font-bold text-[#262626]/40 uppercase tracking-wider">{field}</label>
                          {Array.isArray(item[field]) && (
                            <button 
                              onClick={() => addSubItemToArray(key, idx, field)}
                              className="flex items-center space-x-1 px-2 py-1 bg-[#fb5b15]/5 text-[#fb5b15] rounded-md text-[8px] font-black uppercase tracking-wider hover:bg-[#fb5b15]/10 transition-colors"
                            >
                              <Plus className="w-2 h-2" />
                              <span>Add {field}</span>
                            </button>
                          )}
                        </div>
                        {typeof item[field] === 'boolean' ? (
                          <div className="flex items-center space-x-3">
                            <button 
                              onClick={() => {
                                updateArrayField(key, idx, field, !item[field]);
                              }}
                              className={`w-10 h-5 rounded-full transition-colors relative ${item[field] ? 'bg-emerald-500' : 'bg-black/10'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all ${item[field] ? 'left-5.5' : 'left-0.5'}`} />
                            </button>
                            <span className="text-[10px] font-bold text-[#262626]/40">{item[field] ? 'Included' : 'Not Included'}</span>
                          </div>
                        ) : isUploadField(field) && typeof item[field] === 'string' ? (
                          <div className="space-y-3">
                            <div className="flex items-center space-x-4">
                              {isUploadedMediaUrl(item[field]) && (
                                <img src={item[field]} className="w-16 h-16 rounded-lg object-contain border border-black/5 bg-[#eeeae9]/40" referrerPolicy="no-referrer" alt="Preview" />
                              )}
                            <label className="cursor-pointer">
                              <div className="px-4 py-2 bg-[#eeeae9] rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black/5 transition-colors">Upload</div>
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) handleImageUpload(key, file, idx, field);
                                }}
                              />
                            </label>
                            </div>
                            <input 
                              type="text" 
                              value={item[field]}
                              onChange={(e) => updateArrayField(key, idx, field, e.target.value)}
                              className="w-full px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none text-sm focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                              placeholder="Emoji, icon text, or uploaded image URL"
                            />
                          </div>
                        ) : Array.isArray(item[field]) ? (
                          <div className="space-y-2">
                            {item[field].map((subItem: any, subIdx: number) => (
                              <div key={subIdx} className="flex items-center space-x-2 group/sub">
                                {typeof subItem === 'string' ? (
                                  <input 
                                    type="text" 
                                    value={subItem}
                                    onChange={(e) => {
                                      const newSubArray = [...item[field]];
                                      newSubArray[subIdx] = e.target.value;
                                      updateArrayField(key, idx, field, newSubArray);
                                    }}
                                    className="flex-grow px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none text-sm focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                                  />
                                ) : (
                                  <div className="flex-grow p-4 bg-[#eeeae9]/30 rounded-xl space-y-3">
                                    {Object.keys(subItem).map(subField => (
                                      <div key={subField} className="space-y-1">
                                        <label className="block text-[8px] font-bold text-[#262626]/30 uppercase tracking-widest">{subField}</label>
                                        {typeof subItem[subField] === 'boolean' ? (
                                          <button 
                                            onClick={() => {
                                              const newSubArray = [...item[field]];
                                              newSubArray[subIdx] = { ...subItem, [subField]: !subItem[subField] };
                                              updateArrayField(key, idx, field, newSubArray);
                                            }}
                                            className={`w-8 h-4 rounded-full transition-colors relative ${subItem[subField] ? 'bg-emerald-500' : 'bg-black/10'}`}
                                          >
                                            <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${subItem[subField] ? 'left-4.5' : 'left-0.5'}`} />
                                          </button>
                                        ) : (
                                          <input 
                                            type="text" 
                                            value={subItem[subField]}
                                            onChange={(e) => {
                                              const newSubArray = [...item[field]];
                                              newSubArray[subIdx] = { ...subItem, [subField]: e.target.value };
                                              updateArrayField(key, idx, field, newSubArray);
                                            }}
                                            className="w-full px-3 py-1.5 rounded-lg bg-white border border-black/5 text-xs focus:ring-1 focus:ring-[#fb5b15] outline-none font-medium"
                                          />
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                )}
                                <button 
                                  onClick={() => removeSubItemFromArray(key, idx, field, subIdx)}
                                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <input 
                            type="text" 
                            value={item[field]}
                            onChange={(e) => updateArrayField(key, idx, field, e.target.value)}
                            className="w-full px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none text-sm focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Info Section */}
      <div className="bg-[#eeeae9]/30 rounded-3xl border border-black/5 overflow-hidden">
        <button 
          onClick={() => toggleSection('Page Info')}
          className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
              <Type className="w-4 h-4 text-[#fb5b15]" />
            </div>
            <h3 className="font-bold text-[#262626]">Page Information</h3>
          </div>
          {expandedSections['Page Info'] ? <ChevronDown className="w-5 h-5 text-black/20" /> : <ChevronRight className="w-5 h-5 text-black/20" />}
        </button>
        
        <AnimatePresence>
          {expandedSections['Page Info'] && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-6 pb-8 space-y-4"
            >
              <div>
                <label className="block text-[10px] font-black text-[#262626]/30 uppercase tracking-[0.2em] mb-2">Internal Page Title</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:ring-2 focus:ring-[#fb5b15] outline-none font-bold"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Dynamic Sections */}
      {Object.entries(groupedContent).map(([section, keys]) => (
        <div key={section} className="bg-[#eeeae9]/30 rounded-3xl border border-black/5 overflow-hidden">
          <button 
            onClick={() => toggleSection(section)}
            className="w-full flex items-center justify-between p-6 hover:bg-black/5 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
                {section.includes('List') || section.includes('Table') ? <List className="w-4 h-4 text-[#fb5b15]" /> : <Layout className="w-4 h-4 text-[#fb5b15]" />}
              </div>
              <h3 className="font-bold text-[#262626]">{section}</h3>
            </div>
            {expandedSections[section] ? <ChevronDown className="w-5 h-5 text-black/20" /> : <ChevronRight className="w-5 h-5 text-black/20" />}
          </button>

          <AnimatePresence>
            {expandedSections[section] && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-6 pb-8 space-y-8"
              >
                {keys.map(key => renderField(key))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};
