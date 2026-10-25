import { S, fr, pick } from "../math";

/* Petits outils partagés par les exercices du lot maths3 (cycle 3). */

/** Mélange (Fisher-Yates), sans modifier le tableau d'origine. */
export function melange<T>(t: readonly T[]): T[] {
  const b = [...t];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Propositions d'un QCM : la bonne réponse et au plus n − 1 distracteurs distincts, mélangés. */
export function qcm(a: string, autres: readonly string[], n = 4): string[] {
  const d = [...new Set(autres.filter((x) => x !== a))];
  return melange([a, ...melange(d).slice(0, n - 1)]);
}

/** Arrondi à d décimales (évite les 0,30000000000000004). */
export const arr = (x: number, d = 2): number => Math.round(x * 10 ** d) / 10 ** d;

export const pgdc = (a: number, b: number): number => (b ? pgdc(b, a % b) : Math.abs(a));
export const ppmc = (a: number, b: number): number => (a / pgdc(a, b)) * b;

export function estPremier(n: number): boolean {
  if (n < 2) return false;
  for (let d = 2; d * d <= n; d++) if (n % d === 0) return false;
  return true;
}

/** Point du plan : (−3 ; 4). */
export const pt = (x: number, y: number): string => `(${S(x)} ; ${S(y)})`;

/** Durée en minutes → « 1 h 30 min », « 45 min », « 2 h ». */
export function duree(min: number): string {
  const h = Math.floor(min / 60), m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Heure en minutes depuis minuit → « 7 h 05 ». */
export const heure = (min: number): string => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, "0")}`;

/** Quelques villes romandes pour habiller les énoncés. */
export const VILLES = ["Lausanne", "Genève", "Fribourg", "Sion", "Neuchâtel", "Delémont", "Yverdon-les-Bains", "Bienne", "Martigny", "Bulle", "Nyon", "Morges"] as const;
export const ville = (): string => pick(VILLES);

export const PRENOMS = ["Léa", "Noah", "Emma", "Luca", "Chloé", "Gabriel", "Zoé", "Samuel", "Inès", "Liam", "Maëlle", "Elias"] as const;
export const prenom = (): string => pick(PRENOMS);

/** Liste lisible : « 3, 5 et 8 ». */
export function liste(t: readonly (string | number)[]): string {
  const s = t.map((x) => (typeof x === "number" ? fr(x) : x));
  return s.length < 2 ? s.join("") : `${s.slice(0, -1).join(", ")} et ${s[s.length - 1]}`;
}
