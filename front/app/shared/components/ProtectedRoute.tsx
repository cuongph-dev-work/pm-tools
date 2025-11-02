import { useEffect } from "react";
import { useNavigate } from "react-router";
import { STORAGE_KEYS } from "../constants/storage";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);

    if (!token) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // Check token on render (client-side only)
  if (typeof window !== "undefined") {
    const token = window.localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    if (!token) {
      return null; // Will redirect via useEffect
    }
  }

  return <>{children}</>;
}
