/**
 * PRICING.TSX
 * 
 * What it does:
 * Displays the available subscription tiers and their features.
 * 
 * Why it exists:
 * To inform users about the cost and benefits of different Flash Index plans.
 * 
 * How it works:
 * - Dynamically renders 'plans' from the 'content' prop.
 * - Highlights the "Most Popular" plan (the second one in the list).
 * - "Get Started" opens an inline sign-up modal instead of navigating away.
 * 
 * Connections:
 * - Receives data and navigation handlers from 'src/app/App.tsx'.
 * 
 * Module: Public / Pages
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Zap, Check, X, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
import { C, SectionLabel, useReveal } from '../components/sections/shared';

/* ─── Get Started Modal ──────────────────────────────────────────────── */

interface GetStartedModalProps {
  planName: string;
  onClose: () => void;
}

function GetStartedModal({ planName, onClose }: GetStartedModalProps) {
  const [form, setForm] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    designation: '',
    reason: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/get-started', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, plan: planName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Submission failed');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-black/10 bg-white text-graphite-night text-sm font-medium placeholder:text-graphite-night/30 focus:outline-none focus:ring-2 focus:ring-ruby-heat/30 focus:border-ruby-heat transition-all';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-graphite-night/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 24 }}
        transition={{ type: 'spring', damping: 28, stiffness: 340 }}
        className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="bg-ruby-heat px-8 pt-8 pb-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-1">{planName} Plan</div>
          <h2 className="text-2xl font-black text-white tracking-tight">Get Started with Flash Index</h2>
          <p className="text-white/70 text-sm mt-1">Fill in your details and we'll be in touch shortly.</p>
        </div>

        {/* Body */}
        <div className="px-8 py-7">
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-xl font-black text-graphite-night mb-2">You're on the list!</h3>
              <p className="text-graphite-night/50 text-sm">Thanks, {form.name.split(' ')[0]}. Our team will reach out to you at <span className="font-semibold text-graphite-night">{form.email}</span> soon.</p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-3 bg-ruby-heat text-white rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-ruby-heat/30 transition-all"
              >
                Done
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">Full Name *</label>
                  <input required className={inputClass} placeholder="Jane Smith" value={form.name} onChange={set('name')} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">Company Name *</label>
                  <input required className={inputClass} placeholder="Acme Corp" value={form.company} onChange={set('company')} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">Email Address *</label>
                  <input required type="email" className={inputClass} placeholder="jane@acme.com" value={form.email} onChange={set('email')} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">Phone Number</label>
                  <input type="tel" className={inputClass} placeholder="+1 555 000 0000" value={form.phone} onChange={set('phone')} />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">Your Designation</label>
                <input className={inputClass} placeholder="e.g. Head of Operations" value={form.designation} onChange={set('designation')} />
              </div>

              <div>
                <label className="block text-xs font-bold text-graphite-night/50 uppercase tracking-widest mb-1.5">How will Flash Index help you?</label>
                <textarea
                  rows={3}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell us about your use case, challenges, or goals..."
                  value={form.reason}
                  onChange={set('reason')}
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-ruby-heat text-white rounded-xl font-black text-sm uppercase tracking-widest hover:shadow-lg hover:shadow-ruby-heat/30 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting…' : 'Submit & Get Started →'}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Pricing Page ───────────────────────────────────────────────────── */

export const PricingPage = ({ content, onNavigate }: { content: any, onNavigate: (page: string) => void }) => {
  const revealRef = useReveal();
  const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [isMobileComparison, setIsMobileComparison] = useState(false);
  const [getStartedPlan, setGetStartedPlan] = useState<string | null>(null);

  useEffect(() => {
    const syncComparisonLayout = () => {
      setIsMobileComparison(window.innerWidth < 768);
    };

    syncComparisonLayout();
    window.addEventListener('resize', syncComparisonLayout);
    return () => window.removeEventListener('resize', syncComparisonLayout);
  }, []);

  if (!content) return null;

  const handleLink = (link: string) => {
    if (!link) return;
    if (link.startsWith('/')) {
      onNavigate(link.substring(1) || 'home');
    } else {
      window.open(link, '_blank');
    }
  };

  const plans = (content.plans || []).map((plan: any) => ({
    ...plan,
    features: Array.isArray(plan.features)
      ? plan.features.map((f: any) => typeof f === 'string' ? { name: f, enabled: true } : f)
      : []
  }));

  const allFeatureNames = Array.from(new Set(
    plans.flatMap((p: any) => p.features.map((f: any) => f.name))
  ));

  const mobileComparisonPlans = selectedPlanIndex === null
    ? plans
    : [plans[selectedPlanIndex], ...plans.filter((_: any, idx: number) => idx !== selectedPlanIndex)];

  return (
    <div className="noise-overlay min-h-screen bg-white pt-20">
      {/* Pricing Header */}
      <section className="py-16 relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-1/2 -left-1/2 w-full h-full bg-white/5 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-4">
            <SectionLabel>{content.heroLabel || 'Pricing Plans'}</SectionLabel>
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl lg:text-5xl font-black text-white mb-6 leading-[1.1] tracking-tight"
          >
            {content.mainTitle || "Simple, Transparent Pricing"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base lg:text-lg text-white/80 max-w-2xl mx-auto font-medium"
          >
            {content.subtitle || "Choose the plan that's right for your memory scale."}
          </motion.p>
        </div>
      </section>

      <section ref={revealRef} className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan: any, i: number) => {
              const isFeatured = plan.featured || (i === 1 && plan.featured === undefined);
              const tag = plan.tag || (i === 1 ? "Most Popular" : "");
              const displayFeatures = plan.features.filter((f: any) => f.enabled).slice(0, 5);
              const hasMoreFeatures = plan.features.length > 5;

              return (
                <div
                  key={i}
                  className={`flex flex-col p-10 rounded-[32px] border relative overflow-hidden reveal reveal-d${i + 1} transition-all duration-500 hover:-translate-y-2 ${
                    isFeatured
                      ? 'border-ruby-heat bg-white text-graphite-night shadow-2xl z-10'
                      : 'border-black/5 bg-flash-light/50 text-graphite-night shadow-sm'
                  }`}
                >
                  {tag && (
                    <div className="absolute top-0 right-0 bg-ruby-heat text-white px-5 py-1.5 rounded-bl-xl font-bold text-[10px] uppercase tracking-widest">
                      {tag}
                    </div>
                  )}

                  <div className="mb-8">
                    <h3 className="text-xl font-bold mb-3 text-graphite-night">{plan.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black tracking-tight">{plan.price}</span>
                      {plan.price !== 'Free' && plan.price !== 'Custom' && <span className="text-base opacity-40">/mo</span>}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-6 flex-grow">
                    {displayFeatures.map((f: any, j: number) => (
                      <li key={j} className="flex items-center space-x-3 group">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isFeatured ? 'bg-ruby-heat text-white' : 'bg-ruby-heat/10 text-ruby-heat border border-ruby-heat/20'}`}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className="font-medium text-sm text-graphite-night/70">{f.name}</span>
                      </li>
                    ))}
                  </ul>

                  {hasMoreFeatures && (
                    <button
                      onClick={() => { setSelectedPlanIndex(i); setShowComparison(true); }}
                      className="text-ruby-heat text-xs font-bold uppercase tracking-widest mb-10 hover:underline flex items-center gap-2"
                    >
                      <Info className="w-4 h-4" />
                      View all features
                    </button>
                  )}

                  {/* Get Started button — opens modal */}
                  <button
                    onClick={() => setGetStartedPlan(plan.name)}
                    className={`w-full py-4 rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg text-center ${
                      isFeatured
                        ? 'bg-ruby-heat text-white hover:shadow-[0_0_30px_rgba(251,91,21,0.4)]'
                        : 'bg-graphite-night text-white hover:bg-black'
                    }`}
                  >
                    {plan.ctaText || "Get Started"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Comparison Modal */}
      <AnimatePresence>
        {showComparison && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowComparison(false)}
              className="absolute inset-0 bg-graphite-night/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
            >
              <div className="p-5 sm:p-8 border-b border-black/5 flex items-start sm:items-center justify-between gap-4 bg-flash-light/30">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-graphite-night tracking-tight">{content.comparisonTitle || 'Compare Plans'}</h2>
                  <p className="text-sm text-graphite-night/40 font-medium">{content.comparisonDescription || 'Detailed feature breakdown for all Flash Index tiers.'}</p>
                </div>
                <button
                  onClick={() => setShowComparison(false)}
                  className="w-10 h-10 sm:w-12 sm:h-12 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-graphite-night hover:bg-ruby-heat hover:text-white transition-all shadow-sm flex-shrink-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <div className="flex-grow overflow-auto p-4 sm:p-8">
                {isMobileComparison ? (
                  <div className="space-y-4">
                    {mobileComparisonPlans.map((p: any, idx: number) => (
                      <div key={idx} className={`rounded-[24px] border p-5 ${idx === 0 ? 'border-ruby-heat bg-ruby-heat/5' : 'border-black/5 bg-white'}`}>
                        <div className="mb-4">
                          <div className="text-lg font-black text-graphite-night">{p.name}</div>
                          <div className="text-sm text-ruby-heat font-bold mt-1">{p.price}</div>
                        </div>
                        <div className="space-y-3">
                          {allFeatureNames.map((featureName: any, fIdx: number) => {
                            const feature = p.features.find((f: any) => f.name === featureName);
                            const isEnabled = feature ? feature.enabled : false;
                            return (
                              <div key={fIdx} className="flex items-start justify-between gap-3 border-t border-black/5 pt-3 first:border-t-0 first:pt-0">
                                <span className="text-sm font-semibold text-graphite-night/70 leading-relaxed">{featureName}</span>
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isEnabled ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                                  {isEnabled ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-[800px]">
                      <table className="w-full border-collapse">
                        <thead>
                          <tr>
                            <th className="text-left py-6 px-4 text-xs font-bold text-graphite-night/30 uppercase tracking-widest border-b border-black/5">Feature</th>
                            {plans.map((p: any, idx: number) => (
                              <th key={idx} className={`text-center py-6 px-4 border-b border-black/5 ${idx === selectedPlanIndex ? 'bg-ruby-heat/5' : ''}`}>
                                <div className="text-sm font-black text-graphite-night">{p.name}</div>
                                <div className="text-xs text-ruby-heat font-bold mt-1">{p.price}</div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {allFeatureNames.map((featureName: any, fIdx: number) => (
                            <tr key={fIdx} className="group hover:bg-flash-light/30 transition-colors">
                              <td className="py-5 px-4 text-sm font-bold text-graphite-night/70 border-b border-black/5">{featureName}</td>
                              {plans.map((p: any, pIdx: number) => {
                                const feature = p.features.find((f: any) => f.name === featureName);
                                const isEnabled = feature ? feature.enabled : false;
                                return (
                                  <td key={pIdx} className={`py-5 px-4 text-center border-b border-black/5 ${pIdx === selectedPlanIndex ? 'bg-ruby-heat/5' : ''}`}>
                                    {isEnabled ? (
                                      <div className="w-6 h-6 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                        <Check className="w-4 h-4" />
                                      </div>
                                    ) : (
                                      <div className="w-6 h-6 bg-red-500/10 text-red-600 rounded-full flex items-center justify-center mx-auto">
                                        <X className="w-4 h-4" />
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Get Started Modal */}
      <AnimatePresence>
        {getStartedPlan !== null && (
          <GetStartedModal
            planName={getStartedPlan}
            onClose={() => setGetStartedPlan(null)}
          />
        )}
      </AnimatePresence>

      {/* FAQ / Trust Section */}
      <section className="py-24 border-t border-black/5 bg-flash-light/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Zap className="w-10 h-10 text-ruby-heat mx-auto mb-6" />
          <h2 className="text-3xl font-black text-graphite-night mb-4 tracking-tight">
            {content.ctaTitle || "Need something custom?"}
          </h2>
          <p className="text-lg text-graphite-night/50 mb-8 font-medium">
            {content.ctaDescription || "We offer tailored solutions for large-scale enterprises with specific security and compliance requirements."}
          </p>
          <Link
            to={content.ctaButtonLink || '/contact'}
            className="fi-btn-secondary inline-flex items-center"
          >
            {content.ctaButtonText || "Contact Sales"}
          </Link>
        </div>
      </section>
    </div>
  );
};
