import { create } from "zustand";

export const usePortfolioPanelStore = create((set) => ({
  activePortfolioItemId: null,
  setactivePortfolioItemId: (id) => set({ activePortfolioItemId: id }),
  clearactivePortfolioItemId: () => set({ activePortfolioItemId: null }),
}));
