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

  return (
    <nav
      className={`section-nav ${hidden ? "section-nav--hidden" : ""}`}
      aria-label="Section navigation"
    >
      {navItems.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`section-nav__item ${activeId === id ? "section-nav__item--active" : ""}`}
          onClick={(event) => handleNavClick(event, id)}
        >
          <span className="section-nav__dot" aria-hidden="true" />
          <span className="section-nav__label">{label}</span>
        </a>
      ))}
    </nav>
  );
}

export default SectionNav;
