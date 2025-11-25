import React from 'react';
import './AnimeButton.css';

const AnimeButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  onClick,
  type = 'button',
  ariaLabel,
  className = '',
  ...props
}) => {
  const baseClasses = [
    'anime-btn',
    `anime-btn--${variant}`,
    `anime-btn--${size}`,
    disabled ? 'anime-btn--disabled' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      {...props}
    >
      <span className="anime-btn__content">
        <span className="anime-btn__text">{children}</span>
        <span className="anime-btn__glow" aria-hidden="true" />
        <span className="anime-btn__particles" aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <span
              key={i}
              className="anime-btn__particle"
              style={{
                '--delay': `${i * 0.1}s`,
                '--angle': `${i * 60}deg`,
              }}
            />
          ))}
        </span>
      </span>
      <span className="anime-btn__border" aria-hidden="true" />
      <span className="anime-btn__sparkle" aria-hidden="true" />
    </button>
  );
};

export default AnimeButton;