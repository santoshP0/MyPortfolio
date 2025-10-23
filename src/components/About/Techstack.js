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
  SiFirebase, SiTypescript, SiKotlin, SiApple
} from "react-icons/si";

const techList = [
  { Icon: DiJavascript1, label: "Javascript" },
  { Icon: SiTypescript, label: "TypeScript" },
  { Icon: SiKotlin, label: "Kotlin" },
  { Icon: DiNodejs, label: "Node js" },
  { Icon: DiReact, label: "React-native" },
  { Icon: DiReact, label: "React js" },
  { Icon: DiMongodb, label: "Mongodb" },
  { Icon: DiGit, label: "Git" },
  { Icon: SiFirebase, label: "Firebase" },
  { Icon: DiPython, label: "Python" },
  { Icon: DiAndroid, label: "Android" },
  { Icon: SiApple, label: "iOS" },
  { Icon: DiAws, label: "AWS" },
];

const Techstack = () => (
  <Row style={{ justifyContent: "center", paddingBottom: "50px" }}>
    {techList.map(({ Icon, label }, index) => (
      <Col key={index} xs={4} md={2} className="tech-icons text-center">
        <Icon size={80} />
        <div style={{ fontSize: 20 }}>{label}</div>
      </Col>
    ))}
  </Row>
);

export default Techstack;
