// Re-export types and store for convenience
export * from "~/shared/stores/projectStore";

import { useProjectStore } from "~/shared/stores/projectStore";

export function useProjects() {
  const currentProject = useProjectStore(state => state.currentProject);
  const setCurrentProject = useProjectStore(state => state.setCurrentProject);

  return {
    currentProject,
    setCurrentProject,
  };
}
