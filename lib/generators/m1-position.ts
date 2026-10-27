import { R, pick } from "../math";
import type { Question } from "./types";
import { ANIMAUX, qcm, tirer } from "./m1-outils";

// [phrase, bonne réponse, autres propositions, explication]
const PHRASES: [string, string, string[], string][] = [
  ["Le 🐱 dort sur le lit. Le lit est … le 🐱.", "sous", ["sur", "devant"], "Le chat est en haut, le lit est en bas : le lit est sous le chat."],
  ["Le cahier est sur le livre. Le livre est … le cahier.", "sous", ["sur", "derrière"], "Le cahier est en haut, le livre en bas : le livre est sous le cahier."],
  ["Le livre est sous le cahier. Le cahier est … le livre.", "sur", ["sous", "devant"], "Le livre est en bas, le cahier en haut : le cahier est sur le livre."],
  ["Le 🐟 nage dans le bocal. Il est à l’… du bocal.", "intérieur", ["extérieur"], "Dans le bocal, c’est à l’intérieur."],
  ["Le 🐶 joue dans le jardin, hors de sa niche. Il est à l’… de la niche.", "extérieur", ["intérieur"], "Hors de la niche, c’est à l’extérieur."],
  ["Léa est devant Tom. Tom est … Léa.", "derrière", ["devant", "sur"], "Si Léa est devant Tom, alors Tom est derrière Léa."],
  ["Tom est derrière Léa. Léa est … Tom.", "devant", ["derrière", "sous"], "Si Tom est derrière Léa, alors Léa est devant Tom."],
];

/** Situer un objet : entre, à côté, devant, derrière, sur, sous, dedans, dehors : PER MSN 11, 1re-2e. */
export function gen(): Question {
  const t = R(0, 3), k = R(3, 5), rang = tirer(ANIMAUX, k), ligne = rang.join(" ");
  if (t === 0) {
    const i = R(1, k - 2), a = rang[i];
    return { q: `${ligne}  Qui est <b>entre</b> ${rang[i - 1]} et ${rang[i + 1]} ?`, txt: 1, a, choices: qcm(a, [rang[i - 1], rang[i + 1]]), why: `${a} a ${rang[i - 1]} d’un côté et ${rang[i + 1]} de l’autre : il est entre les deux.` };
  }
  if (t === 1) {
    const bout = Math.random() < 0.5 ? 0 : k - 1, voisin = bout === 0 ? 1 : k - 2, a = rang[voisin];
    return { q: `${ligne}  Qui est <b>à côté</b> de ${rang[bout]} ?`, txt: 1, a, choices: qcm(a, rang.filter((x, j) => j !== bout && j !== voisin)), why: `${rang[bout]} est au bout de la rangée : son seul voisin est ${a}.` };
  }
  if (t === 2) {
    const s = R(0, 3);
    const file = `La file avance vers 🏁.  🏁 ${ligne}`;
    if (s === 0) {
      const i = R(1, k - 1), a = rang[i - 1];
      return { q: `${file}  Qui est juste <b>devant</b> ${rang[i]} ?`, txt: 1, a, choices: qcm(a, rang.filter((_, j) => j !== i && j !== i - 1)), why: `Devant, c’est du côté de 🏁 : juste devant ${rang[i]}, il y a ${a}.` };
    }
    if (s === 1) {
      const i = R(0, k - 2), a = rang[i + 1];
      return { q: `${file}  Qui est juste <b>derrière</b> ${rang[i]} ?`, txt: 1, a, choices: qcm(a, rang.filter((_, j) => j !== i && j !== i + 1)), why: `Derrière, c’est loin de 🏁 : juste derrière ${rang[i]}, il y a ${a}.` };
    }
    const premier = s === 2, a = premier ? rang[0] : rang[k - 1];
    return { q: `${file}  Qui est le <b>${premier ? "premier" : "dernier"}</b> ?`, txt: 1, a, choices: qcm(a, premier ? [rang[k - 1], rang[1]] : [rang[0], rang[k - 2]]), why: `Le premier est tout près de 🏁, le dernier est le plus loin : c’est ${a}.` };
  }
  const [q, a, autres, why] = pick(PHRASES);
  return { q, txt: 1, a, choices: qcm(a, autres), why };
}
