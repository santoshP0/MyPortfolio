import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAudioStore } from "../store/useAudioStore";
import { useDiscoveryStore } from "../store/useDiscoveryStore";

const SLIDER_STYLE = {
    width: "100%",
    accentColor: "#ff8800",
    cursor: "pointer",
    height: 4,
    marginTop: 6,
};

function VolumeRow({ label, icon, value, onChange }) {
    return (
        <div style={{ marginBottom: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                <span style={{ color: "#ffcc88", fontSize: 13, fontWeight: 600 }}>{icon} {label}</span>
                <span style={{ color: "#aaa", fontSize: 12, fontFamily: "monospace" }}>{Math.round(value * 100)}%</span>
            </div>
            <input
                type="range" min={0} max={1} step={0.01} value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={SLIDER_STYLE}
            />
        </div>
    );
}

function PauseSystem() {
    const paused = useDiscoveryStore((s) => s.paused);
    const setPaused = useDiscoveryStore((s) => s.setPaused);

    const engineVolume = useAudioStore((s) => s.engineVolume);
    const setEngineVolume = useAudioStore((s) => s.setEngineVolume);
    const interacting = useDiscoveryStore((s) => s.interacting);

    // ── ONLY Escape pauses the game. Nothing else. ────────────────────
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key !== "Escape" || interacting) return;
            const next = !paused;
            setPaused(next);
            if (next && document.pointerLockElement) document.exitPointerLock();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [paused, interacting, setPaused]);

    // ── Middle mouse toggles pointer lock WITHOUT pausing ─────────────
    useEffect(() => {
        const onMouseDown = (e) => {
            if (e.button !== 1) return;
            e.preventDefault();
            if (document.pointerLockElement) document.exitPointerLock();
            else { const c = document.querySelector("canvas"); if (c) c.requestPointerLock(); }
        };
        document.addEventListener("mousedown", onMouseDown);
        return () => document.removeEventListener("mousedown", onMouseDown);
    }, []);

    const handleResume = useCallback(() => {
        setPaused(false);
        const canvas = document.querySelector("canvas");
        if (canvas) canvas.requestPointerLock();
    }, []);

    if (!paused) return null;

    return createPortal(
        <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 3000, fontFamily: "'Segoe UI', sans-serif",
        }}>
            <div style={{
                background: "rgba(12,6,0,0.94)",
                border: "1px solid rgba(255,160,50,0.3)",
                borderRadius: 14, padding: "32px 36px", width: 340,
                boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
            }}>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, letterSpacing: 3 }}>⏸ PAUSED</div>
                    <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>Press Esc or click Resume to continue</div>
                </div>

                <div style={{
                    background: "rgba(255,140,30,0.06)", border: "1px solid rgba(255,140,30,0.18)",
                    borderRadius: 8, padding: "16px 18px", marginBottom: 24,
                }}>
                    <div style={{ color: "#ffcc66", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
                        🔊 Audio Settings
                    </div>
                    <VolumeRow label="Exploration Volume" icon="🚗" value={engineVolume} onChange={setEngineVolume} />
                    <button
                        onClick={() => {
                            // If volume is very low, set to 0.8, else mute to 0
                            setEngineVolume(engineVolume < 0.05 ? 0.8 : 0);
                        }}
                        style={{
                            marginTop: 4, width: "100%", padding: "7px 0",
                            background: engineVolume < 0.05 ? "rgba(255,80,0,0.25)" : "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,140,30,0.25)", borderRadius: 6,
                            color: "#ccc", fontSize: 12, cursor: "pointer", letterSpacing: 0.5,
                        }}
                    >
                        {engineVolume < 0.05 ? "🔇 Unmute All" : "🔇 Mute All"}
                    </button>
                </div>

                <button onClick={handleResume} style={{
                    width: "100%", padding: "13px 0", fontSize: "1rem",
                    background: "linear-gradient(135deg, #ff8800, #ff4400)",
                    color: "#fff", border: "none", borderRadius: 8, cursor: "pointer",
                    fontWeight: 700, letterSpacing: 1, boxShadow: "0 4px 24px rgba(255,100,0,0.35)",
                }}>
                    ▶ Resume
                </button>

                <div style={{ color: "#666", fontSize: 10, textAlign: "center", marginTop: 12 }}>
                    Press <kbd style={{ background: "#222", padding: "1px 5px", borderRadius: 3, color: "#aaa" }}>Esc</kbd> to toggle pause
                    &nbsp;·&nbsp; <strong style={{ color: "#555" }}>Middle mouse</strong> toggles cursor
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PauseSystem;
