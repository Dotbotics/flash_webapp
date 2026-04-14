/**
 * HOME.TSX
 * 
 * What it does:
 * The primary landing page for the Flash Index website. It is a highly dynamic, 
 * section-based page that renders content fetched from the backend.
 * 
 * Why it exists:
 * To provide a high-end, interactive, and informative first impression for users.
 * 
 * How it works:
 * - Imports modular section components (Hero, Problem, Features, etc.).
 * - Receives 'content' data from App.tsx and passes relevant parts to each section.
 * - Uses a custom 'useHomePageStyles' hook to inject CSS animations specifically for this page.
 * - Uses 'useSEO' to update page metadata dynamically.
 * 
 * Connections:
 * - Depends on 'src/modules/public/components/sections/*' for its layout.
 * - Depends on 'src/hooks/useSEO.ts' for metadata management.
 * 
 * Module: Public / Pages
 */

import { useEffect } from "react";
import { C } from "../components/sections/shared";
import { useSEO } from "../../../hooks/useSEO";

// Sections
import { HeroSection } from "../components/sections/Hero";
import { ProblemSection } from "../components/sections/Problem";
import { FeaturesSection } from "../components/sections/Features";
import { HowItWorksSection } from "../components/sections/HowItWorks";
import { DemoSection } from "../components/sections/Demo";
import { UseCasesSection } from "../components/sections/UseCases";
import { TrustSection } from "../components/sections/Trust";
import { CTASection } from "../components/sections/CTA";
import { TestimonialsSection } from "../components/sections/Testimonials";
import { ClientLogosSection } from "../components/sections/ClientLogos";

/* ─────────────────────────────────────────────────────────
   INJECT STYLES FOR HOMEPAGE SECTIONS
───────────────────────────────────────────────────────── */
function useHomePageStyles(darkMode: boolean) {
  useEffect(() => {
    const style = document.createElement("style");
    const bg = darkMode ? C.graphiteNight : "#fff";
    const text = darkMode ? "#f0ede8" : "#1a1a1a";
    const border = darkMode ? "rgba(255,255,255,0.1)" : "#eee";
    const cardBg = darkMode ? "rgba(255,255,255,0.05)" : "#fff";
    const muted = darkMode ? "#eeeae9" : "#666";

    style.innerHTML = `
      @keyframes floatUp {
        0%,100% { transform: translateY(0px) rotate(-8deg); }
        50% { transform: translateY(-22px) rotate(-8deg); }
      }
      @keyframes blink {
        0%,100% { opacity: 1; }
        50% { opacity: 0; }
      }
      @keyframes shimmer {
        0% { background-position: 0% 50%; }
        100% { background-position: 200% 50%; }
      }
      @keyframes slideUp {
        from { opacity: 0; transform: translateY(36px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes resultSlide {
        from { opacity: 0; transform: translateY(10px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes gradShift {
        0%,100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }
      @keyframes countUp {
        from { opacity:0; transform: translateY(12px); }
        to   { opacity:1; transform: translateY(0); }
      }
      @keyframes logosMarquee {
        from { transform: translateX(0); }
        to { transform: translateX(calc(-50% - 8px)); }
      }

      .fi-btn-primary {
        display: inline-flex; align-items: center; gap: 8px;
        background: linear-gradient(135deg, #fb5b15, #dc2312);
        color: #fff; border: none;
        padding: 14px 32px; border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 700; font-size: 15px;
        cursor: pointer; letter-spacing: -0.2px;
        box-shadow: 0 6px 28px rgba(251,91,21,0.35);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }
      .fi-btn-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(251,91,21,0.45);
      }
      .fi-btn-secondary {
        display: inline-flex; align-items: center; gap: 8px;
        background: transparent;
        color: ${darkMode ? text : "#444"}; border: 1.5px solid ${darkMode ? "rgba(255,255,255,0.2)" : "#ddd"};
        padding: 14px 28px; border-radius: 10px;
        font-family: 'Inter', sans-serif;
        font-weight: 600; font-size: 15px; cursor: pointer;
        transition: border-color 0.2s, color 0.2s;
      }
      .fi-btn-secondary:hover { border-color: #fb5b15; color: #fb5b15; }

      .fi-card {
        background: ${cardBg};
        border: 1.5px solid ${border};
        border-radius: 16px;
        transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
      }
      .fi-card:hover {
        border-color: rgba(251,91,21,0.4);
        box-shadow: 0 12px 40px rgba(251,91,21,0.08);
        transform: translateY(-4px);
      }

      .chip {
        background: ${darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee"}; border: 1.5px solid ${darkMode ? "rgba(251,91,21,0.3)" : "#ffd4c2"};
        border-radius: 8px; padding: 9px 18px;
        font-size: 13px; font-weight: 600; color: ${muted};
        cursor: default; transition: all 0.2s ease;
        display: flex; align-items: center; gap: 8px;
      }
      .chip:hover {
        border-color: #fb5b15; background: ${darkMode ? "rgba(251,91,21,0.15)" : "#fff8f5"}; color: ${text};
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(251,91,21,0.12);
      }

      .step-card-interactive {
        border: 1.5px solid ${border}; border-radius: 16px;
        padding: 24px 28px; cursor: pointer;
        transition: all 0.25s ease; background: ${cardBg};
      }
      .step-card-interactive:hover { border-color: #fb5b15; background: ${darkMode ? "rgba(251,91,21,0.05)" : "#fff8f5"}; }
      .step-card-interactive.active {
        border-color: #fb5b15;
        background: ${darkMode ? "rgba(251,91,21,0.1)" : "linear-gradient(135deg, #fff8f5, #fff3ee)"};
        box-shadow: 0 8px 32px rgba(251,91,21,0.12);
      }

      .demo-tab-btn {
        padding: 9px 22px; border-radius: 8px;
        font-size: 12px; font-weight: 600; cursor: pointer;
        border: 1.5px solid ${border}; background: ${cardBg}; color: ${muted};
        font-family: 'Roboto Mono', monospace;
        transition: all 0.2s ease; letter-spacing: 0.3px;
      }
      .demo-tab-btn.active {
        background: linear-gradient(135deg, #fb5b15, #dc2312);
        border-color: transparent; color: #fff;
        box-shadow: 0 4px 16px rgba(251,91,21,0.3);
      }
      .demo-tab-btn:not(.active):hover { border-color: #fb5b15; color: #fb5b15; }

      .uc-card {
        background: ${cardBg}; border: 1.5px solid ${border};
        border-radius: 20px; padding: 40px 32px;
        position: relative; overflow: hidden;
        transition: all 0.3s ease; cursor: default;
      }
      .uc-card:hover {
        border-color: #fb5b15;
        box-shadow: 0 16px 48px rgba(251,91,21,0.1);
        transform: translateY(-6px);
      }
      .uc-bar {
        position: absolute; bottom: 0; left: 0;
        height: 3px;
        background: linear-gradient(90deg, #fb5b15, #dc2312);
        width: 0; transition: width 0.4s ease;
      }
      .uc-card:hover .uc-bar { width: 100%; }

      .reveal {
        opacity: 0; transform: translateY(32px);
        transition: opacity 0.75s ease, transform 0.75s ease;
      }
      .reveal.visible { opacity: 1; transform: translateY(0); }
      .reveal-d1 { transition-delay: 0.1s; }
      .reveal-d2 { transition-delay: 0.2s; }
      .reveal-d3 { transition-delay: 0.3s; }
      .reveal-d4 { transition-delay: 0.4s; }
      .reveal-d5 { transition-delay: 0.5s; }

      @media (max-width: 1024px) {
        .section-shell { padding: 0 28px !important; }
        .hero-section {
          min-height: auto !important;
          padding: 96px 0 60px !important;
        }
        .hero-grid,
        .problem-grid,
        .steps-detail-grid,
        .demo-layout {
          grid-template-columns: 1fr !important;
          gap: 40px !important;
        }
        .features-grid,
        .uc-grid,
        .trust-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
        }
        .steps-detail-panel {
          position: static !important;
          top: auto !important;
        }
      }

      @media (max-width: 768px) {
        .section-shell { padding: 0 20px !important; }
        .hero-section {
          min-height: auto !important;
          padding: 84px 0 44px !important;
        }
        .fi-btn-primary,
        .fi-btn-secondary {
          width: 100%;
          justify-content: center;
        }
        .hero-grid,
        .problem-grid,
        .steps-detail-grid,
        .demo-layout,
        .features-grid,
        .uc-grid,
        .trust-grid {
          grid-template-columns: 1fr !important;
        }
        .hero-copy {
          text-align: center;
        }
        .hero-copy p {
          max-width: none !important;
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .hero-visual {
          width: 100%;
          max-width: 560px;
          margin: 0 auto;
        }
        .hero-actions,
        .cta-actions {
          flex-direction: column;
          align-items: stretch;
          justify-content: center;
        }
        .hero-stats {
          gap: 24px !important;
          justify-content: center;
        }
        .cta-panel {
          padding: 48px 22px !important;
        }
        .logo-marquee-shell {
          mask-image: none !important;
        }
        .logo-marquee-track {
          animation-duration: 22s !important;
        }
        .client-logo-card {
          width: 116px !important;
          height: 76px !important;
        }
      }

      @media (max-width: 560px) {
        .hero-grid {
          gap: 28px !important;
        }
        .hero-copy h1 {
          text-align: center;
        }
        .hero-actions {
          margin-bottom: 36px !important;
        }
        .problem-grid,
        .steps-detail-grid,
        .demo-layout {
          gap: 24px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [darkMode]);
}

/* ─────────────────────────────────────────────────────────
   ROOT APP - NOW DATA-DRIVEN
───────────────────────────────────────────────────────── */
export const HomePage = ({ content, featuresContent, onNavigate, seo, darkMode = false, fullPageGradient = false }: { content: any; featuresContent?: any; onNavigate: (id: string) => void; seo?: any; darkMode?: boolean; fullPageGradient?: boolean }) => {
  useHomePageStyles(darkMode);
  useSEO(seo);

  // Use content if provided, otherwise provide sensible defaults
  const data = content || {
    heroLabel: "AI-Powered File Retrieval · 2026",
    heroTagline: "Describe anything you want to find",
    heroHeadline1: "Find anything.",
    heroHeadline2Gradient: "Just describe what you remember.",
    heroDescription: "FlashIndex connects to your cloud storage and finds photos, documents, videos, and files — with no folders, filenames, or filters required.",
    heroCloudSources: "Google Drive · SharePoint · Dropbox · OneDrive & more",
    heroPrimaryButton: "Start for Free →",
    heroPrimaryButtonLink: "/pricing",
    heroSecondaryButton: "Watch Demo ▷",
    heroSecondaryButtonLink: "#demo",
    stats: [
      { value: "2M+", label: "Files indexed daily" },
      { value: "<300ms", label: "Avg retrieval time" },
      { value: "12+", label: "Cloud integrations" },
    ],
    problemLabel: "The Old Way",
    problemHeadline: "Searching shouldn't feel like",
    problemHeadlineHighlight: "detective work.",
    problemDescription: "You don't remember filenames. You remember moments — a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
    problemPoints: [
      "Exact filenames always required",
      "Endless nested folders to dig through",
      "Search returns zero useful results",
      "Hours wasted searching every week",
    ],
    solutionLabel: "The FlashIndex Way",
    solutionHeadline: "Search the way",
    solutionHeadlineHighlight: "you think.",
    features: [
      { icon: "💬", title: "Describe Naturally", desc: "Type exactly how you'd explain it to a colleague. Context, emotions, rough details — it all works. No exact names needed." },
      { icon: "🧠", title: "Memory-Aware AI", desc: "Our semantic engine maps meaning, not keywords. It understands people, places, time, and context the way humans do." },
      { icon: "⚡", title: "Instant Recall", desc: "Sub-300ms retrieval across every connected cloud platform, every file format, all from a single unified interface." },
      { icon: "🔐", title: "Zero Data Storage", desc: "We index metadata and meaning — never your content. Files stay in your cloud, under your control, always." },
      { icon: "🌐", title: "12+ Integrations", desc: "Connect Google Drive, SharePoint, Dropbox, OneDrive, Notion, Box and more in seconds. No migration needed." },
      { icon: "📈", title: "Enterprise Scale", desc: "Works for 10 files or 10 million. FlashIndex scales with your organization without any added complexity." },
    ],
    howItWorksLabel: "How It Works",
    howItWorksHeadline: "From memory to result.",
    howItWorksHeadlineHighlight: "In seconds.",
    steps: [
      { num: "01", icon: "☁️", title: "Connect your cloud storage.", desc: "Link Google Drive, SharePoint, Dropbox, OneDrive, or any supported platform in under 60 seconds. No data migration. No disruption to your existing folder structure.", points: ["OAuth-based secure auth", "Read-only index access", "Multiple sources at once", "Setup in under 60 seconds"] },
      { num: "02", icon: "💬", title: "Describe what you remember.", desc: "Tell FlashIndex what you're thinking of — the way you'd explain it to a colleague. Context, dates, people, emotions, topics — all work perfectly.", points: ["Plain English input", "Context & emotion aware", "Any language supported", "No exact details needed"] },
      { num: "03", icon: "⚡", title: "Get it instantly.", desc: "Our semantic AI retrieves your file in milliseconds — with relevance scores, source location, and one-click open. Across every format, every connected source.", points: ["Sub-300ms response time", "Relevance scoring shown", "Cross-platform results", "One-click to open"] },
    ],
    demoLabel: "Live Demo",
    demoHeadline: "See it in action.",
    demo: [
      {
        label: "Personal Memory",
        query: "sunset photo from Goa trip with friends",
        time: "0.19s",
        results: [
          { name: "goa_sunset_beach.jpg", type: "Image · Google Photos", icon: "🌅", score: 98, size: "4.2 MB" },
          { name: "Goa_Trip_Album_Jun23.zip", type: "Archive · Drive", icon: "📦", score: 84, size: "820 MB" },
          { name: "Friends_Goa_Day2.heic", type: "Image · iCloud", icon: "🏖️", score: 79, size: "6.1 MB" },
        ],
      },
    ],
    useCasesLabel: "Use Cases",
    useCasesHeadline: "Built for everyone.",
    useCasesHeadlineHighlight: "Scales for anything.",
    useCases: [
      { tag: "Personal", icon: "👤", title: "For Individuals", desc: "Your memories, photos, and documents found by how you remember them — not by how they were named or filed.", items: ["Personal photo collections", "Tax docs & receipts", "Notes & journals", "Project archives"] },
      { tag: "Teams", icon: "👥", title: "For Teams", desc: "Stop wasting collective time searching shared drives. Give every member instant access to the right knowledge.", items: ["Shared project files", "Meeting recordings", "Client deliverables", "Design assets"] },
      { tag: "Enterprise", icon: "🏢", title: "For Enterprise", desc: "Unlock organizational knowledge across massive, unstructured systems — at the speed of thought and any scale.", items: ["Multi-TB knowledge bases", "Cross-department search", "Compliance & audit trails", "SSO & enterprise auth"] },
    ],
    trustLabel: "Trust & Reliability",
    trustHeadline: "Built for scale.",
    trustHeadlineHighlight: "Designed for clarity.",
    trustBadges: [
      { icon: "🔐", label: "SOC 2 Ready", desc: "Enterprise-grade security" },
      { icon: "📡", label: "99.9% Uptime", desc: "Reliable at any scale" },
      { icon: "🔒", label: "Zero Data Storage", desc: "Files stay in your cloud" },
      { icon: "⚙️", label: "REST API", desc: "Build on top of FlashIndex" },
    ],
    integrations: [
      { name: "Google Drive", emoji: "🟢" },
      { name: "SharePoint", emoji: "🔵" },
      { name: "Dropbox", emoji: "🟦" },
      { name: "OneDrive", emoji: "☁️" },
      { name: "Box", emoji: "📦" },
      { name: "Notion", emoji: "⬛" },
      { name: "Slack Files", emoji: "💬" },
      { name: "Confluence", emoji: "🔷" },
      { name: "iCloud Drive", emoji: "🍏" },
      { name: "S3 / AWS", emoji: "🟠" },
    ],
    ctaBadge: "⚡ Start for free today",
    ctaHeadline: "Ready to find",
    ctaHeadlineHighlight: "what matters?",
    ctaDescription: "Stop searching. Start remembering. Connect your first storage in 60 seconds — no credit card, no migration, no hassle.",
    ctaPrimaryButton: "Get Started for Free →",
    ctaPrimaryButtonLink: "/pricing",
    ctaSecondaryButton: "Talk to Sales",
    ctaSecondaryButtonLink: "/contact",
  };

  return (
    <div style={darkMode ? { background: fullPageGradient ? C.homeFullGradient : C.homeDarkGradient } : undefined}>
      <HeroSection data={data} onNavigate={onNavigate} darkMode={darkMode} fullPageGradient={fullPageGradient} />
      <ClientLogosSection data={data} darkMode={darkMode} />
      <ProblemSection data={data} featureSections={featuresContent?.featureSections || []} darkMode={darkMode} onNavigate={onNavigate} />
      <FeaturesSection data={data} darkMode={darkMode} />
      <HowItWorksSection data={data} darkMode={darkMode} />
      <DemoSection data={data} darkMode={darkMode} />
      <TestimonialsSection data={data} darkMode={darkMode} />
      <UseCasesSection data={data} darkMode={darkMode} />
      <TrustSection data={data} darkMode={darkMode} />
      <CTASection data={data} onNavigate={onNavigate} darkMode={darkMode} />
    </div>
  );
};
