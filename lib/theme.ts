"use client";

export type ThemeChoice = "clair" | "sombre";
export const THEME_KEY = "pi-theme";

/** Script inline, exécuté avant le premier rendu : applique le choix mémorisé sans clignotement. */
export const THEME_BOOT = `try{var t=localStorage.getItem("${THEME_KEY}");if(t==="clair")document.documentElement.dataset.theme="light";else if(t==="sombre")document.documentElement.dataset.theme="dark"}catch(e){}`;

export function effectiveTheme(): ThemeChoice {
  const d = document.documentElement.dataset.theme;
  if (d === "dark") return "sombre";
  if (d === "light") return "clair";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "sombre" : "clair";
}

export function applyTheme(t: ThemeChoice) {
  document.documentElement.dataset.theme = t === "sombre" ? "dark" : "light";
  try { localStorage.setItem(THEME_KEY, t); } catch { /* stockage indisponible */ }
}
