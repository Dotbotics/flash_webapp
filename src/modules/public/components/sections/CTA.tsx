/**
 * SECTIONS/CTA.TSX
 * 
 * What it does:
 * The final call-to-action section at the bottom of the landing page.
 * 
 * Why it exists:
 * To provide one last push for the user to sign up or contact sales 
 * after they've scrolled through the entire page.
 * 
 * How it works:
 * - Features a large, gradient-filled box with a bold headline and 
 *   two call-to-action buttons.
 * - Uses 'useReveal' for entrance animations.
 * 
 * Connections:
 * - Depends on 'shared.tsx' for UI components and constants.
 * - Receives data and navigation handlers from 'Home.tsx'.
 * 
 * Module: Public / Components / Sections
 */

import { Link } from "react-router-dom";
import { C, FlickIcon, useReveal } from "./shared";

export function CTASection({ data, onNavigate, darkMode = false }: { data: any; onNavigate: (id: string) => void; darkMode?: boolean }) {
  const ref = useReveal();
  const bg = darkMode ? "transparent" : "#fafafa";

  return (
    <section ref={ref as any} style={{ padding: "0 0 80px", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal cta-panel" style={{
          background: darkMode 
            ? `linear-gradient(135deg, #2a0a00 0%, #3d1600 50%, #4a1c00 100%)`
            : `linear-gradient(135deg, ${C.red} 0%, ${C.orange} 50%, ${C.gold} 100%)`,
          backgroundSize: "200% 200%",
          animation: "gradShift 8s ease infinite",
          borderRadius: 24, padding: "88px 72px",
          position: "relative", overflow: "hidden",
          border: darkMode ? "1px solid rgba(251,91,21,0.2)" : "none",
        }}>
          {/* Subtle grid overlay */}
          <div style={{ position: "absolute", inset: 0, borderRadius: 24, backgroundImage: "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)", backgroundSize: "44px 44px" }} />
          {/* Floating Flick watermark */}
          <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%) rotate(-5deg)", opacity: 0.12, pointerEvents: "none" }}>
            <FlickIcon size={340} variant="white" />
          </div>

          <div style={{ position: "relative", zIndex: 1, maxWidth: 600 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.18)", borderRadius: 100, padding: "4px 14px", fontSize: 10, color: "rgba(255,255,255,0.85)", fontFamily: "'Roboto Mono', monospace", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: 24 }}>
              {data?.ctaBadge || "⚡ Start for free today"}
            </div>
            <h2 style={{ fontSize: "clamp(36px,5vw,64px)", fontWeight: 900, letterSpacing: "-2px", color: "#fff", lineHeight: 1.0, marginBottom: 20 }}>
              {data?.ctaHeadline || "Ready to find"}<br />{data?.ctaHeadlineHighlight || "what matters?"}
            </h2>
            <p style={{ fontSize: 18, color: "rgba(255,255,255,0.78)", lineHeight: 1.65, marginBottom: 40 }}>
              {data?.ctaDescription || "Stop searching. Start remembering. Connect your first storage in 60 seconds — no credit card, no migration, no hassle."}
            </p>
            <div className="cta-actions" style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <Link
                to={data?.ctaPrimaryButtonLink || '/pricing'}
                style={{ display: "inline-block", background: "#fff", color: darkMode ? "#fb5b15" : C.red, border: "none", padding: "16px 40px", borderRadius: 10, fontWeight: 900, fontSize: 16, cursor: "pointer", fontFamily: "'Inter', sans-serif", transition: "all 0.2s ease", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", textDecoration: "none" }}
                onMouseEnter={(e: any) => { e.target.style.transform = "translateY(-3px)"; e.target.style.boxShadow = "0 16px 40px rgba(0,0,0,0.2)"; }}
                onMouseLeave={(e: any) => { e.target.style.transform = "none"; e.target.style.boxShadow = "0 8px 24px rgba(0,0,0,0.15)"; }}
              >
                {data?.ctaPrimaryButton || "Get Started for Free →"}
              </Link>
              <Link 
                to={data?.ctaSecondaryButtonLink || '/contact'}
                style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.35)", padding: "16px 32px", borderRadius: 10, fontWeight: 600, fontSize: 16, cursor: "pointer", fontFamily: "'Inter', sans-serif", backdropFilter: "blur(12px)", textDecoration: "none" }}
              >
                {data?.ctaSecondaryButton || "Talk to Sales"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
