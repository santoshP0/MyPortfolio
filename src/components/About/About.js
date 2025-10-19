import React from "react";
import { Container } from "react-bootstrap";
import Techstack from "./Techstack";
import Aboutcard from "./AboutCard";
import Toolstack from "./Toolstack";

function About() {
  return (
    <section className="skill-section anime-section" id="skills">
      <Container>
        <div className="skill-grid skill-grid--top">
          <h3 className="skill-subtitle">
            Core <span className="accent">Skillset</span>
          </h3>
          <Techstack />
        </div>

        <div className="skill-grid">
          <h3 className="skill-subtitle">
            Command <span className="accent">Center</span>
          </h3>
          <Toolstack />
        </div>
      </Container>
    </section>
  );
}

export default About;
