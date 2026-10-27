/* Outils partagés par les exercices du cycle 2 (lot maths2). Pas un générateur. */
import { R } from "../math";

/** Mélange (copie). */
export function melange<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Propositions d'un QCM : la bonne réponse + au plus `max - 1` distracteurs distincts, mélangés. */
export function qcm(a: string, distracteurs: readonly string[], max = 4): string[] {
  const d: string[] = [];
  for (const x of distracteurs) if (x !== a && !d.includes(x) && x.trim()) d.push(x);
  return melange([a, ...melange(d).slice(0, max - 1)]);
}

/** Arrondi propre (évite 0,1 + 0,2 = 0,30000000000000004). */
export const arr = (x: number, d = 2): number => Math.round(x * 10 ** d) / 10 ** d;

/** Écriture suisse romande d'un nombre : virgule, jusqu'à 3 décimales, espace fine des milliers dès 10 000. */
export function nb(x: number): string {
  const neg = x < 0;
  const s = String(arr(Math.abs(x), 3));
  const [e, d] = s.split(".");
  const ent = e.length > 4 ? e.replace(/\B(?=(\d{3})+(?!\d))/g, " ") : e;
  return (neg ? "−" : "") + ent + (d ? "," + d : "");
}

/** Nombre décimal écrit avec exactement `d` décimales (ex. 3,40). */
export const nbFixe = (x: number, d: number): string => x.toFixed(d).replace(".", ",");

const UNITES = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize"];
const DIZAINES = ["", "dix", "vingt", "trente", "quarante", "cinquante", "soixante", "septante", "huitante", "nonante"];

/** 0 à 99, en Suisse romande (septante, nonante ; huitante n'est jamais produit : voir sansHuitante). */
function moinsDeCent(n: number): string {
  if (n <= 16) return UNITES[n];
  if (n < 20) return "dix-" + UNITES[n - 10];
  const d = Math.floor(n / 10), u = n % 10;
  if (u === 0) return DIZAINES[d];
  if (u === 1) return `${DIZAINES[d]} et un`;
  return `${DIZAINES[d]}-${UNITES[u]}`;
}

/** 0 à 999 ; `final` : rien ne suit (ou « millions » suit), donc « cents » prend un s. */
function moinsDeMille(n: number, final: boolean): string {
  const c = Math.floor(n / 100), r = n % 100;
  let s = "";
  if (c === 1) s = "cent";
  else if (c > 1) s = `${UNITES[c]} cent${r === 0 && final ? "s" : ""}`;
  if (r) s += (s ? " " : "") + moinsDeCent(r);
  return s || "zéro";
}

/** Nombre entier en lettres (orthographe traditionnelle), jusqu'à 999 999 999. */
export function enLettres(n: number): string {
  if (n === 0) return "zéro";
  const mi = Math.floor(n / 1e6), k = Math.floor((n % 1e6) / 1000), u = n % 1000;
  const p: string[] = [];
  if (mi) p.push(`${moinsDeMille(mi, true)} million${mi > 1 ? "s" : ""}`);
  if (k) p.push(k === 1 ? "mille" : `${moinsDeMille(k, false)} mille`);
  if (u) p.push(moinsDeMille(u, true));
  return p.join(" ");
}

/** Vrai si l'écriture en lettres ne contient pas de 80-89 (huitante / quatre-vingts selon le canton). */
export const sansHuitante = (n: number): boolean => !String(n).split("").some((c, i, t) => c === "8" && (t.length - i) % 3 === 2);

/** Entier au hasard dont l'écriture en lettres n'a pas de 80-89. */
export function Rsans8(a: number, b: number): number {
  let v: number;
  do v = R(a, b);
  while (!sansHuitante(v));
  return v;
}

/** Chiffres romains (1 à 3999). */
export function romain(n: number): string {
  const t: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  let s = "";
  for (const [v, l] of t) while (n >= v) { s += l; n -= v; }
  return s;
}

/** Lecture d'un nombre romain morceau par morceau, ex. « XC (90) + IV (4) ». */
export function romainDetail(n: number): string {
  const t: [number, string][] = [[1000, "M"], [900, "CM"], [500, "D"], [400, "CD"], [100, "C"], [90, "XC"], [50, "L"], [40, "XL"], [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"]];
  const p: string[] = [];
  for (const [v, l] of t) {
    let k = 0;
    while (n >= v) { n -= v; k++; }
    if (k) p.push(`${l.repeat(k)} (${v * k})`);
  }
  return p.join(" + ");
}

/** Réponse décimale à 3 décimales : en texte (la correction numérique arrondit à 2 décimales). */
export function repDec(x: number): { a: string; accept: string[] } {
  const s = nb(x);
  return { a: s, accept: [s.replace(",", "."), s.replace(" ", "")] };
}

/** Valeur d'une expression écrite pour l'élève (×, :, −, parenthèses) ; sert à écarter un distracteur qui donnerait le bon résultat. */
export function valeur(expr: string): number {
  const t = expr.replace(/\s+/g, "");
  let i = 0;
  const nombre = (): number => {
    const m = /^\d+(?:[.,]\d+)?/.exec(t.slice(i));
    if (!m) return NaN;
    i += m[0].length;
    return Number(m[0].replace(",", "."));
  };
  const facteur = (): number => {
    if (t[i] === "(") { i++; const v = somme(); if (t[i] !== ")") return NaN; i++; return v; }
    return nombre();
  };
  const produit = (): number => {
    let v = facteur();
    while (t[i] === "×" || t[i] === ":") { const op = t[i++]; const w = facteur(); v = op === "×" ? v * w : v / w; }
    return v;
  };
  const somme = (): number => {
    let v = produit();
    while (t[i] === "+" || t[i] === "−") { const op = t[i++]; const w = produit(); v = op === "+" ? v + w : v - w; }
    return v;
  };
  const v = somme();
  return i === t.length ? v : NaN;
}

/** Distracteurs dont la valeur diffère de celle de la bonne expression. */
export const autresValeurs = (a: string, d: readonly string[]): string[] => d.filter((x) => Math.abs(valeur(x) - valeur(a)) > 1e-9);

/** PGCD. */
export const pgcd = (a: number, b: number): number => (b ? pgcd(b, a % b) : a);

/** Diviseurs d'un entier positif. */
export const diviseurs = (n: number): number[] => Array.from({ length: n }, (_, i) => i + 1).filter((d) => n % d === 0);

/** Prénoms et lieux pour les énoncés. */
export const PRENOMS = ["Léa", "Noah", "Emma", "Liam", "Zoé", "Gabriel", "Chloé", "Luca", "Mia", "Elias", "Lina", "Nathan", "Sara", "Yanis", "Alice", "Samuel", "Inès", "Matteo", "Jade", "Arthur"];
export const VILLES = ["Lausanne", "Genève", "Fribourg", "Neuchâtel", "Sion", "Delémont", "Yverdon-les-Bains", "Bienne", "Montreux", "Martigny", "Bulle", "La Chaux-de-Fonds", "Nyon", "Morges", "Porrentruy"];
