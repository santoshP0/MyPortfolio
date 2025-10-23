import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import Home2 from "./Home2";
import Type from "./Type";
import { HERO_CONTENT } from "../../constants/content";
import { computeExperience, DEFAULT_MINUTES_PER_XP } from "../../utils/experience";

const HEARTBEAT_STEPS = 5;
const HEARTBEAT_VISIBLE_STEPS = new Set([0, 2, 4]);

function useHeartbeatSequence(options, fallbackValue) {
  const sequence = useMemo(() => {
    if (options && options.length) {
      return options.filter(Boolean);
    }
    return fallbackValue ? [fallbackValue] : [];
  }, [options, fallbackValue]);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setIndex(0);
    setStep(0);
  }, [sequence]);

  useEffect(() => {
    if (!sequence.length) {
      return undefined;
    }
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % HEARTBEAT_STEPS);
    }, 300);
    return () => clearInterval(interval);
  }, [sequence.length]);

  useEffect(() => {
    if (!sequence.length) {
      return;
    }
    if (step === HEARTBEAT_STEPS - 1) {
      setIndex((prev) => (prev + 1) % sequence.length);
    }
  }, [step, sequence.length]);

  const visible = sequence.length ? HEARTBEAT_VISIBLE_STEPS.has(step) : true;
  const value = sequence.length ? sequence[index % sequence.length] : fallbackValue ?? "";
  const animate = sequence.length > 0;

  return { value, visible, animate };
}

function Home() {
  const heroConsole = useMemo(() => HERO_CONTENT.console, []);
  const xpConfig = HERO_CONTENT.xp ?? {};
  const xpStartDate = xpConfig.startDate ?? "2019-04-01T00:00:00Z";
  const minutesPerXp = xpConfig.rateMinutes && xpConfig.rateMinutes > 0
    ? xpConfig.rateMinutes
    : DEFAULT_MINUTES_PER_XP;
  const xpLabel = xpConfig.label ?? "XP";

  const baseStats = HERO_CONTENT.stats ?? [];
  const specialtyFallback = baseStats.find((stat) => stat.label === "Specialty")?.value ?? "";
  const questFallback = baseStats.find((stat) => stat.label === "Current Quest")?.value ?? "";

  const specialtyOptions = useMemo(
    () =>
      Array.isArray(HERO_CONTENT.specialtySequence)
        ? HERO_CONTENT.specialtySequence.filter(Boolean)
        : [],
    []
  );

  const questOptions = useMemo(
    () =>
      Array.isArray(HERO_CONTENT.questSequence)
        ? HERO_CONTENT.questSequence.filter(Boolean)
        : [],
    []
  );

  const xpFormatter = useMemo(() => new Intl.NumberFormat(), []);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const experience = useMemo(
    () => computeExperience(xpStartDate, now, minutesPerXp),
    [xpStartDate, minutesPerXp, now]
  );

  const xpStat = useMemo(() => {
    const totalXpFormatted = xpFormatter.format(experience.totalXp);
    const earnedFormatted = xpFormatter.format(experience.xpIntoLevel);
    const remainingFormatted = xpFormatter.format(experience.xpRemaining);
    const percent = Math.min(Math.max(experience.percent, 0), 100);

    return {
      label: xpLabel,
      value: `Level ${experience.level}`,
      progress: {
        percent,
        ariaText: `Level ${experience.level} progress: ${earnedFormatted} XP earned, ${remainingFormatted} XP remaining. Total ${totalXpFormatted} XP.`,
      },
    };
  }, [experience, xpFormatter, xpLabel]);

  const specialtySequence = useHeartbeatSequence(specialtyOptions, specialtyFallback);
  const questSequence = useHeartbeatSequence(questOptions, questFallback);

  const { value: specialtyValue, visible: specialtyVisible, animate: specialtyAnimate } = specialtySequence;
  const { value: questValue, visible: questVisible, animate: questAnimate } = questSequence;

  const heroStats = useMemo(() => {
    const dynamicStats = baseStats.map((stat) => {
      if (stat.label === "Specialty") {
        return {
          ...stat,
          value: specialtyValue || stat.value,
          animate: specialtyAnimate,
          visible: specialtyVisible,
        };
      }
      if (stat.label === "Current Quest") {
        return {
          ...stat,
          value: questValue || stat.value,
          animate: questAnimate,
          visible: questVisible,
        };
      }
      return {
        ...stat,
        visible: true,
      };
    });

    return [
      {
        ...xpStat,
        visible: true,
        animate: false,
      },
      ...dynamicStats,
    ];
  }, [
    baseStats,
    xpStat,
    specialtyValue,
    specialtyVisible,
    specialtyAnimate,
    questValue,
    questVisible,
    questAnimate,
  ]);

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
                    <div className="hero-stat-card" key={`${stat.label}-${stat.value}`}>
                      <span className="hero-stat-label">{stat.label}</span>
                      <span
                        className={[
                          "hero-stat-value",
                          stat.animate ? "hero-stat-value--heartbeat" : "",
                          stat.visible ? "" : "hero-stat-value--hidden",
                        ].filter(Boolean).join(" ")}
                      >
                        {stat.value}
                      </span>
                      {stat.progress ? (
                        <div className="hero-stat-progress">
                          <div
                            className="hero-stat-progress__bar"
                            role="progressbar"
                            aria-valuenow={Math.round(stat.progress.percent)}
                            aria-valuemin="0"
                            aria-valuemax="100"
                            aria-valuetext={stat.progress.ariaText}
                            aria-label="Experience progress"
                            title={stat.progress.ariaText}
                          >
                            <span
                              className="hero-stat-progress__fill"
                              style={{ width: `${stat.progress.percent}%` }}
                            />
                          </div>
                        </div>
                      ) : null}
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
