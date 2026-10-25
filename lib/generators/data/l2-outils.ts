import { normText } from "../../grade";

/** Outils communs aux exercices d'allemand (l2-) et d'anglais (l3-). */

export const KEYS_DE = ["ä", "ö", "ü", "ß"];

export function melange<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** La bonne réponse et jusqu'à n − 1 leurres, tous différents une fois normalisés comme à la correction. */
export function propositions(a: string, leurres: readonly string[], n = 4): string[] {
  const vus = new Set([normText(a)]);
  const out = [a];
  for (const x of melange(leurres)) {
    if (out.length >= n) break;
    const k = normText(x);
    if (!k || vus.has(k)) continue;
    vus.add(k);
    out.push(x);
  }
  return melange(out);
}

export const maj = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);
