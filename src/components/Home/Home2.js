import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Aboutcard from "../About/AboutCard";

const loadout = [
  "React Native · React.js · Node.js · AWS",
  "TypeScript · JavaScript · Python",
  "Pixel-perfect Android & iOS delivery",
];

function Home2() {
  return (
    <section className="lore-section anime-section" id="about">
      <Container>
        <Row className="lore-row">
          <Col lg={8} className="lore-copy">
            <div className="lore-badge">[Lore Upload]</div>
            <h2 className="lore-title">
              Battle-tested mobile developer with an action anime mindset.
            </h2>
            <p className="lore-body">
              I'm a software engineer obsessed with building impactful Android and
              iOS experiences. Across <span className="accent">5+ years</span> in the
              field, I've spent <span className="accent">4.5 years</span> mastering{" "}
              <span className="accent">React Native</span> to ship cross-platform apps
              that feel native in every universe.
            </p>
            <p className="lore-body">
              React.js keeps my web instincts sharp, while{" "}
              <span className="accent">Data Structures and Algorithms</span> training
              powers how I solve high-pressure quests. I thrive on blending clean
              architecture with anime-level dramatic flair.
            </p>
            <div className="lore-loadout">
              <span className="lore-loadout-label">Weapon loadout</span>
              <ul className="lore-loadout-list">
                {loadout.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <p className="lore-body">
              When the mission calls, I deploy <span className="accent">Node.js</span>{" "}
              backends and modern JavaScript frameworks to deliver cohesive,
              story-driven products from prototype to launch.
            </p>
          </Col>
        </Row>
        <Row className="lore-row lore-row--intel">
          <Col lg={8}>
            <div className="lore-intel">
              <span className="lore-intel__tag">[Professional Intel]</span>
              <Aboutcard />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Home2;
