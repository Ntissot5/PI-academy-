import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr } from "./m3-outils";

const fmt = (e: number): string => (e >= 10000 ? String(e).replace(/\B(?=(\d{3})+(?!\d))/g, " ") : String(e));

/** Échelles, pourcentages et pentes (PER MSN 33, 10e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  const E = pick([10000, 25000, 50000, 100000, 200000]);
  if (t === 0) {
    const d = R(1, 20), km = arr((d * E) / 100000);
    return { q: `Sur une carte à l’échelle 1:${fmt(E)}, deux villages sont à ${d} cm l’un de l’autre. Quelle est la distance réelle en km ?`, txt: 1, a: km, hint: "1 km = 100 000 cm.", why: `${d} × ${fmt(E)} = ${fmt(d * E)} cm = ${fr(km)} km.` };
  }
  if (t === 1) {
    const d = R(1, 20), km = arr((d * E) / 100000);
    return { q: `Sur une carte à l’échelle 1:${fmt(E)}, quelle longueur en cm représente une distance réelle de ${fr(km)} km ?`, txt: 1, a: d, why: `${fr(km)} km = ${fmt(d * E)} cm ; ${fmt(d * E)} ÷ ${fmt(E)} = ${d} cm.` };
  }
  if (t === 2) {
    const d = R(2, 10), km = arr((d * E) / 100000);
    return { q: `Sur une carte, ${d} cm représentent ${fr(km)} km en réalité. L’échelle est 1:x. Que vaut x ?`, txt: 1, a: E, why: `${fr(km)} km = ${fmt(d * E)} cm ; ${fmt(d * E)} ÷ ${d} = ${fmt(E)} → échelle 1:${fmt(E)}.` };
  }
  if (t === 3) {
    const P = 10 * R(3, 50), r = pick([10, 15, 20, 25, 30, 40, 50]), np = arr(P * (1 - r / 100));
    return { q: `Une veste coûte ${P} CHF. Elle est soldée avec ${r} % de rabais. Quel est son nouveau prix en CHF ?`, txt: 1, a: np, why: `Il reste ${100 - r} % du prix : ${P} × ${fr(1 - r / 100)} = ${fr(np)} CHF.` };
  }
  if (t === 4) {
    const P = 20 * R(2, 30), r = pick([10, 20, 25, 40, 50]), np = arr(P * (1 - r / 100));
    return { q: `Après un rabais de ${r} %, un vélo coûte ${fr(np)} CHF. Quel était son prix avant le rabais ?`, txt: 1, a: P, hint: `${fr(np)} CHF représente ${100 - r} % du prix de départ.`, why: `${fr(np)} ÷ ${fr(1 - r / 100)} = ${P} CHF (et non ${fr(np)} + ${r} %).` };
  }
  if (t === 5) {
    const N = pick([200, 250, 400, 500, 800]), p = R(5, 60), k = (N * p) / 100;
    if (!Number.isInteger(k)) return { q: `Dans une école de 400 élèves, ${4 * p} viennent à vélo. Quel pourcentage des élèves vient à vélo ?`, txt: 1, a: p, why: `${4 * p} ÷ 400 × 100 = ${p} %.` };
    return { q: `Dans une école de ${N} élèves, ${k} viennent à vélo. Quel pourcentage des élèves vient à vélo ?`, txt: 1, a: p, why: `${k} ÷ ${N} × 100 = ${p} %.` };
  }
  if (t === 6) {
    const p = R(2, 15), d = 100 * R(2, 20), h = (p * d) / 100;
    if (R(0, 1)) return { q: `Une route monte de ${h} m pour ${d} m parcourus à l’horizontale. Quelle est sa pente en % ?`, txt: 1, a: p, why: `Pente = dénivelé ÷ distance horizontale = ${h} ÷ ${d} = ${fr(p / 100)} = ${p} %.` };
    return { q: `Une route a une pente de ${p} %. De combien de mètres monte-t-elle sur ${d} m à l’horizontale ?`, txt: 1, a: h, why: `${p} % de ${d} m : ${d} × ${p} ÷ 100 = ${fr(h)} m.` };
  }
  const P = 100 * R(1, 9), x = pick([10, 20, 25, 50]), f = arr(P * (1 + x / 100) * (1 - x / 100));
  return { q: `Un prix de ${P} CHF augmente de ${x} %, puis baisse de ${x} %. Quel est le prix final en CHF ?`, txt: 1, a: f, hint: "La baisse se calcule sur le nouveau prix.", why: `${P} × ${fr(1 + x / 100)} = ${fr(arr(P * (1 + x / 100)))} ; × ${fr(1 - x / 100)} = ${fr(f)} CHF. On ne revient pas à ${P} CHF.` };
}
