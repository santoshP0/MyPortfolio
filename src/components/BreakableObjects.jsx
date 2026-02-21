import React, { memo } from "react";
import { useObjectStore } from "../store/useObjectStore";
import BreakableObject from "./BreakableObject";

// Assigns a visual type to each portfolioItem for shape variety
const ITEM_TYPES = {
    project1: "stone",
    project2: "stone",
    skill1: "crate",
    skill2: "crate",
    experience1: "board",
    experience2: "board",
    contact: "tower",
};

/**
 * Renders individual RigidBody objects (not instanced) to avoid matrixWorld null crash.
 * Each breakable object gets its own RigidBody for reliable collision detection.
 */
const BreakableObjects = memo(() => {
    const objects = useObjectStore((state) => state.objects);

    if (objects.length === 0) return null;

    return (
        <>
            {objects.map((obj) => (
                <BreakableObject
                    key={obj.id}
                    id={obj.id}
                    position={obj.position}
                    health={obj.health}
                    initialHealth={obj.initialHealth}
                    portfolioItemId={obj.portfolioItemId}
                    type={ITEM_TYPES[obj.portfolioItemId] || "stone"}
                />
            ))}
        </>
    );
});

export default BreakableObjects;
