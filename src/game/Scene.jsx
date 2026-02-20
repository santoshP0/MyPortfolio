import React from "react";
import { Physics } from "@react-three/rapier";
import Ground from "./Ground";

const Scene = () => {
  return (
    <Physics debug>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Ground />
    </Physics>
  );
};

export default Scene;
