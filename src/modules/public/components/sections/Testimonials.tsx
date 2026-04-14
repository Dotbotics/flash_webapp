import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { C, SectionLabel, useReveal } from "./shared";
import { motion } from "motion/react";

export function TestimonialsSection({ data, darkMode = false }: { data: any; darkMode?: boolean }) {
  const ref = useReveal();
  const testimonials = data?.testimonials || [];
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const updateItemsPerPage = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(3);
      }
    };

    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  const pageCount = Math.max(1, Math.ceil(testimonials.length / itemsPerPage));

  useEffect(() => {
    setPage((current) => Math.min(current, pageCount - 1));
  }, [pageCount]);

  const visibleTestimonials = useMemo(() => {
    const start = page * itemsPerPage;
    return testimonials.slice(start, start + itemsPerPage);
  }, [itemsPerPage, page, testimonials]);

  if (testimonials.length === 0) return null;

  const bg = darkMode ? "transparent" : "#fafafa";
  const text = darkMode ? "#f0ede8" : C.dark;
  const cardBg = darkMode ? "#1c1c1c" : "#fff";
  const cardBorder = darkMode ? "rgba(255,255,255,0.05)" : "#eee";
  const muted = darkMode ? "#eeeae9" : "#666";
  const navBg = darkMode ? "rgba(255,255,255,0.08)" : "#fff";
  const navBorder = darkMode ? "rgba(255,255,255,0.12)" : "#e9e9e9";

  return (
    <section ref={ref as any} style={{ padding: "96px 0", background: bg }}>
      <div className="section-shell" style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px" }}>
        <div className="reveal" style={{ textAlign: "center", marginBottom: 64 }}>
          <SectionLabel darkMode={darkMode}>{data?.testimonialsLabel || "Success Stories"}</SectionLabel>
          <h2 style={{ fontSize: "clamp(36px,5vw,60px)", fontWeight: 900, letterSpacing: "-2px", color: text, lineHeight: 1.05 }}>
            {data?.testimonialsHeadline || "Trusted by teams"}<br />
            <span style={{ color: C.orange }}>{data?.testimonialsHeadlineHighlight || "around the world."}</span>
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${itemsPerPage}, minmax(0, 1fr))`, gap: 24 }}>
          {visibleTestimonials.map((t: any, i: number) => (
            <motion.div
              key={`${page}-${i}-${t.name}`}
              className={`reveal reveal-d${(i % 3) + 1}`}
              style={{
                background: cardBg,
                border: `1.5px solid ${cardBorder}`,
                borderRadius: 24,
                padding: 40,
                display: "flex",
                flexDirection: "column",
                gap: 24,
                minHeight: 320,
                boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                transition: "all 0.3s ease",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, borderColor: C.orange }}
            >
              <div style={{ fontSize: 16, lineHeight: 1.6, color: text, fontStyle: "italic", flexGrow: 1 }}>
                "{t.text}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                {t.image && (
                  <img
                    src={t.image}
                    alt={t.name}
                    referrerPolicy="no-referrer"
                    style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", border: `2px solid ${C.orange}` }}
                  />
                )}
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: text }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: muted, fontWeight: 600 }}>{t.company}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {pageCount > 1 && (
          <div className="reveal" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 28, flexWrap: "wrap" }}>
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => setPage((current) => (current === 0 ? pageCount - 1 : current - 1))}
              style={{
                width: 44,
                height: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: `1px solid ${navBorder}`,
                background: navBg,
                color: text,
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {Array.from({ length: pageCount }).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Go to testimonial page ${index + 1}`}
                  onClick={() => setPage(index)}
                  style={{
                    width: index === page ? 26 : 10,
                    height: 10,
                    borderRadius: 999,
                    border: "none",
                    background: index === page ? C.orange : (darkMode ? "rgba(255,255,255,0.18)" : "#d9d9d9"),
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => setPage((current) => (current + 1) % pageCount)}
              style={{
                width: 44,
                height: 44,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 999,
                border: `1px solid ${navBorder}`,
                background: navBg,
                color: text,
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
