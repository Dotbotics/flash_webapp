/**
 * SECTIONS/USECASES.TSX
 * 
 * What it does:
 * Explains how Flash Index can be used by different types of users 
 * (Individuals, Teams, Enterprises).
 * 
 * Why it exists:
 * To show the versatility of the product and how it scales to meet 
 * different needs.
 * 
 * How it works:
 * - Dynamically renders a list of use cases from the 'content' prop.
 * - Each use case includes a tag, icon, title, description, and a list of items.
 * - Uses 'useReveal' for entrance animations.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { C, SectionLabel, useReveal } from "./shared";

export function UseCasesSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const cases = data?.useCases || [
    {
      tag: "Personal", icon: "👤", title: "For Individuals",
      desc: "Your memories, photos, and documents found by how you remember them — not by how they were named or filed.",
      items: ["Personal photo collections", "Tax docs & receipts", "Notes & journals", "Project archives"],
    },
    {
      tag: "Teams", icon: "👥", title: "For Teams",
      desc: "Stop wasting collective time searching shared drives. Give every member instant access to the right knowledge.",
      items: ["Shared project files", "Meeting recordings", "Client deliverables", "Design assets"],
    },
    {
      tag: "Enterprise", icon: "🏢", title: "For Enterprise",
      desc: "Unlock organizational knowledge across massive, unstructured systems — at the speed of thought and any scale.",
      items: ["Multi-TB knowledge bases", "Cross-department search", "Compliance & audit trails", "SSO & enterprise auth"],
    },
  ];

  const bg = darkMode ? "transparent" : "#fafafa";
  const text = darkMode ? "#f0ede8" : C.dark;
  const cardBg = darkMode ? "#1a1a1a" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const muted = darkMode ? "#eeeae9" : "#888";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 72 }}>
          <SectionLabel>{data?.useCasesLabel || "Use Cases"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", color: text, lineHeight: 1.05 }}>
            {data?.useCasesHeadline || "Built for everyone."}<br />
            <span style={{ color: C.orange }}>{data?.useCasesHeadlineHighlight || "Scales for anything."}</span>
          </h2>
        </div>

        <div className="uc-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {cases.map((c: any, i: number) => ( 
            <div key={i} className={`uc-card reveal reveal-d${i + 1}`} style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}>
              <div style={{ display: "inline-block", background: darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee", border: `1.5px solid ${darkMode ? "rgba(251,91,21,0.3)" : "#ffd4c2"}`, borderRadius: 100, padding: "3px 12px", fontSize: 10, fontFamily: "'Roboto Mono', monospace", color: C.orange, letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 22 }}>
                {c.tag}
              </div>
              <div style={{ fontSize: 48, marginBottom: 20 }}>{c.icon}</div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: text, letterSpacing: "-0.5px", marginBottom: 14 }}>{c.title}</h3>
              <p style={{ fontSize: 14, color: muted, lineHeight: 1.75, marginBottom: 28 }}>{c.desc}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {c.items?.map((it: string) => (
                  <div key={it} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: muted }}>{it}</span>
                  </div>
                ))}
              </div>
              <div className="uc-bar" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
