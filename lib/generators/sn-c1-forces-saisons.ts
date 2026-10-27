import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Qu’est-ce qui fait tourner une éolienne ?", "Le vent", ["La pluie", "La lune"], "Le vent pousse les pales : l’éolienne tourne."],
  ["Qu’est-ce qui pousse un bateau à voile ?", "Le vent", ["Le soleil", "Les poissons"], "Le vent souffle dans la voile et pousse le bateau."],
  ["Qu’est-ce qui fait tourner une roue à aubes de moulin ?", "L’eau de la rivière", ["Le vent du nord", "La neige"], "L’eau qui coule pousse les palettes de la roue."],
  ["Un cerf-volant monte dans le ciel grâce…", "au vent", ["à la pluie", "au soleil"], "Le vent pousse le cerf-volant vers le haut."],
  ["Un parachute descend lentement grâce…", "à l’air qui le freine", ["à l’eau", "à un moteur"], "L’air se met sous la toile et freine la chute."],
  ["Une bille roule sur une pente. Où va-t-elle ?", "Vers le bas", ["Vers le haut", "Elle reste immobile"], "Sur une pente, les objets roulent vers le bas."],
  ["Je souffle sur un moulinet en papier. Que fait-il ?", "Il tourne", ["Il fond", "Il coule"], "Mon souffle, c’est de l’air qui pousse : le moulinet tourne."],
  ["Une balançoire à bascule : un enfant lourd et un enfant léger. Qui descend ?", "L’enfant le plus lourd", ["L’enfant le plus léger", "Personne"], "Le côté le plus lourd descend. Pour équilibrer, le plus lourd se rapproche du milieu."],
  ["Sur une balance à deux plateaux, le plateau qui descend porte…", "l’objet le plus lourd", ["l’objet le plus léger", "l’objet le plus grand"], "Le plateau le plus chargé descend."],
  ["Quelle saison est la plus froide ?", "L’hiver", ["L’été", "Le printemps"], "En hiver, il fait froid et il peut neiger."],
  ["En quelle saison les feuilles des arbres jaunissent et tombent ?", "En automne", ["Au printemps", "En été"], "En automne, les feuilles changent de couleur et tombent."],
  ["En quelle saison les fleurs et les bourgeons apparaissent ?", "Au printemps", ["En automne", "En hiver"], "Au printemps, la nature se réveille : bourgeons et fleurs."],
  ["En quelle saison les journées sont les plus longues et chaudes ?", "En été", ["En hiver", "En automne"], "En été, le soleil brille longtemps et il fait chaud."],
  ["Combien y a-t-il de saisons dans une année ?", "4", ["2", "7"], "Printemps, été, automne, hiver : 4 saisons."],
  ["Quelle saison vient après l’hiver ?", "Le printemps", ["L’automne", "L’été"], "Hiver, puis printemps, puis été, puis automne."],
  ["Quand fait-il nuit ?", "Quand le soleil est couché", ["Quand il pleut", "À midi"], "Le jour, le soleil nous éclaire ; la nuit, il est couché."],
  ["Que fait la marmotte en hiver ?", "Elle hiberne (elle dort tout l’hiver)", ["Elle part en Afrique", "Elle construit un nid dans un arbre"], "La marmotte hiberne dans son terrier jusqu’au printemps."],
  ["Que font les hirondelles en automne ?", "Elles partent vers l’Afrique, où il fait chaud", ["Elles dorment dans la neige", "Elles restent dans le nid"], "Les hirondelles migrent : elles s’envolent vers des pays chauds."],
  ["Pourquoi ne faut-il pas jouer sur une pente enneigée quand il y a un danger d’avalanche ?", "La neige peut glisser d’un coup", ["La neige devient chaude", "La neige se transforme en sable"], "Une avalanche, c’est une grosse masse de neige qui dévale la montagne."],
  ["Le soleil se lève le…", "matin", ["soir", "minuit"], "Le soleil se lève le matin et se couche le soir."],
];

/** Cycle 1 · forces de l'air et de l'eau, équilibre, saisons, jour et nuit. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
