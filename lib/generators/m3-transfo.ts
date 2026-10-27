import { NZ, P, R, S, fr, pick } from "../math";
import type { Question } from "./types";
import { qcm, pt } from "./m3-outils";

type F = (x: number, y: number) => [number, number];
const TRANSFOS: [string, F][] = [
  ["une symétrie d’axe des abscisses (axe x)", (x, y) => [x, -y]],
  ["une symétrie d’axe des ordonnées (axe y)", (x, y) => [-x, y]],
  ["une symétrie centrale de centre O", (x, y) => [-x, -y]],
  ["une rotation de 90° de centre O, sens inverse des aiguilles d’une montre", (x, y) => [-y, x]],
];

/** Question sur une coordonnée de l'image (on demande l'abscisse ou l'ordonnée). */
function coord(intro: string, x2: number, y2: number, why: string): Question {
  const abs = R(0, 1) === 1;
  return { q: `${intro} Quelle est ${abs ? "l’abscisse (x)" : "l’ordonnée (y)"} de l’image ?`, txt: 1, a: abs ? x2 : y2, why: `${why} L’image est ${pt(x2, y2)}.` };
}

/** Isométries dans un repère, composition, conservation, agrandissement et réduction, pavages (PER MSN 31, 9e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  const x = NZ(-8, 8), y = NZ(-8, 8);
  if (t === 0) {
    const a = NZ(-6, 6), b = NZ(-6, 6);
    return coord(`On applique au point A${pt(x, y)} la translation de vecteur ${pt(a, b)}.`, x + a, y + b, `On ajoute le vecteur : (${S(x)} + ${P(a)} ; ${S(y)} + ${P(b)}).`);
  }
  if (t === 1) {
    const k = R(0, 2), [nom, f] = TRANSFOS[k], [x2, y2] = f(x, y);
    const why = ["Par rapport à l’axe x, x reste, y change de signe.", "Par rapport à l’axe y, y reste, x change de signe.", "Par la symétrie de centre O, les deux coordonnées changent de signe."][k];
    return coord(`On applique au point A${pt(x, y)} ${nom}.`, x2, y2, why);
  }
  if (t === 2) {
    const cx = NZ(-4, 4), cy = NZ(-4, 4);
    return coord(`On applique au point A${pt(x, y)} la symétrie centrale de centre C${pt(cx, cy)}.`, 2 * cx - x, 2 * cy - y, `C est le milieu de A et de son image : x' = 2 × ${P(cx)} − ${P(x)}, y' = 2 × ${P(cy)} − ${P(y)}.`);
  }
  if (t === 3) {
    const [nom, f] = TRANSFOS[3], [x2, y2] = f(x, y);
    return coord(`On applique au point A${pt(x, y)} ${nom}.`, x2, y2, "Un quart de tour dans ce sens envoie (x ; y) sur (−y ; x).");
  }
  if (t === 4) {
    // Deux points et leurs images : quelle transformation ?
    let ax: number, ay: number, bx: number, by: number;
    do { ax = NZ(-6, 6); ay = NZ(-6, 6); bx = NZ(-6, 6); by = NZ(-6, 6); } while (ax === bx && ay === by);
    const vx = NZ(-5, 5), vy = NZ(-5, 5);
    const cands: [string, F][] = [["une translation", (p, q) => [p + vx, q + vy]], ...TRANSFOS];
    const [nom, f] = pick(cands);
    const [a2x, a2y] = f(ax, ay), [b2x, b2y] = f(bx, by);
    const marche = (g: F, n: string): boolean => {
      if (n === "une translation") { const dx = a2x - ax, dy = a2y - ay; return bx + dx === b2x && by + dy === b2y; }
      const [p, q] = g(ax, ay), [r, s] = g(bx, by);
      return p === a2x && q === a2y && r === b2x && s === b2y;
    };
    const d = cands.filter(([n, g]) => n !== nom && !marche(g, n)).map(([n]) => n);
    const choices = qcm(nom, d);
    const why = nom === "une translation" ? `Les deux points se déplacent du même vecteur ${pt(vx, vy)} : c’est une translation.` : `On vérifie sur les deux points : c’est ${nom}.`;
    return { q: `A${pt(ax, ay)} a pour image A'${pt(a2x, a2y)} et B${pt(bx, by)} a pour image B'${pt(b2x, b2y)}. Quelle transformation est-ce ?`, txt: 1, a: nom, choices, why };
  }
  if (t === 5) {
    const k = R(0, 2);
    if (k === 0) {
      const a = "ses longueurs et ses angles";
      return { q: "Par une isométrie (translation, symétrie, rotation), une figure garde…", txt: 1, a, choices: [a, "ses longueurs mais pas ses angles", "ses angles mais pas ses longueurs", "seulement sa position"], why: "Une isométrie déplace la figure sans la déformer : longueurs, angles, aire et périmètre sont conservés." };
    }
    const p = R(8, 60), nom = pick(["une symétrie axiale", "une rotation", "une translation", "une symétrie centrale"]);
    return k === 1
      ? { q: `Un triangle a un périmètre de ${p} cm. Quel est le périmètre de son image par ${nom} ?`, txt: 1, a: p, why: `Une isométrie conserve les longueurs : ${p} cm.` }
      : { q: `Une figure a une aire de ${p} cm². Quelle est l’aire de son image par ${nom} ?`, txt: 1, a: p, why: `Une isométrie ne déforme pas la figure : l’aire reste ${p} cm².` };
  }
  if (t === 6) {
    // Composition : symétrie d'axe y puis translation
    const a = NZ(-5, 5), b = NZ(-5, 5);
    return coord(`On applique au point A${pt(x, y)} la symétrie d’axe des ordonnées, puis la translation de vecteur ${pt(a, b)}.`, -x + a, y + b, `Symétrie : ${pt(-x, y)} ; translation : (${S(-x)} + ${P(a)} ; ${S(y)} + ${P(b)}).`);
  }
  const k = R(0, 3);
  if (k === 0) {
    const a = "le pentagone régulier";
    return { q: "Avec lequel de ces polygones réguliers ne peut-on pas paver le plan (sans trou ni chevauchement, une seule forme) ?", txt: 1, a, choices: [a, "le triangle équilatéral", "le carré", "l’hexagone régulier"], why: "Autour d’un sommet, les angles doivent faire 360°. 360 ÷ 60, 360 ÷ 90 et 360 ÷ 120 tombent juste ; 360 ÷ 108 (pentagone) non." };
  }
  if (k === 1) {
    const f = pick([2, 3, 4, 0.5]);
    return { q: `On agrandit ou réduit une figure : toutes ses longueurs sont multipliées par ${fr(f)}. Par combien son aire est-elle multipliée ?`, txt: 1, a: f * f, why: `L’aire est multipliée par le carré du facteur : ${fr(f)}² = ${fr(f * f)}.` };
  }
  const a = 2 * R(2, 8), b = 2 * R(3, 10), f = pick([1.5, 2, 2.5, 3, 0.5]);
  if (k === 2) return { q: `Un rectangle de ${a} cm sur ${b} cm est ${f > 1 ? "agrandi" : "réduit"} : le côté de ${a} cm devient ${fr(a * f)} cm. Que devient le côté de ${b} cm ?`, txt: 1, a: b * f, why: `Facteur : ${fr(a * f)} ÷ ${a} = ${fr(f)} ; ${b} × ${fr(f)} = ${fr(b * f)} cm.` };
  return { q: `Une photo de ${a} cm sur ${b} cm est ${f > 1 ? "agrandie" : "réduite"} avec un facteur ${fr(f)}. Quelle est sa nouvelle longueur (côté de ${b} cm) ?`, txt: 1, a: b * f, why: `Toutes les longueurs sont multipliées par ${fr(f)} : ${b} × ${fr(f)} = ${fr(b * f)} cm.` };
}
