import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useAudioStore } from "../store/useAudioStore";

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
                <span style={{ color: "#ffcc88", fontSize: 13, fontWeight: 600 }}>
                    {icon} {label}
                </span>
                <span style={{ color: "#aaa", fontSize: 12, fontFamily: "monospace" }}>
                    {Math.round(value * 100)}%
                </span>
            </div>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                style={SLIDER_STYLE}
            />
        </div>
    );
}

function PauseSystem() {
    const [paused, setPaused] = useState(false);

    const engineVolume = useAudioStore((s) => s.engineVolume);
    const shootVolume = useAudioStore((s) => s.shootVolume);
    const setEngineVolume = useAudioStore((s) => s.setEngineVolume);
    const setShootVolume = useAudioStore((s) => s.setShootVolume);

    // Track pointer lock state
    useEffect(() => {
        const onLockChange = () => setPaused(!document.pointerLockElement);
        document.addEventListener("pointerlockchange", onLockChange);
        return () => document.removeEventListener("pointerlockchange", onLockChange);
    }, []);

    // Escape key + Middle mouse button toggle pointer lock
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape" && document.pointerLockElement) document.exitPointerLock();
        };
        const onMouseDown = (e) => {
            if (e.button !== 1) return;
            e.preventDefault();
            if (document.pointerLockElement) document.exitPointerLock();
            else { const c = document.querySelector("canvas"); if (c) c.requestPointerLock(); }
        };
        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("mousedown", onMouseDown);
        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("mousedown", onMouseDown);
        };
    }, []);

    const handleResume = useCallback(() => {
        const canvas = document.querySelector("canvas");
        if (canvas) canvas.requestPointerLock();
    }, []);

    if (!paused) return null;

    return createPortal(
        <div
            style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0, 0, 0, 0.6)",
                backdropFilter: "blur(8px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 3000,
                fontFamily: "'Segoe UI', sans-serif",
            }}
        >
            <div
                style={{
                    background: "rgba(12, 6, 0, 0.92)",
                    border: "1px solid rgba(255, 160, 50, 0.3)",
                    borderRadius: 14,
                    padding: "32px 36px",
                    width: 340,
                    boxShadow: "0 8px 40px rgba(0,0,0,0.7)",
                }}
            >
                {/* Title */}
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                    <div style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, letterSpacing: 3 }}>
                        ⏸ PAUSED
                    </div>
                    <div style={{ color: "#aaa", fontSize: 12, marginTop: 4 }}>
                        Click Resume or press Enter to continue
                    </div>
                </div>

                {/* Volume section */}
                <div
                    style={{
                        background: "rgba(255,140,30,0.06)",
                        border: "1px solid rgba(255,140,30,0.18)",
                        borderRadius: 8,
                        padding: "16px 18px",
                        marginBottom: 24,
                    }}
                >
                    <div style={{ color: "#ffcc66", fontSize: 11, fontWeight: 700, letterSpacing: 2, marginBottom: 16, textTransform: "uppercase" }}>
                        🔊 Audio Settings
                    </div>

                    <VolumeRow
                        label="Engine Sound"
                        icon="🚗"
                        value={engineVolume}
                        onChange={setEngineVolume}
                    />
                    <VolumeRow
                        label="Bullet Sound"
                        icon="💥"
                        value={shootVolume}
                        onChange={setShootVolume}
                    />

                    {/* Mute All shortcut */}
                    <button
                        onClick={() => {
                            const allMuted = engineVolume === 0 && shootVolume === 0;
                            setEngineVolume(allMuted ? 0.8 : 0);
                            setShootVolume(allMuted ? 0.8 : 0);
                        }}
                        style={{
                            marginTop: 4,
                            width: "100%",
                            padding: "7px 0",
                            background: engineVolume === 0 && shootVolume === 0
                                ? "rgba(255,80,0,0.25)"
                                : "rgba(255,255,255,0.05)",
                            border: "1px solid rgba(255,140,30,0.25)",
                            borderRadius: 6,
                            color: "#ccc",
                            fontSize: 12,
                            cursor: "pointer",
                            letterSpacing: 0.5,
                        }}
                    >
                        {engineVolume === 0 && shootVolume === 0 ? "🔇 Unmute All" : "🔇 Mute All"}
                    </button>
                </div>

                {/* Resume button */}
                <button
                    onClick={handleResume}
                    style={{
                        width: "100%",
                        padding: "13px 0",
                        fontSize: "1rem",
                        background: "linear-gradient(135deg, #ff8800, #ff4400)",
                        color: "#fff",
                        border: "none",
                        borderRadius: 8,
                        cursor: "pointer",
                        fontWeight: 700,
                        letterSpacing: 1,
                        boxShadow: "0 4px 24px rgba(255,100,0,0.35)",
                    }}
                >
                    ▶ Resume
                </button>

                <div style={{ color: "#666", fontSize: 10, textAlign: "center", marginTop: 12 }}>
                    Press <kbd style={{ background: "#222", padding: "1px 5px", borderRadius: 3, color: "#aaa" }}>Esc</kbd> anytime to pause
                </div>
            </div>
        </div>,
        document.body
    );
}

export default PauseSystem;
