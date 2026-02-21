import React from "react";
import { createPortal } from "react-dom";
import { useTargetedObjectStore } from "../store/useTargetedObjectStore";

function HealthBarHUD() {
  const { targetedObjectId, targetedObjectHealth, targetedObjectInitialHealth } = useTargetedObjectStore();

  if (!targetedObjectId || targetedObjectHealth <= 0) return null;

  const healthPercentage = (targetedObjectHealth / targetedObjectInitialHealth) * 100;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px",
        borderRadius: "5px",
        zIndex: 1000,
        width: "200px",
        textAlign: "center",
      }}
    >
      <h3>Target Health</h3>
      <div
        style={{
          width: "100%",
          height: "10px",
          background: "gray",
          borderRadius: "3px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${healthPercentage}%`,
            height: "100%",
            background: healthPercentage > 50 ? "lightgreen" : healthPercentage > 20 ? "orange" : "red",
            transition: "width 0.2s ease-in-out",
          }}
        ></div>
      </div>
      <p>{targetedObjectHealth} / {targetedObjectInitialHealth}</p>
    </div>,
    document.body
  );
}

export default HealthBarHUD;
