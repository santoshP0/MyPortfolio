import { create } from "zustand";

export const usePortfolioPanelStore = create((set) => ({
  activePortfolioItemId: null,
  panelPosition: null,

  /** Open the 3D panel at a world position — does NOT touch pointer lock */
  openPanel: (id, position) =>
    set({ activePortfolioItemId: id, panelPosition: position }),

  /** Close the panel */
  clearactivePortfolioItemId: () =>
    set({ activePortfolioItemId: null, panelPosition: null }),

  // Legacy alias used in App.jsx
  setActivePortfolioItemId: (id) =>
    set({ activePortfolioItemId: id }),
}));
