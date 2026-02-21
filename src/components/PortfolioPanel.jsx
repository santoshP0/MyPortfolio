import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

/**
 * Animated "lift" panel — slides up from the bottom like an elevator
 * when a portfolio object is destroyed.
 */
function PortfolioPanel({ content, onClose }) {
  const panelRef = useRef();

  // Animate in on mount (lift up from bottom)
  useEffect(() => {
    if (!content || !panelRef.current) return;
    // Start off-screen below
    panelRef.current.style.transform = "translateY(110%)";
    panelRef.current.style.opacity = "0";
    const raf = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!panelRef.current) return;
        panelRef.current.style.transform = "translateY(0)";
        panelRef.current.style.opacity = "1";
      });
    });
    return () => cancelAnimationFrame(raf);
  }, [content]);

  if (!content) return null;

  // Category icon map
  const icons = {
    project: "🗿",
    skill: "📦",
    experience: "🪧",
    contact: "📡",
  };
  const icon = icons[content.category] ?? "✨";

  return createPortal(
    <>
      {/* Dim backdrop — click to close */}
      <div
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.35)",
          backdropFilter: "blur(2px)",
          zIndex: 1900,
        }}
      />

      {/* The lift panel */}
      <div
        ref={panelRef}
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%) translateY(110%)",
          width: "min(680px, 96vw)",
          background: "linear-gradient(170deg, rgba(18,9,2,0.97) 0%, rgba(30,15,3,0.97) 100%)",
          border: "1px solid rgba(255,160,50,0.35)",
          borderBottom: "none",
          borderRadius: "20px 20px 0 0",
          padding: "28px 32px 36px",
          zIndex: 2000,
          fontFamily: "'Segoe UI', sans-serif",
          boxShadow: "0 -12px 60px rgba(255,140,30,0.2)",
          transition: "transform 0.55s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease",
          opacity: 0,
        }}
      >
        {/* ── Top bar ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 28 }}>{icon}</span>
            <div>
              <div style={{ color: "#ffcc66", fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", marginBottom: 2 }}>
                {content.category ?? "Portfolio"}
              </div>
              <h2 style={{ margin: 0, color: "#fff", fontSize: "1.4rem", fontWeight: 700, lineHeight: 1.2 }}>
                {content.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: 8,
              color: "#aaa",
              width: 32, height: 32,
              fontSize: 16,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* ── Divider ── */}
        <div style={{ height: 1, background: "linear-gradient(90deg, rgba(255,160,50,0.4), transparent)", marginBottom: 20 }} />

        {/* ── Description ── */}
        <p style={{ color: "#ccc", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>
          {content.description}
        </p>

        {/* ── Tags / skills ── */}
        {content.tags && content.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {content.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "rgba(255,160,50,0.12)",
                  border: "1px solid rgba(255,160,50,0.3)",
                  borderRadius: 20,
                  padding: "4px 12px",
                  color: "#ffcc88",
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* ── Company / extra field ── */}
        {content.company && (
          <div style={{ color: "#888", fontSize: 13, marginBottom: 16 }}>
            🏢 {content.company}
          </div>
        )}

        {/* ── Links ── */}
        {content.links && content.links.length > 0 && (
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {content.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "10px 20px",
                  background: i === 0
                    ? "linear-gradient(135deg, #ff8800, #ff4400)"
                    : "rgba(255,255,255,0.06)",
                  border: i === 0
                    ? "none"
                    : "1px solid rgba(255,255,255,0.15)",
                  borderRadius: 8,
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                  boxShadow: i === 0 ? "0 4px 20px rgba(255,100,0,0.3)" : "none",
                  transition: "opacity 0.2s",
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* ── Bottom hint ── */}
        <div style={{ marginTop: 20, color: "#555", fontSize: 11, textAlign: "center" }}>
          Click outside or press the × to close and continue driving
        </div>
      </div>
    </>,
    document.body
  );
}

export default PortfolioPanel;
