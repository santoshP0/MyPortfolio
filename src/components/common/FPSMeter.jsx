import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * @component
 * @description A component that measures and displays the current frames per second (FPS) of the application.
 * It uses `requestAnimationFrame` to count frames over a set interval and calculates the FPS,
 * smoothing the value with an exponential moving average for stability. The component
 * dynamically updates a color-coded indicator based on the performance level (good, ok, bad).
 * The calculation is paused when the page is not visible to conserve resources.
 * @returns {JSX.Element} A div element displaying the current FPS.
 */
function FPSMeter() {
  const [fps, setFps] = useState(60);
  const rafRef = useRef(0);
  const visibleRef = useRef(typeof document !== "undefined" ? !document.hidden : true);

  useEffect(() => {
    const handleVisibility = () => {
      visibleRef.current = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  useEffect(() => {
    let frames = 0;
    let lastUpdate = performance.now();

    const tick = (time) => {
      if (!visibleRef.current) {
        lastUpdate = time;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      frames += 1;
      const elapsed = time - lastUpdate;
      if (elapsed >= 250) {
        const current = (frames * 1000) / elapsed;
        // Exponential moving average for stability
        setFps((prev) => Math.round(prev * 0.7 + current * 0.3));
        frames = 0;
        lastUpdate = time;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const qualityClass = useMemo(() => {
    if (fps >= 55) return "good";
    if (fps >= 40) return "ok";
    return "bad";
  }, [fps]);

  return (
    <div className={["fps-meter", `fps-meter--${qualityClass}`].join(" ")} aria-label="Frames per second">
      FPS {fps}
    </div>
  );
}

export default FPSMeter;

