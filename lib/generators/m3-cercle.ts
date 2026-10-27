import { R } from "../math";
import type { Question } from "./types";

const pas90 = (a: number, b: number): number => { let x: number; do x = R(a, b); while (x === 90); return x; };

/** Angles et cercle (11e) : angle inscrit et angle au centre, angles opposés par le sommet, alternes-internes, tangente, cercle de Thalès. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const k = R(15, 85);
    if (R(0, 1)) return { q: `Un angle inscrit et un angle au centre interceptent le même arc de cercle. L’angle au centre mesure ${2 * k}°. Combien mesure l’angle inscrit ?`, txt: 1, a: k, why: `L’angle inscrit vaut la moitié de l’angle au centre qui intercepte le même arc : ${2 * k} ÷ 2 = ${k}°.` };
    return { q: `Un angle inscrit dans un cercle mesure ${k}°. Combien mesure l’angle au centre qui intercepte le même arc ?`, txt: 1, a: 2 * k, why: `L’angle au centre vaut le double de l’angle inscrit : 2 × ${k} = ${2 * k}°.` };
  }
  if (t === 1) {
    const a = pas90(20, 160);
    if (R(0, 1)) return { q: `Deux droites se coupent. L’un des quatre angles formés mesure ${a}°. Combien mesure l’angle qui lui est opposé par le sommet ?`, txt: 1, a, why: `Deux angles opposés par le sommet sont isométriques (égaux) : ${a}°.` };
    return { q: `Deux droites se coupent. L’un des quatre angles formés mesure ${a}°. Combien mesure un angle qui lui est adjacent ?`, txt: 1, a: 180 - a, why: `Deux angles adjacents formés par deux droites sécantes font un angle plat : 180 − ${a} = ${180 - a}°.` };
  }
  if (t === 2) {
    const a = pas90(25, 155), k = R(0, 2);
    if (k === 0) return { q: `Deux droites parallèles sont coupées par une sécante. Un angle situé entre les parallèles mesure ${a}°. Combien mesure l’angle qui lui est alterne-interne ?`, txt: 1, a, why: `Avec des droites parallèles, deux angles alternes-internes sont isométriques : ${a}°.` };
    if (k === 1) return { q: `Deux droites parallèles sont coupées par une sécante. Un angle mesure ${a}°. Combien mesure l’angle correspondant (même position à l’autre intersection) ?`, txt: 1, a, why: `Avec des droites parallèles, deux angles correspondants sont isométriques : ${a}°.` };
    return { q: `Deux droites parallèles sont coupées par une sécante. Entre les parallèles et du même côté de la sécante, un angle mesure ${a}°. Combien mesure l’autre ?`, txt: 1, a: 180 - a, why: `L’alterne-interne du premier angle mesure ${a}° et forme un angle plat avec l’autre : 180 − ${a} = ${180 - a}°.` };
  }
  if (t === 3) {
    const a = R(15, 75);
    if (R(0, 3) === 0) return { q: `Le triangle ABC est inscrit dans un cercle de diamètre [AB]. Combien mesure l’angle en C ?`, txt: 1, a: 90, why: "Cercle de Thalès : un triangle inscrit dans un demi-cercle, dont un côté est le diamètre, est rectangle au troisième sommet : 90°." };
    return { q: `Le triangle ABC est inscrit dans un cercle de diamètre [AB]. L’angle en A mesure ${a}°. Combien mesure l’angle en B ?`, txt: 1, a: 90 - a, hint: "Cercle de Thalès : que vaut l’angle en C ?", why: `Cercle de Thalès : l’angle en C est droit. 180 − 90 − ${a} = ${90 - a}°.` };
  }
  if (t === 4) {
    const a = R(15, 75);
    return { q: `La droite PT est tangente en T au cercle de centre O. L’angle TOP mesure ${a}°. Combien mesure l’angle OPT ?`, txt: 1, a: 90 - a, hint: "Une tangente est perpendiculaire au rayon.", why: `La tangente est perpendiculaire au rayon OT : l’angle en T vaut 90°. 180 − 90 − ${a} = ${90 - a}°.` };
  }
  if (t === 5) {
    const m = R(10, 80);
    return { q: `A et B sont sur un cercle de centre O. L’angle AOB mesure ${2 * m}°. Combien mesure l’angle OAB ?`, txt: 1, a: 90 - m, hint: "OA et OB sont deux rayons.", why: `OA = OB (rayons) : le triangle OAB est isocèle en O. (180 − ${2 * m}) ÷ 2 = ${90 - m}°.` };
  }
  const a = R(15, 80);
  return { q: `Deux angles inscrits dans un cercle interceptent le même arc. L’un mesure ${a}°. Combien mesure l’autre ?`, txt: 1, a, why: `Ils valent tous les deux la moitié du même angle au centre : ${a}°.` };
}
