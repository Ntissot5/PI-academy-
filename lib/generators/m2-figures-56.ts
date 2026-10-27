import { R, pick } from "../math";
import { PRENOMS, qcm } from "./m2-outils";
import type { Question } from "./types";

const FIG = ["carré", "rectangle", "losange", "triangle", "cercle"];

// [description, figure, explication]
const DEVINE: [string, string, string][] = [
  ["J’ai 4 côtés de même longueur et 4 angles droits.", "carré", "4 côtés égaux et 4 angles droits : c’est un carré."],
  ["J’ai 4 angles droits, mais mes côtés ne sont pas tous de la même longueur.", "rectangle", "4 angles droits sans 4 côtés égaux : c’est un rectangle."],
  ["J’ai 4 côtés de même longueur, mais aucun angle droit.", "losange", "4 côtés égaux sans angle droit : c’est un losange."],
  ["J’ai 3 côtés et 3 sommets.", "triangle", "Trois côtés : c’est un triangle."],
  ["Je suis une ligne courbe fermée : tous mes points sont à la même distance du centre.", "cercle", "Tous les points à la même distance du centre : c’est un cercle."],
  ["J’ai 4 angles droits et exactement 2 axes de symétrie.", "rectangle", "Le rectangle a 4 angles droits et 2 axes ; le carré en aurait 4."],
  ["J’ai 4 côtés de même longueur et exactement 2 axes de symétrie.", "losange", "Le losange a 4 côtés égaux et 2 axes (ses diagonales) ; le carré en aurait 4."],
  ["J’ai 4 côtés de même longueur et 4 axes de symétrie.", "carré", "Seul le carré a 4 axes de symétrie."],
];

// [figure, nombre d'axes, explication]
const AXES: [string, number, string][] = [
  ["un carré", 4, "2 axes passent par les milieux des côtés et 2 par les diagonales."],
  ["un rectangle (qui n’est pas un carré)", 2, "Les 2 axes passent par les milieux des côtés opposés ; les diagonales ne sont pas des axes."],
  ["un losange (qui n’est pas un carré)", 2, "Les 2 axes sont les diagonales du losange."],
];

// [question, réponse, explication]
const PARA: [string, string, string][] = [
  ["Dans un rectangle, deux côtés <b>opposés</b> sont…", "parallèles", "Ils ne se rencontrent jamais, comme les rails d’un train."],
  ["Dans un rectangle, deux côtés <b>qui se touchent</b> sont…", "perpendiculaires", "Ils forment un angle droit."],
  ["Dans un carré, deux côtés <b>qui se touchent</b> sont…", "perpendiculaires", "Un carré a 4 angles droits."],
  ["Dans un losange, deux côtés <b>opposés</b> sont…", "parallèles", "Les côtés opposés d’un losange ne se rencontrent jamais."],
  ["Les deux diagonales d’un losange sont…", "perpendiculaires", "Les diagonales d’un losange se coupent en formant un angle droit."],
  ["Deux droites qui se coupent en formant un angle droit sont…", "perpendiculaires", "C’est la définition de deux droites perpendiculaires."],
  ["Deux droites qui ne se rencontrent jamais, même prolongées, sont…", "parallèles", "C’est la définition de deux droites parallèles."],
  ["Les deux bords d’une règle (la longueur) sont…", "parallèles", "Ils gardent toujours le même écart."],
];

/** Figures planes (5e-6e) : reconnaître et nommer, axes de symétrie, parallèles et perpendiculaires, isométries. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const [d, f, w] = pick(DEVINE);
    return { q: `Qui suis-je ? ${d}`, txt: 1, a: f, choices: qcm(f, FIG), why: w };
  }
  if (t === 1) {
    const [f, n, w] = pick(AXES);
    return { q: `Combien d’axes de symétrie a ${f} ?`, txt: 1, a: n, hint: "Imagine un pliage où les deux moitiés se superposent", why: `${n} axes. ${w}` };
  }
  if (t === 2) {
    return { q: "Combien d’axes de symétrie a un cercle ?", txt: 1, a: "une infinité", choices: qcm("une infinité", ["0", "1", "2", "4"]), why: "Toute droite qui passe par le centre est un axe de symétrie : il y en a une infinité." };
  }
  if (t === 3) {
    const [q, a, w] = pick(PARA);
    return { q, txt: 1, a, choices: qcm(a, ["parallèles", "perpendiculaires", "ni l’un ni l’autre"], 3), why: `${a[0].toUpperCase() + a.slice(1)}. ${w}` };
  }
  if (t === 4) {
    const it = pick([
      ["un rectangle", 4, "Un rectangle a toujours 4 angles droits."],
      ["un carré", 4, "Un carré a 4 angles droits."],
      ["un losange qui n’est pas un carré", 0, "Un losange qui n’est pas un carré n’a aucun angle droit."],
    ] as [string, number, string][]);
    return { q: `Combien d’angles droits a ${it[0]} ?`, txt: 1, a: it[1], why: it[2] };
  }
  if (t === 5) {
    const c = R(3, 12), p = pick(PRENOMS), mv = pick(["fait glisser sur la feuille (translation)", "retourne comme dans un miroir (symétrie axiale)"]);
    const it = pick([
      [`un carré de ${c} cm de côté`, `Combien mesure le côté de l’image, en cm ?`, c, `Une isométrie garde les longueurs : le côté mesure toujours ${c} cm.`],
      [`un rectangle qui a 4 angles droits`, `Combien d’angles droits a l’image ?`, 4, "Une isométrie garde les angles : l’image a aussi 4 angles droits."],
      [`un triangle dont un côté mesure ${c} cm`, `Combien mesure ce côté sur l’image, en cm ?`, c, `Les longueurs ne changent pas : ${c} cm.`],
    ] as [string, string, number, string][]);
    return { q: `${p} décalque ${it[0]}, puis le ${mv}. ${it[1]}`, txt: 1, a: it[2], why: it[3] };
  }
  const it = pick([
    ["Après une symétrie axiale (miroir), qu’est-ce qui change ?", "le sens de la figure (elle est retournée)", ["la longueur des côtés", "la mesure des angles", "la forme de la figure"], "Le miroir retourne la figure, mais garde ses longueurs, ses angles et sa forme."],
    ["Après une translation (glissement), qu’est-ce qui change ?", "la position de la figure", ["la longueur des côtés", "la mesure des angles", "le sens de la figure (elle est retournée)"], "La figure glisse sans tourner ni se retourner : seule sa position change."],
  ] as [string, string, string[], string][]);
  return { q: it[0], txt: 1, a: it[1], choices: qcm(it[1], it[2]), why: it[3] };
}
