/**
 * SECTIONS/TRUST.TSX
 * 
 * What it does:
 * Displays trust signals such as security badges and platform integrations.
 * 
 * Why it exists:
 * To reassure users about the security and compatibility of Flash Index.
 * 
 * How it works:
 * - Renders a grid of trust badges (e.g., "SOC 2 Ready").
 * - Renders a list of integration chips (e.g., "Google Drive", "Notion").
 * - Uses 'useReveal' for entrance animations.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { C, SectionLabel, useReveal } from "./shared";

export function TrustSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const badges = data?.trustBadges || [
    { icon: "🔐", label: "SOC 2 Ready", desc: "Enterprise-grade security" },
    { icon: "📡", label: "99.9% Uptime", desc: "Reliable at any scale" },
    { icon: "🔒", label: "Zero Data Storage", desc: "Files stay in your cloud" },
    { icon: "⚙️", label: "REST API", desc: "Build on top of FlashIndex" },
  ];
  const integrations = data?.integrations || [
    { name: "Google Drive", emoji: "🟢" }, { name: "SharePoint", emoji: "🔵" },
    { name: "Dropbox", emoji: "🟦" }, { name: "OneDrive", emoji: "☁️" },
    { name: "Box", emoji: "📦" }, { name: "Notion", emoji: "⬛" },
    { name: "Slack Files", emoji: "💬" }, { name: "Confluence", emoji: "🔷" },
    { name: "iCloud Drive", emoji: "🍏" }, { name: "S3 / AWS", emoji: "🟠" },
  ];

  const bg = darkMode ? "transparent" : "#fff";
  const text = darkMode ? "#f0ede8" : C.dark;
  const cardBg = darkMode ? "#141414" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const muted = darkMode ? "#eeeae9" : "#aaa";
  const softMuted = darkMode ? "rgba(255,255,255,0.1)" : "#fafafa";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel>{data?.trustLabel || "Trust & Reliability"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", color: text, lineHeight: 1.05 }}>
            {data?.trustHeadline || "Built for scale."}<br />
            <span style={{ color: C.orange }}>{data?.trustHeadlineHighlight || "Designed for clarity."}</span>
          </h2>
        </div>

        <div className="trust-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 18, marginBottom: 80 }}>
          {badges.map((b: any, i: number) => ( 
            <div key={i} className={`fi-card reveal reveal-d${i + 1}`} style={{ padding: "32px 24px", textAlign: "center", background: cardBg, border: `1.5px solid ${cardBorder}` }}>
              <div style={{ fontSize: 36, marginBottom: 14 }}>{b.icon}</div>
              <div style={{ fontWeight: 800, fontSize: 15, color: text, marginBottom: 6 }}>{b.label}</div>
              <div style={{ fontSize: 13, color: muted }}>{b.desc}</div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ textAlign: "center", marginBottom: 28 }}>
          <span style={{ fontSize: 11, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc", fontFamily: "'Roboto Mono', monospace", letterSpacing: "2px", textTransform: "uppercase" }}>
            Works where your files already live
          </span>
        </div>
        <div className="reveal" style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
          {integrations.map((int: any) => (
            <div key={int.name} className="chip" style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, color: text }}>
              <span>{int.emoji}</span>
              <span>{int.name}</span>
            </div>
          ))}
          <div style={{ background: softMuted, border: `1.5px dashed ${darkMode ? "rgba(255,255,255,0.1)" : "#eee"}`, borderRadius: 8, padding: "9px 18px", fontSize: 13, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc" }}>
            + More coming
          </div>
        </div>
      </div>
    </section>
  );
}
