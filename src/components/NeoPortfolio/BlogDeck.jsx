import { useState, useEffect, useRef } from "react";
import { BLOG_ARTICLES } from "../../constants/copy/neo-portfolio";

const CARD_COLORS = ["#F6E27A", "#BFD9E8", "#B9C9A6", "#E0A87E", "#F4E9CE", "#D9D7CF"];

// Per-card fan placement (organic, à la Aceternity) — y lift + tilt, x from spacing
const FAN = [
  { y: -14, r: -14 },
  { y: 26, r: 8 },
  { y: -58, r: -6 },
  { y: 18, r: 11 },
  { y: 28, r: -7 },
  { y: -10, r: 13 },
];

/* Fanned deck of blog cards — click one to bring it forward, click away to reset.
   ponytail: CSS transforms + one state var instead of framer-motion. */
export default function BlogDeck() {
  const [active, setActive] = useState(null);
  const [spacing, setSpacing] = useState(150);
  const ref = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setSpacing(mq.matches ? 134 : 46);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const onDown = (e) => { if (ref.current && !ref.current.contains(e.target)) setActive(null); };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const middle = (BLOG_ARTICLES.length - 1) / 2;
  const open = active !== null;

  return (
    <div className={`neo-deck${open ? " neo-deck-open" : ""}`} ref={ref} onClick={() => setActive(null)}>
      {BLOG_ARTICLES.map((a, i) => {
        const offset = i - middle;
        const isActive = active === i;
        const style = isActive
          ? { transform: "translate(-50%, calc(-50% - 96px))", zIndex: 50 }
          : open
            ? { transform: `translate(calc(-50% + ${offset * spacing * 0.5}px), calc(-50% + 236px)) scale(0.74) rotate(${offset * 4}deg)`, zIndex: i + 2 }
            : { transform: `translate(calc(-50% + ${offset * spacing}px), calc(-50% + ${FAN[i].y}px)) rotate(${FAN[i].r}deg)`, transformOrigin: "center", zIndex: i + 2 };

        return (
          <button
            key={a.title}
            className={`neo-deck-card${isActive ? " neo-deck-card-active" : ""}`}
            style={{ background: CARD_COLORS[i % CARD_COLORS.length], ...style }}
            onClick={(e) => { e.stopPropagation(); setActive(isActive ? null : i); }}
          >
            <img src={a.image} alt={a.title} loading="lazy" />
            <h3 className="neo-deck-card-title">{a.title}</h3>
            {isActive && (
              <div className="neo-deck-card-detail">
                <p>{a.desc}</p>
                <div className="neo-deck-card-tags">
                  {a.tags.map((t) => <span key={t}>{t}</span>)}
                </div>
                <a href={a.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>Read article →</a>
              </div>
            )}
          </button>
        );
      })}
      <span className="neo-deck-hint">{open ? "Tap away to close" : "Tap a card to read"}</span>
    </div>
  );
}
