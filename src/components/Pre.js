import React from "react";

function Pre({ load }) {
  return (
    <div className={`preloader ${load ? "preloader--active" : "preloader--hidden"}`}>
      <div className="preloader-panels" aria-hidden="true">
        <span className="preloader-panel preloader-panel--top" />
        <span className="preloader-panel preloader-panel--center" />
        <span className="preloader-panel preloader-panel--bottom" />
      </div>
      <div className="preloader-core">
        <span className="preloader-ring preloader-ring--outer" />
        <span className="preloader-ring preloader-ring--inner" />
        <span className="preloader-spark" />
        <span className="preloader-katana" />
        <span className="preloader-text">Synchronizing battle HUD...</span>
      </div>
    </div>
  );
}

export default Pre;
