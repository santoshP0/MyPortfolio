import React from 'react';
import { Physics } from '@react-three/rapier';
import Ground from './Ground';

function Scene() {
  return (
    <Physics>
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 0]} intensity={1} />
      <Ground />
      {/* Other 3D objects will go here */}
    </Physics>
  );
}

export default Scene;