import React from "react";
import { Physics } from "@react-three/rapier";
import Ground from "./Ground";
import { Player } from "./Player";

const Scene = () => {
  return (
    <Physics debug>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Player />
      <Ground />
    </Physics>
  );
};

export default Scene;
