import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Une étagère à 3 rayons : on demande ce qui est au-dessus / en dessous / à côté.
const OBJETS = ["le ballon", "la poupée", "le camion", "l’ours", "la toupie", "le livre"];

const ITEMS: [string, string, string[], string][] = [
  ["Le chat est sous la table. Où est-il ?", "En dessous de la table", ["Sur la table", "Derrière la porte"], "« Sous » veut dire « en dessous »."],
  ["Le livre est sur la table. Où est-il ?", "Posé dessus", ["En dessous", "Dans le tiroir"], "« Sur » veut dire « au-dessus, posé dessus »."],
  ["Le contraire de « devant », c’est…", "derrière", ["dessus", "à gauche"], "Devant / derrière."],
  ["Le contraire de « loin », c’est…", "près", ["haut", "dehors"], "Loin / près."],
  ["Le contraire de « dedans », c’est…", "dehors", ["dessous", "devant"], "Dedans / dehors."],
  ["Le contraire de « en haut », c’est…", "en bas", ["à droite", "derrière"], "En haut / en bas."],
  ["Dans la file, Léo est devant toi. Où es-tu par rapport à Léo ?", "Derrière lui", ["Devant lui", "Sur lui"], "Si Léo est devant moi, je suis derrière Léo."],
  ["Je suis face à mon copain. Je lève ma main droite. De son côté, ma main levée est…", "à sa gauche", ["à sa droite", "derrière lui"], "Face à face, la droite de l’un est à la gauche de l’autre."],
  ["Pour monter au 1er étage de l’école, je…", "monte l’escalier", ["descends l’escalier", "traverse la route"], "Monter : aller vers le haut."],
  ["Je vais d’un trottoir à l’autre au passage piéton : je…", "traverse la route", ["monte la route", "tourne en rond"], "Traverser : passer d’un côté à l’autre."],
  ["Sur un plan, l’eau (rivière, lac) est en général dessinée en…", "bleu", ["rouge", "noir"], "C’est une convention : le bleu pour l’eau."],
  ["Sur un plan, la forêt est en général dessinée en…", "vert", ["bleu", "jaune"], "Le vert représente la forêt et les espaces verts."],
  ["Un plan de la classe vu du dessus : une table ronde devient…", "un rond", ["un carré", "un triangle"], "Vu d’en haut, on voit la forme du plateau."],
  ["Sur une photo prise d’un avion, les voitures paraissent…", "toutes petites", ["géantes", "invisibles"], "Plus on est loin, plus les choses paraissent petites."],
  ["Quel élément est un bon point de repère, toujours au même endroit ?", "L’église du village", ["Une voiture garée", "Un nuage"], "L’église ne bouge pas ; la voiture et le nuage, si."],
  ["Quel élément est un bon point de repère pour retrouver l’école ?", "La fontaine de la place", ["Le chien du voisin", "Une flaque d’eau"], "Un point de repère doit être visible et rester au même endroit."],
  ["Le petit dessin d’une croix sur un plan, c’est souvent…", "un symbole (expliqué dans la légende)", ["une erreur", "une tache"], "La légende explique ce que veut dire chaque symbole."],
  ["Où est la légende d’un plan ?", "Dans un cadre à côté du plan", ["Dans le ciel", "Elle n’existe pas"], "La légende est une petite boîte qui explique les couleurs et symboles."],
];

/** Cycle 1 · se repérer : vocabulaire de position et de déplacement, points de repère, plans et symboles. */
export function gen(): Question {
  if (Math.random() < 0.3) {
    const [haut, milieu, bas] = shuffle(OBJETS).slice(0, 3);
    const t = R(0, 1);
    if (t === 0) return { q: `Sur l’étagère : en haut ${haut}, au milieu ${milieu}, en bas ${bas}. Qu’est-ce qui est juste au-dessus de ${bas} ?`, txt: 1, a: milieu, choices: shuffle([haut, milieu, bas]), why: `Juste au-dessus de ${bas}, il y a le rayon du milieu : ${milieu}.` };
    return { q: `Sur l’étagère : en haut ${haut}, au milieu ${milieu}, en bas ${bas}. Qu’est-ce qui est tout en bas ?`, txt: 1, a: bas, choices: shuffle([haut, milieu, bas]), why: `Tout en bas, il y a ${bas}.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
