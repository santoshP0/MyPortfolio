import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import pdf from "../../Assets/../Assets/Santosh.pdf";
import {
  AiOutlineDownload,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [showViewer, setShowViewer] = useState(false);
  const openViewer = useCallback(() => {
    setShowViewer(true);
  }, []);
  const closeViewer = useCallback(() => {
    setShowViewer(false);
  }, []);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const onLoadDocument = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const prevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showViewer ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
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

  return (
    <section className="resume-section anime-section" id="resume">
      <Container>
        <div className="resume-header">
          <span className="resume-badge">[Character Sheet]</span>
          <h2 className="resume-title">
            Download the <span className="accent">full stats</span>
          </h2>
          <div className="resume-actions">
            <Button
              variant="primary"
              onClick={openViewer}
              className="resume-download"
            >
              <AiOutlineArrowRight />
              &nbsp;Open Character Sheet
            </Button>
            <Button
              variant="outline-light"
              href={pdf}
              target="_blank"
              className="resume-download resume-download--secondary"
            >
              <AiOutlineDownload />
              &nbsp;Download CV
            </Button>
          </div>
        </div>

        <div className="resume-console">
          <div className="resume-console__grid">
            <div className="resume-console__card">
              <span className="resume-console__label">Experience</span>
              <span className="resume-console__value">5+ Years</span>
            </div>
            <div className="resume-console__card">
              <span className="resume-console__label">Specialty</span>
              <span className="resume-console__value">React Native</span>
            </div>
            <div className="resume-console__card">
              <span className="resume-console__label">Allies</span>
              <span className="resume-console__value">React · Node · AWS</span>
            </div>
            <div className="resume-console__card">
              <span className="resume-console__label">Mode</span>
              <span className="resume-console__value">Action · Isekai</span>
            </div>
          </div>
          <div className="resume-console__bar" aria-hidden="true" />
        </div>

      </Container>

      <div
        className={`resume-modal ${showViewer ? "resume-modal--open" : ""}`}
        aria-hidden={!showViewer}
      >
        <div className="resume-modal__backdrop" onClick={closeViewer} />
        <div
          className="resume-modal__shell"
          role="dialog"
          aria-modal="true"
          aria-label="Character Sheet PDF viewer"
        >
          <div className="resume-modal__glow" aria-hidden="true" />
          <div className="resume-modal__frame">
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
                <Document
                  file={pdf}
                  onLoadSuccess={onLoadDocument}
                  className="resume-document"
                >
                  <Page pageNumber={pageNumber} scale={pageScale} />
                </Document>
              </div>
            </div>
            <div className="resume-controls">
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ResumeNew;
