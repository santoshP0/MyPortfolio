import React from "react";
import Card from "react-bootstrap/Card";
import { ImPointRight } from "react-icons/im";

function AboutCard() {
  return (
    <Card className="quote-card-view">
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p style={{ textAlign: "justify" }}>
            Hi Everyone, I am <span className="purple">Pottabattini Santosh Kumar </span>
            from <span className="purple"> Telangana, India.</span>
            <br />
            I am currently employed as a <span className="purple">Senior Software Developer </span>
            at <a href="https://hexagon.com/company/careers/capability-centre-india" target="_blank" className="purple">Hexagon's Capability Center India (HCCI) </a>.
            <br />
            I have earned a <span className="purple"> Bachelor of Technology (B.Tech) </span> degree with a specialization in Computer Science Engineering (CSE) from Mahaveer Institute of science and technology.
            <br />
            <br />
            Apart from coding, some other activities that I love to do!
          </p>
          <ul>
            <li className="about-activity">
              <ImPointRight /> Playing Games
            </li>
            <li className="about-activity">
              <ImPointRight /> Exploring New Tech
            </li>
            <li className="about-activity">
              <ImPointRight /> Watching Movies/Animes/TV series
            </li>
          </ul>
        </blockquote>
      </Card.Body>
    </Card>
  );
}

export default AboutCard;
