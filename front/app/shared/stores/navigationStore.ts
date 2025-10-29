import { create } from "zustand";

export type PageId =
  | "backlog"
  | "kanban"
  | "sprint"
  | "projects"
  | "logwork"
  | "git-alerts"
  | "settings";

interface NavigationState {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

export const useNavigationStore = create<NavigationState>(set => ({
  currentPage: "kanban",
  setCurrentPage: page => set({ currentPage: page }),
}));
