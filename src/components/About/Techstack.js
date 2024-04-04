import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  DiJavascript1,
  DiReact,
  DiNodejs,
  DiMongodb,
  DiPython,
  DiGit,
  DiAndroid,
  DiAws
} from "react-icons/di";
import {
  SiFirebase,
} from "react-icons/si";

function Techstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
      <Col xs={4} md={2} className="tech-icons">
      <Row style={{ paddingTop: "20px" }} >
          <DiJavascript1 />
          <span style={{ fontSize: 10 }} >Javascript</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiNodejs />
          <span style={{ fontSize: 10 }} >Node js</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiReact />
          <span style={{ fontSize: 10 }} >React-native</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiReact />
          <span style={{ fontSize: 10 }} >React js</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiMongodb />
          <span style={{ fontSize: 10 }} >Mongodb</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiGit />
          <span style={{ fontSize: 10 }} >Git</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <SiFirebase />
          <span style={{ fontSize: 10 }} >Firebase</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiPython />
          <span style={{ fontSize: 10 }} >Python</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiAndroid />
          <span style={{ fontSize: 10 }} >Android</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <DiAws />
          <span style={{ fontSize: 10 }} >AWS</span>
        </Row>
      </Col>
    </Row>
  );
}

export default Techstack;
