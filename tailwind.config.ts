import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#111111",
        charcoal: "#292929",
        paper: "#F5F3EE",
        muted: "#6B6B67",
        rule: "#D8D5CE",
        accent: "#8B2F25"
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        editorial: ["var(--font-source-serif)", "Georgia", "serif"]
      },
      borderRadius: {
        DEFAULT: "4px"
      }
    }
  },
  plugins: []
};

export default config;
