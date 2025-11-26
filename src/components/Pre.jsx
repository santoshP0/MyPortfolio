import React from "react";
import { PRELOADER_MESSAGE } from "../constants";

/**
 * @component
 * @description A preloader component that displays while the main application content is loading.
 * It features a custom animation and a text message. The visibility of the preloader
 * is controlled by the `load` prop.
 *
 * @param {object} props - The component props.
 * @param {boolean} props.load - A boolean that determines whether the preloader is active or hidden.
 * @returns {JSX.Element} The rendered preloader component.
 */
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
        <span className="preloader-text">{PRELOADER_MESSAGE}</span>
      </div>
    </div>
  );
}

export default Pre;
