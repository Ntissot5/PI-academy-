import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

/** Isoler une inconnue. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) { const r = R(2, 9), h = R(3, 30), V = +(Math.PI * r * r * h).toFixed(1); return { q: `Cylindre de volume ${fr(V)} cm³ et rayon ${r} cm. Hauteur en cm ?`, txt: 1, a: V / (Math.PI * r * r), tol: tolAbs(h), why: `h = V ÷ (π·r²) = ${fr(V)} ÷ (π·${r * r}) ≈ ${fr(V / (Math.PI * r * r))} cm.` }; }
  if (t === 1) { const r = R(2, 20), A = +(Math.PI * r * r).toFixed(1); return { q: `Un disque a une aire de ${fr(A)} cm². Rayon en cm ?`, txt: 1, a: Math.sqrt(A / Math.PI), tol: tolAbs(r), why: `r = √(A ÷ π) = √(${fr(A)} ÷ π) ≈ ${fr(Math.sqrt(A / Math.PI))} cm.` }; }
  if (t === 2) { const c = R(3, 20), h = R(3, 30), V = (c * c * h) / 3; return { q: `Pyramide à base carrée de côté ${c} m, volume ${fr(V)} m³. Hauteur ?`, txt: 1, a: h, tol: tolAbs(h), why: `h = 3V ÷ c² = 3 × ${fr(V)} ÷ ${c * c} = ${h} m.` }; }
  if (t === 3) { const r = R(2, 15), V = +((4 / 3) * Math.PI * r ** 3).toFixed(1); return { q: `Sphère de volume ${fr(V)} cm³. Rayon en cm ?`, txt: 1, a: Math.cbrt((3 * V) / (4 * Math.PI)), tol: tolAbs(r), why: `r = ∛(3V ÷ 4π) ≈ ${fr(Math.cbrt((3 * V) / (4 * Math.PI)))} cm.` }; }
  if (t === 4) { const v = pick([40, 60, 80, 90, 100, 120]), tm = R(1, 8) / 2, d = v * tm; return { q: `Tu roules ${fr(d)} km à ${v} km/h. Durée en heures ?`, txt: 1, a: tm, why: `t = d ÷ v = ${fr(d)} ÷ ${v} = ${fr(tm)} h.` }; }
  const r = R(2, 12), h = R(5, 30), V = +((Math.PI * r * r * h) / 3).toFixed(1);
  return { q: `Cône de hauteur ${h} cm et de volume ${fr(V)} cm³. Rayon en cm ?`, txt: 1, a: Math.sqrt((3 * V) / (Math.PI * h)), tol: tolAbs(r), why: `r = √(3V ÷ (π·h)) ≈ ${fr(Math.sqrt((3 * V) / (Math.PI * h)))} cm.` };
}
