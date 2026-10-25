import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { pt } from "./m3-outils";

const TRIPLETS: [number, number, number][] = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [20, 21, 29], [9, 40, 41]];
function triplet(): [number, number, number] {
  const [a, b, c] = pick(TRIPLETS), k = c > 25 ? 1 : c > 13 ? R(1, 2) : R(1, 4);
  return R(0, 1) ? [a * k, b * k, c * k] : [b * k, a * k, c * k];
}

/** Théorème de Pythagore et sa réciproque, en situations (PER MSN 34, 10e-11e). */
export function gen(): Question {
  const t = R(0, 6);
  const [a, b, c] = triplet();
  if (t === 0) return { q: `Un triangle est rectangle ; ses côtés de l’angle droit mesurent ${a} cm et ${b} cm. Combien mesure l’hypoténuse ?`, txt: 1, a: c, hint: "c² = a² + b²", why: `${a}² + ${b}² = ${a * a} + ${b * b} = ${c * c} ; √${c * c} = ${c} cm.` };
  if (t === 1) return { q: `Un triangle rectangle a une hypoténuse de ${c} cm et un côté de l’angle droit de ${a} cm. Combien mesure l’autre côté de l’angle droit ?`, txt: 1, a: b, hint: "On soustrait : b² = c² − a²", why: `${c}² − ${a}² = ${c * c} − ${a * a} = ${b * b} ; √${b * b} = ${b} cm.` };
  if (t === 2) {
    let x: number, y: number, h: number;
    do { x = R(2, 15); y = R(2, 15); h = Math.sqrt(x * x + y * y); } while (Number.isInteger(h));
    return { q: `Un écran rectangulaire mesure ${x} dm sur ${y} dm. Combien mesure sa diagonale, en dm, arrondie au dixième ?`, txt: 1, a: h, tol: 0.051, why: `d² = ${x}² + ${y}² = ${x * x + y * y} ; d = √${x * x + y * y} ≈ ${fr(Math.round(h * 10) / 10)} dm.` };
  }
  if (t === 3) {
    const ok = R(0, 1) === 1, cc = ok ? c : c + pick([1, 2]);
    return { q: `Un triangle a des côtés de ${a} cm, ${b} cm et ${cc} cm. Est-il rectangle ?`, txt: 1, a: ok ? "oui" : "non", choices: ["oui", "non"], hint: "Compare le carré du plus grand côté à la somme des deux autres carrés.", why: `${a}² + ${b}² = ${a * a + b * b} et ${cc}² = ${cc * cc} : ${ok ? "égalité, donc le triangle est rectangle (réciproque de Pythagore)" : "pas d’égalité, donc il n’est pas rectangle"}.` };
  }
  if (t === 4) {
    const [d, h, L] = a < b ? [a, b, c] : [b, a, c];
    return { q: `Une échelle de ${L} dm est appuyée contre un mur vertical. Son pied est à ${d} dm du mur. À quelle hauteur touche-t-elle le mur (en dm) ?`, txt: 1, a: h, why: `L’échelle est l’hypoténuse : h² = ${L}² − ${d}² = ${L * L} − ${d * d} = ${h * h} ; h = ${h} dm.` };
  }
  if (t === 5) {
    const x1 = R(-6, 4), y1 = R(-6, 4), sx = pick([1, -1]), sy = pick([1, -1]);
    const [dx, dy] = c <= 15 ? [a, b] : [3, 4];
    const D = c <= 15 ? c : 5;
    const x2 = x1 + sx * dx, y2 = y1 + sy * dy;
    return { q: `Dans un repère (unité : 1 cm), quelle est la distance entre A${pt(x1, y1)} et B${pt(x2, y2)} ?`, txt: 1, a: D, hint: "Dessine le triangle rectangle avec un côté horizontal et un vertical.", why: `Écart horizontal ${dx}, vertical ${dy} : AB² = ${dx}² + ${dy}² = ${dx * dx + dy * dy}, AB = ${D} cm.` };
  }
  const [m, h, s] = a < b ? [a, b, c] : [b, a, c];
  return { q: `Un triangle isocèle a deux côtés de ${s} cm et une base de ${2 * m} cm. Combien mesure sa hauteur (issue du sommet principal) ?`, txt: 1, a: h, hint: "La hauteur coupe la base en son milieu.", why: `Demi-base : ${m} cm. h² = ${s}² − ${m}² = ${s * s} − ${m * m} = ${h * h} ; h = ${h} cm.` };
}
