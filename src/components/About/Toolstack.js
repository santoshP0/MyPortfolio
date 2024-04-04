import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";

function Toolstack() {
  return (
    <Row style={{ justifyContent: "center", paddingBottom: "20px" }}>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <SiVisualstudiocode />
          <span style={{ fontSize: 10 }} >Visual Studio</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <SiPostman />
          <span style={{ fontSize: 10 }} >Postman</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
      <Row style={{ paddingTop: "20px" }} >
          <SiAndroidstudio />
          <span style={{ fontSize: 10 }} >Android Studio</span>
        </Row>
      </Col>
      <Col xs={4} md={2} className="tech-icons">
        <Row style={{ paddingTop: "20px" }} >
          <SiXcode />
          <span style={{ fontSize: 10 }} >Xcode</span>
        </Row>
      </Col>
    </Row>
  );
}

export default Toolstack;
