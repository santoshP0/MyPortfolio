import React from "react";
import Button from "react-bootstrap/Button";
import { BsApple, BsMedium, BsAndroid2 } from "react-icons/bs";

/**
 * @component
 * @description Renders a card for displaying an individual project or a blog post.
 * The card's appearance and the links it displays are determined by the `isBlog` prop.
 * For projects, it can display separate links for Android and iOS. For blog posts,
 * it shows a single link to the article.
 *
 * @param {object} props - The component props.
 * @param {string} props.imgPath - The path to the project's image.
 * @param {boolean} props.isBlog - If true, the card is styled as a blog post.
 * @param {string} props.title - The title of the project or blog post.
 * @param {string} props.description - A brief description of the project or blog post.
 * @param {string} [props.link] - The URL to the blog post (used if `isBlog` is true).
 * @param {string} [props.AndrLink] - The URL to the Android version of the project.
 * @param {string} [props.iosLink] - The URL to the iOS version of the project.
 * @returns {JSX.Element} The rendered project card.
 */
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
