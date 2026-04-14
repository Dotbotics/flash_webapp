/**
 * SECTIONS/FEATURES.TSX
 * 
 * What it does:
 * Displays a grid of key features and benefits of the Flash Index platform.
 * 
 * Why it exists:
 * To provide a detailed breakdown of the technical and functional 
 * advantages of using the product.
 * 
 * How it works:
 * - Dynamically renders a list of feature cards from the 'content' prop.
 * - Each card includes an icon, title, and description.
 * - Uses 'useReveal' for staggered entrance animations.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { C, SectionLabel, useReveal } from "./shared";

export function FeaturesSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const cards = data?.features || [
    { icon: "💬", title: "Describe Naturally", desc: "Type exactly how you'd explain it to a colleague. Context, emotions, rough details — it all works. No exact names needed." },
    { icon: "🧠", title: "Memory-Aware AI", desc: "Our semantic engine maps meaning, not keywords. It understands people, places, time, and context the way humans do." },
    { icon: "⚡", title: "Instant Recall", desc: "Sub-300ms retrieval across every connected cloud platform, every file format, all from a single unified interface." },
    { icon: "🔐", title: "Zero Data Storage", desc: "We index metadata and meaning — never your content. Files stay in your cloud, under your control, always." },
    { icon: "🌐", title: "12+ Integrations", desc: "Connect Google Drive, SharePoint, Dropbox, OneDrive, Notion, Box and more in seconds. No migration needed." },
    { icon: "📈", title: "Enterprise Scale", desc: "Works for 10 files or 10 million. FlashIndex scales with your organization without any added complexity." },
  ];

  const bg = darkMode ? "transparent" : "#fff";
  const text = darkMode ? "#f0ede8" : C.dark;
  const muted = darkMode ? "#eeeae9" : "#888";
  const iconBg = darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee";
  const iconBorder = darkMode ? "rgba(251,91,21,0.3)" : "#ffd4c2";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel>{data?.solutionLabel || "The FlashIndex Way"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: text }}>
            {data?.solutionHeadline || "Search the way"}<br />
            <span style={{ color: C.orange }}>{data?.solutionHeadlineHighlight || "you think."}</span>
          </h2>
        </div>

        {/* Cards */}
        <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
          {cards.map((c: any, i: number) => ( 
            <div key={i} className={`fi-card reveal reveal-d${(i % 3) + 1}`} style={{ padding: "36px 28px", position: "relative", overflow: "hidden" }}>

              <div style={{ width: 52, height: 52, borderRadius: 14, background: iconBg, border: `1.5px solid ${iconBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 22 }}>
                {c.icon}
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, color: text, marginBottom: 10, letterSpacing: "-0.3px" }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.75 }}>{c.desc}</p>
              {/* Bottom accent */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#fb5b15,transparent)", opacity: 0.3 }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
