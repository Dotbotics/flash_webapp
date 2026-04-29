/**
 * SECTIONS/DEMO.TSX
 * 
 * What it does:
 * Provides an interactive, live-search demo within the landing page.
 * 
 * Why it exists:
 * To let users experience the "magic" of Flash Index without needing 
 * to sign up or connect their own storage first.
 * 
 * How it works:
 * - Features multiple tabs representing different search scenarios 
 *   (Personal, Work, Finance, Video).
 * - Clicking a tab updates the search query and the displayed results.
 * - Uses React state (useState) to track the active demo scenario.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { useState } from "react";
import { C, FlickIcon, SectionLabel, useReveal } from "./shared";

const DEMOS = [
  {
    label: "Personal Memory",
    videoId: "Q3Fv3N5gxbU",
    query: "sunset photo from Goa trip with friends",
    time: "0.19s",
    results: [
      { name: "goa_sunset_beach.jpg", type: "Image � Google Photos", icon: "??", score: 98, size: "4.2 MB" },
      { name: "Goa_Trip_Album_Jun23.zip", type: "Archive � Drive", icon: "??", score: 84, size: "820 MB" },
      { name: "Friends_Goa_Day2.heic", type: "Image � iCloud", icon: "???", score: 79, size: "6.1 MB" },
    ],
  },
  {
    label: "Work Document",
    query: "client presentation from March last year",
    time: "0.21s",
    results: [
      { name: "ClientDeck_Mar2024_v4.pptx", type: "Slides � SharePoint", icon: "??", score: 96, size: "14 MB" },
      { name: "Q1_Meeting_Notes.docx", type: "Doc � OneDrive", icon: "??", score: 81, size: "0.9 MB" },
      { name: "ClientBrief_Final.pdf", type: "PDF � Dropbox", icon: "??", score: 74, size: "2.2 MB" },
    ],
  },
  {
    label: "Finance & Tax",
    query: "Amazon invoice around Diwali last year",
    time: "0.17s",
    results: [
      { name: "Amazon_INV_Oct23_Diwali.pdf", type: "PDF � Gmail", icon: "??", score: 97, size: "0.3 MB" },
      { name: "Oct_Expenses_2023.xlsx", type: "Sheet � Drive", icon: "??", score: 82, size: "1.1 MB" },
      { name: "Diwali_Shopping_Oct23.pdf", type: "PDF � Drive", icon: "???", score: 77, size: "0.8 MB" },
    ],
  },
  {
    label: "Video & Media",
    query: "dad's birthday surprise party video",
    time: "0.24s",
    results: [
      { name: "Dad_Birthday_Surprise.mp4", type: "Video � Google Photos", icon: "??", score: 99, size: "1.2 GB" },
      { name: "Birthday_Celebration_2023.mov", type: "Video � Drive", icon: "??", score: 88, size: "800 MB" },
      { name: "Family_Apr2023_Highlights.mp4", type: "Video � iCloud", icon: "??", score: 72, size: "420 MB" },
    ],
  },
];

function getYouTubeVideoId(value?: string) {
  if (!value) return "";

  const trimmed = value.trim();
  const match = trimmed.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
  return match?.[1] || trimmed;
}

export function DemoSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const [active, setActive] = useState(0);

  // Merge CMS-edited labels/query/results with defaults so existing saved rows still keep default video metadata.
  const demoData = Array.isArray(data?.demo)
    ? data.demo.map((item: any, index: number) => ({ ...(DEMOS[index] || {}), ...item }))
    : DEMOS;
  const demo = demoData[active] || DEMOS[active];

  const bg = darkMode ? "transparent" : "#fff";
  const text = darkMode ? "#f0ede8" : C.dark;
  const cardBg = darkMode ? "#141414" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const barBg = darkMode ? "#1c1c1c" : "#f8f8f8";
  const barBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const sidebarBg = darkMode ? "#181818" : "#fafafa";
  const sidebarBorder = darkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0";
  const muted = darkMode ? "#eeeae9" : "#aaa";
  // Check if the current tab has a videoId defined (for any tab, not just "Personal Memory")
  const videoId = getYouTubeVideoId(demo?.videoId || demo?.videoUrl);
  const hasVideo = videoId !== "";

  return (
    <section id="demo" ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 56 }}>
          <SectionLabel>{data?.demoLabel || "Live Demo"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", color: text, lineHeight: 1.05 }}>
            {data?.demoHeadline || "See it in action."}
          </h2>
        </div>

        <div className="reveal" style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 40, flexWrap: "wrap" }}>
          {demoData.map((d: any, i: number) => (
            <button key={i} className={`demo-tab-btn ${active === i ? "active" : ""}`} onClick={() => setActive(i)}>
              {d.label}
            </button>
          ))}
        </div>

        {hasVideo ? (
          <div className="reveal" style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 20, overflow: "hidden", boxShadow: darkMode ? "0 20px 60px rgba(0,0,0,0.3)" : "0 20px 60px rgba(0,0,0,0.08)" }}>
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: darkMode ? "#111" : "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                title={demo.label}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0 }}
              />
            </div>
          </div>
        ) : (
          <div className="reveal" style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 20, overflow: "hidden", boxShadow: darkMode ? "0 20px 60px rgba(0,0,0,0.3)" : "0 20px 60px rgba(0,0,0,0.08)" }}>
            <div style={{ background: barBg, padding: "13px 20px", display: "flex", gap: 8, alignItems: "center", borderBottom: `1px solid ${barBorder}` }}>
              {["#ff5f57", "#ffbd2e", "#28c840"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
              <div style={{ flex: 1, background: darkMode ? "#141414" : "#eee", borderRadius: 6, padding: "5px 14px", fontSize: 11, fontFamily: "'Roboto Mono', monospace", color: muted, textAlign: "center" }}>
                app.flashindex.ai
              </div>
            </div>

            <div className="demo-layout" style={{ display: "grid", gridTemplateColumns: "220px 1fr" }}>
              <div style={{ borderRight: `1px solid ${sidebarBorder}`, padding: "20px 16px", background: sidebarBg, minHeight: 400 }}>
                <div style={{ fontSize: 9, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc", fontFamily: "'Roboto Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 14 }}>Connected Sources</div>
                {["Google Drive", "Dropbox", "SharePoint", "iCloud", "Gmail"].map(s => (
                  <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8, marginBottom: 4, background: "transparent" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#28c840", flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: darkMode ? "rgba(255,255,255,0.3)" : "#999" }}>{s}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${sidebarBorder}`, marginTop: 16, paddingTop: 14 }}>
                  <div style={{ fontSize: 9, color: darkMode ? "rgba(255,255,255,0.2)" : "#ccc", fontFamily: "'Roboto Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>Search History</div>
                  {demoData.map((d: any, i: number) => (
                    <div key={i} onClick={() => setActive(i)} style={{ fontSize: 11, color: i === active ? C.orange : (darkMode ? "rgba(255,255,255,0.2)" : "#ccc"), padding: "5px 8px", borderRadius: 6, cursor: "pointer", transition: "color 0.2s", fontFamily: "'Roboto Mono', monospace", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>
                      {d.query.slice(0, 26)}�
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: "24px 28px" }}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", background: darkMode ? "rgba(251,91,21,0.1)" : "#fff8f5", border: `1.5px solid ${darkMode ? "rgba(251,91,21,0.4)" : "rgba(251,91,21,0.3)"}`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, boxShadow: "0 0 0 4px rgba(251,91,21,0.06)" }}>
                  <FlickIcon size={16} />
                  <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 14, color: text, flex: 1 }}>
                    "{demo.query}"
                  </span>
                  <span style={{ background: `linear-gradient(135deg,${C.orange},${C.red})`, color: "#fff", padding: "4px 12px", borderRadius: 6, fontSize: 10, fontFamily: "'Roboto Mono', monospace", fontWeight: 700 }}>
                    {demo.time}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: muted, fontFamily: "'Roboto Mono', monospace" }}>
                    {demo.results.length} results across 5 sources
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {['Relevance', 'Date', 'Size'].map((s, i) => (
                      <span key={s} style={{ fontSize: 11, color: i === 0 ? C.orange : muted, fontFamily: "'Roboto Mono', monospace", cursor: "pointer", padding: "3px 8px", borderRadius: 4, background: i === 0 ? (darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee") : "transparent", fontWeight: i === 0 ? 700 : 400 }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                {demo?.results?.map((r: any, i: number) => (
                  <div
                    key={`${active}-${i}`}
                    style={{
                      display: "flex", alignItems: "center", gap: 16,
                      padding: "16px 18px", borderRadius: 12,
                      background: i === 0 ? (darkMode ? "rgba(251,91,21,0.05)" : "#fff8f5") : (darkMode ? "#1c1c1c" : "#fafafa"),
                      border: `1.5px solid ${i === 0 ? "rgba(251,91,21,0.25)" : (darkMode ? "rgba(255,255,255,0.05)" : "#f0f0f0")}`,
                      marginBottom: 10, cursor: "pointer",
                      transition: "all 0.2s ease",
                      animation: `resultSlide 0.35s ${i * 0.1}s ease both`,
                    }}
                  >
                    <div style={{ width: 44, height: 44, borderRadius: 11, background: i === 0 ? (darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee") : (darkMode ? "#262626" : "#f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: muted, fontFamily: "'Roboto Mono', monospace", marginTop: 3 }}>{r.type} � {r.size}</div>
                    </div>
                    <div style={{ width: 90, flexShrink: 0 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 9, color: muted, fontFamily: "'Roboto Mono', monospace" }}>match</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: i === 0 ? C.orange : muted, fontFamily: "'Roboto Mono', monospace" }}>{r.score}%</span>
                      </div>
                      <div style={{ height: 4, background: darkMode ? "#262626" : "#eee", borderRadius: 2, overflow: "hidden" }}>
                        <div style={{ height: "100%", borderRadius: 2, width: `${r.score}%`, background: i === 0 ? `linear-gradient(90deg,${C.orange},${C.gold})` : (darkMode ? "#444" : "#ddd"), transition: "width 0.8s ease" }} />
                      </div>
                    </div>
                    {i === 0 && (
                      <div style={{ fontSize: 9, background: darkMode ? "rgba(251,91,21,0.1)" : "#fff3ee", color: C.orange, padding: "4px 8px", borderRadius: 5, fontWeight: 700, fontFamily: "'Roboto Mono', monospace", letterSpacing: "0.5px", flexShrink: 0, border: `1px solid ${darkMode ? "rgba(251,91,21,0.3)" : "#ffd4c2"}` }}>
                        BEST MATCH
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
