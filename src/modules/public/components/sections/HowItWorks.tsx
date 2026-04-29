/**
 * SECTIONS/HOWITWORKS.TSX
 * 
 * What it does:
 * Explains the three-step process of using Flash Index: Connect, Describe, Retrieve.
 * 
 * Why it exists:
 * To simplify the user's understanding of how the product works 
 * and how easy it is to set up.
 * 
 * How it works:
 * - Features an interactive step-by-step guide.
 * - Clicking a step on the left updates the detailed view on the right.
 * - Uses React state (useState) to track the active step.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { useState } from "react";
import { C, SectionLabel, useReveal } from "./shared";

function StepIcon({ icon, size = 28 }: { icon: string; size?: number }) {
  const isImage = typeof icon === "string" && (icon.startsWith("http") || icon.startsWith("/uploads"));

  if (isImage) {
    return <img src={icon} alt="" style={{ width: size, height: size, objectFit: "contain" }} />;
  }

  return <>{icon}</>;
}

export function HowItWorksSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const [active, setActive] = useState(0);

  const steps = data?.steps || [
    {
      num: "01", icon: "☁️", title: "Connect your cloud storage.",
      desc: "Link Google Drive, SharePoint, Dropbox, OneDrive, or any supported platform in under 60 seconds. No data migration. No disruption to your existing folder structure.",
      points: ["OAuth-based secure auth", "Read-only index access", "Multiple sources at once", "Setup in under 60 seconds"],
    },
    {
      num: "02", icon: "💬", title: "Describe what you remember.",
      desc: "Tell FlashIndex what you're thinking of — the way you'd explain it to a colleague. Context, dates, people, emotions, topics — all work perfectly.",
      points: ["Plain English input", "Context & emotion aware", "Any language supported", "No exact details needed"],
    },
    {
      num: "03", icon: "⚡", title: "Get it instantly.",
      desc: "Our semantic AI retrieves your file in milliseconds — with relevance scores, source location, and one-click open. Across every format, every connected source.",
      points: ["Sub-300ms response time", "Relevance scoring shown", "Cross-platform results", "One-click to open"],
    },
  ];

  const bg = darkMode ? "transparent" : "#fafafa";
  const text = darkMode ? "#f0ede8" : C.dark;
  const cardBg = darkMode ? "#141414" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const muted = darkMode ? "#eeeae9" : "#888";
  const softMuted = darkMode ? "rgba(255,255,255,0.2)" : "#ccc";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel>{data?.howItWorksLabel || "How It Works"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", lineHeight: 1.05, color: text }}>
            {data?.howItWorksHeadline || "From memory to result."}<br />
            <span style={{ color: C.orange }}>{data?.howItWorksHeadlineHighlight || "In seconds."}</span>
          </h2>
        </div>

        <div className="steps-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 56, alignItems: "start" }}>

          {/* Left: clickable steps */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {steps.map((s: any, i: number) => ( 
              <div
                key={i}
                className={`step-card-interactive ${active === i ? "active" : ""}`}
                onClick={() => setActive(i)}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: "50%",
                    background: active === i ? (darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee") : (darkMode ? "#262626" : "#f5f5f5"),
                    border: `2px solid ${active === i ? C.orange : (darkMode ? "rgba(255,255,255,0.05)" : "#eee")}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, flexShrink: 0,
                    transition: "all 0.25s",
                  }}><StepIcon icon={s.icon} /></div>
                  <div>
                    <div style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 10, letterSpacing: "3px", color: active === i ? C.orange : softMuted, textTransform: "uppercase", marginBottom: 4 }}>{s.num}</div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: text }}>{s.title}</h3>
                  </div>
                </div>
                {active === i && (
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.75, marginTop: 16, paddingLeft: 74, animation: "fadeIn 0.35s ease" }}>{s.desc}</p>
                )}
              </div>
            ))}
          </div>

          {/* Right: detail panel */}
          <div className="reveal reveal-d2 steps-detail-panel" style={{ position: "sticky", top: 100 }}>
            <div style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 20, overflow: "hidden", boxShadow: darkMode ? "0 16px 48px rgba(0,0,0,0.3)" : "0 16px 48px rgba(0,0,0,0.07)" }}>
              <div style={{ background: darkMode ? "linear-gradient(135deg,#1c1c1c,#141414)" : "linear-gradient(135deg,#fff8f5,#fff3ee)", padding: "36px 32px", borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#f0e8e4"}` }}>
                <div style={{ fontSize: 64, fontWeight: 900, color: darkMode ? "rgba(251,91,21,0.2)" : "rgba(251,91,21,0.12)", lineHeight: 1, marginBottom: -8, fontFamily: "'Roboto Mono', monospace" }}>
                  {steps[active].num}
                </div>
                <div style={{ fontSize: 40, width: 56, height: 56, display: "flex", alignItems: "center" }}><StepIcon icon={steps[active].icon} size={44} /></div>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: text, margin: "12px 0 14px", letterSpacing: "-0.5px" }}>
                  {steps[active].title}
                </h3>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.8 }}>{steps[active].desc}</p>
              </div>
              <div style={{ padding: "24px 32px" }}>
                <div style={{ fontSize: 10, color: softMuted, fontFamily: "'Roboto Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 16 }}>Key highlights</div>
                {steps[active]?.points?.map((pt: string) => (
                  <div key={pt} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.orange, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: darkMode ? "rgba(240,237,232,0.7)" : "#666" }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
