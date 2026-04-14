/**
 * SECTIONS/HERO.TSX
 * 
 * What it does:
 * The top-most section of the landing page, featuring a bold headline, 
 * call-to-action buttons, and an interactive browser mockup.
 * 
 * Why it exists:
 * To immediately grab the user's attention and communicate the core 
 * value proposition of Flash Index.
 * 
 * How it works:
 * - Uses a 'useTyping' hook to simulate a user typing a search query.
 * - Features a 'HeroMockup' that responds to mouse movements (tilt effect).
 * - Dynamically renders stats (e.g., "2M+ Files indexed") with a count-up animation.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data and navigation handlers from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { C, FlickIcon, SectionLabel } from "./shared";
import { ClientLogosSection } from "./ClientLogos";

const QUERIES = [
  "the sunset photo from our Goa trip with friends",
  "quarterly report with the red bar chart",
  "video from dad's birthday surprise party",
  "Amazon invoice around Diwali last year",
  "team offsite presentation Sarah shared",
];

function useTyping() {
  const [qi, setQi] = useState(0);
  const [text, setText] = useState("");
  const [phase, setPhase] = useState("type");
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const q = QUERIES[qi];
    let timer: any;
    if (phase === "type") {
      if (text.length < q.length) {
        timer = setTimeout(() => setText(q.slice(0, text.length + 1)), 55 + Math.random() * 25);
      } else {
        setShowResults(true);
        timer = setTimeout(() => setPhase("hold"), 2500);
      }
    } else if (phase === "hold") {
      timer = setTimeout(() => { setPhase("erase"); setShowResults(false); }, 800);
    } else {
      if (text.length > 0) {
        timer = setTimeout(() => setText(t => t.slice(0, -1)), 25);
      } else {
        setQi(i => (i + 1) % QUERIES.length);
        setPhase("type");
      }
    }
    return () => clearTimeout(timer);
  }, [text, phase, qi]);

  return { text, showResults };
}

function useCounter(target: number, duration = 1500, trigger = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!trigger) return;
    let start: number;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [trigger, target, duration]);
  return val;
}

const HERO_RESULTS = [
  { name: "goa_sunset_beach.jpg", type: "Image · Google Photos", icon: "🌅", score: 98, best: true },
  { name: "Goa_Trip_Album_Jun23.zip", type: "Archive · Drive", icon: "📦", score: 84, best: false },
  { name: "Friends_Goa_Day2.heic", type: "Image · iCloud", icon: "🏖️", score: 79, best: false },
];

function HeroMockup({ text, showResults, tilt, darkMode }: { text: string; showResults: boolean; tilt: { x: number; y: number }; darkMode: boolean }) {
  const cardBg = darkMode ? "#1c1c1c" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.1)" : "#eee";
  const barBg = darkMode ? "#262626" : "#f8f8f8";
  const barBorder = darkMode ? "rgba(255,255,255,0.1)" : "#eee";
  const urlBg = darkMode ? "#141414" : "#eee";
  const urlText = darkMode ? "rgba(255,255,255,0.4)" : "#999";
  const searchBg = showResults ? (darkMode ? "rgba(251,91,21,0.1)" : "#fff8f5") : (darkMode ? "#141414" : "#fafafa");
  const searchBorder = showResults ? C.orange : (darkMode ? "rgba(255,255,255,0.1)" : "#e0e0e0");
  const searchText = darkMode ? "#f0ede8" : "#333";
  const resultBg = darkMode ? "#1c1c1c" : "#fafafa";
  const resultBorder = darkMode ? "rgba(255,255,255,0.1)" : "#eee";
  const resultText = darkMode ? "#f0ede8" : C.dark;
  const muted = darkMode ? "#eeeae9" : "#666";

  return (
    <div style={{
      transform: `perspective(1000px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
      transition: "transform 0.1s ease",
      position: "relative",
    }}>
      {/* Main card */}
      <div style={{
        background: cardBg,
        border: `1.5px solid ${cardBorder}`,
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: darkMode ? "0 32px 80px rgba(0,0,0,0.4), 0 8px 24px rgba(0,0,0,0.2)" : "0 32px 80px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.06)",
      }}>
        {/* Browser bar */}
        <div style={{ background: barBg, padding: "13px 18px", display: "flex", alignItems: "center", gap: 8, borderBottom: `1px solid ${barBorder}` }}>
          {["#ff5f57","#ffbd2e","#28c840"].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
          <div style={{ flex: 1, background: urlBg, borderRadius: 6, padding: "5px 14px", fontSize: 11, fontFamily: "'Roboto Mono', monospace", color: urlText, textAlign: "center" }}>
            app.flashindex.ai
          </div>
        </div>

        <div style={{ padding: "22px 22px 20px" }}>
          {/* App logo inside */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
            <FlickIcon size={18} />
            <span style={{ fontWeight: 800, fontSize: 16, color: darkMode ? "#fff" : C.dark }}>
              Flash.<span style={{ color: C.orange }}>Index</span>
            </span>
          </div>

          {/* Search bar */}
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            background: searchBg,
            border: `1.5px solid ${searchBorder}`,
            borderRadius: 12, padding: "13px 16px", marginBottom: 16,
            boxShadow: showResults ? "0 0 0 4px rgba(251,91,21,0.08)" : "none",
            transition: "all 0.3s ease",
          }}>
            <FlickIcon size={16} />
            <span style={{ fontFamily: "'Roboto Mono', monospace", fontSize: 12, color: searchText, flex: 1 }}>
              {text}
              <span style={{ animation: "blink 1s infinite", color: C.orange, marginLeft: 1 }}>|</span>
            </span>
            {showResults && (
              <span style={{
                background: `linear-gradient(135deg,${C.orange},${C.red})`,
                color: "#fff", fontSize: 9, padding: "3px 8px",
                borderRadius: 5, fontFamily: "'Roboto Mono', monospace",
                fontWeight: 700, letterSpacing: "0.5px",
              }}>FOUND</span>
            )}
          </div>

          {/* Results */}
          <div style={{ minHeight: 180 }}>
            {showResults ? (
              <div>
                <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.3)" : "#bbb", fontFamily: "'Roboto Mono', monospace", marginBottom: 10 }}>
                  ⚡ 3 results · 0.21s
                </div>
                {HERO_RESULTS.map((r, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "11px 13px", borderRadius: 10,
                    background: r.best ? (darkMode ? "rgba(251,91,21,0.1)" : "#fff8f5") : resultBg,
                    border: `1.5px solid ${r.best ? "rgba(251,91,21,0.3)" : resultBorder}`,
                    marginBottom: 8,
                    animation: `resultSlide 0.35s ${i * 0.1}s ease both`,
                  }}>
                    <div style={{ width: 36, height: 36, borderRadius: 9, background: r.best ? (darkMode ? "rgba(251,91,21,0.15)" : "#fff3ee") : (darkMode ? "#262626" : "#f0f0f0"), display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: resultText, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                      <div style={{ fontSize: 10, color: darkMode ? "rgba(255,255,255,0.3)" : "#aaa", fontFamily: "'Roboto Mono', monospace" }}>{r.type}</div>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, color: r.best ? C.orange : (darkMode ? "rgba(255,255,255,0.2)" : "#ccc") }}>{r.score}%</div>
                      {r.best && <div style={{ fontSize: 8, color: C.orange, fontFamily: "'Roboto Mono', monospace", letterSpacing: "1px" }}>BEST</div>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: 180, gap: 10, color: darkMode ? "rgba(255,255,255,0.1)" : "#ddd" }}>
                <FlickIcon size={32} variant="soft" />
                <span style={{ fontSize: 12, fontFamily: "'Roboto Mono', monospace", color: darkMode ? "rgba(255,255,255,0.1)" : "#ddd" }}>Describe what you remember…</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <div style={{ position: "absolute", top: -14, left: -18, background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 10, padding: "8px 14px", fontSize: 11, color: darkMode ? "#fff" : "#333", fontFamily: "'Roboto Mono', monospace", boxShadow: "0 4px 16px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840", boxShadow: "0 0 6px #28c840", display: "inline-block" }} />
        AI Active
      </div>
      <div style={{ position: "absolute", bottom: -14, right: -10, background: cardBg, border: `1.5px solid ${cardBorder}`, borderRadius: 10, padding: "8px 14px", fontSize: 11, color: muted, fontFamily: "'Roboto Mono', monospace", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}>
        12+ cloud sources
      </div>
    </div>
  );
}

function useHeroTyping(words: string[]) {
  const [wordIndex, setWordIndex] = useState(0);
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [speed, setSpeed] = useState(150);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex];
    
    const handleTyping = () => {
      if (!isDeleting) {
        setText(currentWord.substring(0, text.length + 1));
        setSpeed(150);

        if (text === currentWord) {
          setTimeout(() => setIsDeleting(true), 2000);
          setSpeed(100);
        }
      } else {
        setText(currentWord.substring(0, text.length - 1));
        setSpeed(50);

        if (text === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
          setSpeed(500);
        }
      }
    };

    const timer = setTimeout(handleTyping, speed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, speed]);

  return text;
}

export function HeroSection({ data, onNavigate, darkMode = false, fullPageGradient = false }: { data: any; onNavigate: (id: string) => void; darkMode?: boolean; fullPageGradient?: boolean }) {
  const { text: mockupText, showResults } = useTyping();
  const dynamicWord = useHeroTyping(data?.heroHeadline2Words || ["remember", "think of", "need"]);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const statsRef = useRef(null);
  const [statsOn, setStatsOn] = useState(false);

  const stats = data?.stats || [];
  const muted = darkMode ? "#eeeae9" : "#666";
  const softMuted = darkMode ? "rgba(255,255,255,0.2)" : "#bbb";
  
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsOn(true); }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const onMove = (e: any) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({
      x: ((e.clientX - r.left) / r.width - 0.5) * 10,
      y: ((e.clientY - r.top) / r.height - 0.5) * -7,
    });
  };

  const heroBg = darkMode 
    ? "radial-gradient(circle at 18% 18%, rgba(251,91,21,0.34), transparent 26%), radial-gradient(circle at 82% 12%, rgba(238,234,233,0.10), transparent 24%), linear-gradient(145deg, #262626 0%, #1f1f1f 48%, #fb5b15 100%)" 
    : "linear-gradient(160deg, #fff 0%, #fff8f5 50%, #fff 100%)";
  const sectionBg = fullPageGradient ? "transparent" : heroBg;

  return (
    <section className="hero-section"
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center",
        padding: "130px 48px 80px",
        position: "relative", overflow: "hidden",
        background: sectionBg,
      }}
    >
      {/* Background decoration */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: darkMode ? "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.1) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(255,255,255,0.05) 0%, transparent 40%)" : "radial-gradient(circle at 70% 30%, rgba(251,91,21,0.06) 0%, transparent 55%), radial-gradient(circle at 10% 80%, rgba(220,35,18,0.04) 0%, transparent 40%)" }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: darkMode ? "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)" : "linear-gradient(rgba(251,91,21,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(251,91,21,0.04) 1px, transparent 1px)", backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse 80% 80% at 50% 30%, black 20%, transparent 80%)" }} />

      <div className="section-shell" style={{ maxWidth: 1200, width: "100%", margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "center" }}>
          {/* LEFT */}
          <div className="hero-copy" style={{ animation: "slideUp 0.8s ease both" }}>
            <SectionLabel darkMode={darkMode}>{data?.heroLabel}</SectionLabel>

            <h1 style={{ fontSize: "clamp(34px,5vw,62px)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-2.5px", color: darkMode ? "#fff" : C.dark, marginBottom: 24 }}>
              {data?.heroHeadline1}<br />
              <span style={{
                background: darkMode ? `linear-gradient(90deg,#fff,${C.orange})` : `linear-gradient(90deg, ${C.orange}, ${C.gold}, ${C.orange})`,
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation: darkMode ? "none" : "shimmer 3s linear infinite",
                color: "inherit"
              }}>
                {data?.heroHeadline2Base || "Just describe what you "}
                <span style={{ borderRight: darkMode ? "3px solid #fff" : `3px solid ${C.orange}`, paddingRight: 4 }}>{dynamicWord}</span>
              </span>
            </h1>

            <p style={{ fontSize: 18, color: darkMode ? "rgba(255,255,255,0.8)" : muted, lineHeight: 1.75, maxWidth: 440, marginBottom: 14 }}>
              {data?.heroDescription}
            </p>
            <p style={{ fontSize: 11, color: darkMode ? "rgba(255,255,255,0.5)" : softMuted, letterSpacing: "2px", fontFamily: "'Roboto Mono', monospace", textTransform: "uppercase", marginBottom: 40 }}>
              {data?.heroCloudSources}
            </p>

            <div className="hero-actions" style={{ display: "flex", gap: 14, marginBottom: 60, flexWrap: "wrap" }}>
              <Link 
                to={data?.heroPrimaryButtonLink || '/pricing'}
                className="fi-btn-primary"
                style={darkMode ? { background: "#fff", color: C.orange, boxShadow: "0 6px 28px rgba(255,255,255,0.2)" } : {}}
              >
                {data?.heroPrimaryButton || "Start for Free →"}
              </Link>
              <a 
                href={data?.heroSecondaryButtonLink || '#demo'}
                className="fi-btn-secondary"
                style={darkMode ? { color: "#fff", borderColor: "rgba(255,255,255,0.4)" } : {}}
                onClick={(e) => {
                  if (data?.heroSecondaryButtonLink?.startsWith('#')) {
                    e.preventDefault();
                    const el = document.querySelector(data?.heroSecondaryButtonLink || '#demo');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                {data?.heroSecondaryButton || "Watch Demo ▷"}
              </a>
            </div>

            {/* Stats */}
            <div className="hero-stats" ref={statsRef} style={{ display: "flex", gap: 48, flexWrap: "wrap" }}>
              {stats.map((s: any, i: number) => ( 
                <div key={i} style={{ animation: statsOn ? "countUp 0.6s ease both" : "none" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, color: darkMode ? "#fff" : C.orange, letterSpacing: "-1px", lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: 11, color: darkMode ? "rgba(255,255,255,0.5)" : softMuted, fontFamily: "'Roboto Mono', monospace", marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT */}
          <div className="hero-visual" style={{ animation: "slideUp 0.8s 0.15s ease both" }}>
            <HeroMockup text={mockupText} showResults={showResults} tilt={tilt} darkMode={darkMode} />
          </div>
        </div>

        {/* Client Logos — directly below the stats row */}
        <div style={{ marginTop: 64, position: "relative", zIndex: 1 }}>
          <ClientLogosSection data={data} darkMode={darkMode} />
        </div>
      </div>
    </section>
  );
}
