import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "../constants/storage";

export interface Project {
  id: string;
  name: string;
  members?: Array<{ id: string; name: string }>;
}

interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    set => ({
      currentProject: null,
      setCurrentProject: project => set({ currentProject: project }),
    }),
    {
      name: STORAGE_KEYS.CURRENT_PROJECT,
      partialize: state => ({ currentProject: state.currentProject }),
    }
  )
);
