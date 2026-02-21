import React, { memo } from "react";

/**
 * Always-visible controls overlay — top-right corner.
 * pointerEvents: none so it never blocks mouse aim.
 */
const ControlsHUD = memo(() => {
    return (
        <div
            style={{
                position: "absolute",
                top: 10,
                right: 10,
                background: "rgba(18, 9, 0, 0.75)",
                border: "1px solid rgba(255, 140, 30, 0.25)",
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: "'Segoe UI', sans-serif",
                pointerEvents: "none",
                zIndex: 500,
                backdropFilter: "blur(4px)",
                minWidth: 140,
            }}
        >
            <div
                style={{
                    color: "#ffcc66",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    marginBottom: 7,
                    borderBottom: "1px solid rgba(255,140,30,0.2)",
                    paddingBottom: 4,
                }}
            >
                Controls
            </div>
            {[
                ["W / ↑", "Accelerate"],
                ["S / ↓", "Brake / Reverse"],
                ["A / ←", "Turn Left"],
                ["D / →", "Turn Right"],
                ["Left Click", "Shoot (aim)"],
                ["Space", "Auto-aim Shot"],
                ["Esc", "Pause / Resume"],
            ].map(([key, label]) => (
                <div
                    key={key}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 3,
                    }}
                >
                    <kbd
                        style={{
                            background: "rgba(255,255,255,0.08)",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 3,
                            padding: "1px 5px",
                            color: "#ffcc88",
                            fontSize: 10,
                            fontFamily: "monospace",
                            marginRight: 8,
                        }}
                    >
                        {key}
                    </kbd>
                    <span style={{ color: "#aaa", fontSize: 10 }}>{label}</span>
                </div>
            ))}
            <div
                style={{
                    color: "#555",
                    fontSize: 8.5,
                    marginTop: 6,
                    borderTop: "1px solid rgba(255,140,30,0.15)",
                    paddingTop: 4,
                    textAlign: "center",
                }}
            >
                🎯 Destroy targets to unlock portfolio
            </div>
        </div>
    );
});

ControlsHUD.displayName = "ControlsHUD";
export default ControlsHUD;
