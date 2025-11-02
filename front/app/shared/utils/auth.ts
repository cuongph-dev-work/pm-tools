import { redirect } from "react-router";
import { STORAGE_KEYS } from "../constants/storage";

export function requireAuth(): Response | null {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    throw redirect("/login");
  }

  return null;
}
