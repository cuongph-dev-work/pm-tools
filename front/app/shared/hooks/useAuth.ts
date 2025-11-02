// Re-export types and store for convenience
export * from "~/shared/stores/authStore";

import { useEffect } from "react";
import { useAuthStore } from "~/shared/stores/authStore";
import { setUnauthorizedCallback } from "~/shared/utils/api";

export function useAuth() {
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setUser = useAuthStore(state => state.setUser);
  const setTokens = useAuthStore(state => state.setTokens);
  const logout = useAuthStore(state => state.logout);

  // Setup unauthorized callback on mount
  useEffect(() => {
    setUnauthorizedCallback(() => {
      logout();
    });
  }, [logout]);

  return {
    user,
    accessToken,
    refreshToken,
    setUser,
    setTokens,
    logout,
    isAuthenticated: Boolean(accessToken),
  };
}
