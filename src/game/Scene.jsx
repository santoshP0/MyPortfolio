import React from 'react';
import { Canvas } from '@react-three/fiber';

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={1} />
      {/* Other 3D objects will go here */}
    </>
  );
}

export default Scene;