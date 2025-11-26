import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Toolstack from "./Toolstack";
import { ABOUT_SECTION_CONTENT } from "../../constants";

/**
 * @component
 * @description The main container for the "About" or "Skills" section of the page.
 * It arranges and displays the Techstack and Toolstack components, which showcase
 * the user's technical skills and the tools they use.
 * The content is fetched from the ABOUT_SECTION_CONTENT constant.
 * This component is identified by the id="skills" for navigation purposes.
 * @returns {JSX.Element} The rendered About section.
 */
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
