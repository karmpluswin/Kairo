"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (!document.startViewTransition) {
      setTheme(theme === "light" ? "dark" : "light");
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(theme === "light" ? "dark" : "light");
      });
    });
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center justify-center
w-9 h-9
md:w-12 md:h-10
rounded-xl
 hover:bg-muted
text-foreground cursor-pointer transition-all"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  );
};

export default ThemeToggle;
