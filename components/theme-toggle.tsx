"use client";

import React, { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    // Check initial theme from document element class
    const isLight = document.documentElement.classList.contains("light");
    setTheme(isLight ? "light" : "dark");
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);

    if (nextTheme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="flex h-8 w-14 items-center rounded-full bg-zinc-900/60 p-1 border border-white/10 dark:border-white/10 hover:bg-zinc-800/60 transition-all cursor-pointer shadow-inner relative justify-between px-2 text-zinc-400 select-none"
      title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      <IconSun className={`h-3.5 w-3.5 ${theme === "light" ? "text-amber-400" : "text-zinc-600"}`} />
      <IconMoon className={`h-3.5 w-3.5 ${theme === "dark" ? "text-sky-400" : "text-zinc-600"}`} />
      
      {/* Sliding indicator */}
      <div
        className={`absolute top-0.5 bottom-0.5 h-6 w-6 rounded-full bg-zinc-700/80 border border-white/10 shadow-md transition-all duration-300 ${
          theme === "light" ? "left-0.5" : "left-[calc(100%-1.65rem)]"
        }`}
      />
    </button>
  );
}
