import React, { memo } from "react";
import { createPortal } from "react-dom";
import { useDiscoveryStore } from "../store/useDiscoveryStore";

/**
 * Ancient Ruins themed start screen.
 * Uses global store to synchronize game state.
 */
const IntroOverlay = memo(() => {
  const gameStarted = useDiscoveryStore((s) => s.gameStarted);
  const startGame = useDiscoveryStore((s) => s.startGame);

  if (gameStarted) return null;

  const handleStart = () => {
    // Focus first to ensure keyboard events work
    window.focus();
    startGame();
  };

  return createPortal(
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "radial-gradient(circle, #2a1a0a 0%, #120900 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 5000,
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
        color: "#fff",
      }}
    >
      <div style={{
        padding: "40px",
        border: "2px solid rgba(212, 163, 115, 0.4)",
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(10px)",
        borderRadius: "4px",
        boxShadow: "0 0 100px rgba(212, 163, 115, 0.1)",
      }}>
        <div style={{
          fontSize: "12px",
          letterSpacing: "8px",
          color: "#d4a373",
          textTransform: "uppercase",
          marginBottom: "15px",
          fontWeight: 800
        }}>
          SANTOSH KUMAR
        </div>
        <h1 style={{
          fontSize: "48px",
          margin: 0,
          fontWeight: 900,
          letterSpacing: "-1px",
          color: "#fff",
          textShadow: "0 4px 20px rgba(0,0,0,0.5)"
        }}>
          Desert Artifacts
        </h1>
        <div style={{
          height: "2px",
          width: "60px",
          background: "#d4a373",
          margin: "25px auto"
        }} />

        <p style={{
          fontSize: "14px",
          color: "#aaa",
          maxWidth: "350px",
          lineHeight: "1.6",
          marginBottom: "40px",
          fontWeight: 500
        }}>
          Explore the ruins of my journey. Drive to glowing markers and park to uncover hidden portfolio artifacts.
        </p>

        <button
          onClick={handleStart}
          onMouseEnter={(e) => { e.target.style.background = "#fff"; e.target.style.color = "#000"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#fff"; }}
          style={{
            padding: "16px 45px",
            fontSize: "14px",
            fontWeight: 900,
            background: "transparent",
            color: "#fff",
            border: "3px solid #fff",
            borderRadius: "4px",
            cursor: "pointer",
            letterSpacing: "4px",
            textTransform: "uppercase",
            transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          ENTER RUINS
        </button>

        <div style={{ marginTop: "30px", fontSize: "10px", color: "#555", letterSpacing: "2px" }}>
          WASD TO DRIVE • MOUSE TO LOOK
        </div>
      </div>
    </div>,
    document.body
  );
});

IntroOverlay.displayName = "IntroOverlay";
export default IntroOverlay;
