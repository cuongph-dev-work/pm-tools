import { redirect } from "react-router";
import { STORAGE_KEYS } from "../constants/storage";

export function redirectIfAuthenticated(): Response | null {
  if (typeof window === "undefined") return null;

  const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (token) {
    throw redirect("/");
  }

  return null;
}
