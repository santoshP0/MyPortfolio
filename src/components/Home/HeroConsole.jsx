import React, { useState } from "react";

function HeroConsole({ consoleCopy, onRevealContact }) {
  const [isHovered, setIsHovered] = useState(false);

  if (!consoleCopy) return null;

  return (
    <div className="hero-console anime-console">
      <span className="hero-console__halo anime-console__halo" aria-hidden="true" />
      <div className="hero-console__ring hero-console__ring--outer anime-console__ring" aria-hidden="true" />
      <div className="hero-console__ring hero-console__ring--inner anime-console__ring" aria-hidden="true" />

      {/* Anime-style digital particles */}
      <div className="anime-console__particles" aria-hidden="true">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="anime-console__particle"
            style={{
              '--delay': `${i * 0.3}s`,
              '--angle': `${i * 45}deg`,
            }}
          />
        ))}
      </div>

      <div className="hero-console__shell anime-console__shell">
        <span className="hero-console__tag anime-console__tag">
          {consoleCopy.tag}
          <span className="anime-console__tag-glow"></span>
        </span>
        <div className="hero-console__status anime-console__status">
          <span className="hero-console__code anime-console__code anime-glitch-text">
            {consoleCopy.code}
          </span>
          <span className="hero-console__subtitle anime-console__subtitle anime-glow-text">
            {consoleCopy.subtitle}
          </span>
        </div>

        {/* ASCII art anime emoticon */}
        <div className="anime-console__ascii-art" aria-hidden="true">
          <pre className="anime-console__ascii-content">
{`(￣︿￣) • ${consoleCopy.code ? 'SYSTEM_READY' : 'INITIALIZING'}
┌─────────────────────────┐
│  ／(^_^)＼ Transmission │
│  Ready for Connection   │
└─────────────────────────┘`}
          </pre>
        </div>

        <button
          type="button"
          className={`hero-console__cta anime-btn anime-sparkle ${isHovered ? 'anime-console__cta--hovered' : ''}`}
          onClick={onRevealContact}
          aria-label="Reveal contact form"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="hero-console__cta-glow anime-console__cta-glow" aria-hidden="true" />
          <span className="hero-console__cta-icon anime-console__cta-icon anime-glow-text" aria-hidden="true">
            {consoleCopy.ctaIcon}
          </span>
          <span className="hero-console__cta-text">{consoleCopy.ctaText}</span>

          {/* Anime sparkle effect on button */}
          {isHovered && (
            <span className="anime-console__sparkles" aria-hidden="true">
              {[...Array(3)].map((_, i) => (
                <span
                  key={i}
                  className="anime-console__sparkle"
                  style={{
                    '--delay': `${i * 0.1}s`,
                    '--position': `${-10 + i * 10}px`,
                  }}
                >
                  ✨
                </span>
              ))}
            </span>
          )}
        </button>
      </div>

      {/* Console border glow effect */}
      <div className="anime-console__border-glow" aria-hidden="true" />
    </div>
  );
}

export default HeroConsole;
