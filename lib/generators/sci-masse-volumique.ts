import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

// Masses volumiques usuelles (g/cm³).
const MAT: [string, number][] = [["l’eau", 1], ["l’aluminium", 2.7], ["le fer", 7.9], ["le cuivre", 8.9], ["la glace", 0.92], ["l’or", 19.3], ["le bois de chêne", 0.7]];

/** Masse volumique ρ = m ÷ V. */
export function gen(): Question {
  const t = R(0, 2);
  if (t === 0) {
    const V = R(2, 50) * 10, rho = pick([0.8, 1, 1.2, 2.5, 2.7, 7.9, 8.9]), m = +(rho * V).toFixed(1);
    return { q: `Un objet a une masse de ${fr(m)} g et un volume de ${V} cm³. Sa masse volumique en g/cm³ ?`, txt: 1, a: m / V, tol: tolAbs(m / V, 0.01, 0.02), why: `ρ = m ÷ V = ${fr(m)} ÷ ${V} ≈ ${fr(m / V)} g/cm³.` };
  }
  const [nom, rho] = pick(MAT);
  const V = R(2, 40) * 5;
  if (t === 1) return { q: `La masse volumique de ${nom} vaut ${fr(rho)} g/cm³. Masse de ${V} cm³ en g ?`, txt: 1, a: rho * V, tol: tolAbs(rho * V, 0.01, 0.1), why: `m = ρ × V = ${fr(rho)} × ${V} = ${fr(rho * V)} g.` };
  const m = +(rho * V).toFixed(1);
  return { q: `${nom[0].toUpperCase() + nom.slice(1)} : ${fr(m)} g, masse volumique ${fr(rho)} g/cm³. Volume en cm³ ?`, txt: 1, a: m / rho, tol: tolAbs(m / rho, 0.01, 0.1), why: `V = m ÷ ρ = ${fr(m)} ÷ ${fr(rho)} ≈ ${fr(m / rho)} cm³.` };
}
