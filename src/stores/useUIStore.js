import { create } from 'zustand';

export const useUIStore = create((set) => ({
  isProjectModalOpen: false,
  projectData: null,
  openProjectModal: (data) => set({ isProjectModalOpen: true, projectData: data }),
  closeProjectModal: () => set({ isProjectModalOpen: false, projectData: null }),
}));
