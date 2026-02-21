import { create } from "zustand";

export const useTargetedObjectStore = create((set) => ({
  targetedObjectId: null,
  targetedObjectHealth: 0,
  targetedObjectInitialHealth: 0,
  setTargetedObject: (id, health, initialHealth) =>
    set({
      targetedObjectId: id,
      targetedObjectHealth: health,
      targetedObjectInitialHealth: initialHealth,
    }),
  clearTargetedObject: () =>
    set({ targetedObjectId: null, targetedObjectHealth: 0, targetedObjectInitialHealth: 0 }),
}));
