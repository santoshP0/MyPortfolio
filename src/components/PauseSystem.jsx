import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * Handles Escape key to pause/resume pointer lock.
 * Shows a semi-transparent pause overlay with a "Resume" button.
 * The game itself continues running (physics, etc.) — only pointer is released.
 */
function PauseSystem() {
    const [paused, setPaused] = useState(false);

    // Called whenever pointer lock state changes (including Escape releasing it)
    useEffect(() => {
        const onLockChange = () => {
            const locked = !!document.pointerLockElement;
            setPaused(!locked);
        };
        document.addEventListener("pointerlockchange", onLockChange);
        return () => document.removeEventListener("pointerlockchange", onLockChange);
    }, []);

    // Explicit Escape handler to release pointer lock
    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape" && document.pointerLockElement) {
                document.exitPointerLock();
            }
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    const handleResume = useCallback(() => {
        const canvas = document.querySelector("canvas");
        if (canvas) canvas.requestPointerLock();
    }, []);

    if (!paused) return null;

    return createPortal(
        <div
            onClick={handleResume}
            style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.55)",
                backdropFilter: "blur(6px)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 3000,
                cursor: "pointer",
                userSelect: "none",
            }}
        >
            <div style={{ color: "#fff", fontSize: "2.5rem", fontWeight: 700, letterSpacing: 4, marginBottom: 16 }}>
                ⏸ PAUSED
            </div>
            <div style={{ color: "#ffcc88", fontSize: "1.1rem", opacity: 0.85 }}>
                Click anywhere or press Enter to resume
            </div>
            <button
                onClick={handleResume}
                style={{
                    marginTop: 24,
                    padding: "12px 36px",
                    fontSize: "1rem",
                    background: "linear-gradient(135deg, #ff8800, #ff4400)",
                    color: "#fff",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontWeight: 600,
                    letterSpacing: 1,
                    boxShadow: "0 4px 24px rgba(255,100,0,0.4)",
                }}
            >
                ▶ Resume
            </button>
            <div style={{ color: "#aaa", fontSize: "0.8rem", marginTop: 12 }}>
                Press <kbd style={{ background: "#333", padding: "2px 6px", borderRadius: 3 }}>Esc</kbd> to pause anytime
            </div>
        </div>,
        document.body
    );
}

export default PauseSystem;
