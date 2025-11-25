import React, { useState, useEffect, useRef } from 'react';
import './AnimeCharacter.css';

const AnimeCharacter = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const characterRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!characterRef.current) return;

      const rect = characterRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const angleX = (e.clientY - centerY) / 50;
      const angleY = (e.clientX - centerX) / 50;

      setMousePosition({
        x: Math.max(-10, Math.min(10, angleY)),
        y: Math.max(-10, Math.min(10, angleX))
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Use placeholder image path - will be replaced with actual anime character
  const characterImage = '/anime-assets/hero-character.png';

  return (
    <div
      ref={characterRef}
      className={`anime-character ${isHovered ? 'anime-character--hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        '--mouse-x': `${mousePosition.x}deg`,
        '--mouse-y': `${mousePosition.y}deg`,
      }}
    >
      {/* Character container with parallax effect */}
      <div className="anime-character__container">
        {/* Character image with fallback */}
        <div className="anime-character__image-wrapper">
          <img
            src={characterImage}
            alt="Anime character illustration"
            className="anime-character__image"
            onError={(e) => {
              // Fallback to CSS-based character if image not found
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />

          {/* CSS fallback character */}
          <div className="anime-character__css-fallback" style={{ display: 'none' }}>
            <div className="anime-character__silhouette">
              <div className="anime-character__head">
                <div className="anime-character__hair"></div>
                <div className="anime-character__face">
                  <div className="anime-character__eyes">
                    <div className="anime-character__eye anime-character__eye--left"></div>
                    <div className="anime-character__eye anime-character__eye--right"></div>
                  </div>
                </div>
              </div>
              <div className="anime-character__body"></div>
            </div>
          </div>
        </div>

        {/* Glow effects */}
        <div className="anime-character__glow anime-character__glow--cyan"></div>
        <div className="anime-character__glow anime-character__glow--magenta"></div>

        {/* Particle effects */}
        <div className="anime-character__particles">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="anime-character__particle"
              style={{
                '--delay': `${i * 0.2}s`,
                '--position-x': `${Math.cos(i * 60 * Math.PI / 180) * 30}px`,
                '--position-y': `${Math.sin(i * 60 * Math.PI / 180) * 30}px`,
              }}
            />
          ))}
        </div>

        {/* Code/holographic elements */}
        <div className="anime-character__code-elements">
          <div className="anime-character__code-line anime-character__code-line--1"></div>
          <div className="anime-character__code-line anime-character__code-line--2"></div>
          <div className="anime-character__code-line anime-character__code-line--3"></div>
        </div>

        {/* Hover indicator */}
        <div className="anime-character__hover-indicator">
          <span className="anime-character__hover-text">
            {isHovered ? 'System Online' : 'Hover to Activate'}
          </span>
        </div>
      </div>

      {/* Floating badges/status indicators */}
      <div className="anime-character__status-badges">
        <div className="anime-character__badge anime-character__badge--coding">
          <span className="anime-character__badge-icon">{'</>'}</span>
        </div>
        <div className="anime-character__badge anime-character__badge--level">
          <span className="anime-character__badge-text">LV.42</span>
        </div>
        <div className="anime-character__badge anime-character__badge--status">
          <span className="anime-character__badge-text">READY</span>
        </div>
      </div>
    </div>
  );
};

export default AnimeCharacter;