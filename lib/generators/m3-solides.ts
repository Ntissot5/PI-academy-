import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { qcm } from "./m3-outils";

const BASE: Record<number, string> = { 3: "triangulaire", 4: "carrée", 5: "pentagonale", 6: "hexagonale", 8: "octogonale" };
type Elt = "faces" | "sommets" | "arêtes";
const ELTS: Elt[] = ["faces", "sommets", "arêtes"];

const POLY = ["un cube", "un prisme droit à base triangulaire", "une pyramide à base carrée", "un parallélépipède rectangle"];
const NONPOLY = ["un cylindre", "un cône", "une sphère"];

// [solide, développement] : chaque développement ne correspond qu'à un seul solide de la liste
const DEV: [string, string][] = [
  ["un cube", "6 carrés identiques"],
  ["un prisme droit à base triangulaire", "2 triangles et 3 rectangles"],
  ["une pyramide à base carrée", "1 carré et 4 triangles"],
  ["un cylindre", "2 disques et 1 rectangle"],
  ["un cône", "1 disque et 1 secteur circulaire"],
  ["une pyramide à base triangulaire", "4 triangles"],
];

function compte(type: "prisme" | "pyramide", n: number): Record<Elt, number> {
  return type === "prisme" ? { faces: n + 2, sommets: 2 * n, arêtes: 3 * n } : { faces: n + 1, sommets: n + 1, arêtes: 2 * n };
}

/** Solides : faces, sommets, arêtes, polyèdres, développements, perspective cavalière (PER MSN 31, 9e-11e). */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0 || t === 1) {
    const type = t === 0 ? "prisme" : "pyramide";
    const n = type === "prisme" ? pick([3, 5, 6, 8]) : pick([3, 4, 5, 6, 8]);
    const e = pick(ELTS), c = compte(type, n);
    const nom = type === "prisme" ? `un prisme droit à base ${BASE[n]}` : `une pyramide à base ${BASE[n]}`;
    const why = type === "prisme"
      ? `La base a ${n} côtés. Faces : 2 bases + ${n} rectangles = ${n + 2}. Sommets : ${n} en bas + ${n} en haut = ${2 * n}. Arêtes : ${n} + ${n} + ${n} verticales = ${3 * n}.`
      : `La base a ${n} côtés. Faces : 1 base + ${n} triangles = ${n + 1}. Sommets : ${n} + l’apex = ${n + 1}. Arêtes : ${n} autour de la base + ${n} vers l’apex = ${2 * n}.`;
    return { q: `Combien de ${e} a ${nom} ?`, txt: 1, a: c[e], why };
  }
  if (t === 2) {
    const e = pick(ELTS), v = { faces: 6, sommets: 8, arêtes: 12 }[e];
    return { q: `Combien de ${e} a un ${pick(["cube", "parallélépipède rectangle"])} ?`, txt: 1, a: v, why: "6 faces (dessus, dessous et 4 côtés), 8 sommets (4 en bas, 4 en haut), 12 arêtes (4 en bas, 4 en haut, 4 verticales)." };
  }
  if (t === 3) {
    const type = pick(["prisme", "pyramide"] as const), n = pick([3, 4, 5, 6, 8]), c = compte(type, n);
    return { q: `Un polyèdre a ${c.faces} faces et ${c.sommets} sommets. Combien a-t-il d’arêtes ?`, txt: 1, a: c.arêtes, hint: "Relation d’Euler : F + S − A = 2.", why: `Relation d’Euler : A = F + S − 2 = ${c.faces} + ${c.sommets} − 2 = ${c.arêtes}.` };
  }
  if (t === 4) {
    if (R(0, 1)) { const a = pick(POLY); return { q: "Lequel de ces solides est un polyèdre ?", txt: 1, a, choices: qcm(a, NONPOLY), why: `Un polyèdre n’a que des faces planes (des polygones). ${a.charAt(0).toUpperCase() + a.slice(1)} en est un ; cylindre, cône et sphère ont une surface courbe.` }; }
    const a = pick(NONPOLY);
    return { q: "Lequel de ces solides n’est pas un polyèdre ?", txt: 1, a, choices: qcm(a, POLY), why: `${a.charAt(0).toUpperCase() + a.slice(1)} a une surface courbe : ce n’est pas un polyèdre.` };
  }
  if (t === 5) {
    const [s, d] = pick(DEV);
    if (R(0, 1)) return { q: `Quel solide a pour développement ${d} ?`, txt: 1, a: s, choices: qcm(s, DEV.map((x) => x[0])), why: `${d.charAt(0).toUpperCase() + d.slice(1)} : en repliant, on obtient ${s}.` };
    return { q: `Le développement d’${s} est formé de…`, txt: 1, a: d, choices: qcm(d, DEV.map((x) => x[1])), why: `On déplie ${s} : ${d}.` };
  }
  if (t === 6) {
    const k = R(0, 2);
    if (k === 0) return { q: "Combien de faces planes (bases en forme de disque) a un cylindre ?", txt: 1, a: 2, why: "Un cylindre a deux bases (deux disques) et une surface courbe." };
    if (k === 1) return { q: "Combien de faces planes (base en forme de disque) a un cône ?", txt: 1, a: 1, why: "Un cône a une seule base (un disque), une surface courbe et un sommet." };
    return { q: "Combien de faces planes a une sphère ?", txt: 1, a: 0, why: "La sphère n’a qu’une surface courbe : aucune face plane, aucune arête." };
  }
  if (t === 7) {
    if (R(0, 1)) {
      const r = R(2, 9), h = R(5, 20), L = 2 * Math.PI * r;
      return { q: `Le développement d’un cylindre de rayon ${r} cm et de hauteur ${h} cm contient un rectangle. Combien mesure (en cm, au dixième) le côté du rectangle qui fait le tour de la base ?`, txt: 1, a: L, tol: 0.051, why: `Ce côté s’enroule autour du disque : c’est son périmètre, 2 · π · ${r} ≈ ${fr(L)} cm. L’autre côté vaut la hauteur, ${h} cm.` };
    }
    const n = pick([3, 4, 5, 6, 8]);
    return { q: `Le développement d’une pyramide régulière à base ${BASE[n]} contient combien de triangles isocèles autour de la base ?`, txt: 1, a: n, why: `Un triangle par côté de la base : ${n}.` };
  }
  const k = R(0, 2);
  if (k === 0) return { q: "Tu dessines un cube en perspective cavalière. Combien d’arêtes cachées dessines-tu en traitillé ?", txt: 1, a: 3, why: "Un seul sommet est caché (à l’arrière) ; il est relié à 3 arêtes : ce sont les 3 arêtes cachées." };
  if (k === 1) { const a = "parallèles"; return { q: "En perspective cavalière, deux arêtes parallèles dans la réalité sont dessinées…", txt: 1, a, choices: ["parallèles", "perpendiculaires", "sécantes"], why: "La perspective cavalière garde le parallélisme : des arêtes parallèles restent parallèles sur le dessin." }; }
  const a = "en vraie grandeur (un carré)";
  return { q: "En perspective cavalière, la face avant d’un cube est dessinée…", txt: 1, a, choices: [a, "comme un losange", "comme un trapèze"], why: "La face de devant est vue de face : elle garde sa vraie forme, un carré. Seules les arêtes fuyantes sont raccourcies et inclinées." };
}
