import React from "react";

function HeroStatCard({ label, value, animate, visible, progress }) {
  return (
    <div className="hero-stat-card">
      <span className="hero-stat-label">{label}</span>
      <span
        className={[
          "hero-stat-value",
          animate ? "hero-stat-value--heartbeat" : "",
          visible ? "" : "hero-stat-value--hidden",
        ].filter(Boolean).join(" ")}
      >
        {value}
      </span>
      {progress ? (
        <div className="hero-stat-progress">
          <div
            className="hero-stat-progress__bar"
            role="progressbar"
            aria-valuenow={Math.round(progress.percent)}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuetext={progress.ariaText}
            aria-label="Experience progress"
            title={progress.ariaText}
          >
            <span
              className="hero-stat-progress__fill"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default HeroStatCard;
