import { create } from "zustand";

export interface GitAlert {
  id: string;
  read: boolean;
}

interface GitAlertState {
  alerts: GitAlert[];
  setAlerts: (alerts: GitAlert[]) => void;
  addAlert: (alert: GitAlert) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useGitAlertStore = create<GitAlertState>(set => ({
  alerts: [],
  setAlerts: alerts => set({ alerts }),
  addAlert: alert =>
    set(state => ({
      alerts: [...state.alerts, alert],
    })),
  markAsRead: id =>
    set(state => ({
      alerts: state.alerts.map(alert =>
        alert.id === id ? { ...alert, read: true } : alert
      ),
    })),
  markAllAsRead: () =>
    set(state => ({
      alerts: state.alerts.map(alert => ({ ...alert, read: true })),
    })),
}));
