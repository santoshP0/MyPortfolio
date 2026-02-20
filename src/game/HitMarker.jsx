import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import * as THREE from "three";

const HitMarker = ({ position, onFade }) => {
  const meshRef = useRef();
  const startTime = useRef(Date.now());

  useFrame(() => {
    if (Date.now() - startTime.current > 200) { // 200ms duration
      onFade();
    }
  });

  return (
    <Sphere args={[0.05, 16, 16]} position={position} ref={meshRef}>
      <meshStandardMaterial color="red" emissive="red" emissiveIntensity={2} />
    </Sphere>
  );
};

export default HitMarker;
