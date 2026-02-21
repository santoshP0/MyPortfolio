import { create } from "zustand";
import { nanoid } from "nanoid";

export const useObjectStore = create((set) => ({
  objects: [],
  addObject: (position, args, health, id, portfolioItemId) =>
    set((state) => ({
      objects: [
        ...state.objects,
        { id: id || nanoid(), position, args, health, initialHealth: health, portfolioItemId },
      ],
    })),
  removeObject: (id) =>
    set((state) => ({
      objects: state.objects.filter((object) => object.id !== id),
    })),
  updateObjectHealth: (id, newHealth) =>
    set((state) => ({
      objects: state.objects.map((object) =>
        object.id === id ? { ...object, health: newHealth } : object
      ),
    })),
}));
