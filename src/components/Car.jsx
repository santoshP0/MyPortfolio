import React, { useRef, forwardRef, useImperativeHandle } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox } from "@react-three/cannon";
import { useHotkeys } from "react-hotkeys-hook";
import * as THREE from "three";

const Car = forwardRef((props, fwdRef) => {
  const [ref, api] = useBox(() => ({
    mass: 1,
    position: [0, 1, 0],
    angularDamping: 0.9,
    linearDamping: 0.9,
    ...props,
  }));

  useImperativeHandle(fwdRef, () => ref.current);

  const move = useRef({ forward: false, backward: false, left: false, right: false });

  useHotkeys("w, up", () => (move.current.forward = true), { keydown: true });
  useHotkeys("w, up", () => (move.current.forward = false), { keyup: true });
  useHotkeys("s, down", () => (move.current.backward = true), { keydown: true });
  useHotkeys("s, down", () => (move.current.backward = false), { keyup: true });
  useHotkeys("a, left", () => (move.current.left = true), { keydown: true });
  useHotkeys("a, left", () => (move.current.left = false), { keyup: true });
  useHotkeys("d, right", () => (move.current.right = true), { keydown: true });
  useHotkeys("d, right", () => (move.current.right = false), { keyup: true });

  const force = 100;
  const turnForce = 50;

  useFrame((state, delta) => {
    const { forward, backward, left, right } = move.current;
    
    const impulse = { x: 0, y: 0, z: 0 };
    const torque = { x: 0, y: 0, z: 0 };

    if (forward) {
      const forwardVector = new THREE.Vector3(0, 0, -1).applyQuaternion(ref.current.quaternion);
      impulse.x += forwardVector.x * force * delta;
      impulse.y += forwardVector.y * force * delta;
      impulse.z += forwardVector.z * force * delta;
    }
    if (backward) {
      const backwardVector = new THREE.Vector3(0, 0, 1).applyQuaternion(ref.current.quaternion);
      impulse.x += backwardVector.x * force * delta;
      impulse.y += backwardVector.y * force * delta;
      impulse.z += backwardVector.z * force * delta;
    }
    if (left) {
      torque.y = turnForce * delta;
    }
    if (right) {
      torque.y = -turnForce * delta;
    }

    api.applyImpulse([impulse.x, impulse.y, impulse.z], [0, 0, 0]);
    api.applyTorque([torque.x, torque.y, torque.z]);
  });

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
});

export default Car;
