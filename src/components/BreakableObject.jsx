import React, { useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useObjectStore } from "../store/useObjectStore"; // Import useObjectStore

function BreakableObject({ id, position, args, health: initialHealth = 10, ...props }) {
  const rigidBodyRef = useRef();
  const updateObjectHealth = useObjectStore((state) => state.updateObjectHealth);
  const removeObject = useObjectStore((state) => state.removeObject);

  const [currentHealth, setCurrentHealth] = useState(initialHealth);

  useFrame(() => {
    // Optional: Add any animation or behavior for the object
  });

  const handleCollisionEnter = ({ other }) => {
    // Check if the collision is with a bullet
    if (other.rigidBodyObject && other.rigidBodyObject.userData && other.rigidBodyObject.userData.type === "bullet") {
      setCurrentHealth((prevHealth) => {
        const newHealth = prevHealth - 1;
        updateObjectHealth(id, newHealth); // Update health in the store
        console.log(`Object ${id} hit! Health: ${newHealth}`);
        if (newHealth <= 0) {
          removeObject(id); // Remove object from store if health is 0
          console.log(`Object ${id} destroyed!`);
        }
        return newHealth;
      });
    }
  };

  // Simple visual feedback: change color based on health
  const materialColor = currentHealth > initialHealth / 2 ? "green" : currentHealth > 0 ? "orange" : "black";

  return (
    <RigidBody
      ref={rigidBodyRef}
      colliders="cuboid"
      type="fixed" // Set to "dynamic" if it needs to move
      onCollisionEnter={handleCollisionEnter}
      userData={{ id, type: "breakable" }} // Add id and type to userData
      position={position}
      {...props}
    >
      <mesh castShadow>
        <boxGeometry args={args} />
        <meshStandardMaterial color={materialColor} />
      </mesh>
    </RigidBody>
  );
}

export default BreakableObject;
