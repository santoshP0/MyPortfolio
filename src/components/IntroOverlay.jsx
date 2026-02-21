import React, { useState } from "react";
import { createPortal } from "react-dom";

function IntroOverlay() {
  const [started, setStarted] = useState(false);

  const handleClick = () => {
    setStarted(true);
    document.body.requestPointerLock(); // Lock pointer
  };

  if (started) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.9)",
        color: "white",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <h1>Drive through my portfolio</h1>
      <button
        onClick={handleClick}
        style={{
          marginTop: "20px",
          padding: "15px 30px",
          fontSize: "1.2em",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Click to Start
      </button>
    </div>,
    document.body
  );
}

export default IntroOverlay;
