import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center gy-3">
          <Col md={7} className="footer-copywright">
            <span className="footer-tag">[End Credits]</span>
            <h3>Thanks for exploring this world. Let’s build the next realm together.</h3>
          </Col>
          <Col md={5} className="footer-body">
            <ul className="footer-icons">
              <li className="social-icons">
                <a
                  href="mailto:santoshpk.mdev@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Email"
                >
                  <AiFillMail />
                </a>
              </li>
              <li className="social-icons">
                <a
                  href="https://www.linkedin.com/in/santosh-kumar-649928265"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                >
                  <FaLinkedinIn />
                </a>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
