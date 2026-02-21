import React, { useRef, useEffect, forwardRef, useImperativeHandle, memo, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Controls } from "../App";
import { useBulletStore } from "../store/useBulletStore";

const CarModel = () => {
  const gltf = useLoader(GLTFLoader, "/models/car/car.glb");
  return <primitive object={gltf.scene} scale={[0.5, 0.5, 0.5]} />;
};

const Car = memo(forwardRef((props, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_, get] = useKeyboardControls();
  const addBullet = useBulletStore((state) => state.addBullet);

  const forwardForce = 15;
  const backwardForce = 10;
  const turnTorque = 3;
  const maxSpeed = 10;
  const maxTurnSpeed = 2;
  const bulletSpeed = 50;

  const lastShotTime = useRef(0);
  const shootCooldown = 200; // milliseconds

  const engineAudioRef = useRef();
  const shootAudioRef = useRef(); // Ref for shoot audio

  useFrame((state) => {
    const { forward, backward, left, right, shoot } = get();

    if (!rigidBodyRef.current) return;

    const velocity = rigidBodyRef.current.linvel();
    const rotation = rigidBodyRef.current.rotation();
    const quaternion = new THREE.Quaternion(rotation.x, rotation.y, rotation.z, rotation.w);
    const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(quaternion);

    // Engine sound volume based on speed
    if (engineAudioRef.current) {
      const speed = new THREE.Vector3(velocity.x, 0, velocity.z).length();
      engineAudioRef.current.setVolume(Math.min(speed / (maxSpeed / 2), 1));
    }

    // Movement logic
    let newVelocity = new THREE.Vector3(velocity.x, velocity.y, velocity.z);
    if (forward) {
      newVelocity.add(forwardVector.clone().multiplyScalar(forwardForce * 0.1));
    }
    if (backward) {
      newVelocity.add(forwardVector.clone().multiplyScalar(-backwardForce * 0.1));
    }

    // Limit speed
    if (newVelocity.length() > maxSpeed) {
      newVelocity.normalize().multiplyScalar(maxSpeed);
    }
    rigidBodyRef.current.setLinvel(newVelocity, true);

    // Turning logic
    if (left) {
      rigidBodyRef.current.setAngvel({ x: 0, y: turnTorque, z: 0 }, true);
    } else if (right) {
      rigidBodyRef.current.setAngvel({ x: 0, y: -turnTorque, z: 0 }, true);
    } else {
      rigidBodyRef.current.setAngvel({ x: 0, y: 0, z: 0 }, true);
    }

    // Shooting logic
    if (shoot && Date.now() - lastShotTime.current > shootCooldown) {
      lastShotTime.current = Date.now();
      const carPosition = rigidBodyRef.current.translation();

      const bulletPosition = new THREE.Vector3(
        carPosition.x + forwardVector.x * 2,
        carPosition.y + 1,
        carPosition.z + forwardVector.z * 2
      );

      const bulletVelocity = forwardVector.clone().multiplyScalar(bulletSpeed);
      addBullet(bulletPosition.toArray(), bulletVelocity.toArray());
      if (shootAudioRef.current) shootAudioRef.current.play();
    }

    // Camera follow
    const carPosition = rigidBodyRef.current.translation();
    const cameraOffset = new THREE.Vector3(0, 5, 10).applyQuaternion(quaternion);
    const cameraPosition = new THREE.Vector3(
      carPosition.x + cameraOffset.x,
      carPosition.y + cameraOffset.y,
      carPosition.z + cameraOffset.z
    );
    state.camera.position.lerp(cameraPosition, 0.1);
    state.camera.lookAt(carPosition.x, carPosition.y + 1, carPosition.z);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      position={[0, 2, 0]}
      linearDamping={0.5}
      angularDamping={0.5}
      {...props}
    >
      <Suspense fallback={null}>
        <CarModel />
      </Suspense>
      <PositionalAudio ref={engineAudioRef} url="/audio/engine_loop.mp3" loop autoplay />
      <PositionalAudio ref={shootAudioRef} url="/audio/shoot.mp3" />
    </RigidBody>
  );
}));

export default Car;
