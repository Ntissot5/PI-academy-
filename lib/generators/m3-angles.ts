import { R } from "../math";
import type { Question } from "./types";

const TYPES = ["aigu", "droit", "obtus", "plat"] as const;
const DEF: Record<(typeof TYPES)[number], string> = {
  aigu: "plus petit que 90°",
  droit: "exactement 90°",
  obtus: "entre 90° et 180°",
  plat: "exactement 180°",
};

/** Angles : nature d'un angle, somme des angles du triangle et du quadrilatère, angles à déduire (PER MSN 31, 9e-10e). */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const k = R(0, 3);
    const m = k === 0 ? R(5, 85) : k === 1 ? 90 : k === 2 ? R(95, 175) : 180;
    const a = TYPES[k];
    return { q: `Un angle mesure ${m}°. Comment s’appelle-t-il ?`, txt: 1, a, choices: [...TYPES], why: `Un angle ${a} mesure ${DEF[a]} : ${m}° → angle ${a}.` };
  }
  if (t === 1) {
    const a = R(20, 100), b = R(20, 150 - a), c = 180 - a - b;
    return { q: `Dans un triangle, deux angles mesurent ${a}° et ${b}°. Combien mesure le troisième angle (en degrés) ?`, txt: 1, a: c, hint: "Somme des angles d’un triangle ?", why: `La somme des angles d’un triangle vaut 180° : 180 − ${a} − ${b} = ${c}°.` };
  }
  if (t === 2) {
    if (R(0, 1)) {
      const s = 2 * R(10, 80), b = (180 - s) / 2;
      return { q: `Un triangle isocèle a un angle au sommet (entre les deux côtés égaux) de ${s}°. Combien mesure chacun des deux angles à la base ?`, txt: 1, a: b, why: `Les deux angles à la base sont égaux : (180 − ${s}) ÷ 2 = ${b}°.` };
    }
    const b = R(20, 85), s = 180 - 2 * b;
    return { q: `Dans un triangle isocèle, chaque angle à la base mesure ${b}°. Combien mesure l’angle au sommet ?`, txt: 1, a: s, why: `180 − 2 × ${b} = 180 − ${2 * b} = ${s}°.` };
  }
  if (t === 3) {
    let a: number, b: number, c: number, d: number;
    do { a = R(60, 130); b = R(60, 130); c = R(60, 130); d = 360 - a - b - c; } while (d < 30 || d > 170);
    return { q: `Un quadrilatère a trois angles de ${a}°, ${b}° et ${c}°. Combien mesure le quatrième ?`, txt: 1, a: d, hint: "Un quadrilatère se coupe en deux triangles.", why: `La somme des angles d’un quadrilatère vaut 360° (deux triangles) : 360 − ${a} − ${b} − ${c} = ${d}°.` };
  }
  if (t === 4) {
    if (R(0, 1)) {
      const x = R(10, 80);
      return { q: `Deux angles côte à côte forment ensemble un angle droit. L’un mesure ${x}°. Combien mesure l’autre ?`, txt: 1, a: 90 - x, why: `Un angle droit mesure 90° : 90 − ${x} = ${90 - x}°.` };
    }
    const x = R(10, 170);
    return { q: `Deux angles côte à côte forment ensemble un angle plat. L’un mesure ${x}°. Combien mesure l’autre ?`, txt: 1, a: 180 - x, why: `Un angle plat mesure 180° : 180 − ${x} = ${180 - x}°.` };
  }
  if (t === 5) {
    const a = R(10, 80);
    return { q: `Un triangle rectangle a un angle aigu de ${a}°. Combien mesure son autre angle aigu ?`, txt: 1, a: 90 - a, why: `L’angle droit prend 90° des 180° : il reste 90° pour les deux angles aigus, donc 90 − ${a} = ${90 - a}°.` };
  }
  let a: number;
  do a = R(35, 145); while (a === 90);
  if (R(0, 1)) return { q: `Dans un parallélogramme, un angle mesure ${a}°. Combien mesure un angle voisin (qui partage un côté avec lui) ?`, txt: 1, a: 180 - a, why: `Deux angles voisins d’un parallélogramme font ensemble 180° : 180 − ${a} = ${180 - a}°.` };
  return R(0, 1)
    ? { q: `Dans un parallélogramme, un angle mesure ${a}°. Combien mesure l’angle opposé ?`, txt: 1, a, why: `Dans un parallélogramme, les angles opposés sont égaux : ${a}°.` }
    : { q: `Combien mesure chaque angle d’un triangle équilatéral ?`, txt: 1, a: 60, why: "Ses trois angles sont égaux : 180 ÷ 3 = 60°." };
}
