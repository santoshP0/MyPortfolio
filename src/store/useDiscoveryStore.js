import { create } from "zustand";

/**
 * Tracks the game state and which discovery zones have been revealed.
 */
export const useDiscoveryStore = create((set) => ({
    /** Whether the user has clicked start */
    gameStarted: false,

    /** Whether the user is currently interacting with a monument (mouse unlocked) */
    interacting: false,

    /** The ID of the zone the player is currently inside/nearest to */
    activeZoneId: null,
    activeZonePosition: null,
    setActiveZone: (id, pos) => set({ activeZoneId: id, activeZonePosition: pos }),

    /** Whether the game is currently paused */
    paused: false,
    setPaused: (paused) => set({ paused }),

    /** Set of revealed zone IDs */
    revealedIds: new Set(),

    /** Start the game */
    startGame: () => set({ gameStarted: true }),

    /** Toggle interaction mode (unlocks mouse) */
    setInteracting: (interacting) => set({ interacting }),

    /** Mark a zone as revealed */
    reveal: (id) =>
        set((state) => ({
            revealedIds: new Set([...state.revealedIds, id]),
        })),

    /** Check if a zone is revealed */
    isRevealed: (id) => useDiscoveryStore.getState().revealedIds.has(id),
}));
