import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "rgb(var(--terminal-bg-rgb) / <alpha-value>)",
          light: "rgb(var(--terminal-bg-elevated-rgb) / <alpha-value>)",
        },
        surface: {
          dark: "rgb(var(--terminal-surface-1-rgb) / <alpha-value>)",
          light: "rgb(var(--terminal-surface-2-rgb) / <alpha-value>)",
        },
        text: {
          DEFAULT: "rgb(var(--terminal-text-rgb) / <alpha-value>)",
          title: "rgb(var(--terminal-text-strong-rgb) / <alpha-value>)",
          dark: "rgb(var(--terminal-text-muted-rgb) / <alpha-value>)",
        },
        accent: {
          orange: "rgb(var(--terminal-amber-rgb) / <alpha-value>)",
          blue: "rgb(var(--terminal-blue-rgb) / <alpha-value>)",
          green: "rgb(var(--terminal-success-rgb) / <alpha-value>)",
        },
        border: {
          DEFAULT:
            "rgb(var(--terminal-ghost-rgb) / calc(var(--terminal-ghost-alpha) * <alpha-value>))",
          muted:
            "rgb(var(--terminal-divider-rgb) / calc(var(--terminal-divider-alpha) * <alpha-value>))",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Pretendard", "sans-serif"],
        display: ["var(--font-public-sans)", "Pretendard", "sans-serif"],
        label: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-space-grotesk)", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1380px",
      },
      spacing: {
        section: "88px",
        "section-lg": "112px",
      },
      boxShadow: {
        terminal: "var(--terminal-shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
