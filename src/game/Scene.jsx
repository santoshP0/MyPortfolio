import React from "react";
import { Canvas } from "@react-three/fiber";

const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
    </>
  );
};

export default Scene;
