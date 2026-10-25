import { BOSS_PASS } from "./config";

export interface Progression {
  meilleur_entrainement: number;
  meilleur_boss: number;
  nb_entrainements: number;
  nb_boss: number;
  valide: boolean;
  lecon_lue: boolean;
}

export type Level = 0 | 1 | 2 | 3;
export const LVL = ["Pas commencé", "Tenté", "Familier", "Maîtrisé"] as const;

/** 0 rien · 1 tenté · 2 familier (entraînement ≥ 8) · 3 maîtrisé (boss battu). Même règle que le prototype. */
export function mastery(p: Progression | null | undefined): Level {
  if (!p) return 0;
  if (p.valide) return 3;
  if (p.nb_entrainements > 0 && p.meilleur_entrainement >= BOSS_PASS) return 2;
  if (p.lecon_lue || p.nb_entrainements > 0 || p.nb_boss > 0) return 1;
  return 0;
}

export function courseMastery(ps: (Progression | null | undefined)[]): number {
  if (!ps.length) return 0;
  const s = ps.reduce((acc, p) => acc + mastery(p), 0);
  return Math.round((s / (ps.length * 3)) * 100);
}
