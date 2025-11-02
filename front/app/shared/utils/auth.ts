import { redirect } from "react-router";
import { STORAGE_KEYS } from "../constants/storage";

export async function requireAuth() {
  if (typeof window === "undefined") return;

  const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

  if (!token) {
    throw redirect("/login");
  }
}
