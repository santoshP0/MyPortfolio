import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

function HeroContactCard({
  copy,
  emailHref,
  emailDisplay,
  formData,
  isSubmitting,
  onSubmit,
  onClose,
  onInputChange,
}) {
  return (
    <div className="hero-contact">
      <Row className="hero-contact__row align-items-start gy-4">
        <Col lg={6} className="hero-contact__copy">
          <span className="hero-contact__badge">{copy.badge}</span>
          <h3 className="hero-contact__title">{copy.title}</h3>
          <p className="hero-contact__subtitle">{copy.blurb}</p>
          <p className="hero-contact__subtitle hero-contact__subtitle--muted">
            {copy.secondaryBlurb}{" "}
            <a href={emailHref}>{emailDisplay}</a>.
          </p>
        </Col>
        <Col lg={6} className="hero-contact__form-col">
          <Form className="hero-contact__form" onSubmit={onSubmit}>
            <Form.Group controlId="contactName">
              <Form.Label>{copy.nameLabel}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={onInputChange}
                placeholder="Your name"
                autoComplete="name"
              />
            </Form.Group>
            <Form.Group controlId="contactEmail">
              <Form.Label>{copy.emailLabel}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={onInputChange}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </Form.Group>
            <Form.Group controlId="contactMessage">
              <Form.Label>{copy.messageLabel}</Form.Label>
              <Form.Control
                as="textarea"
                name="message"
                value={formData.message}
                onChange={onInputChange}
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
                {copy.submit}
              </Button>
              <Button
                type="button"
                variant="outline-light"
                onClick={onClose}
                className="hero-contact__back"
                disabled={isSubmitting}
              >
                {copy.cancel}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
}

export default HeroContactCard;
