import { pick } from "../math";
import { gras, melange } from "./f-outils";
import type { Question } from "./types";

/* Mots à plusieurs sens : [mot, [phrase avec *mot*, sens]]. */
const MOTS: readonly (readonly [string, readonly (readonly [string, string])[]])[] = [
  ["pousser", [["L’herbe *pousse* dans le pré.", "grandir"], ["Il *pousse* la porte.", "appuyer pour déplacer"], ["Ses parents le *poussent* à faire du sport.", "encourager"]]],
  ["cœur", [["Le *cœur* bat plus vite quand on court.", "l’organe"], ["Il a du *cœur* : il aide tout le monde.", "la générosité"], ["Nous sommes au *cœur* de la forêt.", "le centre"]]],
  ["souris", [["Le chat attrape une *souris*.", "le petit rongeur"], ["Je clique avec la *souris* de l’ordinateur.", "l’objet pour diriger l’ordinateur"]]],
  ["feuille", [["Une *feuille* tombe de l’arbre.", "la partie de la plante"], ["Écris ton nom sur la *feuille*.", "le morceau de papier"]]],
  ["bouton", [["Il a un *bouton* sur le nez.", "un petit gonflement de la peau"], ["Appuie sur le *bouton* pour allumer.", "la commande d’un appareil"], ["Il manque un *bouton* à ma veste.", "la pièce pour fermer un vêtement"]]],
  ["glace", [["Je mange une *glace* à la vanille.", "le dessert glacé"], ["Elle se regarde dans la *glace*.", "le miroir"], ["La *glace* recouvre le lac en hiver.", "l’eau gelée"]]],
  ["tour", [["C’est mon *tour* de jouer.", "le moment où c’est à quelqu’un"], ["Nous faisons le *tour* du lac.", "le parcours autour"]]],
  ["prendre", [["Je *prends* le train pour Berne.", "voyager avec"], ["Elle *prend* un livre sur l’étagère.", "saisir"], ["Le feu *prend* dans la cheminée.", "commencer"]]],
  ["voler", [["L’oiseau *vole* au-dessus du lac.", "se déplacer dans l’air"], ["Le cambrioleur a *volé* un vélo.", "prendre ce qui est à un autre"]]],
  ["pièce", [["Il me rend une *pièce* de deux francs.", "l’argent en métal"], ["Notre appartement a quatre *pièces*.", "la salle d’un logement"], ["Nous allons voir une *pièce* de théâtre.", "le spectacle"]]],
  ["bureau", [["Mon papa travaille dans un *bureau*.", "le lieu de travail"], ["Range tes crayons sur ton *bureau*.", "la table de travail"]]],
];

/** Polysémie : trouver le sens d'un mot selon le contexte. */
export function gen(): Question {
  const [mot, sens] = pick(MOTS);
  const [p, s] = pick(sens);
  const autres = sens.map(([, x]) => x).filter((x) => x !== s);
  const ailleurs = MOTS.filter(([m]) => m !== mot).map(([, ss]) => pick(ss)[1]);
  const choices = melange([s, ...autres, ...melange(ailleurs)].slice(0, Math.max(3, autres.length + 1)));
  return {
    q: `Dans cette phrase, que veut dire <b>${mot}</b> ? ${gras(p)}`,
    txt: 1,
    a: s,
    choices: [...new Set(choices)],
    why: `Ici, « ${mot} » veut dire « ${s} ». Un même mot peut avoir plusieurs sens : c’est le contexte qui indique lequel.`,
  };
}

