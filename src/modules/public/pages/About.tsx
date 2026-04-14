/**
 * ABOUT.TSX
 */

import { motion } from 'motion/react';
import { Users, Shield, Zap, Target, Eye, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SectionLabel, useReveal } from '../components/sections/shared';

export const AboutPage = ({ content }: { content: any, onNavigate: (page: string) => void }) => {
  const revealRef = useReveal();
  if (!content) return null;

  return (
    <div className="noise-overlay min-h-screen bg-white pt-20">
      <section className="py-16 relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ x: [0, 50, 0], y: [0, -30, 0] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-ruby-heat/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl">
            <div className="mb-4">
              <SectionLabel>{content.heroLabel || 'Our Story'}</SectionLabel>
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
              {content.heroTitle || 'About'} <span className="italic font-light text-white/70">{content.heroTitleAccent || 'Flash Index'}</span>
            </h1>
            <p className="text-base lg:text-lg text-white/80 leading-relaxed font-medium">{content.aboutText}</p>
          </motion.div>
        </div>
      </section>

      <section ref={revealRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-12 bg-ruby-heat rounded-[32px] text-white relative overflow-hidden group reveal reveal-d1 shadow-xl shadow-ruby-heat/20">
              <Target className="w-12 h-12 mb-6 text-white/20 transition-colors" />
              <h3 className="text-3xl font-black mb-4 tracking-tight">{content.missionTitle || 'Our Mission'}</h3>
              <p className="text-lg text-white/80 leading-relaxed font-medium">{content.mission}</p>
              <div className="absolute -right-10 -bottom-10 opacity-10"><Target className="w-48 h-48" /></div>
            </div>

            <div className="p-12 bg-graphite-night rounded-[32px] text-white relative overflow-hidden group reveal reveal-d2 shadow-xl">
              <Eye className="w-12 h-12 mb-6 text-white/10 transition-colors" />
              <h3 className="text-3xl font-black mb-4 tracking-tight">{content.visionTitle || 'Our Vision'}</h3>
              <p className="text-lg text-white/80 leading-relaxed font-medium">{content.vision}</p>
              <div className="absolute -right-10 -bottom-10 opacity-5"><Eye className="w-48 h-48" /></div>
            </div>
          </div>

          <div className="mt-24">
            <div className="text-center mb-16 reveal">
              <SectionLabel>{content.valuesLabel || 'Values'}</SectionLabel>
              <h3 className="text-4xl font-black text-graphite-night mb-4 tracking-tight">{content.valuesTitle || 'Our Core Values'}</h3>
              <div className="h-1.5 w-20 bg-ruby-heat mx-auto rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {content.coreValues?.map((v: any, i: number) => (
                <div key={i} className={`text-center p-8 bg-flash-light rounded-[24px] border border-black/5 reveal reveal-d${i + 1} transition-all duration-500 hover:-translate-y-2 hover:border-ruby-heat/20`}>
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 text-ruby-heat shadow-sm border border-black/5">
                    {v.icon === 'Users' ? <Users className="w-8 h-8" /> : v.icon === 'Shield' ? <Shield className="w-8 h-8" /> : v.icon === 'Heart' ? <Heart className="w-8 h-8" /> : <Zap className="w-8 h-8" />}
                  </div>
                  <p className="text-lg font-bold text-graphite-night tracking-tight">{v.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-flash-light/50 border-y border-black/5">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-black text-graphite-night mb-4 tracking-tight leading-tight">{content.ctaTitle || 'Join us on our journey to redefine memory.'}</h2>
          <p className="text-base sm:text-lg text-graphite-night/60 mb-8 font-medium max-w-2xl mx-auto">{content.ctaDescription || 'Reach out to the team or explore the product in more detail.'}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to={content.ctaPrimaryButtonLink || '/contact'} className="fi-btn-primary">{content.ctaPrimaryButtonText || 'Get in Touch'}</Link>
            <Link to={content.ctaSecondaryButtonLink || '/features'} className="fi-btn-secondary">{content.ctaSecondaryButtonText || 'Explore Features'}</Link>
          </div>
        </div>
      </section>
    </div>
  );
};
