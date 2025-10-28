import React, { useMemo } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { AiFillMail } from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";
import { FOOTER_CONTENT } from "../constants/content";

const iconMap = {
  mail: AiFillMail,
  linkedin: FaLinkedinIn,
};

function Footer() {
  const links = useMemo(
    () =>
      FOOTER_CONTENT.links.map((link) => ({
        ...link,
        Icon: iconMap[link.icon],
      })),
    []
  );

  return (
    <footer className="footer">
      <Container>
        <Row className="align-items-center gy-3">
          <Col md={7} className="footer-copywright">
            <span className="footer-tag">{FOOTER_CONTENT.tag}</span>
            <h3>{FOOTER_CONTENT.message}</h3>
          </Col>
          <Col md={5} className="footer-body">
            <ul className="footer-icons">
              {links.map(({ id, href, label, Icon }) => (
                <li className="social-icons" key={id}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    {Icon ? <Icon /> : null}
                  </a>
                </li>
              ))}
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
