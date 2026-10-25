import { R, pick } from "../math";
import type { Question } from "./types";
import { melange, qcm, tirer } from "./m1-outils";

const FORMES: [string, string][] = [["▲", "triangle"], ["■", "carré"], ["●", "rond"], ["▬", "rectangle"]];
const COULEURS = ["🔴", "🔵", "🟢", "🟡"];
const SOLIDES: [string, string][] = [["⚽", "une boule"], ["🎲", "un cube"], ["🥫", "un cylindre"]];
const DEVINETTES: [string, string, string[]][] = [
  ["J’ai 3 côtés. Qui suis-je ?", "▲", ["■", "●"]],
  ["Je suis tout rond, sans coin. Qui suis-je ?", "●", ["▲", "■"]],
  ["J’ai 4 côtés tous pareils. Qui suis-je ?", "■", ["▬", "▲"]],
  ["J’ai 4 côtés : 2 longs et 2 courts. Qui suis-je ?", "▬", ["■", "●"]],
];

/** Une frise : motif répété, on demande l'élément suivant. */
export function frise(elements: readonly string[]): Question {
  const [A, B, C] = tirer(elements, 3);
  const motif = pick([[A, B], [A, A, B], [A, B, B], [A, B, C]]);
  const n = motif.length * 2 + R(0, motif.length - 1);
  const montre = Array.from({ length: n }, (_, i) => motif[i % motif.length]);
  const a = motif[n % motif.length];
  return { q: `Qu’est-ce qui vient ensuite ?  ${montre.join(" ")} <b>?</b>`, txt: 1, a, choices: melange([...new Set(motif)]), why: `Le motif ${motif.join(" ")} se répète toujours dans le même ordre : ensuite vient ${a}.` };
}

/** Reconnaître et nommer les formes simples, trier selon un critère, continuer une frise : PER MSN 11, 1re-2e. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const [f, ...autres] = tirer(FORMES, 3);
    return { q: `Où est le <b>${f[1]}</b> ?`, txt: 1, a: f[0], choices: melange([f, ...autres].map((x) => x[0])), why: `Le ${f[1]}, c’est ${f[0]}.` };
  }
  if (t === 1) {
    const [f, ...autres] = tirer(FORMES, 3);
    return { q: `Comment s’appelle cette forme ?  <b>${f[0]}</b>`, txt: 1, a: f[1], choices: melange([f, ...autres].map((x) => x[1])), why: `${f[0]} est un ${f[1]}.` };
  }
  if (t === 2) {
    const parCouleur = Math.random() < 0.5;
    const [x, y] = parCouleur ? tirer(COULEURS, 2) : tirer(FORMES.map((f) => f[0]), 2);
    const rang = Array.from({ length: 5 }, () => x);
    rang[R(0, 4)] = y;
    return { q: `Lequel n’est pas comme les autres ?  ${rang.join(" ")}`, txt: 1, a: y, choices: melange([x, y]), why: `Tous sont ${x}, sauf un : ${y} n’a pas la même ${parCouleur ? "couleur" : "forme"}.` };
  }
  if (t === 3) return frise(Math.random() < 0.5 ? COULEURS : ["▲", "■", "●"]);
  if (t === 4) {
    const [e, nom] = pick(SOLIDES);
    return { q: `${e} a la forme…`, txt: 1, a: `d’${nom}`, choices: melange(SOLIDES.map((s) => `d’${s[1]}`)), why: `${e} ressemble à ${nom}.` };
  }
  const [q, a, autres] = pick(DEVINETTES);
  return { q, txt: 1, a, choices: qcm(a, autres), why: `${a} : ${q.replace(" Qui suis-je ?", "").replace(/^J’ai/, "il a").replace(/^Je suis/, "il est")}` };
}
