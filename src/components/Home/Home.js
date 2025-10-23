import React, { useCallback, useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Home2 from "./Home2";
import Type from "./Type";
import { HERO_CONTENT } from "../../constants/content";

function Home() {
  const heroStats = useMemo(() => HERO_CONTENT.stats, []);
  const heroConsole = useMemo(() => HERO_CONTENT.console, []);

  const handleScrollToResume = useCallback(() => {
    const resumeSection = document.getElementById("resume");
    if (resumeSection) {
      resumeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return (
    <>
      <section className="hero-section anime-section" id="home">
        <Container fluid className="hero-wrapper">
          <div className="hero-frame">
            <Row className="hero-row align-items-center">
              <Col md={7} className="hero-copy">
                <h1 className="hero-title">
                  {HERO_CONTENT.greeting}{" "}
                  <span className="accent">{HERO_CONTENT.name}</span>
                </h1>
                <p className="hero-subtitle">
                  {HERO_CONTENT.subtitle}
                </p>
                <div className="hero-type">
                  <Type />
                </div>
                <div className="hero-stats">
                  {heroStats.map((stat) => (
                    <div className="hero-stat-card" key={stat.label}>
                      <span className="hero-stat-label">{stat.label}</span>
                      <span className="hero-stat-value">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </Col>
              <Col md={5} className="hero-visual">
                <div className="hero-console">
                  <span className="hero-console__halo" aria-hidden="true" />
                  <div className="hero-console__ring hero-console__ring--outer" aria-hidden="true" />
                  <div className="hero-console__ring hero-console__ring--inner" aria-hidden="true" />
                  <div className="hero-console__shell">
                    <span className="hero-console__tag">{heroConsole.tag}</span>
                    <div className="hero-console__status">
                      <span className="hero-console__code">{heroConsole.code}</span>
                      <span className="hero-console__subtitle">{heroConsole.subtitle}</span>
                    </div>
                    <button
                      type="button"
                      className="hero-console__cta"
                      onClick={handleScrollToResume}
                      aria-label="Scroll to character sheet"
                    >
                      <span className="hero-console__cta-glow" aria-hidden="true" />
                      <span className="hero-console__cta-icon" aria-hidden="true">
                        {heroConsole.ctaIcon}
                      </span>
                      <span className="hero-console__cta-text">{heroConsole.ctaText}</span>
                    </button>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
        <div className="hero-scanline" aria-hidden="true" />
      </section>
      <Home2 />
    </>
  );
}

export default Home;
