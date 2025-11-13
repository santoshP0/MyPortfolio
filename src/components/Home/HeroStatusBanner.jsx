import React from "react";

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
