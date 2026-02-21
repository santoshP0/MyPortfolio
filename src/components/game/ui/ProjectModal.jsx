import React from 'react';
import { useUIStore } from '../../../stores/useUIStore.js';
import '../../../styles/ProjectModal.css';

const ProjectModal = () => {
  const { isProjectModalOpen, projectData, closeProjectModal } = useUIStore();

  if (!isProjectModalOpen || !projectData) {
    return null;
  }

  return (
    <div className="modal-overlay" onClick={closeProjectModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-button" onClick={closeProjectModal}>X</button>
        <h1>{projectData.title}</h1>
        {projectData.image && <img src={projectData.image} alt={projectData.title} />}
        <p>{projectData.description}</p>
        {projectData.technologies && projectData.technologies.length > 0 && (
          <div className="project-technologies">
            <h3>Technologies:</h3>
            <ul>
              {projectData.technologies.map((tech, index) => (
                <li key={index}>{tech}</li>
              ))}
            </ul>
          </div>
        )}
        {projectData.link && (
          <a href={projectData.link} target="_blank" rel="noopener noreferrer">View Project</a>
        )}
      </div>
    </div>
  );
};

export default ProjectModal;