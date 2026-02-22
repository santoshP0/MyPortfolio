import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider, useRapier } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useAudioStore } from "../store/useAudioStore";
import { useDiscoveryStore } from "../store/useDiscoveryStore";
import { terrainHeight } from "../utils/terrain";

useGLTF.preload("/models/car/car.glb");

const CarModel = () => {
  const { scene } = useGLTF("/models/car/car.glb");

  useEffect(() => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [scene]);

  // Lifted from -0.6 to -0.4 to sit higher on wheels
  return <primitive object={scene} scale={[0.5, 0.5, 0.5]} rotation={[0, Math.PI, 0]} position={[0, -0.4, 0]} />;
};

const ACCELERATION = 2.5;
const BRAKE_FORCE = 4.0;
const MAX_SPEED = 20;
const TURN_SPEED = 3.0;
const BOUNDARY = 44;

const Car = memo(forwardRef(({ carStateRef, ...props }, fwdRef) => {
  const rigidBodyRef = useRef();
  useImperativeHandle(fwdRef, () => rigidBodyRef.current);

  const [_s, get] = useKeyboardControls();
  const engineRef = useRef();
  const engineVolume = useAudioStore((s) => s.engineVolume);
  const gameStarted = useDiscoveryStore((s) => s.gameStarted);

  const orbitAngle = useRef(0);
  const orbitPitch = useRef(0.4);
  const zoomOffset = useRef(0);
  const lastMouseTime = useRef(0);

  const interacting = useDiscoveryStore((s) => s.interacting);
  const paused = useDiscoveryStore((s) => s.paused);
  const setInteracting = useDiscoveryStore((s) => s.setInteracting);
  const activeZonePosition = useDiscoveryStore((s) => s.activeZonePosition);

  // Pointer lock handling
  useEffect(() => {
    const onMouseMove = (e) => {
      if (interacting || paused) return;
      lastMouseTime.current = Date.now();
      orbitAngle.current -= (e.movementX || 0) * 0.003;
      orbitPitch.current = Math.max(0.1, Math.min(1.2, orbitPitch.current + (e.movementY || 0) * 0.002));
    };

    const onMouseDown = () => {
      const canvas = document.querySelector("canvas");
      if (canvas && gameStarted && !interacting && !paused) canvas.requestPointerLock();
    };

    const onWheel = (e) => {
      if (paused) return;
      // Reversed: Scroll up (negative deltaY) zooms IN (subtract from distance)
      zoomOffset.current = THREE.MathUtils.lerp(zoomOffset.current, Math.max(-10, Math.min(25, zoomOffset.current + e.deltaY * 0.015)), 0.5);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("wheel", onWheel);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [interacting, paused, gameStarted]);

  useEffect(() => {
    if (interacting || paused) {
      document.exitPointerLock();
    }
  }, [interacting, paused]);

  // Enable all rotations for slanting/tilting
  useEffect(() => {
    if (rigidBodyRef.current?.setEnabledRotations) {
      rigidBodyRef.current.setEnabledRotations(true, true, true, true);
    }
  }, []);

  // Reused vectors
  const _quat = useRef(new THREE.Quaternion()).current;
  const _fwd = useRef(new THREE.Vector3()).current;
  const _lat = useRef(new THREE.Vector3()).current;
  const _up = useRef(new THREE.Vector3(0, 1, 0)).current;
  const _velXZ = useRef(new THREE.Vector3()).current;
  const _camOffset = useRef(new THREE.Vector3()).current;
  const _camTarget = useRef(new THREE.Vector3()).current;
  const _lookTgt = useRef(new THREE.Vector3()).current;
  const camPos = useRef(new THREE.Vector3(0, 10, 20));
  const camLook = useRef(new THREE.Vector3(0, 1.5, 0));

  useFrame((state, dt) => {
    if (!rigidBodyRef.current) return;
    const { forward, backward, left, right } = get();

    const vel = rigidBodyRef.current.linvel();
    const rot = rigidBodyRef.current.rotation();
    const pos = rigidBodyRef.current.translation();

    _quat.set(rot.x, rot.y, rot.z, rot.w);
    _fwd.set(0, 0, -1).applyQuaternion(_quat);
    _lat.set(1, 0, 0).applyQuaternion(_quat);

    _velXZ.set(vel.x, 0, vel.z);
    const speed = _velXZ.length();
    const signedSpeed = _velXZ.dot(_fwd);
    const isMovingFwd = signedSpeed > 0.5;

    // Driving logic (W/S)
    let nx = vel.x, nz = vel.z;
    if (!interacting && !paused) {
      if (forward) {
        nx += _fwd.x * ACCELERATION;
        nz += _fwd.z * ACCELERATION;
      } else if (backward) {
        const f = isMovingFwd ? -BRAKE_FORCE : -ACCELERATION * 0.7;
        nx += _fwd.x * f;
        nz += _fwd.z * f;
      } else {
        nx *= 0.95; nz *= 0.95;
      }

      const spd = Math.sqrt(nx * nx + nz * nz);
      if (spd > MAX_SPEED) { nx *= MAX_SPEED / spd; nz *= MAX_SPEED / spd; }
    } else {
      nx *= 0.9; nz *= 0.9; // Stop car if interacting
    }

    // Steering logic (A/D)
    const isReversing = signedSpeed < -0.4;
    const turnSign = isReversing ? -1 : 1;
    let ay = 0;
    if (!interacting && !paused && speed > 0.2) {
      ay = left ? TURN_SPEED * turnSign : right ? -TURN_SPEED * turnSign : 0;
    }

    rigidBodyRef.current.setLinvel({ x: nx, y: vel.y, z: nz }, true);
    rigidBodyRef.current.setAngvel({ x: 0, y: ay, z: 0 }, true);

    // ── Terrain Normal Alignment (Tilt) ──
    const hCenter = terrainHeight(pos.x, pos.z);
    const step = 0.6;
    const hFwd = terrainHeight(pos.x + _fwd.x * step, pos.z + _fwd.z * step);
    const hRight = terrainHeight(pos.x + _lat.x * step, pos.z + _lat.z * step);

    // Dynamic tilt correction torque
    const pitch = (hCenter - hFwd) / step;
    const roll = (hCenter - hRight) / step;

    // Low torque to follow terrain without flipping
    rigidBodyRef.current.applyTorqueImpulse({
      x: (pitch * _lat.x + roll * _fwd.x) * 1.5,
      y: 0,
      z: (pitch * _lat.z + roll * _fwd.z) * 1.5
    }, true);

    // Update carState
    if (carStateRef?.current) {
      carStateRef.current.position.set(pos.x, pos.y, pos.z);
      carStateRef.current.quaternion.copy(_quat);
      carStateRef.current.speed = speed;
    }

    // Apply volume/pitch from store + dynamic revving
    // Steady Engine Hum modulation
    if (gameStarted && engineRef.current) {
      const isMoving = speed > 0.5;
      const revving = Math.min(speed / MAX_SPEED, 1);

      // Minimal pitch variation (steady hum)
      // Idle: 0.6, Max Speed: 0.8
      engineRef.current.setPlaybackRate(0.6 + revving * 0.2);

      // Volume follows movement: low at idle, steady when driving
      const volFactor = isMoving ? 0.8 + (revving * 0.2) : 0.5;
      engineRef.current.setVolume(engineVolume * 0.35 * volFactor);
    }

    // Dynamic zoom based on interaction + manual scroll
    const baseDist = 14 + zoomOffset.current;
    const targetDist = interacting ? 3.0 : baseDist; // Ultra zoom (3m)
    const targetFov = interacting ? 30 : 70; // High detail FOV (30)
    state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFov, 0.1);
    state.camera.updateProjectionMatrix();

    // Smoother lerp for the actual camera distance
    const currentDist = THREE.MathUtils.lerp(baseDist, targetDist, interacting ? 0.15 : 0.08);

    const now = Date.now();
    if (!interacting && now - lastMouseTime.current > 1200 && speed > 2) {
      orbitAngle.current = THREE.MathUtils.lerp(orbitAngle.current, 0, 0.05);
      orbitPitch.current = THREE.MathUtils.lerp(orbitPitch.current, 0.4, 0.03);
    }

    const carAngle = Math.atan2(_fwd.x, _fwd.z);
    const targetAngle = carAngle + Math.PI + orbitAngle.current;

    _camOffset.set(
      Math.sin(targetAngle) * currentDist * Math.cos(orbitPitch.current),
      Math.sin(orbitPitch.current) * currentDist,
      Math.cos(targetAngle) * currentDist * Math.cos(orbitPitch.current)
    );

    _camTarget.set(pos.x + _camOffset.x, pos.y + _camOffset.y, pos.z + _camOffset.z);
    camPos.current.lerp(_camTarget, interacting ? 0.08 : 0.12);
    state.camera.position.copy(camPos.current);

    const verticalOffset = interacting ? 2.5 : 1.2;
    if (interacting && activeZonePosition) {
      // Look directly at the monument text area (approx 5.7 units above ground for closer center)
      _lookTgt.set(activeZonePosition[0], activeZonePosition[1] + 5.7, activeZonePosition[2]);
    } else {
      // Look at the car
      _lookTgt.set(pos.x, pos.y + verticalOffset, pos.z);
    }

    camLook.current.lerp(_lookTgt, 0.18);
    state.camera.lookAt(camLook.current);
  });

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders={false}
      position={[0, 8, 8]}
      linearDamping={0.4}
      angularDamping={2.5} // High to prevent flipping
      restitution={0}
      friction={1.5}
      {...props}
    >
      <CuboidCollider args={[0.7, 0.45, 1.4]} position={[0, 0.45, 0]} />
      <Suspense fallback={null}><CarModel /></Suspense>
      <PositionalAudio ref={engineRef} url="/audio/engine_loop.mp3" loop autoplay distance={15} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
