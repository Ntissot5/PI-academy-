import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { qcm } from "./m3-outils";

const DROITES = ["la médiatrice", "la bissectrice", "la hauteur", "la médiane"];
const POINTS = ["des médiatrices", "des bissectrices", "des hauteurs", "des médianes"];

// [question, bonne réponse, distracteurs, explication]
const VOC: [string, string, string[], string][] = [
  ["Comment s’appelle la droite perpendiculaire à un segment qui passe par son milieu ?", "la médiatrice", DROITES, "La médiatrice coupe le segment en son milieu, à angle droit. Chacun de ses points est à la même distance des deux extrémités."],
  ["Comment s’appelle la droite qui partage un angle en deux angles de même mesure ?", "la bissectrice", DROITES, "La bissectrice « coupe l’angle en deux » parts égales."],
  ["Dans un triangle, comment s’appelle la droite qui passe par un sommet et qui est perpendiculaire au côté opposé ?", "la hauteur", DROITES, "La hauteur part d’un sommet et tombe à angle droit sur le côté opposé (ou sur son prolongement)."],
  ["Dans un triangle, comment s’appelle le segment qui relie un sommet au milieu du côté opposé ?", "la médiane", DROITES, "La médiane relie un sommet au milieu du côté d’en face."],
  ["Le centre du cercle circonscrit à un triangle (qui passe par ses trois sommets) est le point de rencontre…", "des médiatrices", POINTS, "Un point des médiatrices est à égale distance des sommets : c’est le centre du cercle qui passe par les trois sommets."],
  ["Le centre du cercle inscrit dans un triangle (qui touche ses trois côtés) est le point de rencontre…", "des bissectrices", POINTS, "Un point des bissectrices est à égale distance des côtés : c’est le centre du cercle inscrit."],
  ["Le centre de gravité d’un triangle est le point de rencontre…", "des médianes", POINTS, "Le centre de gravité est l’intersection des trois médianes."],
  ["Dans un plan, deux droites perpendiculaires à une même troisième droite sont…", "parallèles entre elles", ["perpendiculaires entre elles", "sécantes"], "Elles font toutes deux un angle droit avec la même droite : elles ont la même direction, donc elles sont parallèles."],
  ["Quel quadrilatère a quatre côtés de même longueur et quatre angles droits ?", "le carré", ["le losange", "le rectangle", "le trapèze"], "Le losange a quatre côtés égaux, le rectangle quatre angles droits : le carré a les deux."],
  ["Un parallélogramme dont les diagonales ont la même longueur est…", "un rectangle", ["un losange", "un trapèze", "un cerf-volant"], "Diagonales de même longueur qui se coupent en leur milieu : c’est un rectangle."],
  ["Un parallélogramme dont les diagonales sont perpendiculaires est…", "un losange", ["un rectangle", "un trapèze", "un cerf-volant"], "Diagonales perpendiculaires qui se coupent en leur milieu : c’est un losange."],
  ["Un quadrilatère qui a exactement une paire de côtés parallèles est…", "un trapèze", ["un parallélogramme", "un losange", "un rectangle"], "Le parallélogramme a deux paires de côtés parallèles ; le trapèze une seule."],
  ["Dans tout parallélogramme, les diagonales…", "se coupent en leur milieu", ["sont perpendiculaires", "ont la même longueur", "sont parallèles"], "C’est la propriété de tous les parallélogrammes ; perpendiculaires (losange) ou de même longueur (rectangle), seulement dans certains."],
  ["Un triangle qui a exactement deux côtés de même longueur est…", "isocèle", ["équilatéral", "rectangle", "quelconque"], "Isocèle : deux côtés égaux. Équilatéral : trois côtés égaux."],
];

// [figure, nombre d'axes de symétrie]
const AXES: [string, number][] = [
  ["un rectangle qui n’est pas un carré", 2],
  ["un carré", 4],
  ["un losange qui n’est pas un carré", 2],
  ["un parallélogramme qui n’est ni un rectangle ni un losange", 0],
  ["un triangle équilatéral", 3],
  ["un triangle isocèle qui n’est pas équilatéral", 1],
  ["un triangle dont les trois côtés ont des longueurs différentes", 0],
  ["un trapèze isocèle qui n’est pas un rectangle", 1],
  ["un cerf-volant qui n’est pas un losange", 1],
];

/** Figures planes : vocabulaire (droites remarquables, quadrilatères), symétries, nature d'un triangle, dessin à l'échelle (PER MSN 31, 9e-10e). */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const [q, a, d, why] = pick(VOC);
    return { q, txt: 1, a, choices: qcm(a, d), why };
  }
  if (t === 1) {
    const [f, n] = pick(AXES);
    return { q: `Combien d’axes de symétrie a ${f} ?`, txt: 1, a: n, why: `${f.charAt(0).toUpperCase() + f.slice(1)} a ${n} axe${n > 1 ? "s" : ""} de symétrie : c’est le nombre de façons de le plier pour que les deux moitiés se superposent exactement.` };
  }
  if (t === 2) {
    let a: number, b: number;
    const k = R(0, 2);
    if (k === 1) { a = R(20, 70); b = 90 - a; }
    else if (k === 2) { a = R(95, 140); b = R(10, 170 - a); }
    else { do { a = R(35, 85); b = R(35, 85); } while (a + b < 95 || 180 - a - b >= 90); }
    const c = 180 - a - b, m = Math.max(a, b, c);
    const nat = m === 90 ? "rectangle" : m > 90 ? "obtusangle" : "acutangle";
    return { q: `Un triangle a des angles de ${a}°, ${b}° et ${c}°. Comment est-il ?`, txt: 1, a: nat, choices: ["acutangle", "rectangle", "obtusangle"], why: `Le plus grand angle mesure ${m}° : ${m === 90 ? "un angle droit → rectangle" : m > 90 ? "un angle obtus → obtusangle" : "les trois angles sont aigus → acutangle"}.` };
  }
  if (t === 3) {
    const k = R(0, 2);
    let s: number[];
    if (k === 0) { const x = R(3, 12); s = [x, x, x]; }
    else if (k === 1) { const x = R(4, 12); let y: number; do y = R(3, 2 * x - 1); while (y === x); s = [x, y, x]; }
    else { let x: number, y: number, z: number; do { x = R(3, 12); y = R(3, 12); z = R(3, 12); } while (x === y || y === z || x === z || Math.max(x, y, z) * 2 >= x + y + z); s = [x, y, z]; }
    const nat = ["équilatéral", "isocèle", "quelconque"][k];
    return { q: `Un triangle a des côtés de ${s[0]} cm, ${s[1]} cm et ${s[2]} cm. Comment est-il ?`, txt: 1, a: nat, choices: ["équilatéral", "isocèle", "quelconque"], why: k === 0 ? "Trois côtés égaux : équilatéral." : k === 1 ? "Exactement deux côtés égaux : isocèle." : "Trois côtés différents : quelconque." };
  }
  if (t === 4) {
    const ok = R(0, 1) === 1;
    let x: number, y: number, z: number;
    do { x = R(2, 15); y = R(2, 15); z = R(2, 15); } while (Math.max(x, y, z) * 2 === x + y + z || (Math.max(x, y, z) * 2 < x + y + z) !== ok);
    const m = Math.max(x, y, z), autres = x + y + z - m;
    return { q: `Peut-on construire un triangle dont les côtés mesurent ${x} cm, ${y} cm et ${z} cm ?`, txt: 1, a: ok ? "oui" : "non", choices: ["oui", "non"], hint: "Compare le plus grand côté à la somme des deux autres.", why: `Le plus grand côté (${m} cm) doit être plus court que la somme des deux autres (${autres} cm) : ${ok ? `${m} < ${autres}, c’est possible` : `${m} ≥ ${autres}, impossible : les deux petits côtés ne se rejoignent pas`}.` };
  }
  const k = pick([20, 50, 100, 200, 500]), c = R(2, 15), reel = (c * k) / 100;
  if (R(0, 1)) return { q: `Sur un plan à l’échelle 1:${k}, un mur mesure ${c} cm. Quelle est sa longueur réelle en mètres ?`, txt: 1, a: reel, why: `1 cm sur le plan = ${k} cm en réalité : ${c} × ${k} = ${c * k} cm = ${fr(reel)} m.` };
  return { q: `Tu dessines à l’échelle 1:${k} une table longue de ${fr(reel)} m. Quelle longueur en cm aura-t-elle sur ton dessin ?`, txt: 1, a: c, why: `${fr(reel)} m = ${c * k} cm, et ${c * k} ÷ ${k} = ${c} cm.` };
}
