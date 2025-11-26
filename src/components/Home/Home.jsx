import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { animate } from "@motionone/dom";
import { Container, Row, Col } from "react-bootstrap";
import Home2 from "./Home2";
import Type from "./Type";
import HeroStatCard from "./HeroStatCard";
import HeroConsole from "./HeroConsole";
import HeroContactCard from "./HeroContactCard";
import HeroStatusBanner from "./HeroStatusBanner";
import {
  HERO_CONTENT,
  HERO_CONTACT_COPY,
  FOOTER_CONTENT,
} from "../../constants";
import { computeExperience, DEFAULT_MINUTES_PER_XP } from "../../utils/experience";
import useHeartbeatSequence from "../../hooks/useHeartbeatSequence";
import { sendAlertzyTransmission } from "../../utils/alertzy";

const INITIAL_FORM_STATE = Object.freeze({
  name: "",
  email: "",
  message: "",
});
const STATUS_RESET_DELAY = 900;

/**
 * @component
 * @description The main component for the hero section of the portfolio.
 * It orchestrates a complex UI with a flippable card that serves as the main
 * interface. The front of the card displays professional stats and a dynamic "typewriter"
 * effect, while the back contains a contact form. This component manages the state for
 * the card flip, form data, submission status, and dynamic stats like experience points (XP).
 * It sources its content from various constants and uses several child components to build the UI.
 * @returns {JSX.Element} The rendered hero section.
 */
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
  const [sendPhase, setSendPhase] = useState("idle"); // idle | launch | return
  const [sendStatus, setSendStatus] = useState(null); // null | success | error
  const animTimerRef = useRef(null);
  const pendingResultRef = useRef(null); // 'success' | 'error' | null
  const heroCardRef = useRef(null);
  const [cardAnimating, setCardAnimating] = useState(false);
  const IS_PROD = process.env.NODE_ENV === "production";
  const alertzyToken = useMemo(() => {
    if (IS_PROD) return ""; // never embed token in production bundle
    const raw = String(process.env.REACT_APP_ALERTZY_TOKEN || "");
    // Trim whitespace and strip surrounding quotes if present
    return raw.trim().replace(/^['"]+|['"]+$/g, "");
  }, [IS_PROD]);
  const usingServerProxy = useMemo(() => IS_PROD, [IS_PROD]);

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

    if (!alertzyToken && !usingServerProxy) {
      window.alert("Alertzy token missing. Set REACT_APP_ALERTZY_TOKEN for local dev, or deploy with Netlify Function.");
      return;
    }

    setIsSubmitting(true);
    setSendStatus(null);
    pendingResultRef.current = null;
    setSendPhase("launch");
    setCardAnimating(true);
    try {
      const basePayload = {
        title,
        message: messageBody,
        priority: 1,
        group: "Portfolio Contact",
      };

      const sendTask = (async () => {
        const result = await sendAlertzyTransmission(basePayload, { token: alertzyToken });
        pendingResultRef.current = result.ok ? "success" : "error";
        if (!result.ok) {
          throw result.error || new Error("Unknown transmission error");
        }
      })();

      const cardEl = heroCardRef.current;
      const launch = animate(
        cardEl,
        {
          transform: [
            "translate3d(0,0,0) scale(1) rotate(0deg)",
            "translate3d(34vw,-26vh,0) scale(0.16) rotate(-8deg)",
          ],
          opacity: [1, 0],
        },
        { duration: 0.52, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );

      await Promise.allSettled([launch.finished, sendTask]);

      const status = pendingResultRef.current || null;
      setSendStatus(status);
      setSendPhase("return");

      const ret = animate(
        cardEl,
        {
          transform: [
            "translate3d(34vw,-26vh,0) scale(0.16) rotate(-8deg)",
            "translate3d(0,0,0) scale(1) rotate(0deg)",
          ],
          opacity: [0, 1],
        },
        { duration: 0.43, easing: "cubic-bezier(0.22, 1, 0.36, 1)", fill: "forwards" }
      );

      await ret.finished;
      setCardAnimating(false);

      if (status === "success") {
        setFormData(INITIAL_FORM_STATE);
        setIsFlipped(false);
      }
      clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setSendPhase("idle");
        setSendStatus(null);
      }, STATUS_RESET_DELAY);
    } catch (error) {
      console.error("Failed to dispatch transmission via Alertzy:", error);
      pendingResultRef.current = "error";
      setSendStatus("error");
      setSendPhase("idle");
      setCardAnimating(false);
    } finally {
      setIsSubmitting(false);
    }
  }, [alertzyToken, formData, isSubmitting, usingServerProxy]);

  useEffect(() => () => clearTimeout(animTimerRef.current), []);

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
          <HeroStatusBanner phase={sendPhase} status={sendStatus} />

          <div
            ref={heroCardRef}
            className={[
              "hero-card",
              isFlipped ? "hero-card--flipped" : "",
              cardAnimating ? "hero-card--animating" : "",
            ].filter(Boolean).join(" ")}
          >
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
                        <HeroStatCard key={`${stat.label}-${stat.value}`} {...stat} />
                      ))}
                    </div>
                  </Col>
                  <Col md={5} className="hero-visual">
                    <HeroConsole consoleCopy={heroConsole} onRevealContact={handleOpenContact} />
                  </Col>
                </Row>
              </div>
              <div
                className="hero-card__face hero-card__face--back hero-frame hero-frame--contact"
                aria-hidden={!isFlipped}
              >
                <HeroContactCard
                  copy={HERO_CONTACT_COPY}
                  emailHref={contactEmailHref}
                  emailDisplay={contactEmailDisplay}
                  formData={formData}
                  isSubmitting={isSubmitting}
                  onSubmit={handleContactSubmit}
                  onClose={handleCloseContact}
                  onInputChange={handleInputChange}
                />
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
