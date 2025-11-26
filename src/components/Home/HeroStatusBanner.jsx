import React from "react";

/**
 * @component
 * @description Renders a status banner for displaying the state of a form submission (e.g., sending, success, error).
 * The banner is only visible when the `phase` is not 'idle' or a `status` is present.
 * The message and styling of the banner change based on the `status`.
 *
 * @param {object} props - The component props.
 * @param {'idle' | 'launch' | 'return'} props.phase - The current phase of the submission animation.
 * @param {'success' | 'error' | null} props.status - The current status of the submission.
 * @returns {JSX.Element|null} The rendered status banner, or null if it should not be visible.
 */
function HeroStatusBanner({ phase, status }) {
  if (phase === "idle" && !status) {
    return null;
  }

  const classNames = [
    "tx-status",
    status === "success" ? "tx-status--success" : "",
    status === "error" ? "tx-status--error" : "",
  ].filter(Boolean).join(" ");

  let text = "Sending...";
  if (status === "success") text = "Transmission sent";
  if (status === "error") text = "Transmission failed";

  return (
    <div className={classNames} role="status" aria-live="polite">
      {text}
    </div>
  );
}

export default HeroStatusBanner;
