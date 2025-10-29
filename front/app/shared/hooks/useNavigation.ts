// Re-export types and store for convenience
export * from "~/shared/stores/navigationStore";

import { useNavigationStore } from "~/shared/stores/navigationStore";

export function useNavigation() {
  const currentPage = useNavigationStore(state => state.currentPage);
  const setCurrentPage = useNavigationStore(state => state.setCurrentPage);

  return {
    currentPage,
    setCurrentPage,
  };
}
