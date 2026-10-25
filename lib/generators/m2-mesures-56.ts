import { R, pick } from "../math";
import { PRENOMS, arr, nb, qcm } from "./m2-outils";
import type { Question } from "./types";

// [objet, bonne estimation, distracteurs]
const ESTIM: [string, string, string[]][] = [
  ["la hauteur d’une porte", "environ 2 m", ["environ 2 cm", "environ 20 cm", "environ 20 m"]],
  ["la longueur d’un crayon neuf", "environ 18 cm", ["environ 18 mm", "environ 18 m", "environ 1 m"]],
  ["la longueur d’un lit", "environ 2 m", ["environ 20 cm", "environ 20 m", "environ 2 km"]],
  ["la masse d’une pomme", "environ 150 g", ["environ 15 g", "environ 15 kg", "environ 1 g"]],
  ["la masse d’un élève de 10 ans", "environ 30 kg", ["environ 3 kg", "environ 300 kg", "environ 300 g"]],
  ["la contenance d’une brique de lait", "environ 1 litre", ["environ 1 décilitre", "environ 10 litres", "environ 100 litres"]],
  ["la largeur d’un timbre", "environ 2 cm", ["environ 2 m", "environ 20 cm", "environ 2 mm"]],
  ["la durée d’une nuit de sommeil d’un enfant", "environ 10 heures", ["environ 10 minutes", "environ 10 secondes", "environ 10 jours"]],
];
// [ce qu'on mesure, unité]
const UNITE: [string, string, string[]][] = [
  ["la longueur d’une gomme", "cm", ["km", "kg", "h"]], ["la longueur de la cour d’école", "m", ["mm", "g", "min"]], ["la masse d’un sac de pommes de terre", "kg", ["cm", "min", "g"]],
  ["la masse d’une lettre", "g", ["kg", "m", "h"]], ["la durée d’une récréation", "min", ["h", "m", "kg"]], ["la hauteur d’un arbre", "m", ["mm", "km", "kg"]], ["la largeur d’un cahier", "cm", ["km", "m", "g"]],
];

/** Mesures (5e-6e) : cm et m, estimations, choix d'une unité, lecture d'une règle, unités non conventionnelles, durées. */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0) {
    const m = R(1, 9), c = R(1, 99), k = R(0, 2);
    if (k === 0) return { q: `${m} m ${c} cm = ? cm`, a: m * 100 + c, hint: "1 m = 100 cm", why: `${m} m = ${m * 100} cm, plus ${c} cm : ${m * 100 + c} cm.` };
    if (k === 1) { const v = m * 100 + c; return { q: `${v} cm = ? m (nombre à virgule)`, a: arr(v / 100), hint: "100 cm = 1 m", why: `${v} cm = ${m} m et ${c} cm = ${nb(arr(v / 100))} m.` }; }
    const v = m * 100;
    return { q: `${v} cm = ? m`, a: m, hint: "100 cm = 1 m", why: `${v} : 100 = ${m} m.` };
  }
  if (t === 1) {
    const [o, a, d] = pick(ESTIM);
    return { q: `Estime ${o}.`, txt: 1, a, choices: qcm(a, d), why: `${o[0].toUpperCase() + o.slice(1)} : ${a}. Compare avec des objets que tu connais.` };
  }
  if (t === 2) {
    const [o, a, d] = pick(UNITE);
    return { q: `Quelle unité choisis-tu pour mesurer ${o} ?`, txt: 1, a, choices: qcm(a, d), why: `Pour ${o}, l’unité la plus pratique est le ${a === "min" ? "minute (min)" : a}.`.replace("le minute", "la minute") };
  }
  if (t === 3) {
    const d = R(1, 8), l = R(2, 12);
    return { q: `Sur une règle, un trait commence à la graduation <b>${d} cm</b> et finit à la graduation <b>${d + l} cm</b>. Combien mesure-t-il, en cm ?`, txt: 1, a: l, hint: "Le trait ne commence pas à 0", why: `${d + l} − ${d} = ${l} cm.` };
  }
  if (t === 4) {
    const n = R(3, 9), c = pick([12, 15, 18, 20, 25]), o = pick(["crayons", "règles", "gommes"]);
    const it = pick([
      [`Le banc de l’école mesure ${n} longueurs de ${o.replace(/s$/, "")}. Un${o === "règles" || o === "gommes" ? "e" : ""} ${o.replace(/s$/, "")} mesure ${c} cm. Combien mesure le banc, en cm ?`, n * c, `${n} × ${c} = ${n * c} cm.`],
      [`Une surface est recouverte exactement par ${n} carreaux. Chaque carreau est fait de 2 triangles. Combien de triangles recouvrent la surface ?`, 2 * n, `${n} × 2 = ${2 * n} triangles : avec une unité 2 fois plus petite, le nombre est 2 fois plus grand.`],
    ] as [string, number, string][]);
    return { q: it[0], txt: 1, a: it[1], why: it[2] };
  }
  if (t === 5) {
    const p1 = pick(PRENOMS), a = R(6, 10), b = R(3, a - 1);
    const rep = "le père";
    return { q: `${p1} mesure la table avec son empan (main ouverte) : ${a} empans. Son père trouve ${b} empans pour la même table. Qui a le plus grand empan ?`, txt: 1, a: rep, choices: [p1, rep, "ils ont le même"], why: "Moins on reporte l’unité, plus elle est grande : le père en a besoin de moins, son empan est plus grand." };
  }
  if (t === 6) {
    const L = [[1, R(10, 30)], [1, R(1, 9)], [0, R(100, 130)], [0, R(85, 99)]].map(([m, c]) => m * 100 + c);
    const vus = [...new Set(L)];
    const txt = (v: number, i: number): string => (i % 2 === 0 && v >= 100 ? `${Math.floor(v / 100)} m ${v % 100} cm` : `${v} cm`);
    const lab = vus.map((v, i) => txt(v, i));
    const grand = Math.random() < 0.5, ix = vus.indexOf(grand ? Math.max(...vus) : Math.min(...vus));
    return { q: `Quelle est la longueur la plus ${grand ? "grande" : "petite"} ?`, txt: 1, a: lab[ix], choices: qcm(lab[ix], lab), hint: "Écris tout en cm", why: `En cm : ${vus.map((v) => `${v} cm`).join(", ")}. La plus ${grand ? "grande" : "petite"} est ${lab[ix]}.` };
  }
  if (t === 7) {
    const k = R(0, 2);
    if (k === 0) { const h = R(1, 3), m = R(5, 55); return { q: `${h} h ${m} min = ? min`, a: h * 60 + m, hint: "1 h = 60 min", why: `${h} × 60 = ${h * 60} min, plus ${m} : ${h * 60 + m} min.` }; }
    const h = R(7, 16), m1 = R(0, 11) * 5, d = R(2, 11) * 5, fin = h * 60 + m1 + d;
    const f = (x: number): string => `${Math.floor(x / 60)} h ${String(x % 60).padStart(2, "0")}`;
    return { q: `La leçon commence à ${f(h * 60 + m1)} et finit à ${f(fin)}. Combien de minutes dure-t-elle ?`, txt: 1, a: d, hint: "Passe par l’heure pile", why: `De ${f(h * 60 + m1)} à ${f(fin)} : ${d} min.` };
  }
  const L = R(2, 6), n = pick([2, 4, 5]);
  if (Math.random() < 0.5) return { q: `On coupe une ficelle de ${L} m en ${n} morceaux égaux. Combien mesure chaque morceau, en cm ?`, txt: 1, a: (L * 100) / n, hint: "Convertis d’abord en cm", why: `${L} m = ${L * 100} cm ; ${L * 100} : ${n} = ${(L * 100) / n} cm.` };
  const k = R(2, 6);
  return { q: `Autrefois, on mesurait en « pieds ». Un pied mesure environ 30 cm. Une poutre mesure ${k * 2} pieds. Combien mesure-t-elle environ, en cm ?`, txt: 1, a: k * 60, why: `${k * 2} × 30 = ${k * 60} cm environ (le pied anglais mesure exactement 30,48 cm).` };
}
