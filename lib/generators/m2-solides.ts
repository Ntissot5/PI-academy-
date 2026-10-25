import { R, pick } from "../math";
import { qcm } from "./m2-outils";
import type { Question } from "./types";

// [nom, faces, sommets, arêtes]
const SOL: [string, number, number, number][] = [
  ["un cube", 6, 8, 12],
  ["un parallélépipède rectangle (une boîte à chaussures)", 6, 8, 12],
  ["une pyramide à base carrée", 5, 5, 8],
  ["une pyramide à base triangulaire", 4, 4, 6],
];
const NOMS = ["cube", "parallélépipède rectangle", "pyramide à base carrée", "pyramide à base triangulaire"];
const DEVINE: [string, string][] = [
  ["J’ai 6 faces, toutes des carrés identiques.", "cube"],
  ["J’ai 6 faces rectangulaires, et elles ne sont pas toutes des carrés.", "parallélépipède rectangle"],
  ["J’ai une base carrée et 4 faces triangulaires qui se rejoignent en un sommet.", "pyramide à base carrée"],
  ["J’ai 4 faces, toutes triangulaires.", "pyramide à base triangulaire"],
  ["J’ai 5 sommets et 8 arêtes.", "pyramide à base carrée"],
  ["J’ai 4 sommets et 6 arêtes.", "pyramide à base triangulaire"],
];

/** Solides : faces, sommets, arêtes, développements, assemblages de cubes. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const [n, f, s, a] = pick(SOL), k = R(0, 2);
    const mot = ["faces", "sommets", "arêtes"][k], v = [f, s, a][k];
    const aide = ["Les faces sont les surfaces planes.", "Les sommets sont les « coins ».", "Les arêtes sont les segments où deux faces se touchent."][k];
    return { q: `Combien de <b>${mot}</b> a ${n} ?`, txt: 1, a: v, hint: aide, why: `${n[0].toUpperCase() + n.slice(1)} a ${f} faces, ${s} sommets et ${a} arêtes.` };
  }
  if (t === 1) {
    const [d, a] = pick(DEVINE);
    return { q: `Qui suis-je ? ${d}`, txt: 1, a, choices: qcm(a, NOMS), why: `C’est ${a === "pyramide à base carrée" || a === "pyramide à base triangulaire" ? "une" : "un"} ${a}.` };
  }
  if (t === 2) {
    const it = pick([
      ["Le développement (le patron) d’un cube est formé de combien de carrés ?", 6, "Un cube a 6 faces carrées : son patron a 6 carrés."],
      ["Le patron d’une pyramide à base carrée a combien de triangles ?", 4, "1 carré pour la base et 4 triangles pour les faces latérales."],
      ["Le patron d’un parallélépipède rectangle a combien de rectangles ?", 6, "Un parallélépipède rectangle a 6 faces : 3 paires de rectangles identiques."],
      ["Dans le patron d’un cube, combien de carrés touchent la face du dessus une fois le cube fermé ?", 4, "La face du dessus touche les 4 faces latérales ; seule la face du dessous ne la touche pas."],
    ] as [string, number, string][]);
    return { q: it[0], txt: 1, a: it[1], why: it[2] };
  }
  if (t === 3) {
    const a = R(2, 5), b = R(2, 4), c = R(1, 4);
    return { q: `Une construction en forme de parallélépipède rectangle est faite de petits cubes : ${a} cubes de long, ${b} de large et ${c} de haut. Combien de petits cubes en tout ?`, txt: 1, a: a * b * c, hint: "Compte une couche, puis multiplie par le nombre de couches", why: `Une couche : ${a} × ${b} = ${a * b} cubes ; ${c} couche${c > 1 ? "s" : ""} : ${a * b} × ${c} = ${a * b * c}.` };
  }
  if (t === 4) {
    const n = pick([3, 4]);
    const k = R(0, 1);
    if (k === 0) return { q: `Un grand cube est formé de ${n} × ${n} × ${n} petits cubes. On peint toute sa surface extérieure. Combien de petits cubes n’ont <b>aucune</b> face peinte ?`, txt: 1, a: (n - 2) ** 3, hint: "Ils sont cachés au centre", why: `Les cubes cachés forment un cube de ${n - 2} × ${n - 2} × ${n - 2} = ${(n - 2) ** 3} au centre.` };
    return { q: `Un grand cube est formé de ${n} × ${n} × ${n} petits cubes. On peint toute sa surface extérieure. Combien de petits cubes ont exactement 3 faces peintes ?`, txt: 1, a: 8, hint: "Où trouve-t-on 3 faces visibles ?", why: "Seuls les cubes des coins ont 3 faces peintes, et un cube a 8 sommets : 8 cubes." };
  }
  const a = R(2, 9);
  const it = pick([
    [`Un cube a des arêtes de ${a} cm. Quelle est la longueur totale de ses arêtes, en cm ?`, 12 * a, `Un cube a 12 arêtes de ${a} cm : 12 × ${a} = ${12 * a} cm.`],
    [`Sur un dé ordinaire, la somme de deux faces opposées vaut toujours 7. Quel nombre est sur la face opposée au ${(a % 6) + 1} ?`, 7 - ((a % 6) + 1), `7 − ${(a % 6) + 1} = ${7 - ((a % 6) + 1)}.`],
    [`Combien de faces d’un cube touchent une même arête ?`, 2, "Une arête est la rencontre de 2 faces."],
    [`Combien d’arêtes partent d’un même sommet d’un cube ?`, 3, "À chaque coin du cube, 3 arêtes se rencontrent."],
  ] as [string, number, string][]);
  return { q: it[0], txt: 1, a: it[1], why: it[2] };
}
