import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Toolstack from "./Toolstack";
import { ABOUT_SECTION_CONTENT } from "../../constants/content";

function About() {
  const sectionContent = useMemo(() => ABOUT_SECTION_CONTENT, []);

  return (
    <section className="skill-section anime-section" id="skills">
      <Container>
        <div className="skill-grid skill-grid--top">
          <h3 className="skill-subtitle">
            {sectionContent.skills.title} <span className="accent">{sectionContent.skills.accent}</span>
          </h3>
          <Techstack />
        </div>

        <div className="skill-grid">
          <h3 className="skill-subtitle">
            {sectionContent.tools.title} <span className="accent">{sectionContent.tools.accent}</span>
          </h3>
          <Toolstack />
        </div>
      </Container>
    </section>
  );
}

export default About;
