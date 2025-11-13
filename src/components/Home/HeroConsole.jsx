import React from "react";

function HeroConsole({ consoleCopy, onRevealContact }) {
  if (!consoleCopy) return null;

  return (
    <div className="hero-console">
      <span className="hero-console__halo" aria-hidden="true" />
      <div className="hero-console__ring hero-console__ring--outer" aria-hidden="true" />
      <div className="hero-console__ring hero-console__ring--inner" aria-hidden="true" />
      <div className="hero-console__shell">
        <span className="hero-console__tag">{consoleCopy.tag}</span>
        <div className="hero-console__status">
          <span className="hero-console__code">{consoleCopy.code}</span>
          <span className="hero-console__subtitle">{consoleCopy.subtitle}</span>
        </div>
        <button
          type="button"
          className="hero-console__cta"
          onClick={onRevealContact}
          aria-label="Reveal contact form"
        >
          <span className="hero-console__cta-glow" aria-hidden="true" />
          <span className="hero-console__cta-icon" aria-hidden="true">
            {consoleCopy.ctaIcon}
          </span>
          <span className="hero-console__cta-text">{consoleCopy.ctaText}</span>
        </button>
      </div>
    </div>
  );
}

export default HeroConsole;
