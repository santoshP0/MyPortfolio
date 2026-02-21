import { create } from "zustand";

export const usePortfolioPanelStore = create((set) => ({
  activePortfolioItemId: null,
  setActivePortfolioItemId: (id) => set({ activePortfolioItemId: id }),
  clearactivePortfolioItemId: () => set({ activePortfolioItemId: null }),
}));
