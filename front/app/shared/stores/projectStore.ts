import { create } from "zustand";

export interface Project {
  id: string;
  name: string;
  members?: Array<{ id: string; name: string }>;
}

interface ProjectState {
  currentProject: Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export const useProjectStore = create<ProjectState>(set => ({
  currentProject: null,
  setCurrentProject: project => set({ currentProject: project }),
}));
