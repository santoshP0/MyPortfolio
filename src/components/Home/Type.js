import React from "react";
import Typewriter from "typewriter-effect";

function Type() {
  return (
    <Typewriter
      options={{
        strings: [
          "Senior Software Developer",
          "Mobile App Developer",
          "React-native Developer",
          "Tech Enthusiast",
          "Problem Solver and Strategist"
        ],
        autoStart: true,
        loop: true,
        deleteSpeed: 50,
      }}
    />
  );
}

export default Type;
