import React from "react";
import Particles from "react-tsparticles";

function Particle() {
  return (
    <Particles
      id="tsparticles"
      options={{
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "canvas",
          events: {
            onClick: {
              enable: true,
              mode: "push",
            },
            resize: true,
          },
          modes: {
            push: {
              quantity: 1,
            },
          },
        },
        particles: {
          number: {
            value: 150,
            density: {
              enable: true,
              value_area: 800,
            },
          },
          color: {
            value: "#ffffff", // Color of the snowflakes
          },
          shape: {
            type: "polygon", // Shape of the snowflakes
          },
          opacity: {
            value: 0.5,
            random: true,
            anim: {
              enable: true,
              speed: 0.3,
              opacity_min: 0,
              sync: false,
            },
          },
          size: {
            value: 3, // Size of the snowflakes
            random: true,
          },
          line_linked: {
            enable: false,
          },
          move: {
            enable: true,
            direction: "bottom",
            random: true,
            speed: 1, // Speed of snowflakes falling
            out_mode: "out",
          },
        },
      }}
    />
  );
}

export default Particle;
