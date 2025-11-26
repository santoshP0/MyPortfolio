import React from "react";

/**
 * @component
 * @description Renders a card for displaying a single statistic in the hero section.
 * It can show a label, a value, and an optional progress bar. The component
 * also supports animations for the value.
 *
 * @param {object} props - The component props.
 * @param {string} props.label - The label for the statistic.
 * @param {string} props.value - The value of the statistic.
 * @param {boolean} [props.animate=false] - If true, applies a heartbeat animation to the value.
 * @param {boolean} [props.visible=true] - If false, the value is hidden (e.g., for transitioning).
 * @param {object} [props.progress] - Optional. An object to configure a progress bar.
 * @param {number} props.progress.percent - The percentage to fill the progress bar.
 * @param {string} props.progress.ariaText - The accessible text for the progress bar.
 * @returns {JSX.Element} The rendered statistic card component.
 */
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
