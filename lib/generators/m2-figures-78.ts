import { R, pick } from "../math";
import { qcm } from "./m2-outils";
import type { Question } from "./types";

const QUADRI = ["carré", "rectangle", "losange", "parallélogramme", "trapèze"];

// [description, nom, explication]
const DEVINE: [string, string, string][] = [
  ["J’ai 4 côtés. Une seule paire de mes côtés opposés est parallèle.", "trapèze", "Une seule paire de côtés parallèles : c’est un trapèze."],
  ["Mes côtés opposés sont parallèles et de même longueur, mais je n’ai ni angle droit ni 4 côtés égaux.", "parallélogramme", "Côtés opposés parallèles, sans angle droit ni côtés tous égaux : un parallélogramme."],
  ["J’ai 4 côtés de même longueur et mes diagonales se coupent à angle droit, mais je n’ai pas d’angle droit.", "losange", "4 côtés égaux sans angle droit : un losange."],
  ["J’ai 4 angles droits et mes diagonales ont la même longueur, mais mes 4 côtés ne sont pas égaux.", "rectangle", "4 angles droits sans 4 côtés égaux : un rectangle."],
  ["J’ai 4 côtés égaux et 4 angles droits.", "carré", "4 côtés égaux et 4 angles droits : un carré."],
];

// [phrase, toujours/parfois/jamais, explication]
const VRAI: [string, string, string][] = [
  ["Un carré est ___ un rectangle.", "toujours", "Un carré a 4 angles droits : c’est un rectangle particulier."],
  ["Un carré est ___ un losange.", "toujours", "Un carré a 4 côtés égaux : c’est un losange particulier."],
  ["Un rectangle est ___ un carré.", "parfois", "Seulement si ses 4 côtés sont égaux."],
  ["Un losange est ___ un carré.", "parfois", "Seulement s’il a des angles droits."],
  ["Un losange est ___ un parallélogramme.", "toujours", "Ses côtés opposés sont parallèles."],
  ["Un rectangle est ___ un parallélogramme.", "toujours", "Ses côtés opposés sont parallèles."],
  ["Un parallélogramme est ___ un rectangle.", "parfois", "Seulement s’il a des angles droits."],
  ["Un triangle est ___ un quadrilatère.", "jamais", "Un triangle a 3 côtés, un quadrilatère en a 4."],
  ["Un trapèze est ___ un triangle.", "jamais", "Un trapèze a 4 côtés."],
];

const AXES: [string, number][] = [
  ["un triangle équilatéral", 3], ["un triangle isocèle (non équilatéral)", 1], ["un triangle dont les 3 côtés sont de longueurs différentes", 0],
  ["un carré", 4], ["un rectangle (non carré)", 2], ["un losange (non carré)", 2], ["un parallélogramme sans angle droit ni côtés tous égaux", 0],
  ["un hexagone régulier", 6], ["un pentagone régulier", 5], ["un octogone régulier", 8], ["un trapèze isocèle", 1],
];

// [description, isométrie]
const ISO: [string, string][] = [
  ["La figure glisse dans une direction, sans tourner ni se retourner.", "translation"],
  ["La figure est retournée, comme son reflet dans un miroir.", "symétrie axiale"],
  ["La figure tourne autour d’un point fixe.", "rotation"],
  ["L’aiguille d’une montre passe de 12 h à 3 h.", "rotation"],
  ["Une cabine de téléphérique avance tout droit le long du câble.", "translation"],
  ["Le reflet d’un chalet dans l’eau calme du lac.", "symétrie axiale"],
  ["Une roue de vélo fait un quart de tour.", "rotation"],
];

const pt = (x: number, y: number): string => `(${x} ; ${y})`;

/** Figures planes et isométries (7e-8e) : triangles, quadrilatères, axes, translation / symétrie / rotation, agrandissement. */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0) {
    const [d, f, w] = pick(DEVINE);
    return { q: `Qui suis-je ? ${d}`, txt: 1, a: f, choices: qcm(f, QUADRI), why: w };
  }
  if (t === 1) {
    const [p, a, w] = pick(VRAI);
    return { q: p.replace("___", "<b>___</b>"), txt: 1, a, choices: ["toujours", "parfois", "jamais"], why: `${a[0].toUpperCase() + a.slice(1)}. ${w}` };
  }
  if (t === 2) {
    // triangle par ses côtés
    const k = R(0, 2);
    let s: number[];
    if (k === 0) { const c = R(3, 12); s = [c, c, c]; }
    else if (k === 1) { const c = R(4, 12); let b: number; do b = R(2, 2 * c - 1); while (b === c); s = [c, c, b]; }
    else { let a: number, b: number, c: number; do { a = R(3, 12); b = R(3, 12); c = R(3, 12); } while (a === b || b === c || a === c || a + b <= c || a + c <= b || b + c <= a); s = [a, b, c]; }
    const nom = ["équilatéral", "isocèle", "quelconque"][k];
    const why = ["Les 3 côtés sont égaux : triangle équilatéral.", "Exactement 2 côtés égaux : triangle isocèle.", "Les 3 côtés sont différents : triangle quelconque."][k];
    const [x, y, z] = [...s].sort(() => Math.random() - 0.5);
    return { q: `Un triangle a des côtés de ${x} cm, ${y} cm et ${z} cm. Il est…`, txt: 1, a: nom, choices: ["équilatéral", "isocèle", "quelconque"], why };
  }
  if (t === 3) {
    const [f, n] = pick(AXES);
    return { q: `Combien d’axes de symétrie a ${f} ?`, txt: 1, a: n, hint: "Plie la figure en pensée", why: n === 0 ? `Aucun : aucun pliage ne superpose les deux moitiés de ${f}.` : `${f[0].toUpperCase() + f.slice(1)} a ${n} axe${n > 1 ? "s" : ""} de symétrie.` };
  }
  if (t === 4) {
    const [d, a] = pick(ISO);
    return { q: `Quelle isométrie ? ${d}`, txt: 1, a, choices: ["translation", "symétrie axiale", "rotation"], why: { translation: "Un glissement sans tourner : c’est une translation.", "symétrie axiale": "Un retournement comme dans un miroir : c’est une symétrie axiale.", rotation: "On tourne autour d’un point : c’est une rotation." }[a] ?? "" };
  }
  if (t === 5) {
    // anticiper l'image d'un point sur un quadrillage
    const x = R(1, 9), y = R(1, 9), k = R(0, 2);
    if (k === 0) {
      const dx = R(1, 5), dy = R(1, 5), bas = Math.random() < 0.5 && y - dy >= 0;
      const X = x + dx, Y = bas ? y - dy : y + dy;
      const a = pt(X, Y);
      return { q: `Sur un quadrillage, A est en ${pt(x, y)} (colonne ; ligne). On fait une translation de ${dx} cases vers la droite et ${dy} vers ${bas ? "le bas" : "le haut"}. Où arrive A ?`, txt: 1, a, choices: qcm(a, [pt(x - dx, Y), pt(X, bas ? y + dy : y - dy), pt(Y, X), pt(x + dy, bas ? y - dx : y + dx)]), why: `Colonne ${x} + ${dx} = ${X}, ligne ${y} ${bas ? "−" : "+"} ${dy} = ${Y}.` };
    }
    if (k === 1) {
      let c: number; do c = R(1, 10); while (c === x || 2 * c - x < 0 || 2 * c - x > 12);
      const X = 2 * c - x, a = pt(X, y);
      return { q: `Sur un quadrillage, A est en ${pt(x, y)} (colonne ; ligne). L’axe de symétrie est la ligne verticale de la colonne ${c}. Où est le symétrique de A ?`, txt: 1, a, choices: qcm(a, [pt(x, 2 * c - y), pt(X + 1, y), pt(c, y), pt(X, y + 1)]), why: `A est à ${Math.abs(c - x)} case${Math.abs(c - x) > 1 ? "s" : ""} de l’axe ; son symétrique est à la même distance de l’autre côté : colonne ${X}, même ligne ${y}.` };
    }
    let cx: number, cy: number;
    do { cx = R(3, 7); cy = R(3, 7); } while (2 * cx - x < 0 || 2 * cy - y < 0 || (cx === x && cy === y));
    const X = 2 * cx - x, Y = 2 * cy - y, a = pt(X, Y);
    return { q: `Sur un quadrillage, A est en ${pt(x, y)} (colonne ; ligne). On fait un demi-tour (rotation de 180°) autour du point O ${pt(cx, cy)}. Où arrive A ?`, txt: 1, a, choices: qcm(a, [pt(X, y), pt(x, Y), pt(Y, X), pt(X + 1, Y)]), why: `O est le milieu de A et de son image : colonne ${cx} + (${cx} − ${x}) = ${X}, ligne ${cy} + (${cy} − ${y}) = ${Y}.` };
  }
  if (t === 6) {
    // agrandissement / réduction sur papier quadrillé
    const L = R(2, 6), l = R(1, L), k = R(2, 3);
    const s = pick([0, 1, 2]);
    if (s === 0) return { q: `Sur du papier quadrillé, un rectangle mesure ${L} carreaux sur ${l}. On l’agrandit ${k} fois (×${k}). Combien de carreaux mesure le grand côté de l’agrandissement ?`, txt: 1, a: L * k, why: `Chaque longueur est multipliée par ${k} : ${L} × ${k} = ${L * k}.` };
    if (s === 1) return { q: `Sur du papier quadrillé, un rectangle mesure ${L} carreaux sur ${l}. On l’agrandit ${k} fois (×${k}). Combien de carreaux en tout couvre l’agrandissement ?`, txt: 1, a: L * k * l * k, hint: "Calcule d’abord les nouvelles longueurs", why: `Nouvelles longueurs : ${L * k} et ${l * k} carreaux, donc ${L * k} × ${l * k} = ${L * k * l * k} carreaux (et pas ${L * l * k} : l’aire est multipliée par ${k * k}).` };
    const A = 2 * L, B = 2 * l;
    return { q: `Sur du papier quadrillé, un rectangle mesure ${A} carreaux sur ${B}. On le réduit de moitié. Combien de carreaux mesure le petit côté de la réduction ?`, txt: 1, a: l, why: `Chaque longueur est divisée par 2 : ${B} : 2 = ${l}.` };
  }
  // déduction
  const it = pick([
    ["Un quadrilatère a 4 angles droits et deux côtés qui se touchent mesurent chacun 5 cm. C’est un…", "carré", ["rectangle (non carré)", "losange (non carré)", "trapèze"], "Avec 4 angles droits, les côtés opposés sont égaux ; si deux côtés voisins sont égaux, les 4 le sont : c’est un carré."],
    ["Un triangle a deux côtés de même longueur. Combien a-t-il d’axes de symétrie au moins ?", "1", ["0", "2", "3"], "Un triangle isocèle a au moins un axe : celui qui passe par le sommet principal (3 s’il est équilatéral)."],
    ["Un quadrilatère a ses 4 côtés égaux et un angle droit. C’est un…", "carré", ["losange (non carré)", "rectangle (non carré)", "parallélogramme sans angle droit"], "4 côtés égaux : c’est un losange ; avec un angle droit, il en a 4 : c’est un carré."],
  ] as [string, string, string[], string][]);
  return { q: it[0], txt: 1, a: it[1], choices: qcm(it[1], it[2]), why: it[3] };
}
