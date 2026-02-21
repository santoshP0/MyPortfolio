import { create } from "zustand";
import { nanoid } from "nanoid";

export const useBulletStore = create((set) => ({
  bullets: [],
  addBullet: (position, velocity) =>
    set((state) => ({
      bullets: [
        ...state.bullets,
        { id: nanoid(), position, velocity, timestamp: Date.now() },
      ],
    })),
  removeBullet: (id) =>
    set((state) => ({
      bullets: state.bullets.filter((bullet) => bullet.id !== id),
    })),
  // Optional: Update bullet positions/velocities over time if needed
  // This could also be handled by Rapier's physics engine directly
}));
