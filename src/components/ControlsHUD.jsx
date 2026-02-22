import React, { memo } from "react";
import { useDiscoveryStore } from "../store/useDiscoveryStore";

/**
 * Exploration HUD — top-right corner.
 * Shows driving controls and the new discovery mechanic.
 */
const ControlsHUD = memo(() => {
    const gameStarted = useDiscoveryStore((s) => s.gameStarted);
    if (!gameStarted) return null;

    return (
        <div
            style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "rgba(10, 5, 0, 0.85)",
                border: "1px solid rgba(212, 163, 115, 0.3)",
                borderRadius: "12px",
                padding: "16px 20px",
                fontFamily: "'Inter', sans-serif",
                pointerEvents: "none",
                zIndex: 500,
                backdropFilter: "blur(12px)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                minWidth: 180,
            }}
        >
            <div
                style={{
                    color: "#d4a373",
                    fontSize: 10,
                    fontWeight: 800,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    marginBottom: 12,
                    borderBottom: "1px solid rgba(212, 163, 115, 0.2)",
                    paddingBottom: 6,
                }}
            >
                Explorer Guide
            </div>
            {[
                ["W / S", "Drive / Reverse"],
                ["A / D", "Steer"],
                ["Mouse", "Look Around"],
                ["E", "Interact with Stone"],
                ["Esc", "Pause / Back"],
            ].map(([key, label]) => (
                <div
                    key={key}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 6,
                    }}
                >
                    <kbd
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: "4px",
                            padding: "2px 8px",
                            color: "#fff",
                            fontSize: 11,
                            fontWeight: 700,
                            fontFamily: "monospace",
                            marginRight: 10,
                        }}
                    >
                        {key}
                    </kbd>
                    <span style={{ color: "#888", fontSize: 11, fontWeight: 500 }}>{label}</span>
                </div>
            ))}
            <div
                style={{
                    color: "#d4a373",
                    fontSize: 10,
                    marginTop: 12,
                    borderTop: "1px solid rgba(212, 163, 115, 0.15)",
                    paddingTop: 8,
                    textAlign: "center",
                    fontWeight: 600,
                    lineHeight: 1.4,
                }}
            >
                ✨ Park inside beacons to reveal projects
            </div>
        </div>
    );
});

ControlsHUD.displayName = "ControlsHUD";
export default ControlsHUD;
