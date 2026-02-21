export const portfolioData = {
  projects: [
    {
      id: "project1",
      category: "project",
      title: "3D Portfolio Game",
      description:
        "This very portfolio! Built with React Three Fiber, Rapier physics, and Zustand. Drive around a Thar desert, shoot objects, and unlock portfolio sections.",
      tags: ["Three.js", "React", "Rapier", "Vite", "Zustand"],
      links: [
        { label: "GitHub", url: "https://github.com/santosh/portfolio-game" },
        { label: "Live Demo", url: "#" },
      ],
    },
    {
      id: "project2",
      category: "project",
      title: "AI Meeting Agent",
      description:
        "An AI-powered assistant that transcribes, summarises, and assigns action items from meetings using CrewAI and local Ollama models.",
      tags: ["Python", "CrewAI", "Ollama", "Streamlit", "LLM"],
      links: [
        { label: "GitHub", url: "https://github.com/santosh/ai-meeting-agent" },
      ],
    },
  ],
  skills: [
    {
      id: "skill1",
      category: "skill",
      title: "Frontend & 3D",
      description:
        "Proficient in React.js, Three.js, React Three Fiber, GSAP, and modern CSS. I build interactive, animated web experiences from scratch.",
      tags: ["React", "Three.js", "R3F", "GSAP", "CSS", "Vite"],
    },
    {
      id: "skill2",
      category: "skill",
      title: "Backend & AI",
      description:
        "Experienced with Node.js, Python, REST APIs, and integrating LLM services (OpenAI, Gemini, Ollama). End-to-end full-stack development.",
      tags: ["Node.js", "Python", "FastAPI", "OpenAI", "Gemini", "PostgreSQL"],
    },
  ],
  experience: [
    {
      id: "experience1",
      category: "experience",
      title: "Senior Software Engineer",
      description:
        "Developed scalable backend systems and led frontend architecture for a SaaS product serving 50k+ users.",
      company: "Tech Solutions Inc.",
      tags: ["React", "Node.js", "AWS", "PostgreSQL"],
    },
    {
      id: "experience2",
      category: "experience",
      title: "Junior Developer",
      description:
        "Assisted in front-end development and helped ship features for the company's mobile app.",
      company: "Startup Co.",
      tags: ["React Native", "Redux", "Firebase"],
    },
  ],
  contact: {
    id: "contact",
    category: "contact",
    title: "Get in Touch",
    description:
      "I'm open to freelance projects, full-time roles, and interesting collaborations. Drop me a message!",
    links: [
      { label: "✉️ Email", url: "mailto:your.email@example.com" },
      { label: "LinkedIn", url: "https://linkedin.com/in/yourprofile" },
      { label: "GitHub", url: "https://github.com/santosh" },
    ],
  },
};
