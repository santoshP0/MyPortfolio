import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { Controls } from "../App";

const Car = forwardRef((props, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_, get] = useKeyboardControls();
  const { scene } = useGLTF("/models/car/car.glb");

  const speed = 10;
  const rotationSpeed = 1;

  useFrame(() => {
    const { forward, backward, left, right } = get();

    if (!rigidBodyRef.current) return;

    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    const currentRotation = rigidBodyRef.current.rotation();
    const quaternion = new THREE.Quaternion(
      currentRotation.x,
      currentRotation.y,
      currentRotation.z,
      currentRotation.w
    );

    if (forward) {
      const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
      impulse.x += forwardVector.x * speed;
      impulse.z += forwardVector.z * speed;
    }
    if (backward) {
      const backwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
      impulse.x += backwardVector.x * speed;
      impulse.z += backwardVector.z * speed;
    }
    if (left) {
      torque.y += rotationSpeed;
    }
    if (right) {
      torque.y -= rotationSpeed;
    }

    rigidBodyRef.current.applyImpulse(impulse, true);
    rigidBodyRef.current.applyTorqueImpulse(torque, true);
  });

  return (
    <RigidBody ref={rigidBodyRef} colliders="cuboid" {...props}>
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
});

export default Car;
