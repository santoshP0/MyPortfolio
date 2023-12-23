import React, { useState, useEffect } from 'react';
import './App.css';
import Typed from 'react-typed';


const resumeData = {
  name: 'Pottabattini Santosh Kumar',
  location: 'India',
  phone: '(MyphoneNumber)',
  email: '(MyEmail)',
  linkedin: 'LinkedIn',
  summary: 'I am a senior software developer with 4 years of experience in the industry, specialized in React Native mobile app development. I focus on delivering top-notch code while improving user experiences. My goal is to drive innovation and achieve exceptional results in software development projects.',
  education: {
    college: 'MSVE College',
    degree: 'B.Tech in E.C.E',
    graduationDate: 'Apr 2018',
  },
  workExperience: [
    {
      company: 'Bitzop Technologies',
      title: 'React-Native Developer',
      duration: 'Apr 2019 - Aug 2021',
      details: [
        'Translated client-provided designs into intuitive user interfaces.',
        'Developed and implemented custom and reusable UI components.',
        // Add more details as needed
      ],
    },
    {
      company: 'Hexagon Capability Center India Pvt Ltd',
      title: 'Senior Software Developer',
      duration: 'Aug 2021 - Present',
      details: [
        'Integrated Siri features into the app for voice commands.',
        'Identified and resolved compatibility issues during React Native version upgrades.',
        // Add more details as needed
      ],
    },
    // Add more work experience entries if applicable
  ],
  projectExperience: [
    {
      name: 'Health System App',
      duration: 'Apr 2019 - Mar 2021',
      description: 'Developed a comprehensive healthcare app empowering users to monitor their well-being and receive personalized insights.',
    },
    {
      name: "Cogensia's Customer Management Platform",
      duration: 'Mar 2021 - Aug 2021',
      description: 'Contributed to designing UI components and integrating sales and engagement data for a CRM web portal.',
    },
    // Add more project experience entries if applicable
  ],
  skills: ['Javascript', 'Python', 'AWS', 'Nodejs'],
  interests: ['App Development', 'Gaming'],
};

const App = () => {
  const [darkMode, setDarkMode] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : 'light'}`}>
      <button className="mode-toggle" onClick={toggleDarkMode}>
        {darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>

      <header>
        <h1>{resumeData.name}</h1>
        <Typed style={{padding: 3}} strings={[resumeData.summary]} typeSpeed={10} loop={false} />
        <ul className="contact-info">
          {/* <li>
            <i className="fas fa-phone"></i>
            {resumeData.phone}
          </li> */}
          <li>
            <i className="fas fa-envelope"></i>
            {resumeData.email}
          </li>
          <li>
            <i className="fab fa-linkedin"></i>
            <a href={resumeData.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
        </ul>
      </header>

      <section className="work-experience">
        <h2>Work Experience</h2>
        <div className="work-experience-scroll">
          <div className="work-experience-cards">
            {resumeData.workExperience.map((exp, index) => (
              <div key={index} className="work-experience-card">
                <h3>{exp.title}</h3>
                <p>{exp.company}</p>
                <p>{exp.duration}</p>
                <ul>
                  {exp.details.map((detail, i) => (
                    <li key={i}>{detail}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="project-experience">
        <h2>Project Experience</h2>
        {resumeData.projectExperience.map((proj, index) => (
          <div key={index} className="proj">
            <h3>{proj.name}</h3>
            <p>{proj.duration}</p>
            <p>{proj.description}</p>
          </div>
        ))}
      </section>

      <section className="skills">
        <h2>Skills</h2>
        <ul>
          {resumeData.skills.map((skill, index) => (
            <li key={index}>{skill}</li>
          ))}
        </ul>
      </section>

      <section className="interests">
        <h2>Interests</h2>
        <ul>
          {resumeData.interests.map((interest, index) => (
            <li key={index}>{interest}</li>
          ))}
        </ul>
      </section>

      <section className="education">
        <h2>Education</h2>
        <p>{resumeData.education.college}</p>
        <p>{resumeData.education.degree}</p>
        <p>{resumeData.education.graduationDate}</p>
      </section>

      {/* <footer>
        <p>&copy; Your Name</p>
      </footer> */}
    </div>
  );
};

export default App;
