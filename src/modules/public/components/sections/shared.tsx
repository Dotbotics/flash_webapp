/**
 * SECTIONS/SHARED.TSX
 * 
 * What it does:
 * A utility file containing shared UI components, constants, and hooks 
 * used specifically within the landing page sections.
 * 
 * Why it exists:
 * To avoid code duplication and maintain a consistent look and feel 
 * across the various sections of the home page.
 * 
 * How it works:
 * - Defines a color palette (C).
 * - Provides a 'FlickIcon' component for the brand logo.
 * - Provides a 'SectionLabel' for stylized section headers.
 * - Provides a 'useReveal' hook for scroll-triggered entrance animations.
 * 
 * Connections:
 * - Imported by almost every file in 'src/modules/public/components/sections/'.
 * 
 * Module: Public / Components / Sections
 */

import { useState, useEffect, useRef } from "react";

export const C = {
  orange: "#fb5b15",
  graphiteNight: "#262626",
  paperAsh: "#eeeae9",
  red: "#dc2312",
  gold: "#fcb900",
  dark: "#1a1a1a",
  mid: "#444",
  soft: "#888",
  border: "#eee",
  bg: "#fff",
  bgSoft: "#fafafa",
  bgWarm: "#fff8f5",
  homeDarkGradient: "radial-gradient(circle at top left, rgba(251,91,21,0.24), transparent 28%), radial-gradient(circle at 85% 15%, rgba(238,234,233,0.08), transparent 26%), linear-gradient(160deg, #262626 0%, #1c1c1c 52%, #262626 100%)",
  homeFullGradient: "radial-gradient(circle at 18% 12%, rgba(251,91,21,0.32), transparent 24%), radial-gradient(circle at 82% 10%, rgba(238,234,233,0.12), transparent 22%), radial-gradient(circle at 50% 55%, rgba(251,91,21,0.10), transparent 34%), linear-gradient(145deg, #262626 0%, #1f1f1f 48%, #fb5b15 100%)",
};

export function FlickIcon({ size = 28, variant = "orange" }: { size?: number; variant?: string }) {
  const fill = variant === "white" ? "#fff"
    : variant === "dark" ? C.dark
    : C.orange;
  return (
    <svg width={size} height={Math.round(size * 1.15)} viewBox="0 0 28 32" fill="none">
      <path d="M17 1L4 19h11L9 31 27 13H16L17 1z" fill={fill} />
    </svg>
  );
}

export function SectionLabel({ children, darkMode = false }: { children: any; darkMode?: boolean }) {
  return (
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: darkMode ? "rgba(255,255,255,0.1)" : "#fff3ee", 
      border: darkMode ? "1.5px solid rgba(255,255,255,0.2)" : "1.5px solid #ffd4c2",
      borderRadius: 100, padding: "5px 14px",
      fontSize: 11, fontFamily: "'Roboto Mono', monospace",
      color: darkMode ? "#fff" : C.orange, letterSpacing: "1.5px",
      textTransform: "uppercase", marginBottom: 20,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: darkMode ? "#fff" : C.orange, display: "inline-block" }} />
      {children}
    </div>
  );
}

export function useReveal() {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.querySelectorAll(".reveal").forEach(r => r.classList.add("visible"));
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }),
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}
