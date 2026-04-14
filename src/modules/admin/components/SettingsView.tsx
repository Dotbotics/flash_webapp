/**
 * ADMIN/SETTINGSVIEW.TSX
 * 
 * What it does:
 * A form for managing global application settings, specifically email configuration.
 * 
 * Why it exists:
 * To allow administrators to configure how contact form notifications are sent.
 * 
 * Module: Admin / Components
 */

import React, { useState, useEffect } from 'react';
import { Save, Mail, Info, Globe, Menu, Plus, Trash2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as api from '../../../lib/api';

interface EmailConfig {
  fromEmail: string;
  toEmail: string;
  subject: string;
  messageTemplate: string;
  fieldsToSend: string;
}

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

type Tab = 'email' | 'site' | 'navigation' | 'footer';

export const SettingsView = () => {
  const [activeTab, setActiveTab] = useState<Tab>('site');
  const [emailConfig, setEmailConfig] = useState<EmailConfig>({
    fromEmail: '',
    toEmail: '',
    subject: '',
    messageTemplate: '',
    fieldsToSend: ''
  });
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: '',
    logoUrl: '',
    faviconUrl: '',
    logoSizeDesktop: 120,
    logoSizeTablet: 100,
    logoSizeMobile: 80,
    footerDescription: '',
    footerCopyright: ''
  });
  const [navigation, setNavigation] = useState<NavItem[]>([]);
  const [footerConfig, setFooterConfig] = useState<FooterConfig>({
    socialLinks: [],
    resourceLinks: [],
    navigationTitle: 'Navigation',
    resourcesTitle: 'Resources'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  const fetchSettings = async () => {
    try {
      const [emailData, siteData, navData, footerData] = await Promise.all([
        api.fetchSettings('email_config'),
        api.fetchSettings('site_config'),
        api.fetchSettings('navigation'),
        api.fetchSettings('footer_config')
      ]);
      if (emailData) setEmailConfig(emailData);
      if (siteData) setSiteConfig(siteData);
      if (navData) setNavigation(navData);
      if (footerData) setFooterConfig(footerData);
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    setSaving(true);
    setStatus(null);
    try {
      let key = '';
      let body = {};

      if (activeTab === 'email') {
        key = 'email_config';
        body = emailConfig;
      } else if (activeTab === 'site') {
        key = 'site_config';
        body = siteConfig;
      } else if (activeTab === 'navigation') {
        key = 'navigation';
        body = navigation;
      } else if (activeTab === 'footer') {
        key = 'footer_config';
        body = footerConfig;
      }

      const success = await api.updateSettings(key, body);

      if (success) {
        setStatus({ type: 'success', message: 'Settings saved successfully' });
        // Update favicon if it was changed
        if (activeTab === 'site' && siteConfig.faviconUrl) {
          const link = document.querySelector("link[rel*='icon']") as HTMLLinkElement || document.createElement('link');
          link.type = 'image/x-icon';
          link.rel = 'shortcut icon';
          link.href = siteConfig.faviconUrl;
          document.getElementsByTagName('head')[0].appendChild(link);
        }
      } else {
        throw new Error('Failed to save');
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'favicon') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await api.uploadImage(file);
      if (url) {
        if (type === 'logo') {
          setSiteConfig({ ...siteConfig, logoUrl: url });
        } else {
          setSiteConfig({ ...siteConfig, faviconUrl: url });
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const addNavItem = () => {
    const newItem: NavItem = {
      id: Date.now().toString(),
      label: 'New Link',
      path: '/'
    };
    setNavigation([...navigation, newItem]);
  };

  const removeNavItem = (id: string) => {
    setNavigation(navigation.filter(item => item.id !== id));
  };

  const updateNavItem = (id: string, field: keyof NavItem, value: string) => {
    setNavigation(navigation.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#fb5b15]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#262626]">Global Settings</h2>
          <p className="text-sm text-black/40 font-medium">Manage your site identity, navigation, and email config.</p>
        </div>
        <button
          onClick={saveSettings}
          disabled={saving}
          className="flex items-center justify-center space-x-2 px-8 py-3 bg-[#fb5b15] text-white rounded-2xl font-bold hover:bg-[#e04a0a] transition-all shadow-lg shadow-[#fb5b15]/20 disabled:opacity-50"
        >
          <Save size={18} />
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </button>
      </div>

      <div className="flex space-x-2 p-1 bg-[#eeeae9] rounded-2xl w-fit">
        {[
          { id: 'site', label: 'Site Identity', icon: Globe },
          { id: 'navigation', label: 'Navigation', icon: Menu },
          { id: 'footer', label: 'Footer', icon: ImageIcon },
          { id: 'email', label: 'Email Config', icon: Mail }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-[#fb5b15] shadow-sm' 
                : 'text-black/40 hover:text-black/60'
            }`}
          >
            <tab.icon size={16} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-2xl text-sm font-bold ${
            status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {status.message}
        </motion.div>
      )}

      <AnimatePresence mode="wait">
        {activeTab === 'site' && (
          <motion.div
            key="site"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-8"
          >
            <div className="bg-[#eeeae9]/50 p-8 rounded-3xl border border-black/5 space-y-8">
              <div className="flex items-center space-x-3 text-[#fb5b15]">
                <Globe className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Site Identity</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Site Name</label>
                  <input
                    type="text"
                    value={siteConfig.siteName}
                    onChange={(e) => setSiteConfig({ ...siteConfig, siteName: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Logo Size (Desktop px)</label>
                    <input
                      type="number"
                      value={siteConfig.logoSizeDesktop}
                      onChange={(e) => setSiteConfig({ ...siteConfig, logoSizeDesktop: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Logo Size (Tablet px)</label>
                    <input
                      type="number"
                      value={siteConfig.logoSizeTablet}
                      onChange={(e) => setSiteConfig({ ...siteConfig, logoSizeTablet: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Logo Size (Mobile px)</label>
                    <input
                      type="number"
                      value={siteConfig.logoSizeMobile}
                      onChange={(e) => setSiteConfig({ ...siteConfig, logoSizeMobile: parseInt(e.target.value) || 0 })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Site Logo</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-20 h-20 rounded-2xl bg-white border border-black/5 flex items-center justify-center overflow-hidden">
                        {siteConfig.logoUrl ? (
                          <img src={siteConfig.logoUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
                        ) : (
                          <ImageIcon className="text-black/10" />
                        )}
                      </div>
                      <label className="cursor-pointer px-6 py-3 bg-white text-black/60 rounded-xl font-bold text-sm border border-black/5 hover:bg-black/5 transition-all">
                        Upload Logo
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'logo')} accept="image/*" />
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Favicon</label>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl bg-white border border-black/5 flex items-center justify-center overflow-hidden">
                        {siteConfig.faviconUrl ? (
                          <img src={siteConfig.faviconUrl} alt="Favicon" className="w-8 h-8 object-contain" />
                        ) : (
                          <ImageIcon size={16} className="text-black/10" />
                        )}
                      </div>
                      <label className="cursor-pointer px-6 py-3 bg-white text-black/60 rounded-xl font-bold text-sm border border-black/5 hover:bg-black/5 transition-all">
                        Upload Favicon
                        <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'favicon')} accept="image/*" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-black/5">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Footer Description</label>
                    <textarea
                      value={siteConfig.footerDescription}
                      onChange={(e) => setSiteConfig({ ...siteConfig, footerDescription: e.target.value })}
                      rows={3}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Footer Copyright Text</label>
                    <input
                      type="text"
                      value={siteConfig.footerCopyright}
                      onChange={(e) => setSiteConfig({ ...siteConfig, footerCopyright: e.target.value })}
                      className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'navigation' && (
          <motion.div
            key="navigation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-8"
          >
            <div className="bg-[#eeeae9]/50 p-8 rounded-3xl border border-black/5 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[#fb5b15]">
                  <Menu className="w-5 h-5" />
                  <h3 className="font-bold uppercase tracking-wider text-sm">Navigation Menu</h3>
                </div>
                <button
                  onClick={addNavItem}
                  className="flex items-center space-x-2 px-4 py-2 bg-white text-[#fb5b15] rounded-xl font-bold text-xs border border-[#fb5b15]/20 hover:bg-[#fb5b15] hover:text-white transition-all"
                >
                  <Plus size={14} />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-4">
                {navigation.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-black/5">
                    <div className="flex-1 grid md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateNavItem(item.id, 'label', e.target.value)}
                        placeholder="Label"
                        className="px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                      <input
                        type="text"
                        value={item.path}
                        onChange={(e) => updateNavItem(item.id, 'path', e.target.value)}
                        placeholder="Path (e.g. /about)"
                        className="px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                    </div>
                    <button
                      onClick={() => removeNavItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
                {navigation.length === 0 && (
                  <div className="text-center py-12 text-black/20 font-bold uppercase tracking-widest text-xs">
                    No navigation items defined
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'footer' && (
          <motion.div
            key="footer"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-8"
          >
            <div className="bg-[#eeeae9]/50 p-8 rounded-3xl border border-black/5 space-y-8">
              <div className="flex items-center space-x-3 text-[#fb5b15]">
                <ImageIcon className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Footer Configuration</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Navigation Column Title</label>
                  <input
                    type="text"
                    value={footerConfig.navigationTitle}
                    onChange={(e) => setFooterConfig({ ...footerConfig, navigationTitle: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Resources Column Title</label>
                  <input
                    type="text"
                    value={footerConfig.resourcesTitle}
                    onChange={(e) => setFooterConfig({ ...footerConfig, resourcesTitle: e.target.value })}
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#262626]/60 uppercase tracking-wider">Social Links</h4>
                  <button
                    onClick={() => setFooterConfig({
                      ...footerConfig,
                      socialLinks: [...footerConfig.socialLinks, { id: Date.now().toString(), label: 'NEW', url: '/contact' }]
                    })}
                    className="p-2 text-[#fb5b15] hover:bg-[#fb5b15]/10 rounded-lg transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="grid gap-4">
                  {footerConfig.socialLinks.map((link, idx) => (
                    <div key={link.id} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-black/5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...footerConfig.socialLinks];
                          newLinks[idx].label = e.target.value;
                          setFooterConfig({ ...footerConfig, socialLinks: newLinks });
                        }}
                        placeholder="Label (e.g. TW)"
                        className="w-24 px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...footerConfig.socialLinks];
                          newLinks[idx].url = e.target.value;
                          setFooterConfig({ ...footerConfig, socialLinks: newLinks });
                        }}
                        placeholder="URL"
                        className="flex-1 px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                      <button
                        onClick={() => {
                          const newLinks = footerConfig.socialLinks.filter(l => l.id !== link.id);
                          setFooterConfig({ ...footerConfig, socialLinks: newLinks });
                        }}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-[#262626]/60 uppercase tracking-wider">Resource Links</h4>
                  <button
                    onClick={() => setFooterConfig({
                      ...footerConfig,
                      resourceLinks: [...footerConfig.resourceLinks, { id: Date.now().toString(), label: 'New Resource', path: '/' }]
                    })}
                    className="p-2 text-[#fb5b15] hover:bg-[#fb5b15]/10 rounded-lg transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <div className="grid gap-4">
                  {footerConfig.resourceLinks.map((link, idx) => (
                    <div key={link.id} className="flex items-center space-x-4 bg-white p-4 rounded-2xl border border-black/5">
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...footerConfig.resourceLinks];
                          newLinks[idx].label = e.target.value;
                          setFooterConfig({ ...footerConfig, resourceLinks: newLinks });
                        }}
                        placeholder="Label"
                        className="w-48 px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                      <input
                        type="text"
                        value={link.path}
                        onChange={(e) => {
                          const newLinks = [...footerConfig.resourceLinks];
                          newLinks[idx].path = e.target.value;
                          setFooterConfig({ ...footerConfig, resourceLinks: newLinks });
                        }}
                        placeholder="Path"
                        className="flex-1 px-4 py-2 rounded-xl bg-[#eeeae9]/50 border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium text-sm"
                      />
                      <button
                        onClick={() => {
                          const newLinks = footerConfig.resourceLinks.filter(l => l.id !== link.id);
                          setFooterConfig({ ...footerConfig, resourceLinks: newLinks });
                        }}
                        className="p-2 text-red-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'email' && (
          <motion.div
            key="email"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid gap-8"
          >
            <div className="bg-[#eeeae9]/50 p-8 rounded-3xl border border-black/5 space-y-6">
              <div className="flex items-center space-x-3 text-[#fb5b15] mb-2">
                <Mail className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Sender & Recipient</h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">From Email</label>
                  <input
                    type="email"
                    value={emailConfig.fromEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, fromEmail: e.target.value })}
                    placeholder="noreply@yourdomain.com"
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">To Email (Comma separated)</label>
                  <input
                    type="text"
                    value={emailConfig.toEmail}
                    onChange={(e) => setEmailConfig({ ...emailConfig, toEmail: e.target.value })}
                    placeholder="admin@gmail.com, support@gmail.com"
                    className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="bg-[#eeeae9]/50 p-8 rounded-3xl border border-black/5 space-y-6">
              <div className="flex items-center space-x-3 text-[#fb5b15] mb-2">
                <Info className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Message Content</h3>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Subject Line</label>
                <input
                  type="text"
                  value={emailConfig.subject}
                  onChange={(e) => setEmailConfig({ ...emailConfig, subject: e.target.value })}
                  className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Message Text</label>
                <textarea
                  value={emailConfig.messageTemplate}
                  onChange={(e) => setEmailConfig({ ...emailConfig, messageTemplate: e.target.value })}
                  rows={4}
                  className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#262626]/40 uppercase tracking-wider">Fields to Include (Comma separated)</label>
                <input
                  type="text"
                  value={emailConfig.fieldsToSend}
                  onChange={(e) => setEmailConfig({ ...emailConfig, fieldsToSend: e.target.value })}
                  placeholder="name, email, subject, message"
                  className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-[#fb5b15] outline-none font-medium"
                />
                <p className="text-[10px] text-black/30 font-bold uppercase tracking-widest mt-2">
                  Available fields: name, email, subject, message
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
