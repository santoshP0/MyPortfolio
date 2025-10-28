import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Container, Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Home2 from "./Home2";
import Type from "./Type";
import { HERO_CONTENT, FOOTER_CONTENT } from "../../constants/content";
import { computeExperience, DEFAULT_MINUTES_PER_XP } from "../../utils/experience";

const HEARTBEAT_STEPS = 5;
const HEARTBEAT_VISIBLE_STEPS = new Set([0, 2, 4]);
const ALERTZY_ENDPOINT = "/api/alertzy/send";
const INITIAL_FORM_STATE = Object.freeze({
  name: "",
  email: "",
  message: "",
});

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
  const [isFlipped, setIsFlipped] = useState(false);
  const minutesPerXp = xpConfig.rateMinutes && xpConfig.rateMinutes > 0
    ? xpConfig.rateMinutes
    : DEFAULT_MINUTES_PER_XP;
  const xpLabel = xpConfig.label ?? "XP";

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const alertzyToken = useMemo(
    () => (process.env.REACT_APP_ALERTZY_TOKEN ?? "").trim(),
    []
  );

  const contactEmailHref = useMemo(() => {
    const emailLink = FOOTER_CONTENT.links?.find((link) => link.id === "email")?.href;
    return emailLink ?? "mailto:santoshpk.mdev@gmail.com";
  }, []);

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

  const handleOpenContact = useCallback(() => {
    setIsFlipped(true);
  }, []);

  const handleCloseContact = useCallback(() => {
    setIsFlipped(false);
  }, []);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleContactSubmit = useCallback(async (event) => {
    event.preventDefault();
    if (isSubmitting) {
      return;
    }

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const trimmedMessage = formData.message.trim();
    const messageBody = [
      `Name: ${trimmedName || "—"}\n`,
      `Email: ${trimmedEmail || "—"}`,
      "",
      trimmedMessage || "No mission details provided.",
    ].join("\n");
    const title = trimmedName ? `New transmission from ${trimmedName}` : "New portfolio transmission";

    if (!alertzyToken) {
      window.alert("Alertzy token missing.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        accountKey: alertzyToken,
        title,
        message: messageBody,
        priority: 1,
        group: "Portfolio Contact",
      };

      const response = await fetch(ALERTZY_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      console.log("Alertzy response:", response);
      if (!response.ok) {
        throw new Error(`Alertzy response: ${response.status}`);
      }

      window.alert("Transmission sent! I'll be in touch soon.");
      setFormData(INITIAL_FORM_STATE);
      setIsFlipped(false);
    } catch (error) {
      console.error("Failed to dispatch transmission via Alertzy:", error);
      window.alert("Could not send via Alertzy. Please try again shortly.");
    } finally {
      setIsSubmitting(false);
    }
  }, [alertzyToken, formData, isSubmitting]);

  useEffect(() => {
    if (!isFlipped) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsFlipped(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFlipped]);

  const contactEmailDisplay = useMemo(
    () => contactEmailHref.replace(/^mailto:/i, ""),
    [contactEmailHref]
  );

  return (
    <>
      <section className="hero-section anime-section" id="home">
        <Container fluid className="hero-wrapper">
          <div className={`hero-card ${isFlipped ? "hero-card--flipped" : ""}`}>
            <div className="hero-card__inner">
              <div
                className="hero-card__face hero-card__face--front hero-frame"
                aria-hidden={isFlipped}
              >
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
                          onClick={handleOpenContact}
                          aria-label="Reveal contact form"
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
              <div
                className="hero-card__face hero-card__face--back hero-frame hero-frame--contact"
                aria-hidden={!isFlipped}
              >
                <div className="hero-contact">
                  <Row className="hero-contact__row align-items-start gy-4">
                    <Col lg={6} className="hero-contact__copy">
                      <span className="hero-contact__badge">[Comm Signal]</span>
                      <h3 className="hero-contact__title">
                        Let&apos;s build the next realm together
                      </h3>
                      <p className="hero-contact__subtitle">
                        Share your mission briefing and I&apos;ll respond with next steps.
                      </p>
                      <p className="hero-contact__subtitle hero-contact__subtitle--muted">
                        Prefer a direct channel? Reach me at{" "}
                        <a href={contactEmailHref}>{contactEmailDisplay}</a>.
                      </p>
                    </Col>
                    <Col lg={6} className="hero-contact__form-col">
                      <Form className="hero-contact__form" onSubmit={handleContactSubmit}>
                        <Form.Group controlId="contactName">
                          <Form.Label>Squad Handle</Form.Label>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Your name"
                            autoComplete="name"
                          />
                        </Form.Group>
                        <Form.Group controlId="contactEmail">
                          <Form.Label>Transmission Channel</Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            required
                          />
                        </Form.Group>
                        <Form.Group controlId="contactMessage">
                          <Form.Label>Mission Brief</Form.Label>
                          <Form.Control
                            as="textarea"
                            name="message"
                            value={formData.message}
                            onChange={handleInputChange}
                            placeholder="Tell me about the product, problem, or idea."
                            rows={5}
                            required
                          />
                        </Form.Group>
                        <div className="hero-contact__actions">
                          <Button
                            type="submit"
                            variant="primary"
                            className="hero-contact__submit"
                            disabled={isSubmitting}
                          >
                            Send Transmission
                          </Button>
                          <Button
                            type="button"
                            variant="outline-light"
                            onClick={handleCloseContact}
                            className="hero-contact__back"
                            disabled={isSubmitting}
                          >
                            Return
                          </Button>
                        </div>
                      </Form>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </div>
        </Container>
        <div className="hero-scanline" aria-hidden="true" />
      </section>
      <Home2 />
    </>
  );
}

export default Home;
