import { create } from "zustand";

/**
 * Global audio volume multipliers.
 * Car.jsx reads these each frame and applies them to the audio nodes.
 * PauseSystem shows sliders that write here.
 */
export const useAudioStore = create((set) => ({
    engineVolume: 1.0, // 0 → 1
    shootVolume: 1.0, // 0 → 1
    setEngineVolume: (v) => set({ engineVolume: Math.max(0, Math.min(1, v)) }),
    setShootVolume: (v) => set({ shootVolume: Math.max(0, Math.min(1, v)) }),
}));
