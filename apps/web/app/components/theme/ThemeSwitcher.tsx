"use client";

import * as React from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/20/solid";
import { useTheme } from "next-themes";
import { cn } from "@repo/ui";

export function ThemeSwitcher({ className }: { className?: string }) {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme } = useTheme();

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-full cursor-pointer p-1 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-800",
        className
      )}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
