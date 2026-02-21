import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore"; // Import the bullet store

const Car = forwardRef((props, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_, get] = useKeyboardControls();
  const { scene } = useGLTF("/models/car/car.glb");
  const addBullet = useBulletStore((state) => state.addBullet);

  const forwardForce = 15;
  const backwardForce = 10;
  const turnTorque = 3;
  const maxSpeed = 10;
  const maxTurnSpeed = 2;
  const bulletSpeed = 50;

  const lastShotTime = useRef(0);
  const shootCooldown = 200; // milliseconds

  useFrame(() => {
    const { forward, backward, left, right, shoot } = get();

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

    const currentVelocity = rigidBodyRef.current.linvel();
    const currentAngularVelocity = rigidBodyRef.current.angvel();

    if (forward) {
      const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
      impulse.x += forwardVector.x * forwardForce;
      impulse.z += forwardVector.z * forwardForce;
    }
    if (backward) {
      const backwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion);
      impulse.x += backwardVector.x * backwardForce;
      impulse.z += backwardVector.z * backwardForce;
    }
    if (left) {
      torque.y += turnTorque;
    }
    if (right) {
      torque.y -= turnTorque;
    }

    // Shooting logic
    if (shoot && Date.now() - lastShotTime.current > shootCooldown) {
      lastShotTime.current = Date.now();
      const carPosition = rigidBodyRef.current.translation();
      const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);
      
      const bulletPosition = new THREE.Vector3(
        carPosition.x + forwardVector.x * 1.5, // Spawn slightly in front of the car
        carPosition.y + 0.5, // Slightly above the car
        carPosition.z + forwardVector.z * 1.5
      );

      const bulletVelocity = new THREE.Vector3(
        forwardVector.x * bulletSpeed,
        forwardVector.y * bulletSpeed,
        forwardVector.z * bulletSpeed
      );

      addBullet(bulletPosition.toArray(), bulletVelocity.toArray());
    }

    // Limit linear velocity
    const linvel = new THREE.Vector3(currentVelocity.x, currentVelocity.y, currentVelocity.z);
    if (linvel.length() > maxSpeed) {
      linvel.normalize().multiplyScalar(maxSpeed);
      rigidBodyRef.current.setLinvel({ x: linvel.x, y: linvel.y, z: linvel.z }, true);
    }

    // Limit angular velocity
    const angvel = new THREE.Vector3(currentAngularVelocity.x, currentAngularVelocity.y, currentAngularVelocity.z);
    if (angvel.length() > maxTurnSpeed) {
      angvel.normalize().multiplyScalar(maxTurnSpeed);
      rigidBodyRef.current.setAngvel({ x: angvel.x, y: angvel.y, z: angvel.z }, true);
    }

    rigidBodyRef.current.applyImpulse(impulse, true);
    rigidBodyRef.current.applyTorqueImpulse(torque, true);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      linearDamping={0.5}
      angularDamping={0.5}
      {...props}
    >
      <primitive object={scene} scale={[0.5, 0.5, 0.5]} />
    </RigidBody>
  );
});

export default Car;
