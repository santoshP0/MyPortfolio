import React from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { BsApple, BsMedium, BsAndroid2 } from "react-icons/bs";

function ProjectCards(props) {
  return (
    <Card className="project-card-view d-flex flex-column">
      {
       props.isBlog ? (
        <Card.Img variant="top" src={props.imgPath} alt="card-img" style={{ height: "250px", objectFit: "cover" }}  />
      ) : (
        <Card.Img variant="top" src={props.imgPath} alt="card-img"  />
      )
      }
      <Card.Body>
        <Card.Title style={{lineClamp: 2}} >{props.title}</Card.Title>
        {
          props.isBlog ? (
            <Card.Text className="card-text-4-lines">
              {props.description}
            </Card.Text>
          ) : (
            <Card.Text  style={{ textAlign: "justify" }}>
              {props.description}
            </Card.Text>
          )
        }
        {props.isBlog && (
          <Button variant="primary" href={props.link} target="_blank">
            <BsMedium /> &nbsp;
            Blog
          </Button>
        )}
        
        {"\n"}
        {"\n"}

        {/* If the component contains Demo link and if it's not a Blog then, it will render the below component  */}

        {!props.isBlog && props.AndrLink && (
          <Button
            variant="primary"
            href={props.AndrLink}
            target="_blank"
            style={{ marginLeft: "10px" }}
          >
            <BsAndroid2 /> &nbsp;
            Android
          </Button>
        )}
        {!props.isBlog && props.iosLink && (
          <Button
            variant="primary"
            href={props.iosLink}
            target="_blank"
            style={{ marginLeft: "10px" }}
          >
            <BsApple /> &nbsp;
            IOS
          </Button>
        )}
      </Card.Body>
    </Card>
  );
}
export default ProjectCards;
