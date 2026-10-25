import { R, fr, tolAbs } from "../math";
import type { Question } from "./types";

/** Aires, volumes, unités. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) { const c = R(3, 40), ar = R(0, 1); return ar ? { q: `Carré de côté ${c} m. Aire en m² ?`, txt: 1, a: c * c, why: `Aire = côté² = ${c}² = ${c * c} m².` } : { q: `Carré de côté ${c} m. Périmètre en m ?`, txt: 1, a: 4 * c, why: `Périmètre = 4 × côté = ${4 * c} m.` }; }
  if (t === 1) { const b = R(3, 30), h = R(2, 25); return { q: `Triangle de base ${b} cm et hauteur ${h} cm. Aire en cm² ?`, txt: 1, a: (b * h) / 2, why: `(base × hauteur) ÷ 2 = ${fr((b * h) / 2)} cm².` }; }
  if (t === 2) { const r = R(2, 15); return { q: `Disque de rayon ${r} cm. Aire en cm² (arrondi 0,1) ?`, txt: 1, a: Math.PI * r * r, tol: tolAbs(Math.PI * r * r), why: `π·r² = π·${r}² ≈ ${fr(Math.PI * r * r)} cm².` }; }
  if (t === 3) { const r = R(2, 6), h = R(8, 25), v = (Math.PI * r * r * h) / 3; return { q: `Verre conique : r = ${r} cm, h = ${h} cm. Capacité en dl ?`, txt: 1, a: v / 100, tol: tolAbs(v / 100), why: `π·${r}²·${h} ÷ 3 ≈ ${fr(v)} cm³, et 1 dl = 100 cm³ → ≈ ${fr(v / 100)} dl.` }; }
  if (t === 4) { const r = R(3, 12), h = R(5, 30), v = Math.PI * r * r * h; return { q: `Cylindre : r = ${r} cm, h = ${h} cm. Volume en litres ?`, txt: 1, a: v / 1000, tol: tolAbs(v / 1000), why: `π·${r}²·${h} ≈ ${fr(v)} cm³ = ${fr(v / 1000)} L (÷ 1 000).` }; }
  if (t === 5) { const r = R(2, 12), v = (4 / 3) * Math.PI * r ** 3; return { q: `Sphère de rayon ${r} cm. Volume en cm³ ?`, txt: 1, a: v, tol: tolAbs(v), why: `4/3·π·r³ = 4/3·π·${r}³ ≈ ${fr(v)} cm³.` }; }
  const c = R(4, 30), h = R(3, 30), v = (c * c * h) / 3;
  return { q: `Pyramide à base carrée : côté ${c} m, hauteur ${h} m. Volume en m³ ?`, txt: 1, a: v, tol: tolAbs(v), why: `Base = ${c}² = ${c * c} m² (pas 4×${c}) ; ${c * c} × ${h} ÷ 3 = ${fr(v)} m³.` };
}
