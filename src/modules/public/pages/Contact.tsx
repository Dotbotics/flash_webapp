/**
 * CONTACT.TSX
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MapPin, Mail, Phone, Send, Zap, CheckCircle2 } from 'lucide-react';
import { SectionLabel, useReveal } from '../components/sections/shared';

export const ContactPage = ({ content }: { content: any, onNavigate: (page: string) => void }) => {
  const revealRef = useReveal();
  const subjectOptions = content?.subjectOptions?.length ? content.subjectOptions : ['General Inquiry', 'Sales', 'Support', 'Partnership'];
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: subjectOptions[0],
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  if (!content) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          subject: formData.subject,
          message: formData.message
        })
      });

      if (res.ok) {
        setStatus('success');
        setFormData({ firstName: '', lastName: '', email: '', subject: subjectOptions[0], message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="noise-overlay min-h-screen bg-white pt-20">
      <section className="py-16 relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-saffron-glow/20 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <SectionLabel>{content.heroLabel || 'Contact Us'}</SectionLabel>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-3xl lg:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight">
            {content.heroTitle || 'Get in'} <span className="italic font-light text-white/70">{content.heroTitleAccent || 'Touch'}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-base lg:text-lg text-white/80 max-w-2xl mx-auto font-medium">
            {content.heroDescription || "Have questions? We're here to help you find your way. Our team is ready to assist with any inquiries."}
          </motion.p>
        </div>
      </section>

      <section ref={revealRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="reveal reveal-d1">
              <h2 className="text-3xl font-black text-graphite-night mb-10 tracking-tight">{content.contactInfoTitle || 'Contact Information'}</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-flash-light border border-black/5 rounded-2xl flex items-center justify-center text-ruby-heat flex-shrink-0 group-hover:bg-ruby-heat group-hover:text-white transition-all shadow-sm"><MapPin className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-graphite-night mb-1">{content.addressLabel || 'Address'}</h4>
                    <p className="text-graphite-night/50 text-base font-medium">{content.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-flash-light border border-black/5 rounded-2xl flex items-center justify-center text-ruby-heat flex-shrink-0 group-hover:bg-ruby-heat group-hover:text-white transition-all shadow-sm"><Mail className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-graphite-night mb-1">{content.emailLabel || 'Email'}</h4>
                    <p className="text-graphite-night/50 text-base font-medium">{content.email}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6 group">
                  <div className="w-12 h-12 bg-flash-light border border-black/5 rounded-2xl flex items-center justify-center text-ruby-heat flex-shrink-0 group-hover:bg-ruby-heat group-hover:text-white transition-all shadow-sm"><Phone className="w-6 h-6" /></div>
                  <div>
                    <h4 className="text-lg font-bold text-graphite-night mb-1">{content.phoneLabel || 'Phone'}</h4>
                    <p className="text-graphite-night/50 text-base font-medium">{content.phone}</p>
                  </div>
                </div>
              </div>

              <div className="mt-16 p-10 bg-graphite-night rounded-[32px] text-white relative overflow-hidden shadow-2xl">
                <Zap className="w-10 h-10 text-ruby-heat mb-6" />
                <h3 className="text-xl font-bold mb-4 tracking-tight">{content.enterpriseTitle || 'Enterprise Inquiries'}</h3>
                <p className="text-white/50 leading-relaxed font-medium text-sm">{content.enterpriseDescription || 'Looking for a custom deployment or high-volume indexing? Our enterprise team is ready to build a solution that fits your scale.'}</p>
                <div className="absolute -right-10 -bottom-10 opacity-5"><Zap className="w-40 h-40" /></div>
              </div>
            </div>

            <div className="bg-flash-light p-10 md:p-12 rounded-[40px] border border-black/5 shadow-sm reveal reveal-d2">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"><CheckCircle2 className="w-10 h-10" /></div>
                  <h3 className="text-2xl font-black text-graphite-night mb-4 tracking-tight">{content.successTitle || 'Message Sent!'}</h3>
                  <p className="text-graphite-night/50 max-w-xs mx-auto mb-8 font-medium text-sm">{content.successMessage || 'Thank you for reaching out. Our team will get back to you shortly.'}</p>
                  <button onClick={() => setStatus('idle')} className="fi-btn-secondary">{content.resetButtonText || 'Send Another Message'}</button>
                </motion.div>
              ) : (
                <form className="space-y-6" onSubmit={handleSubmit}>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest mb-2">{content.firstNameLabel || 'First Name'}</label>
                      <input type="text" required value={formData.firstName} onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} placeholder={content.firstNamePlaceholder || 'John'} className="w-full px-6 py-4 rounded-xl bg-white border border-black/5 text-graphite-night focus:ring-2 focus:ring-ruby-heat outline-none shadow-sm font-medium text-sm" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest mb-2">{content.lastNameLabel || 'Last Name'}</label>
                      <input type="text" required value={formData.lastName} onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} placeholder={content.lastNamePlaceholder || 'Doe'} className="w-full px-6 py-4 rounded-xl bg-white border border-black/5 text-graphite-night focus:ring-2 focus:ring-ruby-heat outline-none shadow-sm font-medium text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest mb-2">{content.emailFieldLabel || 'Email Address'}</label>
                    <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder={content.emailPlaceholder || 'john@example.com'} className="w-full px-6 py-4 rounded-xl bg-white border border-black/5 text-graphite-night focus:ring-2 focus:ring-ruby-heat outline-none shadow-sm font-medium text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest mb-2">{content.subjectLabel || 'Subject'}</label>
                    <select value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-6 py-4 rounded-xl bg-white border border-black/5 text-graphite-night focus:ring-2 focus:ring-ruby-heat outline-none shadow-sm font-medium appearance-none text-sm">
                      {subjectOptions.map((option: string) => <option key={option} value={option}>{option}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-graphite-night/40 uppercase tracking-widest mb-2">{content.messageLabel || 'Message'}</label>
                    <textarea rows={4} required value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder={content.messagePlaceholder || 'How can we help you?'} className="w-full px-6 py-4 rounded-xl bg-white border border-black/5 text-graphite-night focus:ring-2 focus:ring-ruby-heat outline-none shadow-sm font-medium text-sm"></textarea>
                  </div>

                  {status === 'error' && <p className="text-red-500 text-xs font-bold">{content.errorMessage || 'Something went wrong. Please try again.'}</p>}

                  <button disabled={status === 'submitting'} className="fi-btn-primary w-full justify-center py-4 text-base disabled:opacity-50">
                    <Send className="w-4 h-4" />
                    {status === 'submitting' ? (content.submittingButtonText || 'Sending...') : (content.submitButtonText || 'Send Message')}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
