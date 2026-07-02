export const themeConfig = {
  colors: {
    ink: "#241913",
    muted: "#7d7067",
    paper: "#fbf7f2",
    surface: "#ffffff",
    line: "#eaded2",
    night: "#1f2f35",
    clay: "#9b7350",
    sand: "#d7b58c",
    sage: "#6f897f",
    cream: "#fff8ef",
    brandBg: "#f6eee6",
    bodyWarm: "#fffaf4",
    tickerBg: "#f5f2ed",
    tickerText: "#6d6259",
    brandText: "#6f5a48",
    fieldBorder: "#d7d0c8",
    textStrong: "#4f4640",
    textDeep: "#3d2c23",
    footerBg: "#4b4a47",
    success: "#3b5a50",
    danger: "#8a332e",
    mediaBg: "#e9eef5",
    blue: "#3b74a6",
    gold: "#c69b55",
    red: "#b74d46",
  },
  shadows: {
    default: "0 24px 70px rgba(50, 37, 27, 0.15)",
  },
  fonts: {
    body: "\"Inter\", \"Montserrat\", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", sans-serif",
    brand: "Georgia, \"Times New Roman\", serif",
  },
};

export function applyThemeVariables(theme = themeConfig) {
  const root = document.documentElement;
  root.style.setProperty("--ink", theme.colors.ink);
  root.style.setProperty("--muted", theme.colors.muted);
  root.style.setProperty("--paper", theme.colors.paper);
  root.style.setProperty("--surface", theme.colors.surface);
  root.style.setProperty("--line", theme.colors.line);
  root.style.setProperty("--night", theme.colors.night);
  root.style.setProperty("--clay", theme.colors.clay);
  root.style.setProperty("--sand", theme.colors.sand);
  root.style.setProperty("--sage", theme.colors.sage);
  root.style.setProperty("--cream", theme.colors.cream);
  root.style.setProperty("--brand-bg", theme.colors.brandBg);
  root.style.setProperty("--body-warm", theme.colors.bodyWarm);
  root.style.setProperty("--ticker-bg", theme.colors.tickerBg);
  root.style.setProperty("--ticker-text", theme.colors.tickerText);
  root.style.setProperty("--brand-text", theme.colors.brandText);
  root.style.setProperty("--field-border", theme.colors.fieldBorder);
  root.style.setProperty("--text-strong", theme.colors.textStrong);
  root.style.setProperty("--text-deep", theme.colors.textDeep);
  root.style.setProperty("--footer-bg", theme.colors.footerBg);
  root.style.setProperty("--success", theme.colors.success);
  root.style.setProperty("--danger", theme.colors.danger);
  root.style.setProperty("--media-bg", theme.colors.mediaBg);
  root.style.setProperty("--blue", theme.colors.blue);
  root.style.setProperty("--gold", theme.colors.gold);
  root.style.setProperty("--red", theme.colors.red);
  root.style.setProperty("--shadow", theme.shadows.default);
  root.style.setProperty("--font-body", theme.fonts.body);
  root.style.setProperty("--font-brand", theme.fonts.brand);
}
