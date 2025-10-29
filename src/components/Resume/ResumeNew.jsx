import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { animate } from "@motionone/dom";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import pdf from "../../Assets/../Assets/Santosh.pdf";
import {
  AiOutlineDownload,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { HERO_CONTENT, RESUME_CONTENT } from "../../constants/content";
import { computeExperience, DEFAULT_MINUTES_PER_XP, MS_PER_MINUTE } from "../../utils/experience";

// Configure PDF.js worker for newer react-pdf versions
try {
  // Resolve worker file from pdfjs-dist using bundler URL
  // eslint-disable-next-line no-undef
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();
} catch (_) {
  // Last‑resort CDN fallback
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
}

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showViewer, setShowViewer] = useState(false);
  const [pageDirection, setPageDirection] = useState(0); // 1 next, -1 prev
  const frameRef = useRef(null);
  const backdropRef = useRef(null);
  const [tone, setTone] = useState(0); // -1 cool .. 0 neutral .. +1 warm
  const baseWarm = 0.12;
  const [warmAlpha, coolAlpha] = React.useMemo(() => {
    const v = Math.max(-1, Math.min(1, tone));
    if (v >= 0) {
      return [Math.min(0.4, baseWarm + v * 0.24), 0];
    }
    const reduced = baseWarm + v * 0.4; // reduce warm more quickly going left
    if (reduced >= 0) return [reduced, 0];
    const cool = Math.min(0.28, -reduced);
    return [0, cool];
  }, [tone]);
  const modalRootRef = useRef(null);
  const [now, setNow] = useState(() => new Date());
  const openViewer = useCallback(() => {
    setShowViewer(true);
  }, []);
  const closeViewer = useCallback(() => {
    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    const anims = [];
    if (backdrop) {
      anims.push(animate(backdrop, { opacity: [1, 0] }, { duration: 0.2 }).finished);
    }
    if (frame) {
      anims.push(
        animate(
          frame,
          { transform: ["translateY(0) scale(1)", "translateY(8px) scale(0.98)"], opacity: [1, 0] },
          { duration: 0.22, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
        ).finished
      );
    }
    Promise.all(anims).catch(() => {}).finally(() => setShowViewer(false));
  }, []);

  useEffect(() => {
    // Create a detached root for the modal so it's not clipped by transformed ancestors
    const el = document.createElement("div");
    el.className = "resume-modal-root";
    document.body.appendChild(el);
    modalRootRef.current = el;
    return () => {
      if (modalRootRef.current && modalRootRef.current.parentNode) {
        modalRootRef.current.parentNode.removeChild(modalRootRef.current);
      }
      modalRootRef.current = null;
    };
  }, []);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const onLoadDocument = useCallback(({ numPages: totalPages }) => {
    setNumPages(totalPages);
  }, []);

  const nextPage = useCallback(() => {
    if (!numPages) return;
    setPageDirection(1);
    setPageNumber((current) => (current < numPages ? current + 1 : current));
  }, [numPages]);

  const prevPage = useCallback(() => {
    setPageDirection(-1);
    setPageNumber((current) => (current > 1 ? current - 1 : current));
  }, []);

  useEffect(() => {
    document.body.style.overflow = showViewer ? "hidden" : "auto";
    if (showViewer) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
    const event = new CustomEvent("section-nav:toggle", { detail: { hidden: showViewer } });
    window.dispatchEvent(event);
    return () => {
      document.body.style.overflow = "auto";
      document.body.classList.remove("modal-open");
      const resetEvent = new CustomEvent("section-nav:toggle", { detail: { hidden: false } });
      window.dispatchEvent(resetEvent);
    };
  }, [showViewer]);

  useEffect(() => {
    if (!showViewer) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeViewer();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showViewer, closeViewer]);

  // Animate open when modal becomes visible
  useEffect(() => {
    if (!showViewer) return;
    const frame = frameRef.current;
    const backdrop = backdropRef.current;
    if (backdrop) {
      animate(backdrop, { opacity: [0, 1] }, { duration: 0.22 });
    }
    if (frame) {
      animate(
        frame,
        { transform: ["translateY(18px) scale(0.98)", "translateY(0) scale(1)"], opacity: [0, 1] },
        { duration: 0.3, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
      );
    }
  }, [showViewer]);

  useEffect(() => {
    const handleResumeOpen = () => openViewer();
    window.addEventListener("resume:open", handleResumeOpen);
    window.resumeOpen = openViewer;
    return () => {
      window.removeEventListener("resume:open", handleResumeOpen);
      delete window.resumeOpen;
    };
  }, [openViewer]);

  const pageScale = useMemo(() => (width > 1024 ? 1.25 : width > 786 ? 1 : 0.52), [width]);
  const resumeCopy = useMemo(() => RESUME_CONTENT, []);

  const xpConfig = HERO_CONTENT.xp ?? {};
  const xpStartDate = xpConfig.startDate ?? "2019-04-01T00:00:00Z";
  const minutesPerXp = xpConfig.rateMinutes && xpConfig.rateMinutes > 0
    ? xpConfig.rateMinutes
    : DEFAULT_MINUTES_PER_XP;
  const xpFormatter = useMemo(() => new Intl.NumberFormat(), []);

  const experience = useMemo(
    () => computeExperience(xpStartDate, now, minutesPerXp),
    [xpStartDate, now, minutesPerXp]
  );

  const totalXpFormatted = useMemo(() => xpFormatter.format(experience.totalXp), [experience.totalXp, xpFormatter]);
  const earnedFormatted = useMemo(() => xpFormatter.format(experience.xpIntoLevel), [experience.xpIntoLevel, xpFormatter]);
  const remainingFormatted = useMemo(
    () => xpFormatter.format(experience.xpRemaining),
    [experience.xpRemaining, xpFormatter]
  );
  const levelPercent = useMemo(
    () => Math.min(Math.max(Math.round(experience.percent), 0), 100),
    [experience.percent]
  );

  const veteranSince = useMemo(() => {
    if (!experience.startDate) return "—";
    return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(experience.startDate);
  }, [experience.startDate]);

  const daysOnDuty = useMemo(() => {
    if (!experience.startDate || !experience.currentDate) {
      return 0;
    }
    const diffMs = experience.currentDate.getTime() - experience.startDate.getTime();
    return Math.max(0, Math.floor(diffMs / (MS_PER_MINUTE * 60 * 24)));
  }, [experience.currentDate, experience.startDate]);

  const cadenceLabel = useMemo(() => {
    if (!minutesPerXp) return "Cadence · pending";
    if (minutesPerXp % (60 * 24) === 0) {
      const days = minutesPerXp / (60 * 24);
      return `Cadence · 1 XP / ${days} day${days > 1 ? "s" : ""}`;
    }
    if (minutesPerXp % 60 === 0) {
      const hours = minutesPerXp / 60;
      return `Cadence · 1 XP / ${hours} hr${hours > 1 ? "s" : ""}`;
    }
    return `Cadence · 1 XP / ${minutesPerXp} min`;
  }, [minutesPerXp]);

  const etaLabel = useMemo(() => {
    if (experience.xpRemaining <= 0) {
      return "Ready now";
    }
    const minutesRemaining = experience.xpRemaining * minutesPerXp;
    if (minutesRemaining <= 0) {
      return "Calibrating";
    }
    const days = Math.floor(minutesRemaining / (60 * 24));
    const hours = Math.floor((minutesRemaining % (60 * 24)) / 60);
    const minutes = Math.floor(minutesRemaining % 60);
    if (days > 0) {
      const hourPart = hours > 0 ? ` ${hours}h` : "";
      return `${days}d${hourPart}`;
    }
    if (hours > 0) {
      const minutePart = minutes > 0 ? ` ${minutes}m` : "";
      return `${hours}h${minutePart}`;
    }
    return `${minutes}m`;
  }, [experience.xpRemaining, minutesPerXp]);

  const resumeCards = useMemo(
    () => [
      {
        label: "Level Brief",
        primary: `Level ${experience.level}`,
        metrics: [`Total XP · ${totalXpFormatted}`],
      },
      {
        label: "XP Sync",
        primary: `${levelPercent}% Sync`,
        progress: levelPercent,
        metrics: [`Earned · ${earnedFormatted} XP`],
      },
      {
        label: "Mission Clock",
        primary: `${daysOnDuty} days active`,
        metrics: [experience.startDate ? `Deployed · ${veteranSince}` : "Deployment pending"],
      },
    ],
    [
      experience.level,
      totalXpFormatted,
      levelPercent,
      earnedFormatted,
      remainingFormatted,
      daysOnDuty,
      veteranSince,
      etaLabel,
    ]
  );

  // Animate PDF page transitions using motion.dev (Motion One)
  const pageWrapRef = useRef(null);
  useEffect(() => {
    if (!pageWrapRef.current) return;
    const dir = pageDirection || 1;
    animate(
      pageWrapRef.current,
      { transform: [
          `translateX(${dir > 0 ? 24 : -24}px) scale(0.995)`,
          "translateX(0px) scale(1)"
        ],
        opacity: [0, 1],
        filter: ["blur(6px)", "blur(0px)"]
      },
      { duration: 0.28, easing: "cubic-bezier(0.22, 1, 0.36, 1)" }
    );
  }, [pageNumber, pageDirection]);

  const modalMarkup = (
      <div
        className={`resume-modal ${showViewer ? "resume-modal--open" : ""}`}
        aria-hidden={!showViewer}
      >
        <div ref={backdropRef} className="resume-modal__backdrop" onClick={closeViewer} />
        <div
          className="resume-modal__shell"
          role="dialog"
          aria-modal="true"
          aria-label="Character Sheet PDF viewer"
        >
          <div className="resume-modal__glow" aria-hidden="true" />
          <div ref={frameRef} className="resume-modal__frame">
            <button
              type="button"
              className="resume-modal__close"
              onClick={closeViewer}
            >
              <AiOutlineArrowLeft />
              <span>Close</span>
            </button>
            <div className="resume-modal__body">
              <div className="resume-viewer">
                <div className="resume-pdf">
                  <Document
                    file={pdf}
                    onLoadSuccess={onLoadDocument}
                    className="resume-document"
                  >
                    <div ref={pageWrapRef}>
                      <Page pageNumber={pageNumber} scale={pageScale} />
                    </div>
                  </Document>
                  <div
                    className="resume-pdf__tint resume-pdf__tint--warm"
                    style={{ backgroundColor: `rgba(255, 224, 178, ${warmAlpha})` }}
                  />
                  <div
                    className="resume-pdf__tint resume-pdf__tint--cool"
                    style={{ backgroundColor: `rgba(178, 208, 255, ${coolAlpha})` }}
                  />
                </div>
              </div>
            </div>
            <div className="resume-controls">
              {numPages === 2 ? (
                <>
                  <span className="resume-page-indicator">
                    {pageNumber} / {numPages}
                  </span>
                  <Button
                    variant="outline-light"
                    onClick={pageNumber === 1 ? nextPage : prevPage}
                    className="resume-control resume-control--single"
                    data-dir={pageNumber === 1 ? "next" : "prev"}
                  >
                    <AiOutlineArrowRight />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline-light"
                    onClick={prevPage}
                    className="resume-control"
                    disabled={pageNumber === 1}
                  >
                    <AiOutlineArrowLeft />
                  </Button>
                  <span className="resume-page-indicator">
                    {pageNumber} / {numPages ?? "?"}
                  </span>
                  <Button
                    variant="outline-light"
                    onClick={nextPage}
                    className="resume-control"
                    disabled={!numPages || pageNumber === numPages}
                  >
                    <AiOutlineArrowRight />
                  </Button>
                </>
              )}
            </div>
            <div className="resume-tint" role="group" aria-label="PDF tone control">
              <input
                type="range"
                min={-1}
                max={1}
                step={0.01}
                value={tone}
                onChange={(e) => setTone(parseFloat(e.target.value))}
                className="resume-tint__range"
              />
              <span className="resume-tint__label">Tone</span>
            </div>
          </div>
        </div>
      </div>
  );

  return (
    <section className="resume-section anime-section" id="resume">
      <Container>
        <div className="resume-header">
          <span className="resume-badge">{resumeCopy.badge}</span>
          <h2 className="resume-title">
            {resumeCopy.title} <span className="accent">{resumeCopy.titleAccent}</span>
          </h2>
          <div className="resume-actions">
            <Button
              variant="primary"
              onClick={openViewer}
              className="resume-download"
            >
              <AiOutlineArrowRight />
              &nbsp;{resumeCopy.primaryCta}
            </Button>
            <Button
              variant="outline-light"
              href={pdf}
              target="_blank"
              className="resume-download resume-download--secondary"
            >
              <AiOutlineDownload />
              &nbsp;{resumeCopy.secondaryCta}
            </Button>
          </div>
        </div>

        <div className="resume-console">
          <div className="resume-console__grid">
            {resumeCards.map(({ label, primary, metrics = [], progress }) => {
              const renderedMetrics = metrics.filter(Boolean);
              return (
                <div className="resume-console__card" key={label}>
                  <span className="resume-console__chip">{label}</span>
                  <span className="resume-console__primary">{primary}</span>
                  {typeof progress === "number" ? (
                    <div className="resume-console__progress" aria-hidden="true">
                    <span
                      className="resume-console__progress-fill"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                ) : null}
                  {renderedMetrics.map((metric) => (
                    <span className="resume-console__meta" key={`${label}-${metric}`}>
                      {metric}
                    </span>
                  ))}
                </div>
              );
            })}
          </div>
          <div className="resume-console__bar" aria-hidden="true" />
        </div>

      </Container>

      {modalRootRef.current ? createPortal(modalMarkup, modalRootRef.current) : null}
    </section>
  );
}

export default ResumeNew;
