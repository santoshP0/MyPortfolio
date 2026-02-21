import { create } from "zustand";
import { nanoid } from "nanoid";

export const useObjectStore = create((set) => ({
  objects: [],

  addObject: (position, args, health, id, portfolioItemId) =>
    set((state) => ({
      objects: [
        ...state.objects,
        { id: id || nanoid(), position, args, health, initialHealth: health, portfolioItemId, revealed: false },
      ],
    })),

  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((o) => o.id !== id),
    })),

  updateObjectHealth: (id, newHealth) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, health: newHealth } : o
      ),
    })),

  /** Mark object as revealed (destroyed but panel stays visible in world) */
  revealObject: (id) =>
    set((state) => ({
      objects: state.objects.map((o) =>
        o.id === id ? { ...o, health: 0, revealed: true } : o
      ),
    })),
}));
