import { R, pick } from "../math";
import type { Question } from "./types";
import { qcm } from "./m3-outils";

// n → nom du polygone régulier
const REG: Record<number, string> = {
  3: "triangle équilatéral", 4: "carré", 5: "pentagone régulier", 6: "hexagone régulier",
  8: "octogone régulier", 9: "ennéagone régulier", 10: "décagone régulier", 12: "dodécagone régulier",
};
const NS = [3, 4, 5, 6, 8, 9, 10, 12];
const NOMS: Record<number, string> = { 5: "un pentagone", 6: "un hexagone", 7: "un heptagone", 8: "un octogone", 10: "un décagone", 12: "un dodécagone" };

/** Polygones réguliers : angle au centre, angle intérieur, somme des angles, axes, périmètre, noms (PER MSN 31, 10e-11e). */
export function gen(): Question {
  const t = R(0, 6);
  const n = pick(NS), nom = REG[n];
  if (t === 0) return { q: `Quel est l’angle au centre d’un ${nom} (en degrés) ?`, txt: 1, a: 360 / n, hint: "Le tour complet fait 360°.", why: `Les ${n} angles au centre se partagent le tour complet : 360 ÷ ${n} = ${360 / n}°.` };
  if (t === 1) {
    const ai = ((n - 2) * 180) / n;
    return { q: `Combien mesure chaque angle intérieur d’un ${nom} ?`, txt: 1, a: ai, hint: "Somme des angles : (n − 2) × 180°.", why: `Somme des angles : (${n} − 2) × 180 = ${(n - 2) * 180}° ; ${n} angles égaux : ${(n - 2) * 180} ÷ ${n} = ${ai}°.` };
  }
  if (t === 2) {
    const m = R(4, 12);
    return { q: `Quelle est la somme des angles intérieurs d’un polygone (convexe) à ${m} côtés ?`, txt: 1, a: (m - 2) * 180, hint: "Découpe-le en triangles depuis un sommet.", why: `Depuis un sommet, on le découpe en ${m} − 2 = ${m - 2} triangles : ${m - 2} × 180 = ${(m - 2) * 180}°.` };
  }
  if (t === 3) return { q: `Combien d’axes de symétrie a un ${nom} ?`, txt: 1, a: n, why: `Un polygone régulier à ${n} côtés a ${n} axes de symétrie.` };
  if (t === 4) {
    const ai = ((n - 2) * 180) / n;
    return { q: `Chaque angle intérieur d’un polygone régulier mesure ${ai}°. Combien a-t-il de côtés ?`, txt: 1, a: n, hint: "L’angle au centre vaut 180° − angle intérieur.", why: `Angle au centre : 180 − ${ai} = ${180 - ai}° ; 360 ÷ ${180 - ai} = ${n} côtés.` };
  }
  if (t === 5) {
    const c = R(2, 25);
    if (R(0, 1)) return { q: `Un ${nom} a des côtés de ${c} cm. Quel est son périmètre en cm ?`, txt: 1, a: n * c, why: `${n} côtés égaux : ${n} × ${c} = ${n * c} cm.` };
    return { q: `Un ${nom} a un périmètre de ${n * c} cm. Combien mesure un côté ?`, txt: 1, a: c, why: `${n * c} ÷ ${n} = ${c} cm.` };
  }
  const k = pick(Object.keys(NOMS).map(Number)), a = NOMS[k];
  return { q: `Comment s’appelle un polygone à ${k} côtés ?`, txt: 1, a, choices: qcm(a, Object.values(NOMS)), why: `${k} côtés : ${a.replace("un ", "")}.` };
}
