import { C, useReveal } from "./shared";

const DEFAULT_LOGOS = [
  { name: "Google" },
  { name: "Microsoft" },
  { name: "Dropbox" },
  { name: "Notion" },
  { name: "Atlassian" },
  { name: "Slack" },
  { name: "Box" },
  { name: "Zoom" },
  { name: "HubSpot" },
  { name: "Stripe" },
  { name: "Canva" },
  { name: "Figma" },
];

export function ClientLogosSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const logos = (data?.clientLogos && data.clientLogos.length > 0 ? data.clientLogos : DEFAULT_LOGOS).slice(0, 12);
  const marqueeLogos = [...logos, ...logos];

  const bg = darkMode ? "transparent" : "#fff";
  const text = darkMode ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.55)";
  const cardBg = darkMode ? "rgba(255,255,255,0.04)" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.08)" : "#ece7e5";

  return (
    <section ref={ref as any} style={{ padding: "48px 0", background: bg, borderBottom: `1px solid ${darkMode ? "rgba(255,255,255,0.05)" : "#eee"}` }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 32 }}>
          <span style={{ fontSize: 11, color: darkMode ? "rgba(255,255,255,0.3)" : "#999", fontFamily: "'Roboto Mono', monospace", letterSpacing: "2px", textTransform: "uppercase", fontWeight: 700 }}>
            {data?.clientLogosLabel || "Trusted by industry leaders"}
          </span>
        </div>

        <div className="reveal logo-marquee-shell" style={{ overflow: "hidden", maskImage: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
          <div className="logo-marquee-track" style={{ display: "flex", width: "max-content", gap: 16, animation: "logosMarquee 28s linear infinite" }}>
            {marqueeLogos.map((logo: any, i: number) => (
              <div
                key={`${logo.name}-${i}`}
                className="client-logo-card"
                style={{
                  width: 132,
                  height: 84,
                  padding: 16,
                  borderRadius: 20,
                  border: `1px solid ${cardBorder}`,
                  background: cardBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {logo.logo ? (
                  <img
                    src={logo.logo}
                    alt={logo.name}
                    referrerPolicy="no-referrer"
                    style={{ width: 88, height: 40, objectFit: "contain", filter: darkMode ? "brightness(0) invert(1)" : "grayscale(1)" }}
                  />
                ) : (
                  <span style={{ fontSize: 16, fontWeight: 800, color: text, letterSpacing: "-0.3px", textAlign: "center" }}>{logo.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
