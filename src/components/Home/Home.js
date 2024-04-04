import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import homeLogo from "../../Assets/home-main-img-nobg.png";
import Particle from "../Particle";
import Home2 from "./Home2";
import Type from "./Type";

function Home() {
  return (
    <>
      <Container fluid className="home-section" id="home">
        <Particle />
        <Container className="home-content d-flex align-items-center justify-content-center text-center">
            <Col className="lead" >
              <h1 style={{ paddingBottom: 15 }} className="display-3">
                Hi, Iam <strong> Pottabattini Santosh. </strong>
              </h1>
              <h1 style={{ paddingBottom: 15 }} className="display-4">
                <strong className="main-name"> Im a Mobile App Developer </strong>
              </h1>
              <div style={{ padding: 50, justifyContent:"center", textAlign:"center", alignItems:"center"}} className="display-10">
                <Type />
              </div>
            </Col>

        </Container>
      </Container>
      <Home2 />
    </>
  );
}

export default Home;
