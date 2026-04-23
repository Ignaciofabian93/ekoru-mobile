/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./features/**/*.{js,jsx,ts,tsx}",
    "./ui/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {

      // ── Colors ──────────────────────────────────────────────────
      colors: {
        // Brand primary (Lime)
        primary: {
          DEFAULT:    "#65a30d",   // lime-600
          hover:      "#a3e635",   // lime-400
          active:     "#4d7c0f",   // lime-700
          dark:       "#365314",   // lime-800
          light:      "#84cc16",   // lime-500
          "light-bg": "#f7fee7",   // lime-50
        },
        navbar: {
          DEFAULT: "#d9f99d",      // lime-200
          hover:   "#bef264",      // lime-300
          dark:    "#365314",      // lime-800
        },

        // Brand secondary (Cyan)
        secondary: {
          DEFAULT: "#22d3ee",      // cyan-400
          hover:   "#67e8f9",      // cyan-300
          dark:    "#0e7490",      // cyan-700
        },

        // Accent (Amber)
        accent: {
          DEFAULT: "#f59e0b",      // amber-500
          hover:   "#fbbf24",      // amber-400
        },

        // Feedback
        danger: {
          DEFAULT: "#ef4444",
          hover:   "#f87171",
        },
        success: "#22c55e",
        warning: "#eab308",
        info:    "#3b82f6",

        // Backgrounds
        bg: {
          DEFAULT:   "#fdfffc",    // near-white warm
          secondary: "#f9fafb",    // gray-50
          tertiary:  "#f3f4f6",    // gray-100
        },

        // Surfaces
        surface: {
          DEFAULT: "#ffffff",
          hover:   "#f9fafb",
          active:  "#f3f4f6",
        },

        // Foreground / Text
        fg: {
          DEFAULT:   "#1f2937",    // gray-800
          secondary: "#4b5563",    // gray-600
          tertiary:  "#9ca3af",    // gray-400
          muted:     "#d1d5db",    // gray-300
        },

        // Borders
        border: {
          DEFAULT: "#a8a8a8",
          light:   "#f3f4f6",
          strong:  "#d1d5db",
          focus:   "#84cc16",      // lime-500
        },

        // Inputs
        input: {
          bg:               "#ffffff",
          border:           "#d1d5db",
          "border-hover":   "#9ca3af",
          "border-focus":   "#84cc16",
          text:             "#1f2937",
          placeholder:      "#9ca3af",
          disabled:         "#f3f4f6",
        },
      },

      // ── Font families ────────────────────────────────────────────
      fontFamily: {
        cabin:            ["Cabin_400Regular"],
        "cabin-medium":   ["Cabin_500Medium"],
        "cabin-semibold": ["Cabin_600SemiBold"],
        "cabin-bold":     ["Cabin_700Bold"],
      },

      // ── Font sizes (design scale, overrides Tailwind defaults) ──
      fontSize: {
        xs:    [11, { lineHeight: "16px" }],  // eyebrow, captions
        sm:    [13, { lineHeight: "18px" }],  // secondary labels
        base:  [15, { lineHeight: "22px" }],  // body default
        lg:    [17, { lineHeight: "24px" }],  // large body
        xl:    [20, { lineHeight: "26px" }],  // h4, section heads
        "2xl": [24, { lineHeight: "30px" }],  // h3
        "3xl": [30, { lineHeight: "36px" }],  // hero titles
        "4xl": [36, { lineHeight: "40px" }],  // display
      },

      // ── Letter spacing ───────────────────────────────────────────
      letterSpacing: {
        tighter: "-0.05em",   // display headings
        tight:   "-0.02em",   // h2
        normal:   "0em",
        wide:     "0.02em",   // label pills
        wider:    "0.04em",   // type badges
        widest:   "0.09em",   // EYEBROW labels
      },

      // ── Semantic spacing extras ──────────────────────────────────
      spacing: {
        tap:     "44px",   // minimum tap target
        card:    "16px",   // default card padding
        section: "32px",   // between home sections
      },

      // ── Border radius ────────────────────────────────────────────
      borderRadius: {
        none:  "0px",
        sm:    "8px",     // sm buttons
        md:    "10px",    // inputs, md/lg buttons
        lg:    "12px",    // product/store cards
        xl:    "14px",    // store card, lg button
        "2xl": "18px",    // category / hero cards
        "3xl": "24px",
        full:  "9999px",  // pills, dots
        // Semantic aliases
        btn:   "10px",
        card:  "12px",
        pill:  "9999px",
        input: "10px",
      },

      // ── Shadows ──────────────────────────────────────────────────
      boxShadow: {
        sm:   "0 1px 4px rgba(0,0,0,0.08)",
        md:   "0 2px 4px rgba(0,0,0,0.10)",
        lg:   "0 4px 10px rgba(0,0,0,0.18)",
        xl:   "0 8px 24px rgba(0,0,0,0.12)",
        none: "none",
      },

      // ── Min heights for interactive elements ─────────────────────
      minHeight: {
        "btn-sm": "32px",
        "btn-md": "40px",
        "btn-lg": "48px",
        input:    "44px",
        tap:      "44px",
      },

      minWidth: {
        btn: "120px",
      },

    },
  },
  plugins: [],
};
