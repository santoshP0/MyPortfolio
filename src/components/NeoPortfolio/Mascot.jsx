import { useEffect, useRef, useState } from "react";

/* Paper-craft robot mascot — eyes follow the cursor, waves on click */
export default function Mascot() {
  const rootRef = useRef(null);
  const [waving, setWaving] = useState(false);

  useEffect(() => {
    // Touch devices get the CSS look-around animation instead
    if (!window.matchMedia("(hover: hover)").matches) return;

    const onMove = (e) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const max = 3.5;
      const d = Math.max(Math.hypot(dx, dy), 1);
      el.style.setProperty("--look-x", `${(dx / d) * max}px`);
      el.style.setProperty("--look-y", `${(dy / d) * max}px`);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const wave = () => {
    setWaving(true);
    setTimeout(() => setWaving(false), 1200);
  };

  return (
    <div
      ref={rootRef}
      className={`neo-mascot${waving ? " neo-mascot-waving" : ""}`}
      onClick={wave}
      title="Hi! I'm SK-bot"
      aria-hidden="true"
    >
      <div className="neo-mascot-antenna"><span /></div>
      <div className="neo-mascot-head">
        <div className="neo-mascot-eyes">
          <span className="neo-mascot-eye"><span className="neo-mascot-pupil" /></span>
          <span className="neo-mascot-eye"><span className="neo-mascot-pupil" /></span>
        </div>
        <div className="neo-mascot-mouth" />
      </div>
      <div className="neo-mascot-body">
        <span className="neo-mascot-arm neo-mascot-arm-l" />
        <span className="neo-mascot-arm neo-mascot-arm-r" />
      </div>
    </div>
  );
}
