import React, { useRef, useMemo, useEffect, memo } from "react";
import { InstancedRigidBodies } from "@react-three/rapier";
import * as THREE from "three";
import { useObjectStore } from "../store/useObjectStore";

const InstancedBreakableObjects = memo(() => {
  const rigidBodiesRef = useRef(); // Ref for InstancedRigidBodies
  const meshRef = useRef(); // Ref for instancedMesh
  const objects = useObjectStore((state) => state.objects);

  const instances = useMemo(() => {
    return objects.map((object) => ({
      key: object.id,
      position: object.position,
      rotation: [0, 0, 0], // Assuming no initial rotation for now
      scale: object.health > 0 ? 1 : 0.001, // Scale to 0.001 to "hide" destroyed objects
      userData: { id: object.id, type: "breakable", portfolioItemId: object.portfolioItemId },
    }));
  }, [objects]);

  // Update instancedMesh matrices and colors
  useEffect(() => {
    if (!meshRef.current) return;

    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();

    objects.forEach((obj, i) => {
      // Set position and scale
      matrix.compose(
        new THREE.Vector3(...obj.position),
        new THREE.Quaternion().setFromEuler(new THREE.Euler(...instances[i].rotation)),
        new THREE.Vector3(obj.health > 0 ? 1 : 0.001, obj.health > 0 ? 1 : 0.001, obj.health > 0 ? 1 : 0.001)
      );
      meshRef.current.setMatrixAt(i, matrix);

      // Set color based on health
      const materialColor =
        obj.health > obj.initialHealth / 2 ? "green" : obj.health > 0 ? "orange" : "black";
      meshRef.current.setColorAt(i, color.set(materialColor));
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;

  }, [objects, instances]);

  return (
    <InstancedRigidBodies ref={rigidBodiesRef} instances={instances} colliders="cuboid" type="fixed">
      <instancedMesh ref={meshRef} args={[null, null, objects.length]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial />
      </instancedMesh>
    </InstancedRigidBodies>
  );
});

export default InstancedBreakableObjects;
