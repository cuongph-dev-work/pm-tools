import { useEffect, useState } from "react";

const SIDEBAR_STORAGE_KEY = "sidebar-collapsed";

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return saved === "true";
    }
    return false;
  });

  const toggleSidebar = () => {
    setIsCollapsed(prev => !prev);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(isCollapsed));
    }
  }, [isCollapsed]);

  return {
    isCollapsed,
    toggleSidebar,
  };
}
