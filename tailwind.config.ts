import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Public site — accent is CSS-var driven (theme-able), default #FFC62B
        accent: "var(--r3-accent, #FFC62B)",
        r3: {
          black: "#0D0D0D",
          dark2: "#111111",
          footer: "#0A0A0A",
          card: "#161616",
          cardBorder: "#262626",
          divider: "#222222",
          accentAlt: "#F5A800",
          accentLight: "#FFD84D",
          offwhite: "#F6F6F3",
          border: "#E4E4E1",
          borderMuted: "#C9C9C4",
          heading: "#111111",
          body: "#3A3E41",
          muted: "#63686B",
          mutedDark: "#9BA0A3",
          faint: "#6E7376",
          navInactive: "#B9BDBF",
          whatsapp: "#25D366",
        },
        // Admin panel — dark by default, toggleable to light via
        // [data-theme="light"] (see globals.css). Accent/status colors stay
        // fixed brand colors across both themes.
        admin: {
          bg: "var(--admin-bg)",
          sidebar: "var(--admin-sidebar)",
          card: "var(--admin-card)",
          activeNav: "var(--admin-active-nav)",
          input: "var(--admin-input)",
          border: "var(--admin-border)",
          borderInput: "var(--admin-border-input)",
          borderBtn: "var(--admin-border-btn)",
          divider: "var(--admin-divider)",
          accent: "#FFC62B",
          accentHover: "#FFD666",
          text: "var(--admin-text)",
          textSecondary: "var(--admin-text-secondary)",
          textMuted: "var(--admin-text-muted)",
          textFaint: "var(--admin-text-faint)",
          sectionLabel: "var(--admin-section-label)",
          disabled: "var(--admin-disabled)",
          danger: "#EF4444",
          pill: "var(--admin-pill)",
          pillText: "var(--admin-pill-text)",
          switchOff: "var(--admin-switch-off)",
          switchThumbOff: "var(--admin-switch-thumb-off)",
          statusNovoBg: "var(--admin-status-novo-bg)",
          statusNovoText: "var(--admin-status-novo-text)",
          statusAtendimento: "#FFC62B",
          statusProposta: "#3B7EC9",
          statusFechado: "#2FA85A",
          statusPerdido: "#EF4444",
          rankGold: "#FFC62B",
          rankSilver: "#C9C9C9",
          rankBronze: "#9A6A2E",
        },
      },
      fontFamily: {
        oswald: ["var(--font-oswald)", "sans-serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      borderRadius: {
        none: "0px",
      },
    },
  },
  plugins: [],
};

export default config;
