import React from "react";
import { Col, Row } from "react-bootstrap";
import {
  SiVisualstudiocode,
  SiPostman,
  SiXcode,
  SiAndroidstudio,
} from "react-icons/si";

const tools = [
  { Icon: SiVisualstudiocode, label: "Visual Studio" },
  { Icon: SiPostman, label: "Postman" },
  { Icon: SiAndroidstudio, label: "Android Studio" },
  { Icon: SiXcode, label: "Xcode" },
];

const Toolstack = () => (
  <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
    {tools.map(({ Icon, label }, index) => (
      <Col key={index} xs={4} md={2} className="tech-icons text-center">
        <Icon size={80} />
        <div style={{ fontSize: 20 }}>{label}</div>
      </Col>
    ))}
  </Row>

);

export default Toolstack;
