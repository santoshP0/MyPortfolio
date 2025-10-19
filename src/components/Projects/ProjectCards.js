import React from "react";
import Button from "react-bootstrap/Button";
import { BsApple, BsMedium, BsAndroid2 } from "react-icons/bs";

function ProjectCard({
  imgPath,
  isBlog,
  title,
  description,
  link,
  AndrLink,
  iosLink,
}) {
  return (
    <article className={`quest-card ${isBlog ? "quest-card--log" : "quest-card--ship"}`}>
      <div className="quest-card__media">
        <img src={imgPath} alt={title} loading="lazy" />
        <span className="quest-card__badge">
          {isBlog ? "Field Report" : "Deployment"}
        </span>
      </div>
      <div className="quest-card__body">
        <h4 className="quest-card__title">{title}</h4>
        <p className="quest-card__desc">{description}</p>
        <div className="quest-card__actions">
          {isBlog ? (
            <Button variant="primary" href={link} target="_blank" rel="noopener noreferrer">
              <BsMedium /> &nbsp;Blog
            </Button>
          ) : (
            <>
              {AndrLink && (
                <Button
                  variant="primary"
                  href={AndrLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsAndroid2 /> &nbsp;Android
                </Button>
              )}
              {iosLink && (
                <Button
                  variant="primary"
                  href={iosLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsApple /> &nbsp;iOS
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProjectCard;
