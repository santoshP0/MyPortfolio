import React, { useRef, forwardRef, useImperativeHandle, memo, Suspense, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
import { useKeyboardControls, PositionalAudio, useGLTF } from "@react-three/drei";
import { Controls } from "../App";
import { useAudioStore } from "../store/useAudioStore";
import { useDiscoveryStore } from "../store/useDiscoveryStore";
import { terrainHeight } from "../utils/terrain";
import {
  CAM_DEFAULT_DISTANCE, CAM_DEFAULT_FOV, CAM_DEFAULT_PITCH,
  INSPECT_DISTANCE, INSPECT_FOV, INSPECT_CAM_Y_OFFSET,
  CAR_MAX_SPEED, CAR_ACCELERATION, CAR_BRAKE_FORCE,
} from "../constants/gameConfig";

useGLTF.preload("/models/car/ferrari.glb");

// ── Constants ─────────────────────────────────────────────────────────────────
const TURN_SPEED = 2.5;
const GROUND_Y_OFF = 0.78;  // Raised to match model's -0.75 offset + small buffer
const COAST_DECAY = 0.96;
const WHEEL_KEYS = ["wheel", "tire", "rim"];
const EXCLUDE_KEYS = ["steering", "seat", "dashboard", "brake", "interior", "cockpit", "engine", "chassis", "body", "frame", "mirror", "caliper", "disc", "suspension", "hub", "bolt", "support", "axle", "rod", "joint", "arm", "bar", "link", "spring"];
const WHEEL_SPIN = -12.0;    // Negative now (Ferrari wheels rotate forward)
const WHEEL_STEER = 0.5;
const PITCH_GAIN = 0.15;     // Smoother slope follow

// ── GLB ───────────────────────────────────────────────────────────────────────
const _wp = new THREE.Vector3();
const CarModel = memo(({ wheelRefs }) => {
  const { scene } = useGLTF("/models/car/ferrari.glb");
  useEffect(() => {
    const w = [];
    scene.traverse((c) => {
      if (c.isMesh) {
        c.castShadow = true;
        c.receiveShadow = true;

        if (c.material) {
          c.material.envMapIntensity = 3.5;
          // Look for body parts to make them shiny
          const matName = c.material.name.toLowerCase();
          if (matName.includes("body") || matName.includes("paint") || matName.includes("car")) {
            c.material.roughness = 0.05;
            c.material.metalness = 1.0;
            c.material.color.set("#ff1111"); // Bright Ferrari red
          }
        }

        const name = c.name.toLowerCase();
        const isWheel = WHEEL_KEYS.some((k) => name.includes(k));
        const isExcluded = EXCLUDE_KEYS.some((k) => name.includes(k));

        if (isWheel && !isExcluded) {
          // Store initial rotation to avoid "bending" when overriding
          if (!c.userData.origRot) c.userData.origRot = c.rotation.clone();
          w.push(c);
        }
      }
    });
    wheelRefs.current = w;
  }, [scene, wheelRefs]);
  return <primitive object={scene} scale={[0.75, 0.75, 0.75]} rotation={[0, Math.PI, 0]} position={[0, -0.75, 0]} />;
});

// ── Scratch (never allocate inside useFrame) ─────────────────────────────────
const _fwd = new THREE.Vector3();
const _camOff = new THREE.Vector3();
const _camTgt = new THREE.Vector3();
const _look = new THREE.Vector3();
const _euler = new THREE.Euler();
const _qRot = new THREE.Quaternion();

// ── Car ───────────────────────────────────────────────────────────────────────
const Car = memo(forwardRef(({ carStateRef, ...props }, fwdRef) => {
  const rbRef = useRef();
  useImperativeHandle(fwdRef, () => rbRef.current);

  const [_s, getKeys] = useKeyboardControls();
  const engineRef = useRef();
  const engineVolume = useAudioStore((s) => s.engineVolume);
  const gameStarted = useDiscoveryStore((s) => s.gameStarted);
  const interacting = useDiscoveryStore((s) => s.interacting);
  const paused = useDiscoveryStore((s) => s.paused);
  const activeZonePos = useDiscoveryStore((s) => s.activeZonePosition);

  const yaw = useRef(Math.PI); // Start facing opposite direction
  const spd = useRef(0);       // current speed
  const rollDist = useRef(0);       // wheel visual rotation

  // Camera
  const orbAng = useRef(0);
  const orbPit = useRef(CAM_DEFAULT_PITCH);
  const zoomOff = useRef(0);
  const lastM = useRef(0);
  const camP = useRef(new THREE.Vector3(0, 12, 20));
  const camL = useRef(new THREE.Vector3());

  // Wheels
  const wR = useRef([]);

  // ── Audio ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!engineRef.current) return;
    if (gameStarted) { if (!engineRef.current.isPlaying) engineRef.current.play(); }
    else { if (engineRef.current.isPlaying) engineRef.current.setVolume(0); }
  }, [gameStarted]);

  // ── Mouse ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const onMove = (e) => {
      if (interacting || paused) return;
      lastM.current = Date.now();
      orbAng.current -= e.movementX * 0.003;
      orbPit.current = THREE.MathUtils.clamp(orbPit.current + e.movementY * 0.002, 0.1, 1.2);
    };
    const onDown = () => {
      const c = document.querySelector("canvas");
      if (c && gameStarted && !interacting && !paused) c.requestPointerLock();
    };
    const onWheel = (e) => {
      if (paused) return;
      zoomOff.current = THREE.MathUtils.clamp(zoomOff.current + e.deltaY * 0.015, -10, 25);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("wheel", onWheel);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("wheel", onWheel);
    };
  }, [interacting, paused, gameStarted]);

  useEffect(() => { if (interacting || paused) document.exitPointerLock(); }, [interacting, paused]);

  // ── Physics lock: only Y rotation allowed ──────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => {
      if (rbRef.current) {
        rbRef.current.setEnabledRotations(false, true, false, true);
      }
    }, 200);
    return () => clearTimeout(t);
  }, []);

  // ── Frame ──────────────────────────────────────────────────────────────────
  useFrame((state, dt) => {
    const rb = rbRef.current;
    if (!rb) return;

    const { forward, backward, left, right } = getKeys();
    const pos = rb.translation();
    const rv = rb.linvel();
    const canMove = !interacting && !paused;

    // 1. STEERING — manual yaw, no torque
    const { drift } = getKeys();
    const isDrifting = canMove && drift && Math.abs(spd.current) > 4;
    const currentTurnSpeed = isDrifting ? TURN_SPEED * 1.8 : TURN_SPEED;

    if (canMove && Math.abs(spd.current) > 0.3) {
      const dir = left ? 1 : right ? -1 : 0;
      const steerFactor = spd.current < 0 ? -1 : 1; // Invert steering when reversing
      yaw.current += dir * currentTurnSpeed * dt * steerFactor;
    }

    // 2. FORCE ROTATION — yaw only, X=0, Z=0 every frame
    rb.setAngvel({ x: 0, y: 0, z: 0 }, true);
    _euler.set(0, yaw.current, 0);
    _qRot.setFromEuler(_euler);
    rb.setRotation({ x: _qRot.x, y: _qRot.y, z: _qRot.z, w: _qRot.w }, true);

    // 3. SPEED — accelerate / brake / coast
    if (canMove) {
      if (forward) {
        spd.current = Math.min(spd.current + CAR_ACCELERATION * dt * 4, CAR_MAX_SPEED);
      } else if (backward) {
        spd.current = Math.max(spd.current - CAR_BRAKE_FORCE * dt * 4, -CAR_MAX_SPEED * 0.35);
      } else {
        spd.current *= COAST_DECAY;
        if (Math.abs(spd.current) < 0.05) spd.current = 0;
      }
    } else {
      spd.current *= 0.9;
    }

    // 4. FORWARD VECTOR — derived from yaw (flat on XZ)
    _fwd.set(Math.sin(yaw.current), 0, Math.cos(yaw.current));

    // 5. SET VELOCITY — XZ from car direction, Y from gravity
    const vy = rv.y;
    rb.setLinvel({ x: _fwd.x * spd.current, y: vy, z: _fwd.z * spd.current }, true);

    // 6. TERRAIN STICK & PITCH (Multi-point for stability)
    const frontPos = pos.x + _fwd.x * 1.8;
    const frontZ = pos.z + _fwd.z * 1.8;
    const backPos = pos.x - _fwd.x * 1.8;
    const backZ = pos.z - _fwd.z * 1.8;

    const hFront = terrainHeight(frontPos, frontZ);
    const hBack = terrainHeight(backPos, backZ);
    const avgH = (hFront + hBack) / 2;
    const groundY = avgH + GROUND_Y_OFF;

    // Force snap Y for toy-car feel
    rb.setTranslation({ x: pos.x, y: groundY, z: pos.z }, true);

    // Calculate slope pitch based on front/back difference
    const targetPitch = Math.atan2(hBack - hFront, 3.6);
    _euler.setFromQuaternion(_qRot, "YXZ");
    const nextP = THREE.MathUtils.lerp(_euler.x, targetPitch, 0.2); // Faster response
    _euler.set(nextP, yaw.current, 0);
    _qRot.setFromEuler(_euler);
    rb.setRotation({ x: _qRot.x, y: _qRot.y, z: _qRot.z, w: _qRot.w }, true);

    // Reset vertical velocity since we're snapped
    rb.setLinvel({ x: _fwd.x * spd.current, y: 0, z: _fwd.z * spd.current }, true);

    // 7. WHEELS — spin + front steer
    const absSpd = Math.abs(spd.current);
    rollDist.current += spd.current * dt * WHEEL_SPIN;
    const steerDir = left ? 1 : right ? -1 : 0;
    const currentSteerLimit = isDrifting ? WHEEL_STEER * 1.4 : WHEEL_STEER;

    if (wR.current) {
      wR.current.forEach((w) => {
        const orig = w.userData.origRot;
        if (!orig) return;

        // For steering, find wheels in front half
        w.getWorldPosition(_wp);
        const localZ = _wp.sub(new THREE.Vector3(pos.x, pos.y, pos.z)).applyQuaternion(_qRot.clone().invert()).z;

        // Calculate target angles
        const spin = orig.x + rollDist.current;
        let steer = orig.y;
        if (localZ > 0.2) { // Front wheels
          const targetSteer = orig.y + steerDir * currentSteerLimit;
          // Smoothly lerp the steering for better visuals
          w.userData.steerAmt = THREE.MathUtils.lerp(w.userData.steerAmt || 0, steerDir * currentSteerLimit, 0.15);
          steer = orig.y + w.userData.steerAmt;
        }

        // Apply rotation with specific order to avoid axes interference ("shifting")
        w.rotation.set(spin, steer, orig.z, "YXZ");
      });
    }

    // 8. SHARED STATE — for discovery zones
    if (carStateRef?.current) {
      carStateRef.current.position.set(pos.x, pos.y, pos.z);
      carStateRef.current.quaternion.copy(_qRot);
      carStateRef.current.speed = absSpd;
      carStateRef.current.drifting = isDrifting;
    }

    // 9. AUDIO
    if (gameStarted && engineRef.current?.isPlaying) {
      const rev = Math.min(absSpd / CAR_MAX_SPEED, 1);
      engineRef.current.setPlaybackRate(0.85 + rev * 0.25); // Slighly higher base, narrower range
      engineRef.current.setVolume(engineVolume * (absSpd > 0.5 ? 0.15 + rev * 0.05 : 0.08)); // Even lower volume
    }

    // 10. CAMERA
    const baseDist = CAM_DEFAULT_DISTANCE + zoomOff.current;
    state.camera.fov = THREE.MathUtils.lerp(
      state.camera.fov, interacting ? INSPECT_FOV : CAM_DEFAULT_FOV, 0.1);
    state.camera.updateProjectionMatrix();

    if (interacting && activeZonePos) {
      const fz = activeZonePos[2] - 0.35;
      const fy = activeZonePos[1] + 5.7;
      _camTgt.set(activeZonePos[0], fy + INSPECT_CAM_Y_OFFSET, fz + INSPECT_DISTANCE);
      camP.current.lerp(_camTgt, 0.07);
      state.camera.position.copy(camP.current);
      _look.set(activeZonePos[0], fy, fz);
      camL.current.lerp(_look, 0.12);
      state.camera.lookAt(camL.current);
    } else {
      if (Date.now() - lastM.current > 1200 && absSpd > 2) {
        orbAng.current = THREE.MathUtils.lerp(orbAng.current, 0, 0.05);
        orbPit.current = THREE.MathUtils.lerp(orbPit.current, CAM_DEFAULT_PITCH, 0.03);
      }
      const behind = yaw.current + Math.PI + orbAng.current;
      _camOff.set(
        Math.sin(behind) * baseDist * Math.cos(orbPit.current),
        Math.sin(orbPit.current) * baseDist,
        Math.cos(behind) * baseDist * Math.cos(orbPit.current),
      );
      _camTgt.set(pos.x + _camOff.x, pos.y + _camOff.y, pos.z + _camOff.z);
      camP.current.lerp(_camTgt, 0.1);
      state.camera.position.copy(camP.current);
      _look.set(pos.x, pos.y + 1.2, pos.z);
      camL.current.lerp(_look, 0.15);
      state.camera.lookAt(camL.current);
    }
  });

  return (
    <RigidBody
      ref={rbRef}
      colliders={false}
      position={[0, 5, 8]}
      mass={1}
      linearDamping={4}
      angularDamping={6}
      restitution={0}
      friction={2}
      canSleep={false}
      {...props}
    >
      <CuboidCollider args={[1.2, 0.7, 2.3]} position={[0, 0.7, 0]} />
      <Suspense fallback={null}><CarModel wheelRefs={wR} /></Suspense>
      <PositionalAudio ref={engineRef} url="/audio/engine_loop.mp3" loop autoplay distance={15} />
    </RigidBody>
  );
}));

Car.displayName = "Car";
export default Car;
