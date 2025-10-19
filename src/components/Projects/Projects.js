import React from "react";
import { Container } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Deno from "../../Assets/Projects/Deno.webp";
import androidWidget from "../../Assets/Projects/androidWidget.jpg";
import MR from "../../Assets/Projects/MR.webp";
import modernNoti from "../../Assets/Projects/modernNoti.webp";
import oncallMobile from "../../Assets/Projects/oncallMobile.webp";
import twilio from "../../Assets/Projects/twilio.png";
import ReactNative from "../../Assets/Projects/ReactNative.png";
import tensor from "../../Assets/Projects/tensor flow.png";

function Projects() {
  const deployments = [
    {
      imgPath: MR,
      title: "Intergraph Mobile Responder RN",
      description:
        "Extends I/CAD capabilities to always-connected responders with native performance, secure messaging, GPS, and camera integrations.",
      AndrLink: "https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en",
      iosLink: "https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198",
    },
    {
      imgPath: oncallMobile,
      title: "OnCall Mobile",
      description:
        "Empowers field units with dispatch intelligence, real-time updates, and frictionless coordination directly on handheld devices.",
      AndrLink: "https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en",
      iosLink: "https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906",
    },
  ];

  const fieldNotes = [
    {
      imgPath: Deno,
      title: "Deno vs Node.js",
      description:
        "A breakdown of performance, security, and DX trade-offs across REST, WebSocket, and GraphQL builds.",
      link: "https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6",
      isBlog: true,
    },
    {
      imgPath: androidWidget,
      title: "Custom Android Widgets",
      description:
        "How I reimagined React Native widgets to keep audiences locked into core flows from the home screen.",
      link: "https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06",
      isBlog: true,
    },
    {
      imgPath: modernNoti,
      title: "Modern Notifications",
      description:
        "Taming Notifee for cinematic push notifications with rich media, deep links, and custom actions.",
      link: "https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712",
      isBlog: true,
    },
    {
      imgPath: tensor,
      title: "Object Detection App",
      description:
        "Deploying TensorFlow-powered recognition in React Native for real-time scene awareness.",
      link: "http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/",
      isBlog: true,
    },
    {
      imgPath: ReactNative,
      title: "Best Practices",
      description:
        "The key systems that keep React Native apps fast, stable, and ready for scale.",
      link: "http://blog.zenof.ai/8-best-practices-for-your-react-native-app/",
      isBlog: true,
    },
    {
      imgPath: twilio,
      title: "Video Calling App",
      description:
        "Building production-ready Twilio video experiences with call controls and polished UX.",
      link: "http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/",
      isBlog: true,
    },
  ];

  return (
    <section className="project-section anime-section" id="projects">
      <Container>
        <div className="project-header">
          <span className="project-badge">[Quest Log]</span>
          <h2 className="project-title">
            Missions <span className="accent">& Builds</span>
          </h2>
          <p className="project-subtitle">
            A curated list of shipped products and artifact notes that shaped my journey.
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
          <span className="project-badge">[Field Notes]</span>
          <h3 className="project-title">
            Writing the <span className="accent">Strategy</span>
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
