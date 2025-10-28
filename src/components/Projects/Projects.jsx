import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import {
  PROJECT_DEPLOYMENTS,
  PROJECT_FIELD_NOTES,
  PROJECTS_CONTENT,
} from "../../constants/content";

function Projects() {
  const deployments = useMemo(() => PROJECT_DEPLOYMENTS, []);
  const fieldNotes = useMemo(() => PROJECT_FIELD_NOTES, []);
  const projectsCopy = useMemo(() => PROJECTS_CONTENT, []);

  return (
    <section className="project-section anime-section" id="projects">
      <Container>
        <div className="project-header">
          <span className="project-badge">{projectsCopy.questBadge}</span>
          <h2 className="project-title">
            {projectsCopy.questTitle} <span className="accent">{projectsCopy.questTitleAccent}</span>
          </h2>
          <p className="project-subtitle">
            {projectsCopy.questSubtitle}
          </p>
        </div>

        <div className="quest-grid quest-grid--featured">
          {deployments.map((project) => (
            <div className="quest-grid__item" key={project.title}>
              <ProjectCard {...project} />
            </div>
          ))}
        </div>

        <div className="project-header project-header--secondary">
          <span className="project-badge">{projectsCopy.notesBadge}</span>
          <h3 className="project-title">
            {projectsCopy.notesTitle} <span className="accent">{projectsCopy.notesTitleAccent}</span>
          </h3>
        </div>

        <div className="quest-grid quest-grid--notes">
          {fieldNotes.map((note) => (
            <div className="quest-grid__item" key={note.title}>
              <ProjectCard {...note} />
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

export default Projects;
