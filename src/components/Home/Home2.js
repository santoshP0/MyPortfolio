import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import myImg from "../../Assets/profilepic.png";
import Tilt from "react-parallax-tilt";
import {
  AiTwotoneMail,
  AiFillInstagram,
} from "react-icons/ai";
import { FaLinkedinIn } from "react-icons/fa";

function Home2() {
  return (
    <Container fluid className="home-about-section" id="about">
      <Container>
        <Row>
          <Col className="home-about-description">
            <h1 style={{ fontSize: "2.6em" }}>
              LET ME <span className="purple"> INTRODUCE </span> MYSELF
            </h1>
            <p className="home-about-body">
              I'm a software engineer deeply passionate about building impactful applications for both Android and iOS platforms. 
              Within my <span className="purple">4.5 years</span> of industry experience, I have committed <span className="purple">4 years</span> exclusively to professional <span className="purple">React Native development</span>, specializing in crafting seamless cross-platform experiences.
              Additionally, I possess proficiency in <span className="purple">React.js</span>.
              <br />
              <br />Proficient in  
              <b className="purple"> React Native</b>,
              <b className="purple"> React.js</b>,
              <b className="purple"> Node.js</b>,
              <b className="purple"> AWS</b> with expertise in 
              <b className="purple"> TypeScript</b>,
              <b className="purple"> JavaScript</b> and
              <b className="purple"> Python</b>
              <br />
              <br />
              My field of Interest's are building new &nbsp;
              <i>
                <b className="purple">Android and IOS Apps </b> and
                also in areas related to{" "}
                <b className="purple">
                  Data Structure and Algorithms
                </b>
              </i>
              <br />
              <br />
              Whenever possible, I also apply my passion for developing products
              with <b className="purple">Node.js</b> and
              <i>
                <b className="purple">
                  {" "}
                  Modern Javascript Library and Frameworks
                </b>
              </i>
              &nbsp; like
              <i>
                <b className="purple"> React-native and React.js</b>
              </i>
            </p>
          </Col>
        </Row>
      </Container>
    </Container>
  );
}
export default Home2;
