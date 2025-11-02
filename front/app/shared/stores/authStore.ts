import { create } from "zustand";
import { STORAGE_KEYS } from "../constants/storage";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => {
  // Load tokens from localStorage on initialization
  const getStorageItem = (key: string): string | null => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(key);
  };

  const setStorageItem = (key: string, value: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  };

  const removeStorageItem = (key: string): void => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  };

  const accessToken = getStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
  const refreshToken = getStorageItem(STORAGE_KEYS.REFRESH_TOKEN);

  return {
    user: null,
    accessToken,
    refreshToken,
    setUser: user => set({ user }),
    setTokens: (accessToken, refreshToken) => {
      setStorageItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      setStorageItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
      set({ accessToken, refreshToken });
    },
    logout: () => {
      removeStorageItem(STORAGE_KEYS.ACCESS_TOKEN);
      removeStorageItem(STORAGE_KEYS.REFRESH_TOKEN);
      set({ user: null, accessToken: null, refreshToken: null });
    },
  };
});
