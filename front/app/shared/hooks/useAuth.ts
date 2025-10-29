// Re-export types and store for convenience
export * from "~/shared/stores/authStore";

import { useAuthStore } from "~/shared/stores/authStore";

export function useAuth() {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  return {
    user,
    logout,
  };
}
