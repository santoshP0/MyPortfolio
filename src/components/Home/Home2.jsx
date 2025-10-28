import React, { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Aboutcard from "../About/AboutCard";
import { LORE_CONTENT } from "../../constants/content";

function Home2() {
  const loadoutItems = useMemo(() => LORE_CONTENT.loadoutItems, []);

  return (
    <section className="lore-section anime-section" id="about">
      <Container>
        <Row className="lore-row">
          <Col lg={8} className="lore-copy">
            <div className="lore-copy__inner">
              <div className="lore-badge">{LORE_CONTENT.badge}</div>
              <h2 className="lore-title">
                {LORE_CONTENT.title}
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
                <span className="lore-loadout-label">{LORE_CONTENT.loadoutLabel}</span>
                <ul className="lore-loadout-list">
                  {loadoutItems.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <p className="lore-body">
                When the mission calls, I deploy <span className="accent">Node.js</span>{" "}
                backends and modern JavaScript frameworks to deliver cohesive,
                story-driven products from prototype to launch.
              </p>
            </div>
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
