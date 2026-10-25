/* Outils partagés des exercices du cycle 1 (lot maths1) : collections d'objets, QCM, nombres en lettres. */

export const OBJETS = ["🍎", "🍓", "⭐", "🐞", "🎈", "🐟", "🌸", "🚗", "🍪", "⚽"] as const;
export const ANIMAUX = ["🐶", "🐱", "🐰", "🐻", "🐸", "🐷", "🐮", "🐵"] as const;
export const PRENOMS = ["Léa", "Noé", "Mia", "Tom", "Emma", "Luca", "Zoé", "Nina", "Liam", "Elio", "Lina", "Sami"] as const;

export function melange<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** n éléments distincts tirés au hasard. */
export const tirer = <T,>(a: readonly T[], n: number): T[] => melange(a).slice(0, n);

/** QCM : la bonne réponse et les n − 1 premiers distracteurs distincts (dans l'ordre donné : erreurs fréquentes d'abord), mélangés. */
export function qcm(a: string, autres: readonly string[], n = 3): string[] {
  const d = [...new Set(autres)].filter((x) => x !== a);
  return melange([a, ...d.slice(0, n - 1)]);
}

/** QCM de nombres entiers dans [min, max] : bonne réponse + erreurs données, complétées par a ± 1, a ± 2… */
export function qcmNombre(a: number, erreurs: readonly number[], min = 0, max = 1000, n = 3): { a: string; choices: string[] } {
  const d: number[] = [];
  for (const x of [...erreurs, a + 1, a - 1, a + 2, a - 2, a + 3, a - 3]) {
    if (Number.isInteger(x) && x >= min && x <= max && x !== a && !d.includes(x)) d.push(x);
  }
  return { a: String(a), choices: melange([a, ...d.slice(0, n - 1)]).map(String) };
}

/** Une collection de n objets, groupés par 5 pour qu'on puisse la compter. */
export function tas(e: string, n: number): string {
  const g: string[] = [];
  for (let i = 0; i < n; i += 5) g.push(e.repeat(Math.min(5, n - i)));
  return g.join(" ");
}

/** De 1 à n, pour montrer le comptage. */
export const compte = (de: number, a: number): string => Array.from({ length: a - de + 1 }, (_, i) => de + i).join(", ");

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "septante", "huitante", "nonante"];

/** Nombre en lettres (0 à 999), à la mode romande : septante, huitante, nonante. */
export function lettres(n: number): string {
  if (n < 20) return UNITES[n];
  if (n < 100) {
    const d = Math.floor(n / 10), u = n % 10;
    if (u === 0) return DIZAINES[d];
    if (u === 1) return `${DIZAINES[d]} et un`;
    return `${DIZAINES[d]}-${UNITES[u]}`;
  }
  const c = Math.floor(n / 100), r = n % 100;
  const tete = c === 1 ? "cent" : `${UNITES[c]} cent${r === 0 ? "s" : ""}`;
  return r === 0 ? tete : `${tete} ${lettres(r)}`;
}
