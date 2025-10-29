// Re-export types and store for convenience
export * from "~/shared/stores/gitAlertStore";

import { useGitAlertStore } from "~/shared/stores/gitAlertStore";

export function useGitAlerts() {
  const alerts = useGitAlertStore(state => state.alerts);
  const setAlerts = useGitAlertStore(state => state.setAlerts);
  const addAlert = useGitAlertStore(state => state.addAlert);
  const markAsRead = useGitAlertStore(state => state.markAsRead);
  const markAllAsRead = useGitAlertStore(state => state.markAllAsRead);

  return {
    alerts,
    setAlerts,
    addAlert,
    markAsRead,
    markAllAsRead,
  };
}
