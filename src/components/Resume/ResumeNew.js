import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Particle from "../Particle";
import pdf from "../../Assets/../Assets/Santosh.pdf";
import { AiOutlineDownload, AiOutlineArrowRight, AiOutlineArrowLeft } from "react-icons/ai";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function ResumeNew() {
  const [width, setWidth] = useState(1200);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  const onLoadDocument=({numPages})=>{
    setNumPages(numPages)
  }

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
  return (
    <div>
      <Container fluid className="resume-section">
        <Particle />
        <Row style={{ justifyContent: "center", position: "relative" }}>
          <Button
            variant="primary"
            href={pdf}
            target="_blank"
            style={{ maxWidth: "250px" }}
          >
            <AiOutlineDownload />
            &nbsp;Download CV
          </Button>
        </Row>

        <Row className="resume">
          <Document file={pdf} onLoadSuccess={onLoadDocument} className="d-flex justify-content-center">
            <Page pageNumber={pageNumber}  scale={width > 786 ? 1.7 : 0.6} />
          </Document>
        </Row>

        <Row style={{ justifyContent: "center", position: "relative", paddingBottom:10, display:pageNumber === numPages ? "none":"block" }}>
          <Button
            variant="primary"
            onClick={nextPage}
            style={{ maxWidth:"60px", borderRadius:30 }}
          >
            &nbsp;<AiOutlineArrowRight />
          </Button>
        </Row>
        <Row style={{ justifyContent: "center", position: "relative", paddingBottom:10, display:pageNumber !== numPages ? "none":"block" }}>
          <Button
            variant="primary"
            onClick={prevPage}
            style={{ maxWidth:"60px", borderRadius:30 }}
          >
            &nbsp;<AiOutlineArrowLeft />
          </Button>
        </Row>
      </Container>
    </div>
  );
}

export default ResumeNew;
