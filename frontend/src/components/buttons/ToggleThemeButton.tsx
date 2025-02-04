"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { initializeTheme, useThemeStore } from "@/stores/themeStore";
import { useEffect } from "react";

export const ToggleThemeButton = () => {
  const { isDark, toggleTheme } = useThemeStore();

  useEffect(() => {
    initializeTheme();
  }, []);

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} className="pointer-events-auto">
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
};
