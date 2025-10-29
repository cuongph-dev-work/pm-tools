import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  user: {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
  },
  setUser: user => set({ user }),
  logout: () => {
    // TODO: Implement actual logout logic
    console.log("Logout");
    set({ user: null });
  },
}));
