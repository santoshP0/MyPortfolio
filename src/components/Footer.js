import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import {
  AiFillMail
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <Container fluid className="footer">
      <Row>
        <Col md="6" className="footer-copywright">
          <h3>This website runs on 99% pixels, 1% magic, and a sprinkle of chaotic energy</h3>
        </Col>
        <Col md="2" className="footer-copywright">
        </Col>
        <Col md="4" className="footer-body">
          <ul className="footer-icons">
            <li className="social-icons">
            </li>
            <li className="social-icons">
              <a
                href="https://www.linkedin.com/in/santosh-kumar-649928265"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
            </li>
            <li className="social-icons">
              <a
                href="mailto:santosh.pk@hotmail.com"
                style={{ color: "white" }}
                target="_blank" 
                rel="noopener noreferrer"
              >
                <AiFillMail />
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default Footer;
