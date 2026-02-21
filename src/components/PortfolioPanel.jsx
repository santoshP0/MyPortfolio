import React from "react";
import { createPortal } from "react-dom";

function PortfolioPanel({ content, onClose }) {
  if (!content) return null;

  return createPortal(
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "20px",
        borderRadius: "10px",
        maxWidth: "500px",
        zIndex: 1000,
      }}
    >
      <h2>{content.title}</h2>
      <p>{content.description}</p>
      {content.links && (
        <div>
          {content.links.map((link, index) => (
            <a
              key={index}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", marginRight: "10px" }}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <button
        onClick={onClose}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>,
    document.body
  );
}

export default PortfolioPanel;
