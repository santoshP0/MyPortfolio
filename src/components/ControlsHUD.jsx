import React, { useState } from "react";
import { createPortal } from "react-dom";

const CONTROLS = [
    { key: "W / ↑", action: "Accelerate" },
    { key: "S / ↓", action: "Brake / Reverse" },
    { key: "A / ←", action: "Turn Left" },
    { key: "D / →", action: "Turn Right" },
    { key: "Space", action: "Shoot" },
    { key: "Esc", action: "Pause / Resume" },
];

function ControlsHUD() {
    const [visible, setVisible] = useState(true);

    return createPortal(
        <>
            {/* ── Controls panel — top-right ── */}
            {visible && (
                <div
                    style={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        background: "rgba(10, 5, 0, 0.75)",
                        backdropFilter: "blur(8px)",
                        border: "1px solid rgba(255,180,60,0.3)",
                        borderRadius: 10,
                        padding: "12px 16px",
                        minWidth: 210,
                        zIndex: 1500,
                        fontFamily: "'Segoe UI', sans-serif",
                        boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
                    }}
                >
                    <div style={{ color: "#ffcc66", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 8, textTransform: "uppercase" }}>
                        🎮 Controls
                    </div>
                    {CONTROLS.map(({ key, action }) => (
                        <div
                            key={key}
                            style={{ display: "flex", justifyContent: "space-between", gap: 16, marginBottom: 5 }}
                        >
                            <kbd style={{
                                background: "rgba(255,200,80,0.15)",
                                border: "1px solid rgba(255,200,80,0.4)",
                                borderRadius: 4,
                                padding: "2px 7px",
                                color: "#ffdd88",
                                fontSize: 11,
                                fontFamily: "monospace",
                                whiteSpace: "nowrap",
                            }}>
                                {key}
                            </kbd>
                            <span style={{ color: "#ddd", fontSize: 11, textAlign: "right" }}>{action}</span>
                        </div>
                    ))}
                    <div style={{ marginTop: 10, borderTop: "1px solid rgba(255,180,60,0.15)", paddingTop: 8, color: "#aaa", fontSize: 10 }}>
                        🎯 Destroy objects to unlock portfolio sections
                    </div>
                </div>
            )}

            {/* ── Toggle button — bottom-right, always visible ── */}
            <button
                onClick={() => setVisible((v) => !v)}
                title={visible ? "Hide Controls" : "Show Controls"}
                style={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    zIndex: 1600,
                    background: visible
                        ? "linear-gradient(135deg, #ff8800, #ff4400)"
                        : "rgba(20,10,0,0.75)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,180,60,0.4)",
                    borderRadius: 8,
                    color: "#fff",
                    fontFamily: "'Segoe UI', sans-serif",
                    fontSize: 12,
                    fontWeight: 600,
                    padding: "8px 14px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 2px 12px rgba(0,0,0,0.5)",
                    transition: "background 0.2s",
                    letterSpacing: 0.5,
                    userSelect: "none",
                }}
            >
                <span style={{ fontSize: 14 }}>⌨️</span>
                {visible ? "Hide Controls" : "Controls"}
            </button>
        </>,
        document.body
    );
}

export default ControlsHUD;
