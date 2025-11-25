import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SECTION_NAV_ITEMS } from "../constants";

function SectionNav() {
  const navItems = useMemo(() => SECTION_NAV_ITEMS, []);
  const [activeId, setActiveId] = useState(navItems[0].id);
  const [hidden, setHidden] = useState(false);

  const updateActive = useCallback(() => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.3;
    let current = navItems[0].id;

    navItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      if (el.offsetTop <= scrollPosition) {
        current = id;
      }
    });

    setActiveId(current);
  }, [navItems]);

  useEffect(() => {
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, [updateActive]);

  const handleNavClick = useCallback((event, id) => {
    event.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveId(id);
  }, [setActiveId]);

  useEffect(() => {
    const handleToggle = (event) => {
      setHidden(Boolean(event.detail?.hidden));
    };
    window.addEventListener("section-nav:toggle", handleToggle);
    return () => window.removeEventListener("section-nav:toggle", handleToggle);
  }, []);

  // Anime-style icon mapping for navigation items
  const getAnimeIcon = (label) => {
    const iconMap = {
      'Home': '🏠',
      'About': '👤',
      'Projects': '⚔️',
      'Resume': '📜',
      'Contact': '💬',
      'Skills': '🎯',
      'Journey': '🗺️',
    };
    return iconMap[label] || '✨';
  };

  return (
    <nav
      className={`anime-section-nav ${hidden ? "anime-section-nav--hidden" : ""}`}
      aria-label="Section navigation"
    >
      {navItems.map(({ id, label }, index) => (
        <a
          key={id}
          href={`#${id}`}
          className={`anime-nav-item ${activeId === id ? "anime-nav-item--active" : ""}`}
          onClick={(event) => handleNavClick(event, id)}
          style={{
            '--animation-delay': `${index * 0.1}s`,
          }}
        >
          <span className="anime-nav__icon" aria-hidden="true">
            {getAnimeIcon(label)}
          </span>
          <span className="anime-nav__dot anime-nav__dot--pulse" aria-hidden="true" />
          <span className="anime-nav__label">{label}</span>
          <span className="anime-nav__glow" aria-hidden="true" />
          <span className="anime-nav__particles" aria-hidden="true">
            {[...Array(3)].map((_, i) => (
              <span
                key={i}
                className="anime-nav__particle"
                style={{
                  '--delay': `${i * 0.2}s`,
                }}
              />
            ))}
          </span>
        </a>
      ))}

      {/* Anime-style navigation accent */}
      <div className="anime-nav__accent" aria-hidden="true" />
      <div className="anime-nav__border-glow" aria-hidden="true" />
    </nav>
  );
}

export default SectionNav;
