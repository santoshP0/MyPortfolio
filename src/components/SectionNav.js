import React, { useEffect, useState } from "react";

const navEntries = [
  { id: "home", label: "Intro" },
  { id: "about", label: "Lore" },
  { id: "skills", label: "Skillset" },
  { id: "projects", label: "Quests" },
  { id: "resume", label: "Stats" },
];

function SectionNav() {
  const [activeId, setActiveId] = useState(navEntries[0].id);

  useEffect(() => {
    const updateActive = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.3;
      let current = navEntries[0].id;

      navEntries.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.offsetTop <= scrollPosition) {
          current = id;
        }
      });

      setActiveId(current);
    };

    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
    updateActive();

    return () => {
      window.removeEventListener("scroll", updateActive);
      window.removeEventListener("resize", updateActive);
    };
  }, []);

  return (
    <nav className="section-nav" aria-label="Section navigation">
      {navEntries.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          className={`section-nav__item ${activeId === id ? "section-nav__item--active" : ""}`}
          onClick={(event) => {
            event.preventDefault();
            const section = document.getElementById(id);
            if (section) {
              section.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            setActiveId(id);
          }}
        >
          <span className="section-nav__dot" aria-hidden="true" />
          <span className="section-nav__label">{label}</span>
        </a>
      ))}
    </nav>
  );
}

export default SectionNav;
