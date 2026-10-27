import { NZ, R, S, fr, pick } from "../math";
import type { Question } from "./types";
import { arr, pt } from "./m3-outils";

/** Homothéties et similitudes (11e) : image d'un point, longueurs, aires, rapport. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const k = pick([2, 3, -1, -2, 0.5, -0.5, 1.5]), x = 2 * NZ(-4, 4), y = 2 * NZ(-4, 4);
    const abs = R(0, 1) === 1, v = arr(k * (abs ? x : y));
    return { q: `On applique au point A${pt(x, y)} l’homothétie de centre O(0 ; 0) et de rapport ${fr(k)}. Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} de l’image ?`, txt: 1, a: v, why: `Avec le centre O, on multiplie les coordonnées par le rapport : ${fr(k)} × ${pt(x, y)} = ${pt(arr(k * x), arr(k * y))}.` };
  }
  if (t === 1) {
    const k = pick([2, 3, -1, -2]), cx = NZ(-3, 3), cy = NZ(-3, 3), x = NZ(-5, 5), y = NZ(-5, 5);
    const ix = cx + k * (x - cx), iy = cy + k * (y - cy), abs = R(0, 1) === 1;
    return { q: `On applique au point A${pt(x, y)} l’homothétie de centre C${pt(cx, cy)} et de rapport ${S(k)}. Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} de l’image ?`, txt: 1, a: abs ? ix : iy, hint: "Vecteur CA, multiplié par le rapport, à partir de C.", why: `CA = ${pt(x - cx, y - cy)} ; ${S(k)} × CA = ${pt(k * (x - cx), k * (y - cy))} ; on part de C : ${pt(ix, iy)}.` };
  }
  if (t === 2) {
    const k = pick([2, 3, -2, -3, 0.5, -0.5, 1.5, 2.5]), l = 2 * R(2, 9), v = arr(Math.abs(k) * l);
    return { q: `Un segment mesure ${l} cm. Combien mesure son image par une homothétie de rapport ${fr(k)} ?`, txt: 1, a: v, why: `Les longueurs sont multipliées par |${fr(k)}| = ${fr(Math.abs(k))} : ${l} × ${fr(Math.abs(k))} = ${fr(v)} cm.` };
  }
  if (t === 3) {
    const k = pick([2, 3, -2, 0.5, 4]), A = 4 * R(2, 15), v = arr(k * k * A);
    return { q: `Une figure a une aire de ${A} cm². Quelle est l’aire de son image par une homothétie de rapport ${fr(k)} ?`, txt: 1, a: v, why: `Les aires sont multipliées par le carré du rapport : ${fr(k)}² = ${fr(k * k)} ; ${A} × ${fr(k * k)} = ${fr(v)} cm².` };
  }
  if (t === 4) {
    const k = R(0, 2);
    if (k === 0) { const a = "une symétrie centrale"; return { q: "Une homothétie de rapport −1 est la même transformation que…", txt: 1, a, choices: [a, "une symétrie axiale", "une translation", "un agrandissement"], why: "Rapport −1 : chaque point est envoyé à la même distance de l’autre côté du centre, comme une symétrie centrale." }; }
    const f = k === 1 ? pick([0.5, 0.25, 0.75]) : pick([1.5, 2, 3]);
    const a = f < 1 ? "réduit la figure" : "agrandit la figure";
    return { q: `Une homothétie de rapport ${fr(f)}…`, txt: 1, a, choices: ["agrandit la figure", "réduit la figure", "conserve les longueurs"], why: `|rapport| ${f < 1 ? "< 1 : les longueurs diminuent" : "> 1 : les longueurs augmentent"}.` };
  }
  // Similitude : figures semblables
  const k = pick([1.5, 2, 2.5, 3, 4]), a = 2 * R(2, 8), b = 2 * R(2, 8);
  if (R(0, 1)) return { q: `Deux triangles sont semblables. Un côté de ${a} cm du petit correspond à un côté de ${fr(a * k)} cm du grand. Un autre côté du petit mesure ${b} cm. Combien mesure le côté correspondant du grand ?`, txt: 1, a: arr(b * k), why: `Rapport de similitude : ${fr(a * k)} ÷ ${a} = ${fr(k)} ; ${b} × ${fr(k)} = ${fr(b * k)} cm.` };
  const A = R(3, 20);
  return { q: `Deux figures sont semblables avec un rapport de similitude de ${fr(k)}. La petite a une aire de ${A} cm². Quelle est l’aire de la grande ?`, txt: 1, a: arr(A * k * k), why: `Aires × ${fr(k)}² = ${fr(k * k)} : ${A} × ${fr(k * k)} = ${fr(A * k * k)} cm².` };
}
