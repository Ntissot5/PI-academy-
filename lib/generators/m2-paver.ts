import { R, pick } from "../math";
import type { Question } from "./types";

/** Décomposer et recomposer des surfaces sur papier quadrillé (compter des carreaux, demi-carreaux, dominos). */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const a = R(4, 9), b = R(3, 7), c = R(1, a - 2), d = R(1, b - 1);
    return { q: `Sur du papier quadrillé, on dessine un rectangle de ${a} carreaux sur ${b}, puis on enlève un coin de ${c} carreau${c > 1 ? "x" : ""} sur ${d}. La figure en L couvre combien de carreaux ?`, txt: 1, a: a * b - c * d, hint: "Le grand rectangle, moins le coin", why: `${a} × ${b} = ${a * b} carreaux, moins le coin ${c} × ${d} = ${c * d} : ${a * b} − ${c * d} = ${a * b - c * d}.` };
  }
  if (t === 1) {
    const a = R(2, 6), b = R(2, 5), c = R(2, 6), d = R(2, 5);
    return { q: `Une figure est formée de deux rectangles collés : l’un de ${a} carreaux sur ${b}, l’autre de ${c} carreaux sur ${d}. Combien de carreaux couvre la figure ?`, txt: 1, a: a * b + c * d, hint: "Décompose en deux rectangles", why: `${a} × ${b} = ${a * b} et ${c} × ${d} = ${c * d}, donc ${a * b} + ${c * d} = ${a * b + c * d} carreaux.` };
  }
  if (t === 2) {
    const e = R(3, 15), h = 2 * R(1, 6);
    return { q: `Une figure couvre ${e} carreaux entiers et ${h} demi-carreaux (coupés en diagonale). Elle couvre combien de carreaux en tout ?`, txt: 1, a: e + h / 2, hint: "2 demi-carreaux font 1 carreau", why: `${h} demi-carreaux = ${h / 2} carreaux ; ${e} + ${h / 2} = ${e + h / 2}.` };
  }
  if (t === 3) {
    const n = R(2, 6);
    return { q: `On découpe un carré de ${n} carreaux sur ${n} en triangles qui valent chacun un demi-carreau. Combien de triangles obtient-on ?`, txt: 1, a: 2 * n * n, why: `${n} × ${n} = ${n * n} carreaux, et chaque carreau donne 2 triangles : ${2 * n * n}.` };
  }
  if (t === 4) {
    const a = 2 * R(2, 5), b = R(2, 6);
    return { q: `On coupe un rectangle de ${a} carreaux sur ${b} le long d’une diagonale. On obtient deux triangles identiques. Combien de carreaux couvre un de ces triangles ?`, txt: 1, a: (a * b) / 2, hint: "Les deux triangles se partagent le rectangle", why: `Le rectangle couvre ${a} × ${b} = ${a * b} carreaux ; un triangle en couvre la moitié : ${(a * b) / 2}.` };
  }
  const k = pick([2, 3, 4]), a = k * R(1, 4), b = R(2, 6);
  const piece = k === 2 ? "dominos (2 carreaux)" : k === 3 ? "triominos droits (3 carreaux en ligne)" : "tétrominos droits (4 carreaux en ligne)";
  return { q: `Combien de ${piece} faut-il pour couvrir exactement un rectangle de ${a} carreaux sur ${b} ?`, txt: 1, a: (a * b) / k, why: `Le rectangle couvre ${a} × ${b} = ${a * b} carreaux ; ${a * b} : ${k} = ${(a * b) / k} pièces (on peut les aligner sur les ${a} carreaux de chaque rangée).` };
}
