import { R, pick } from "../math";
import { PRENOMS, nb } from "./m2-outils";
import type { Question } from "./types";

/** Calcul de grandeurs (7e-8e) : périmètres et trajets, aires (rectangle, carré, triangle, parallélogramme, losange, figures composées), volumes. */
export function gen(): Question {
  const t = R(0, 9);
  if (t === 0) {
    const L = R(5, 25), l = R(2, L - 1), u = pick(["cm", "m"]);
    if (Math.random() < 0.5) return { q: `Quel est le périmètre d’un rectangle de ${L} ${u} sur ${l} ${u}, en ${u} ?`, txt: 1, a: 2 * (L + l), hint: "Le tour complet : 4 côtés", why: `2 × (${L} + ${l}) = 2 × ${L + l} = ${2 * (L + l)} ${u}.` };
    return { q: `Un rectangle a un périmètre de ${2 * (L + l)} ${u}. Sa longueur mesure ${L} ${u}. Combien mesure sa largeur, en ${u} ?`, txt: 1, a: l, hint: "La moitié du périmètre = longueur + largeur", why: `${2 * (L + l)} : 2 = ${L + l} ; ${L + l} − ${L} = ${l} ${u}.` };
  }
  if (t === 1) {
    const c = R(3, 30);
    if (Math.random() < 0.5) return { q: `Quel est le périmètre d’un carré de ${c} cm de côté, en cm ?`, txt: 1, a: 4 * c, why: `4 × ${c} = ${4 * c} cm.` };
    return { q: `Un carré a un périmètre de ${4 * c} cm. Combien mesure un côté, en cm ?`, txt: 1, a: c, why: `${4 * c} : 4 = ${c} cm.` };
  }
  if (t === 2) {
    const s = Array.from({ length: R(3, 6) }, () => R(3, 20));
    const nom = ["", "", "", "un triangle", "un quadrilatère", "un pentagone", "un hexagone"][s.length];
    return { q: `Les côtés d’${nom} mesurent ${s.join(" cm, ")} cm. Quel est son périmètre, en cm ?`, txt: 1, a: s.reduce((x, y) => x + y, 0), why: `${s.join(" + ")} = ${s.reduce((x, y) => x + y, 0)} cm.` };
  }
  if (t === 3) {
    const L = R(4, 12) * 10, l = R(2, 8) * 5, n = R(2, 5), p = pick(PRENOMS);
    return { q: `${p} fait ${n} fois le tour d’un terrain rectangulaire de ${L} m sur ${l} m. Quelle distance parcourt-il ou elle, en m ?`, txt: 1, a: n * 2 * (L + l), hint: "Un tour = le périmètre", why: `Un tour : 2 × (${L} + ${l}) = ${2 * (L + l)} m ; ${n} tours : ${nb(n * 2 * (L + l))} m.` };
  }
  if (t === 4) {
    const L = R(3, 15), l = R(2, 12);
    if (L === l || Math.random() < 0.3) return { q: `Quelle est l’aire d’un carré de ${L} cm de côté, en cm<sup>2</sup> ?`, txt: 1, a: L * L, hint: "côté × côté", why: `${L} × ${L} = ${L * L} cm<sup>2</sup>.` };
    return { q: `Quelle est l’aire d’un rectangle de ${L} m sur ${l} m, en m<sup>2</sup> ?`, txt: 1, a: L * l, hint: "longueur × largeur", why: `${L} × ${l} = ${L * l} m<sup>2</sup>.` };
  }
  if (t === 5) {
    const b = R(3, 16), h = 2 * R(1, 8);
    const k = R(0, 2);
    if (k === 0) return { q: `Un triangle a une base de ${b} cm et une hauteur de ${h} cm. Quelle est son aire, en cm<sup>2</sup> ?`, txt: 1, a: (b * h) / 2, hint: "La moitié d’un rectangle", why: `${b} × ${h} : 2 = ${b * h} : 2 = ${(b * h) / 2} cm<sup>2</sup>.` };
    if (k === 1) return { q: `Un parallélogramme a une base de ${b} cm et une hauteur de ${h} cm. Quelle est son aire, en cm<sup>2</sup> ?`, txt: 1, a: b * h, hint: "On peut le transformer en rectangle", why: `En déplaçant un triangle, on obtient un rectangle de ${b} sur ${h} : ${b} × ${h} = ${b * h} cm<sup>2</sup>.` };
    return { q: `Un losange a des diagonales de ${b} cm et ${h} cm. Quelle est son aire, en cm<sup>2</sup> ?`, txt: 1, a: (b * h) / 2, hint: "La moitié du rectangle qui l’entoure", why: `${b} × ${h} : 2 = ${(b * h) / 2} cm<sup>2</sup> (le losange occupe la moitié du rectangle ${b} × ${h}).` };
  }
  if (t === 6) {
    const a = R(6, 14), b = R(5, 12), c = R(2, a - 3), d = R(2, b - 2);
    return { q: `Une chambre en forme de L : c’est un rectangle de ${a} m sur ${b} m auquel il manque un coin rectangulaire de ${c} m sur ${d} m. Quelle est l’aire de la chambre, en m<sup>2</sup> ?`, txt: 1, a: a * b - c * d, hint: "Grand rectangle moins le coin", why: `${a} × ${b} − ${c} × ${d} = ${a * b} − ${c * d} = ${a * b - c * d} m<sup>2</sup>.` };
  }
  if (t === 7) {
    const c = R(2, 10);
    return { q: `Quel est le volume d’un cube de ${c} cm d’arête, en cm<sup>3</sup> ?`, txt: 1, a: c ** 3, hint: "arête × arête × arête", why: `${c} × ${c} × ${c} = ${c ** 3} cm<sup>3</sup>.` };
  }
  if (t === 8) {
    const L = R(3, 12), l = R(2, 8), h = R(2, 10);
    return { q: `Une boîte en forme de parallélépipède rectangle mesure ${L} cm de long, ${l} cm de large et ${h} cm de haut. Quel est son volume, en cm<sup>3</sup> ?`, txt: 1, a: L * l * h, hint: "longueur × largeur × hauteur", why: `${L} × ${l} × ${h} = ${L * l * h} cm<sup>3</sup>.` };
  }
  const L = R(3, 10), l = R(2, 6), h = R(2, 8);
  return { q: `Un aquarium (parallélépipède rectangle) a un volume de ${L * l * h} dm<sup>3</sup>. Son fond mesure ${L} dm sur ${l} dm. Quelle est sa hauteur, en dm ?`, txt: 1, a: h, hint: "Volume = aire du fond × hauteur", why: `Aire du fond : ${L} × ${l} = ${L * l} dm<sup>2</sup> ; ${L * l * h} : ${L * l} = ${h} dm.` };
}
