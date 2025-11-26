import React from "react";

/**
 * @component
 * @description Renders an interactive, console-themed component for the hero section.
 * This component displays status information and includes a call-to-action (CTA) button
 * that triggers an event to reveal a contact form.
 *
 * @param {object} props - The component props.
 * @param {object} props.consoleCopy - An object containing the text and icons to be displayed.
 * @param {string} props.consoleCopy.tag - A tag line.
 * @param {string} props.consoleCopy.code - A status code.
 * @param {string} props.consoleCopy.subtitle - A subtitle message.
 * @param {string} props.consoleCopy.ctaIcon - The icon for the CTA button.
 * @param {string} props.consoleCopy.ctaText - The text for the CTA button.
 * @param {function(): void} props.onRevealContact - A callback function to be executed when the CTA button is clicked.
 * @returns {JSX.Element|null} The rendered hero console component, or null if `consoleCopy` is not provided.
 */
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
