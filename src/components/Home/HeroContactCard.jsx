import React from "react";
import { Row, Col, Form, Button } from "react-bootstrap";

/**
 * @component
 * @description Renders a contact form card for the hero section.
 * This component includes fields for name, email, and message, along with submit and cancel buttons.
 * It's designed to be used within a flippable card interface.
 *
 * @param {object} props - The component props.
 * @param {object} props.copy - An object containing the text for labels, buttons, and other copy.
 * @param {string} props.emailHref - The `href` value for the direct email link.
 * @param {string} props.emailDisplay - The display text for the direct email link.
 * @param {object} props.formData - An object containing the current values of the form fields (name, email, message).
 * @param {boolean} props.isSubmitting - A boolean indicating whether the form is currently being submitted.
 * @param {function(Event): void} props.onSubmit - The callback function to handle form submission.
 * @param {function(): void} props.onClose - The callback function to handle closing the contact card.
 * @param {function(Event): void} props.onInputChange - The callback function to handle changes in form inputs.
 * @returns {JSX.Element} The rendered contact card component.
 */
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
