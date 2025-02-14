import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProjectCard from "./ProjectCards";
import Particle from "../Particle";
import Deno from "../../Assets/Projects/Deno.webp";
import androidWidget from "../../Assets/Projects/androidWidget.jpg";
import MR from "../../Assets/Projects/MR.webp";
import modernNoti from "../../Assets/Projects/modernNoti.webp";
import oncallMobile from "../../Assets/Projects/oncallMobile.webp";
import twilio from "../../Assets/Projects/twilio.png";
import ReactNative from "../../Assets/Projects/ReactNative.png";
import tensor from "../../Assets/Projects/tensor flow.png";

function Projects() {
  return (
    <Container fluid className="project-section">
      <Particle />
      <Container>
        <h1 className="project-heading">
          <strong className="purple">Projects </strong>
        </h1>
        <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
              <ProjectCard
                imgPath={MR}
                isBlog={false}
                title="Intergraph Mobile Responder RN"
                description="Intergraph's Mobile Responder extends our industry-leading computer-aided dispatch (I/CAD) to smartphones and tablets. It’s an easy-to-use, lower-cost option that improves safety and productivity by giving field personnel constant access to CAD. With Mobile Responder, you can view incident details, receive and acknowledge messages, update status, query databases, and more. Our native app performs better than browser-based solutions, and incorporates native device capabilities, such as push notifications, GPS, and the camera."
                AndrLink="https://play.google.com/store/apps/details?id=com.hexagon.mobileresponder&hl=en"
                iosLink="https://apps.apple.com/us/app/intergraph-mobile-responder-rn/id6474117198"
              />
            </Col>
          <Col md={4} className="project-card">
              <ProjectCard
                imgPath={oncallMobile}
                isBlog={false}
                title="OnCall Mobile"
                description="HxGN OnCall Dispatch | Mobile Responder connects first responders to the PSAP via a smartphone or hand-held tablet. Fully integrated with HxGN OnCall Dispatch, the mobile app helps public safety agencies make smarter decisions and improve safety and efficiency in the field."
                AndrLink="https://play.google.com/store/apps/details?id=com.hexagon.oncallmobile&hl=en"
                iosLink="https://apps.apple.com/us/app/hxgn-oncall-mobile/id1502277906"
              />
            </Col>
        </Row>
        <h1 className="project-heading">
          My <strong className="purple">Blogs </strong>
        </h1>
         <Row style={{ justifyContent: "center", paddingBottom: "10px" }}>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={Deno}
              isBlog={true}
              title="Deno vs Node.js"
              description="Explored the key differences between Deno and Node.js by comparing their performance, security, and developer experience in REST APIs, WebSockets, and GraphQL."
              link="https://medium.com/@santosh.pk/building-a-rest-api-websocket-and-graphql-server-in-deno-25616c95c5a6"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={androidWidget}
              isBlog={true}
              title="Custom Android Widgets"
              description="Explored how to create and manage Android home screen widgets using React Native, improving user engagement and accessibility"
              link="https://medium.com/@santosh.pk/implementation-of-react-native-widget-for-android-14fe648a9b06"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={modernNoti}
              isBlog={true}
              title="Modern Notifications"
              description="Implemented advanced push notifications in React Native using Notifee, featuring rich media, custom actions, and background handling."
              link="https://medium.com/@santosh.pk/implementing-modern-push-notifications-in-react-native-android-notifee-72de60ee2712"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={tensor}
              isBlog={true}
              title="Object Detection App"
              description="Built a React Native app leveraging TensorFlow for real-time object detection, enabling users to identify and track objects using their device camera."
              link="http://blog.zenof.ai/building-react-native-object-detection-app-using-tensorflow-with-react-hooks/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={ReactNative}
              isBlog={true}
              title="best practices for react native"
              description="Explored essential techniques for enhancing performance, handling navigation, managing dependencies, and writing maintainable code"
              link="http://blog.zenof.ai/8-best-practices-for-your-react-native-app/"
            />
          </Col>
          <Col md={4} className="project-card">
            <ProjectCard
              imgPath={twilio}
              isBlog={true}
              title="video calling app"
              description="Built a high-quality video calling app using Twilio, featuring real-time communication, call controls, and a seamless user experience"
              link="http://blog.zenof.ai/create-a-react-native-video-calling-app-using-twilio/"
            />
          </Col>
        </Row>
      </Container>
    </Container>
  );
}

export default Projects;
