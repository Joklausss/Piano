import type { Config } from "tailwindcss";

/**
 * Design system « Mon Piano des mots ».
 * Palette douce et joyeuse — une couleur par voyelle pour aider la reconnaissance.
 * (Jetons de couleur génériques, contenus 100 % originaux.)
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: { DEFAULT: "#FFF6E9", soft: "#FFEFD7" },
        ink: { DEFAULT: "#4A3B63", soft: "#6E5D86" },
        keydark: "#3B2F52", // touches « foncées » = voyelles
        grass: { DEFAULT: "#7BB36A", dark: "#5E9650" }, // touches consonnes
        sun: "#F4B63C",
        // Une couleur par voyelle
        va: "#F2785C",
        ve: "#5FB6A8",
        vi: "#F4C04E",
        vo: "#6BA8E5",
        vu: "#A98CD9",
        vy: "#E58FB5",
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        // Police de lecture pour jeunes lecteurs (lettres non ambiguës type Andika)
        reading: ["var(--font-reading)", "var(--font-body)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 8px 22px rgba(74,59,99,.14)",
        softs: "0 3px 9px rgba(74,59,99,.13)",
      },
      borderRadius: {
        xl2: "20px",
        xl3: "24px",
      },
      minHeight: { tap: "44px" },
      minWidth: { tap: "44px" },
    },
  },
  plugins: [],
};

export default config;
