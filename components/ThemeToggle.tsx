"use client";

import { useEffect, useState } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY, type SiteTheme } from "@/lib/theme";

interface ThemeToggleProps {
  className?: string;
}

function isSiteTheme(value: string | null | undefined): value is SiteTheme {
  return value === "dark" || value === "light";
}

function applyTheme(theme: SiteTheme) {
  document.documentElement.dataset.theme = theme;
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function readTheme(): SiteTheme {
  const rootTheme = document.documentElement.dataset.theme;

  if (isSiteTheme(rootTheme)) {
    return rootTheme;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return isSiteTheme(storedTheme) ? storedTheme : DEFAULT_THEME;
}

function ThemeIcon({ theme }: { theme: SiteTheme }) {
  if (theme === "light") {
    return (
      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="h-4 w-4 fill-none stroke-current"
        strokeWidth="1.85"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 3.5v2.25" />
        <path d="M12 18.25v2.25" />
        <path d="m5.99 5.99 1.59 1.59" />
        <path d="m16.42 16.42 1.59 1.59" />
        <path d="M3.5 12h2.25" />
        <path d="M18.25 12h2.25" />
        <path d="m5.99 18.01 1.59-1.59" />
        <path d="m16.42 7.58 1.59-1.59" />
        <circle cx="12" cy="12" r="4.1" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4 fill-none stroke-current"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.5 14.4A8.5 8.5 0 1 1 9.6 3.5a6.9 6.9 0 0 0 10.9 10.9Z" />
    </svg>
  );
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const [theme, setTheme] = useState<SiteTheme>(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTheme(readTheme());
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : DEFAULT_THEME;
  const nextTheme: SiteTheme = currentTheme === "light" ? "dark" : "light";

  return (
    <button
      type="button"
      onClick={() => {
        applyTheme(nextTheme);
        setTheme(nextTheme);
      }}
      className={`terminal-outline-button px-3 py-2 ${
        currentTheme === "light"
          ? "border-accent-orange/35 bg-accent-orange/10 text-accent-orange"
          : ""
      } ${className}`.trim()}
      aria-label={
        nextTheme === "light"
          ? "Switch to light theme"
          : "Switch to dark theme"
      }
      aria-pressed={currentTheme === "light"}
      title={nextTheme === "light" ? "Switch to light theme" : "Switch to dark theme"}
    >
      <ThemeIcon theme={nextTheme} />
      <span className="font-label hidden text-[0.68rem] uppercase tracking-[0.18em] sm:inline">
        {nextTheme === "light" ? "Light" : "Dark"}
      </span>
    </button>
  );
}
