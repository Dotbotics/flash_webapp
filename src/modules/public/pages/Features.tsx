/**
 * FEATURES.TSX
 */

import React from 'react';
import { motion } from 'motion/react';
import { Zap, Search, Cloud, Maximize, Image as ImageIcon, Layout, Database, Globe } from 'lucide-react';
import { C, SectionLabel, useReveal } from '../components/sections/shared';

const FeatureSection = (props: { title: string, description: string, label: string, icon: any, reversed?: boolean, children: React.ReactNode, key?: any }) => {
  const { title, description, label, icon: Icon, reversed = false, children } = props;
  const revealRef = useReveal();

  return (
    <section ref={revealRef} className={`py-16 md:py-24 bg-white ${reversed ? 'bg-flash-light/30' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid lg:grid-cols-2 gap-10 md:gap-16 items-center ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          <div className={`reveal reveal-d1 ${reversed ? 'lg:order-2' : ''}`}>
            <div className="bg-white border border-black/5 rounded-[24px] md:rounded-[40px] overflow-hidden shadow-2xl shadow-black/5 relative group">
              <div className="bg-flash-light px-6 py-4 flex gap-2 items-center border-b border-black/5">
                {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <span className="text-[10px] font-mono text-graphite-night/30 ml-2 uppercase tracking-widest">Flash Index Preview</span>
              </div>
              <div className="p-5 md:p-8">{children}</div>
              <div className="absolute inset-0 bg-brand-gradient opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
            </div>
          </div>

          <div className={`reveal reveal-d2 ${reversed ? 'lg:order-1' : ''}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-ruby-heat/10 rounded-xl flex items-center justify-center text-ruby-heat">
                <Icon className="w-5 h-5" />
              </div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#fff3ee', border: '1.5px solid #ffd4c2', borderRadius: 100, padding: '5px 14px', fontSize: 11, fontFamily: "'Roboto Mono', monospace", color: C.orange, letterSpacing: '1.5px', textTransform: 'uppercase', marginBottom: 0 }}><span style={{ width: 6, height: 6, borderRadius: '50%', background: C.orange, display: 'inline-block' }} />{label}</div>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-graphite-night mb-6 leading-tight tracking-tight">{title}</h2>
            <p className="text-lg text-graphite-night/60 mb-10 leading-relaxed font-medium">{description}</p>
            <div className="space-y-4">
              {['Instant sub-second response times', 'End-to-end encrypted metadata', 'Zero-config setup in minutes'].map((point, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full bg-ruby-heat/10 border border-ruby-heat/20 flex items-center justify-center text-ruby-heat">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-bold text-graphite-night/60">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Check = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export const FeaturesPage = ({ content, onNavigate }: { content: any, onNavigate: (page: string) => void }) => {
  const revealRef = useReveal();
  if (!content) return null;

  const featureSections = content.featureSections || [];

  return (
    <div className="noise-overlay min-h-screen bg-white pt-20">
      <section className="py-16 relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-[600px] h-[600px] bg-ruby-heat/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <SectionLabel>{content.heroLabel || 'Features & Capabilities'}</SectionLabel>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            {content.mainTitle || 'Everything you need to find anything.'}
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base lg:text-lg text-white/80 max-w-2xl mx-auto mb-8 font-medium">
            {content.description || 'Unlocking the power of your memory with advanced AI indexing and retrieval.'}
          </motion.p>
        </div>
      </section>

      <section ref={revealRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="reveal reveal-d1 bg-white border border-black/5 rounded-[32px] overflow-hidden shadow-2xl shadow-black/5">
              <div className="bg-flash-light px-6 py-4 flex gap-2 items-center border-b border-black/5">
                {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                <span className="text-[10px] font-mono text-graphite-night/30 ml-2 uppercase tracking-widest">File Explorer</span>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 bg-flash-light border border-black/5 rounded-xl px-4 py-3 mb-6">
                  <Search className="w-4 h-4 text-graphite-night/20" />
                  <span className="font-mono text-xs text-graphite-night/30">goa trip photo...</span>
                </div>
                <div className="text-center py-12 bg-flash-light rounded-2xl border-2 border-dashed border-black/5 mb-6">
                  <div className="text-4xl mb-4">No results</div>
                  <div className="text-sm font-bold text-graphite-night/40">No results found</div>
                  <div className="text-[10px] font-mono text-graphite-night/20 mt-2">Try an exact filename</div>
                </div>
                <div className="space-y-1">
                  {['Documents/Work/2023/Q3/', 'File_not_final_FINAL_v3.docx', 'IMG_20231108_unknown.heic', 'Untitled Folder (2)/photo.jpg'].map(f => (
                    <div key={f} className="flex items-center gap-3 py-2 px-3 border-t border-black/5 text-[10px] font-mono text-graphite-night/30 overflow-hidden">
                      <span className="flex-shrink-0">Folder</span>
                      <span className="truncate">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="reveal reveal-d2">
              <SectionLabel>{content.oldWayLabel || 'The Old Way'}</SectionLabel>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-graphite-night mt-4 mb-6 leading-tight tracking-tight">{content.oldWayHeadline || "Searching shouldn't feel like detective work."}</h2>
              <p className="text-lg text-graphite-night/60 mb-10 leading-relaxed font-medium">{content.oldWayDescription || "You don't remember filenames. You remember moments - a conversation, a location, a feeling. Traditional systems force you to think like a machine."}</p>
              <div className="space-y-4">
                {(content.oldWayPoints || ['Exact filenames always required', 'Endless nested folders to dig through', 'Search returns zero useful results', 'Hours wasted searching every week']).map((point: string, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-ruby-heat/10 border border-ruby-heat/20 flex items-center justify-center text-ruby-heat text-[10px] font-bold">x</div>
                    <span className="text-sm font-bold text-graphite-night/60">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {featureSections.map((section: any, idx: number) => {
        const icons = [Search, Cloud, ImageIcon, Layout, Maximize];
        const Icon = icons[idx % icons.length];
        return (
          <FeatureSection key={idx} label={section.label} icon={Icon} title={section.title} description={section.description} reversed={section.reversed}>
            {idx === 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 bg-ruby-heat/5 border border-ruby-heat/20 rounded-xl px-4 py-4 mb-6">
                  <Search className="w-5 h-5 text-ruby-heat" />
                  <span className="font-bold text-sm text-graphite-night">"The contract I signed with Acme Corp last Tuesday"</span>
                </div>
                <div className="space-y-3">
                  {[{ name: 'Acme_Final_Contract.pdf', path: 'Google Drive / Legal', time: '2m ago' }, { name: 'Acme_Corp_Onboarding.docx', path: 'Dropbox / Clients', time: '5m ago' }].map((file, fileIdx) => (
                    <div key={fileIdx} className="flex items-center justify-between p-4 bg-flash-light rounded-xl border border-black/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-ruby-heat shadow-sm"><Layout className="w-4 h-4" /></div>
                        <div>
                          <div className="text-xs font-bold text-graphite-night">{file.name}</div>
                          <div className="text-[10px] text-graphite-night/30 font-mono">{file.path}</div>
                        </div>
                      </div>
                      <div className="text-[10px] font-bold text-ruby-heat uppercase tracking-tighter">{file.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : idx === 1 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[{ name: 'Google Drive', icon: Globe, color: 'text-blue-500', status: 'Connected' }, { name: 'Dropbox', icon: Cloud, color: 'text-indigo-500', status: 'Connected' }, { name: 'OneDrive', icon: Cloud, color: 'text-blue-600', status: 'Syncing...' }, { name: 'Local Storage', icon: Database, color: 'text-graphite-night', status: 'Connected' }].map((cloud, cloudIdx) => (
                  <div key={cloudIdx} className="p-6 bg-flash-light rounded-2xl border border-black/5 flex flex-col items-center text-center group hover:border-ruby-heat/20 transition-all">
                    <cloud.icon className={`w-8 h-8 mb-3 ${cloud.color}`} />
                    <div className="text-xs font-bold text-graphite-night mb-1">{cloud.name}</div>
                    <div className={`text-[9px] font-bold uppercase tracking-widest ${cloud.status === 'Syncing...' ? 'text-ruby-heat animate-pulse' : 'text-green-500'}`}>{cloud.status}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden border border-black/5 relative group">
                    <img src={`https://picsum.photos/seed/img${i + idx}/200/200`} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" alt="Feature" />
                  </div>
                ))}
              </div>
            )}
            {section.points && (
              <div className="mt-6 space-y-2">
                {section.points.map((p: string, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3 h-3 text-ruby-heat" />
                    <span className="text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest">{p}</span>
                  </div>
                ))}
              </div>
            )}
          </FeatureSection>
        );
      })}

      <section className="py-16 md:py-24 bg-flash-light/30 border-t border-black/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Zap className="w-12 h-12 text-ruby-heat mx-auto mb-8" />
          <h2 className="text-3xl sm:text-4xl lg:text-4xl font-black text-graphite-night mb-4 tracking-tight leading-tight">
            {content.ctaTitle || 'Ready to unlock your'} <span className="text-ruby-heat italic">{content.ctaTitleHighlight || 'digital memory?'}</span>
          </h2>
          <p className="text-base sm:text-lg text-graphite-night/60 mb-8 font-medium max-w-2xl mx-auto">{content.ctaDescription || 'Explore the plan that fits your workflow or talk to our team about a custom rollout.'}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button onClick={() => onNavigate((content.ctaPrimaryButtonLink || '/pricing').replace(/^\//, '') || 'pricing')} className="fi-btn-primary px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg">{content.ctaPrimaryButtonText || 'View Pricing'}</button>
            <button onClick={() => onNavigate((content.ctaSecondaryButtonLink || '/contact').replace(/^\//, '') || 'contact')} className="fi-btn-secondary px-6 sm:px-10 py-4 sm:py-5 text-base sm:text-lg">{content.ctaSecondaryButtonText || 'Contact Sales'}</button>
          </div>
        </div>
      </section>
    </div>
  );
};
