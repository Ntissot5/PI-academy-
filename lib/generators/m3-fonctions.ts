import { NZ, R, S, P, lin, pick } from "../math";
import type { Question } from "./types";
import { melange, qcm } from "./m3-outils";

const PROP = [
  "le prix payé selon la masse de pommes achetée (prix au kilo fixe)",
  "la distance parcourue selon le temps, à vitesse constante",
  "le périmètre d’un carré selon la longueur de son côté",
  "le nombre de roues selon le nombre de vélos",
];
const NONPROP = [
  "l’aire d’un carré selon la longueur de son côté",
  "le prix d’une course en taxi avec une prise en charge fixe, selon les km",
  "la taille d’un enfant selon son âge",
  "le prix d’un abonnement de téléphone avec un forfait de base, selon les minutes",
];

const machine = (a: number, b: number): string => `multiplie le nombre d’entrée par ${a}, puis ${b > 0 ? `ajoute ${b}` : `soustrait ${-b}`}`;

/** Fonctions : machines, tableaux de valeurs, opérateur, situations modélisées, x → ax² (PER MSN 33 et MSN 35, 9e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    const a = R(2, 6), b = NZ(-9, 9), x = R(-5, 10);
    return { q: `Une machine ${machine(a, b)}. Que sort-il si on entre ${S(x)} ?`, txt: 1, a: a * x + b, why: `${a} × ${P(x)} = ${S(a * x)}, puis ${S(a * x)} ${b > 0 ? "+" : "−"} ${Math.abs(b)} = ${S(a * x + b)}.` };
  }
  if (t === 1) {
    const a = R(2, 6), b = NZ(-9, 9), x = R(-5, 10), y = a * x + b;
    return { q: `Une machine ${machine(a, b)}. Il sort ${S(y)}. Quel nombre a-t-on entré ?`, txt: 1, a: x, hint: "Fais le chemin à l’envers.", why: `À l’envers : ${S(y)} ${b > 0 ? "−" : "+"} ${Math.abs(b)} = ${S(y - b)}, puis ÷ ${a} = ${S(x)}.` };
  }
  if (t === 2) {
    const a = NZ(-5, 5), b = R(-9, 9), x = pick([10, 20, 100]);
    return { q: `Tableau de valeurs d’une fonction affine : x = 0 → ${S(b)} ; x = 1 → ${S(a + b)} ; x = 2 → ${S(2 * a + b)}. Quelle valeur correspond à x = ${x} ?`, txt: 1, a: a * x + b, hint: "De combien augmente-t-on à chaque pas ?", why: `On ajoute ${S(a)} à chaque pas et on part de ${S(b)} : f(x) = ${lin(a, b)} ; f(${x}) = ${S(a * x + b)}.` };
  }
  if (t === 3) {
    const k = R(0, 3), a = R(2, 5), b = R(1, 9);
    const f = [(x: number) => a * x, (x: number) => x + b, (x: number) => a * x + b, (x: number) => x * x][k];
    const nom = [`x → ${a}x`, `x → ${lin(1, b)}`, `x → ${lin(a, b)}`, "x → x²"][k];
    const xs = [1, 2, 3], ys = xs.map(f);
    const cands: [string, (x: number) => number][] = [
      [`x → ${lin(ys[0], 0)}`, (x) => ys[0] * x],
      [`x → ${lin(1, ys[0] - 1)}`, (x) => x + ys[0] - 1],
      [`x → ${lin(ys[1] - ys[0], ys[0] - (ys[1] - ys[0]))}`, (x) => (ys[1] - ys[0]) * x + ys[0] - (ys[1] - ys[0])],
      ["x → x²", (x) => x * x],
      [`x → ${lin(a + 1, b - 1)}`, (x) => (a + 1) * x + b - 1],
      [`x → ${a + b}x`, (x) => (a + b) * x],
    ];
    const d = cands.filter(([n, g]) => n !== nom && !xs.every((x, i) => g(x) === ys[i])).map(([n]) => n);
    return { q: `Quelle règle donne ce tableau ? 1 → ${ys[0]} ; 2 → ${ys[1]} ; 3 → ${ys[2]}`, txt: 1, a: nom, choices: qcm(nom, d), hint: "Vérifie la règle sur les trois colonnes.", why: `${nom} : ${xs.map((x, i) => `${x} → ${ys[i]}`).join(", ")} ✔.` };
  }
  if (t === 4) {
    let p: number, b: number;
    do { p = R(2, 6); b = R(3, 12); } while (p === b);
    const [ctx, u] = pick([[`Une course de taxi coûte ${b} CHF de prise en charge, plus ${p} CHF par km.`, "le nombre de km"], [`Un club de sport demande ${b} CHF d’inscription, puis ${p} CHF par séance.`, "le nombre de séances"]] as const);
    const a = `x → ${p}x + ${b}`;
    return { q: `${ctx} Quelle fonction donne le prix en CHF si x est ${u} ?`, txt: 1, a, choices: melange([a, `x → ${b}x + ${p}`, `x → ${p + b}x`, `x → ${p}x`]), why: `${p} CHF pour chaque unité (${p}x), plus ${b} CHF une seule fois : ${a}.` };
  }
  if (t === 5) {
    if (R(0, 1)) { const a = pick(PROP); return { q: "Laquelle de ces situations est une situation de proportionnalité ?", txt: 1, a, choices: qcm(a, NONPROP), why: `Dans « ${a} », doubler l’une double l’autre, et 0 donne 0.` }; }
    const a = pick(NONPROP);
    return { q: "Laquelle de ces situations n’est pas une situation de proportionnalité ?", txt: 1, a, choices: qcm(a, PROP), why: `Dans « ${a} », doubler l’une ne double pas l’autre.` };
  }
  if (t === 6) {
    const a = NZ(-3, 3), x = NZ(-5, 5);
    return { q: `f(x) = ${a === 1 ? "" : a === -1 ? "−" : S(a)}x². Calcule f(${S(x)}).`, txt: 1, a: a * x * x, hint: "Le carré d’abord.", why: `${P(x)}² = ${x * x}, puis × ${P(a)} = ${S(a * x * x)}.` };
  }
  const b = 5 * R(2, 8), p = pick([2, 3, 4, 5]), n = R(3, 15), T = b + p * n;
  return { q: `Un abonnement de téléphone coûte ${b} CHF par mois, plus ${p} CHF par Go de données. Ce mois, tu paies ${T} CHF. Combien de Go as-tu utilisés ?`, txt: 1, a: n, hint: `${b} + ${p}x = ${T}`, why: `${T} − ${b} = ${T - b} CHF pour les données ; ${T - b} ÷ ${p} = ${n} Go.` };
}
