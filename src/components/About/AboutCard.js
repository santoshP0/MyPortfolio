import React, { useCallback, useMemo } from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";
import { ABOUT_CARD_CONTENT } from "../../constants/content";

function AboutCard() {
  const paragraphs = useMemo(
    () => [
      ABOUT_CARD_CONTENT.introSegments,
      ABOUT_CARD_CONTENT.jobSegments,
      ABOUT_CARD_CONTENT.educationSegments,
    ],
    []
  );

  const activities = useMemo(() => ABOUT_CARD_CONTENT.activities, []);

  const renderSegments = useCallback((segments) => (
    segments.map((segment, index) => {
      switch (segment.type) {
        case "accent":
          return (
            <span className="purple" key={`${segment.type}-${index}`}>
              {segment.value}
            </span>
          );
        case "link":
          return (
            <a
              key={`${segment.type}-${index}`}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className="purple"
            >
              {segment.value}
            </a>
          );
        default:
          return (
            <React.Fragment key={`${segment.type}-${index}`}>
              {segment.value}
            </React.Fragment>
          );
      }
    })
  ), []);

  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            {paragraphs.map((segments, index) => (
              <React.Fragment key={`paragraph-${index}`}>
                {renderSegments(segments)}
                <br />
                {index === paragraphs.length - 1 && <br />}
              </React.Fragment>
            ))}
            {ABOUT_CARD_CONTENT.activitiesHeading}
          </p>
          <ul>
            {activities.map((activity) => (
              <li className="about-activity" key={activity}>
                <ImPointRight /> {activity}
              </li>
            ))}
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
