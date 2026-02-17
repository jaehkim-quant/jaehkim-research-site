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
          DEFAULT: "#FFFFFF",
          light: "#FFFFFF",
        },
        surface: {
          dark: "#F5F6F8",
          light: "#FAFBFC",
        },
        text: {
          DEFAULT: "#1E293B",
          title: "#0F172A",
          dark: "#0F172A",
        },
        accent: {
          orange: "#F47920",
          blue: "#F47920",
        },
        border: {
          DEFAULT: "#E2E8F0",
          muted: "#CBD5E1",
        },
      },
      fontFamily: {
        sans: ["var(--font-pretendard)", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      maxWidth: {
        content: "1160px",
      },
      spacing: {
        section: "72px",
        "section-lg": "96px",
      },
    },
  },
  plugins: [],
};

export default config;
