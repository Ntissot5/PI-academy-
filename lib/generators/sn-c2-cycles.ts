import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Dans quel ordre se déroule le cycle de vie du papillon ?", "Œuf, chenille, chrysalide, papillon", ["Chenille, œuf, papillon, chrysalide", "Papillon, chrysalide, œuf, chenille", "Œuf, papillon, chenille, chrysalide"], "C’est une métamorphose complète : œuf → chenille (larve) → chrysalide → papillon adulte."],
  ["Dans quel ordre se déroule le cycle de vie de la mouche ?", "Œuf, asticot, pupe, mouche", ["Asticot, mouche, œuf, pupe", "Œuf, mouche, asticot, pupe", "Mouche, pupe, asticot, œuf"], "L’asticot est la larve de la mouche."],
  ["Dans quel ordre se déroule le cycle de vie de la grenouille ?", "Œuf, têtard, jeune grenouille, grenouille adulte", ["Têtard, œuf, grenouille", "Œuf, grenouille, têtard", "Grenouille, têtard, œuf, jeune grenouille"], "Le têtard vit dans l’eau avec des branchies, puis ses pattes poussent."],
  ["Le changement de forme de la chenille en papillon s’appelle…", "la métamorphose", ["la germination", "la pollinisation", "l’hibernation"], "Métamorphose : l’animal change complètement de forme en grandissant."],
  ["Quand une graine commence à pousser, on dit qu’elle…", "germe", ["fleurit", "fane", "hiberne"], "La germination : la graine sort une petite racine puis une tige."],
  ["De quoi une graine a-t-elle besoin pour germer ?", "D’eau, d’air et d’une température douce", ["De lumière forte seulement", "De sel", "D’être dans le congélateur"], "Beaucoup de graines germent même dans le noir : elles ont surtout besoin d’eau et de chaleur."],
  ["Le transport du pollen d’une fleur à une autre s’appelle…", "la pollinisation", ["la germination", "la fécondation des animaux", "la photosynthèse"], "Le vent ou les insectes transportent le pollen."],
  ["Après la pollinisation, la fleur se transforme en…", "fruit (qui contient les graines)", ["racine", "feuille", "bourgeon"], "La fleur fanée laisse place au fruit, comme la cerise après la fleur de cerisier."],
  ["Comment les graines du pissenlit sont-elles dispersées ?", "Par le vent", ["Par l’eau seulement", "Par les poissons", "Elles tombent toujours au pied de la plante"], "Les petits parachutes du pissenlit s’envolent au vent."],
  ["Comment les graines des cerises sont-elles souvent dispersées ?", "Par les oiseaux qui mangent les fruits", ["Par le vent", "Par la neige", "Elles ne sont jamais dispersées"], "L’oiseau mange le fruit et rejette le noyau plus loin."],
  ["Le fraisier fait de longues tiges qui s’enracinent plus loin. Il se reproduit…", "sans graines, par ses tiges (stolons)", ["seulement par ses graines", "grâce aux poissons", "il ne se reproduit pas"], "Certaines plantes se multiplient aussi par une partie de la plante."],
  ["Que font beaucoup de plantes annuelles en hiver ?", "Elles meurent ; seules leurs graines passent l’hiver", ["Elles fleurissent", "Elles migrent", "Elles hibernent comme la marmotte"], "Les annuelles vivent une seule année ; la graine assure la suite."],
  ["Comment un arbre comme l’érable passe-t-il l’hiver ?", "Il perd ses feuilles et garde ses bourgeons", ["Il meurt chaque hiver", "Il part au sud", "Il se cache sous terre"], "Les bourgeons, protégés, s’ouvriront au printemps."],
  ["Comment la marmotte passe-t-elle l’hiver ?", "Elle hiberne dans son terrier", ["Elle migre en Afrique", "Elle reste active dans la neige", "Elle change de couleur"], "Son cœur et sa respiration ralentissent : elle vit sur ses réserves de graisse."],
  ["Comment l’hirondelle passe-t-elle l’hiver ?", "Elle migre vers l’Afrique", ["Elle hiberne", "Elle se cache sous la neige", "Elle reste dans son nid"], "En hiver, il n’y a plus d’insectes à manger chez nous : elle part au chaud."],
  ["Quel animal pond beaucoup d’œufs dans l’eau sans s’en occuper ensuite ?", "La grenouille", ["La vache", "Le chat", "La chauve-souris"], "Beaucoup d’œufs, peu de soins : quelques-uns survivront."],
  ["Chez les mammifères, où se développe le petit avant la naissance ?", "Dans le ventre de sa mère", ["Dans un œuf au nid", "Dans l’eau", "Dans une chrysalide"], "Le petit mammifère se développe dans l’utérus de la mère."],
  ["Le rôle commun de la graine et de l’œuf, c’est…", "contenir ce qu’il faut pour développer un nouvel être vivant", ["servir de nourriture aux humains", "protéger du froid", "rien de commun"], "La graine (plante) et l’œuf (animal) contiennent l’information et les réserves pour un nouvel individu."],
  ["Dans le cycle de vie, la rencontre d’une cellule mâle et d’une cellule femelle s’appelle…", "la fécondation", ["l’éclosion", "la germination", "la métamorphose"], "Après la fécondation se forme un œuf, qui se développe."],
  ["La sortie du poussin hors de son œuf s’appelle…", "l’éclosion", ["la fécondation", "la germination", "la pollinisation"], "Le poussin casse la coquille : c’est l’éclosion."],
];

/** Cycle 2 · cycles de vie des animaux et des plantes, reproduction, passer l'hiver. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
