/**
 * GENERICPAGE.TSX
 * 
 * What it does:
 * A flexible, fallback page template for rendering any dynamically created page 
 * that doesn't have a specialized layout (e.g., Privacy Policy, Terms of Service).
 * 
 * Why it exists:
 * To allow the admin to create new pages on the fly without needing a developer 
 * to build a new React component for each one.
 * 
 * How it works:
 * - Renders a simple hero section with the page title.
 * - Renders the 'body' content as text/markdown and an optional 'image'.
 * 
 * Connections:
 * - Receives data and navigation handlers from 'src/app/App.tsx'.
 * 
 * Module: Public / Pages
 */

import { motion } from 'motion/react';

/**
 * GenericPage Component
 * 
 * A fallback component for rendering dynamically created pages that don't have
 * a specialized layout. It displays a title, body text, and an optional image.
 * Redesigned to align with the high-end, animated aesthetic of the home page.
 */
export const GenericPage = ({ content, onNavigate }: { content: any, onNavigate: (page: string) => void }) => {
  if (!content) return null;
  
  return (
    <div className="noise-overlay min-h-screen bg-white pt-20">
      {/* Generic Hero */}
      <section className="py-20 md:py-32 relative overflow-hidden bg-brand-gradient">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-0 left-0 w-[500px] h-[500px] bg-ruby-heat/20 rounded-full blur-[120px]"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl lg:text-8xl font-bold text-white mb-8 leading-[0.9] tracking-tight"
          >
            {content.title || 'New Page'}
          </motion.h1>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Body Content */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-lg md:prose-2xl max-w-none text-graphite-night/70 leading-relaxed font-light break-words"
          >
            {content.body || 'Add content in the admin dashboard...'}
          </motion.div>
          
          {/* Optional Page Image */}
          {content.image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="mt-16 md:mt-20 rounded-[28px] md:rounded-[48px] overflow-hidden shadow-2xl border border-black/5"
            >
              <img 
                src={content.image} 
                className="w-full h-auto object-cover" 
                referrerPolicy="no-referrer" 
                alt={content.title || 'Page image'}
              />
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
};
