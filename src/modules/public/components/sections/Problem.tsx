import { useEffect, useMemo, useState } from "react";
import { Cloud, Database, Globe, Image as ImageIcon, Layout, Maximize, Search } from "lucide-react";
import { C, SectionLabel, useReveal } from "./shared";

type ProblemSectionProps = {
  data: any;
  featureSections?: any[];
  darkMode?: boolean;
  onNavigate?: (id: string) => void;
};

type SlideItem = {
  label: string;
  headline: string;
  highlight?: string;
  description: string;
  points: string[];
  kind: "problem" | "feature";
  featureIndex?: number;
};

const ROTATE_MS = 18000;
const FADE_MS = 550;

function CheckIcon({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color}>
      <path d="M5 13l4 4L19 7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturePreview({ index }: { index: number }) {
  if (index === 0) {
    return (
      <div style={{ display: "grid", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, background: "rgba(251,91,21,0.05)", border: "1px solid rgba(251,91,21,0.18)", borderRadius: 12, padding: "16px 18px" }}>
          <Search size={18} color={C.orange} />
          <span style={{ fontWeight: 700, fontSize: 14, color: C.dark }}>&quot;The contract I signed with Acme Corp last Tuesday&quot;</span>
        </div>
        <div style={{ display: "grid", gap: 12 }}>
          {[
            { name: "Acme_Final_Contract.pdf", path: "Google Drive / Legal", time: "2m ago" },
            { name: "Acme_Corp_Onboarding.docx", path: "Dropbox / Clients", time: "5m ago" }
          ].map((file) => (
            <div key={file.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, background: "#fafafa", borderRadius: 12, border: "1px solid #eee", gap: 12 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
                <div style={{ width: 32, height: 32, background: "#fff", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: C.orange, boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                  <Layout size={16} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.dark, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{file.name}</div>
                  <div style={{ fontSize: 10, color: "rgba(26,26,26,0.35)", fontFamily: "'Roboto Mono', monospace" }}>{file.path}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: C.orange, textTransform: "uppercase", letterSpacing: 0.3 }}>{file.time}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (index === 1) {
    const clouds = [
      { name: "Google Drive", icon: Globe, color: "#4285F4", status: "Connected" },
      { name: "Dropbox", icon: Cloud, color: "#2563eb", status: "Connected" },
      { name: "OneDrive", icon: Cloud, color: "#2563eb", status: "Syncing..." },
      { name: "Local Storage", icon: Database, color: C.dark, status: "Connected" }
    ];

    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        {clouds.map((cloud) => {
          const Icon = cloud.icon;
          return (
            <div key={cloud.name} style={{ padding: 24, background: "#fafafa", borderRadius: 16, border: "1px solid #eee", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 10 }}>
              <Icon size={30} color={cloud.color} />
              <div style={{ fontSize: 12, fontWeight: 700, color: C.dark }}>{cloud.name}</div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, color: cloud.status === "Syncing..." ? C.orange : "#16a34a" }}>{cloud.status}</div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} style={{ aspectRatio: "1 / 1", borderRadius: 12, overflow: "hidden", border: "1px solid #eee", position: "relative", background: "#f5f5f5" }}>
          <img src={`https://picsum.photos/seed/feature-${index}-${i}/200/200`} alt="Feature preview" referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(100%)" }} />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.08))" }} />
        </div>
      ))}
    </div>
  );
}

export function ProblemSection({ data, featureSections = [], darkMode = false, onNavigate }: ProblemSectionProps) {
  const ref = useReveal();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);

  const slides = useMemo<SlideItem[]>(() => {
    const baseProblemPoints = data?.problemPoints || [
      "Exact filenames always required",
      "Endless nested folders to dig through",
      "Search returns zero useful results",
      "Hours wasted searching every week"
    ];

    const featureItems = (featureSections || []).map((section: any, index: number) => ({
      label: section?.label || "Feature",
      headline: section?.title || section?.label || "Feature",
      description: section?.description || "",
      points: Array.isArray(section?.points) ? section.points : [],
      kind: "feature" as const,
      featureIndex: index
    }));

    return [
      {
        label: data?.problemLabel || "The Old Way",
        headline: data?.problemHeadline || "Searching shouldn't feel like",
        highlight: data?.problemHeadlineHighlight || "detective work.",
        description: data?.problemDescription || "You don't remember filenames. You remember moments - a conversation, a location, a feeling. Traditional systems force you to think like a machine.",
        points: baseProblemPoints,
        kind: "problem"
      },
      ...featureItems
    ];
  }, [data, featureSections]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = window.setInterval(() => {
      setIsFading(true);
      window.setTimeout(() => {
        setActiveIndex((current) => (current + 1) % slides.length);
        setIsFading(false);
      }, FADE_MS);
    }, ROTATE_MS);

    return () => window.clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    setActiveIndex(0);
    setIsFading(false);
  }, [slides]);

  const currentSlide = slides[activeIndex] || slides[0];
  const bg = darkMode ? "transparent" : "#fff";
  const cardBg = darkMode ? "#141414" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const barBg = darkMode ? "#1c1c1c" : "#f5f5f5";
  const barBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const text = darkMode ? "#f0ede8" : C.dark;
  const muted = darkMode ? "#eeeae9" : "#888";
  const bodyColor = darkMode ? "rgba(240,237,232,0.7)" : "rgba(26,26,26,0.6)";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="problem-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }}>
          <div
            className="reveal"
            style={{
              background: cardBg,
              border: `1.5px solid ${cardBorder}`,
              borderRadius: 32,
              overflow: "hidden",
              boxShadow: darkMode ? "0 8px 32px rgba(0,0,0,0.2)" : "0 8px 32px rgba(0,0,0,0.06)",
              opacity: isFading ? 0 : 1,
              transform: `translateY(${isFading ? 8 : 0}px)`,
              transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease`
            }}
          >
            <div style={{ background: barBg, padding: "13px 16px", display: "flex", gap: 8, alignItems: "center", borderBottom: `1px solid ${barBorder}` }}>
              {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />)}
              <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "#bbb", fontSize: 11, fontFamily: "'Roboto Mono', monospace", marginLeft: 6 }}>
                {currentSlide.kind === "problem" ? "File Explorer" : "Flash Index Preview"}
              </span>
            </div>
            <div style={{ padding: 24 }}>
              {currentSlide.kind === "problem" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, background: darkMode ? "#1c1c1c" : "#fafafa", border: `1px solid ${barBorder}`, borderRadius: 12, padding: "12px 14px", marginBottom: 16 }}>
                    <span style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc" }}>Search</span>
                    <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc" }}>goa trip photo...</span>
                  </div>
                  <div style={{ textAlign: "center", padding: "42px 20px", background: darkMode ? "#1c1c1c" : "#fafafa", borderRadius: 16, border: `1.5px dashed ${darkMode ? "rgba(255,255,255,0.08)" : "#eee"}`, marginBottom: 16 }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>0</div>
                    <div style={{ color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc", fontSize: 13, fontWeight: 600 }}>No results found</div>
                    <div style={{ color: darkMode ? "rgba(255,255,255,0.1)" : "#ddd", fontSize: 11, marginTop: 6, fontFamily: "'Roboto Mono', monospace" }}>Try an exact filename</div>
                  </div>
                  {["Documents/Work/2023/Q3/", "File_not_final_FINAL_v3.docx", "IMG_20231108_unknown.heic", "Untitled Folder (2)/photo.jpg"].map(f => (
                    <div key={f} style={{ padding: "8px 10px", fontSize: 11, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc", fontFamily: "'Roboto Mono', monospace", borderTop: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#f5f5f5"}`, display: "flex", gap: 6, overflow: "hidden" }}>
                      <span>Folder</span>
                      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f}</span>
                    </div>
                  ))}
                </>
              ) : (
                <FeaturePreview index={currentSlide.featureIndex || 0} />
              )}
            </div>
          </div>

          <div style={{ opacity: isFading ? 0 : 1, transform: `translateY(${isFading ? 8 : 0}px)`, transition: `opacity ${FADE_MS}ms ease, transform ${FADE_MS}ms ease` }}>
            {currentSlide.kind === "problem" ? (
              <>
                <div className="reveal"><SectionLabel>{currentSlide.label}</SectionLabel></div>
                <h2 className="reveal reveal-d1" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, color: text, marginBottom: 24 }}>
                  {currentSlide.headline}{" "}
                  <span style={{ color: C.orange }}>{currentSlide.highlight}</span>
                </h2>
              </>
            ) : (
              <>
                <div className="reveal reveal-d2" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
                  <div style={{ width: 40, height: 40, background: darkMode ? "rgba(251,91,21,0.12)" : "rgba(251,91,21,0.1)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: C.orange }}>
                    {currentSlide.featureIndex === 0 ? <Search size={20} /> : currentSlide.featureIndex === 1 ? <Cloud size={20} /> : currentSlide.featureIndex === 2 ? <ImageIcon size={20} /> : currentSlide.featureIndex === 3 ? <Layout size={20} /> : <Maximize size={20} />}
                  </div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: darkMode ? "rgba(251,91,21,0.12)" : "#fff3ee", border: `1.5px solid ${darkMode ? "rgba(251,91,21,0.3)" : "#ffd4c2"}`, borderRadius: 100, padding: "5px 14px", fontSize: 11, fontFamily: "'Roboto Mono', monospace", color: C.orange, letterSpacing: "1.5px", textTransform: "uppercase" }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.orange, display: "inline-block" }} />
                    {currentSlide.label}
                  </div>
                </div>
                <h2 className="reveal reveal-d1" style={{ fontSize: "clamp(32px,4vw,52px)", fontWeight: 900, letterSpacing: "-1.5px", lineHeight: 1.1, color: text, marginBottom: 24 }}>
                  {currentSlide.headline}
                </h2>
              </>
            )}
            <p className="reveal reveal-d2" style={{ fontSize: 17, color: muted, lineHeight: 1.8, marginBottom: 36 }}>
              {currentSlide.description}
            </p>
            <div className="reveal reveal-d3" style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 28 }}>
              {currentSlide.points.map((p: string, index: number) => (
                <div key={`${p}-${index}`} style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: darkMode ? "rgba(251,91,21,0.1)" : "rgba(251,91,21,0.08)", border: `1.5px solid ${darkMode ? "rgba(251,91,21,0.25)" : "rgba(251,91,21,0.18)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {currentSlide.kind === "problem" ? <span style={{ fontSize: 11, color: C.red }}>x</span> : <CheckIcon color={C.orange} />}
                  </div>
                  <span style={{ fontSize: 14, color: bodyColor, fontWeight: currentSlide.kind === "feature" ? 700 : 400 }}>{p}</span>
                </div>
              ))}
            </div>
            <button className="fi-btn-secondary reveal reveal-d3" onClick={() => onNavigate?.("features")}>
              View all features
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
