import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Chaînes alimentaires simples : [producteur, consommateur 1, consommateur 2]
const CHAINES: [string, string, string][] = [
  ["l’herbe", "le chevreuil", "le lynx"],
  ["l’herbe", "la sauterelle", "le lézard"],
  ["l’herbe", "le lièvre", "l’aigle royal"],
  ["la salade", "l’escargot", "l’orvet"],
  ["l’herbe", "le chevreuil", "le loup"],
  ["les feuilles", "le criquet", "la grenouille"],
];
const ROLES = ["producteur", "consommateur de 1er ordre (herbivore)", "consommateur de 2e ordre (carnivore)", "décomposeur"];

const ITEMS: [string, string, string[], string][] = [
  ["Dans une chaîne alimentaire, que veut dire la flèche « herbe → lapin » ?", "L’herbe est mangée par le lapin", ["Le lapin est mangé par l’herbe", "Le lapin plante l’herbe", "L’herbe pousse sur le lapin"], "La flèche va du mangé vers le mangeur : elle montre le chemin de la nourriture."],
  ["Par quoi commence toujours une chaîne alimentaire ?", "Par un végétal (producteur)", ["Par un carnivore", "Par un champignon", "Par un humain"], "Les végétaux fabriquent leur matière grâce à la lumière : ce sont les producteurs."],
  ["Les vers de terre et les champignons qui transforment les feuilles mortes en terre sont des…", "décomposeurs", ["producteurs", "prédateurs", "parasites"], "Les décomposeurs recyclent la matière morte en éléments utiles aux plantes."],
  ["Le renard chasse le lapin. Le renard est…", "le prédateur", ["la proie", "le parasite", "le producteur"], "Le prédateur chasse et mange sa proie."],
  ["La tique se nourrit du sang du chevreuil sans le tuer. C’est…", "du parasitisme", ["de la prédation", "de la symbiose", "de la décomposition"], "Le parasite vit aux dépens d’un autre être vivant, son hôte."],
  ["L’abeille butine la fleur et transporte son pollen. Les deux y gagnent. C’est…", "une relation où les deux gagnent (mutualisme, symbiose)", ["du parasitisme", "de la prédation", "de la compétition"], "L’abeille reçoit du nectar, la fleur est pollinisée."],
  ["Deux merles veulent le même ver de terre. C’est de la…", "compétition", ["symbiose", "décomposition", "pollinisation"], "Quand deux êtres vivants recherchent la même ressource, ils sont en compétition."],
  ["Dans une pyramide alimentaire, quel niveau compte le plus d’individus (ou de masse) ?", "Les producteurs (végétaux), à la base", ["Les grands carnivores, au sommet", "Tous les niveaux pareil", "Les décomposeurs seulement"], "Il faut beaucoup de plantes pour nourrir les herbivores, et beaucoup d’herbivores pour les carnivores."],
  ["Si tous les renards disparaissaient d’une forêt, que se passerait-il probablement ?", "Les lapins deviendraient plus nombreux", ["Les lapins disparaîtraient aussi tout de suite", "L’herbe pousserait plus", "Rien ne changerait"], "Moins de prédateurs : les proies se multiplient… et mangent plus d’herbe."],
  ["On assèche une mare. Quels animaux perdent leur lieu de reproduction ?", "Les grenouilles et les tritons", ["Les marmottes", "Les écureuils", "Les chamois"], "Les amphibiens pondent dans l’eau : sans mare, plus de têtards."],
  ["On coupe la haie au bord d’un champ. Quelle conséquence ?", "Les oiseaux et les insectes perdent un abri et de la nourriture", ["Plus de biodiversité", "Rien ne change", "Les poissons du lac disparaissent"], "La haie est un milieu de vie : sa disparition fait baisser la biodiversité."],
  ["Une marée noire (pétrole dans la mer) est grave parce que…", "elle tue les oiseaux, les poissons et pollue les côtes", ["elle rend l’eau plus propre", "elle nourrit les poissons", "elle n’a aucun effet"], "Le pétrole colle aux plumes et empoisonne les êtres vivants."],
  ["Une action de l’Homme qui augmente la biodiversité ?", "Créer une prairie fleurie ou un étang", ["Bétonner un pré", "Couper toutes les haies", "Verser des produits toxiques"], "De nouveaux milieux accueillent de nouvelles espèces."],
];

/** Cycle 2 · relations alimentaires (chaînes, pyramides, producteurs, consommateurs, décomposeurs), relations entre êtres vivants, écosystèmes fragiles. */
export function gen(): Question {
  if (Math.random() < 0.4) {
    const ch = pick(CHAINES);
    const i = Math.floor(Math.random() * 3);
    const nom = ch[i];
    const a = ROLES[i];
    return {
      q: `Chaîne alimentaire : ${ch[0]} → ${ch[1]} → ${ch[2]}. Dans cette chaîne, ${nom} : quel rôle ?`, txt: 1, a, choices: shuffle([...ROLES]),
      why: `${ch[0][0].toUpperCase() + ch[0].slice(1)} : producteur ; ${ch[1]} le mange (consommateur de 1er ordre) ; ${ch[2]} mange ${ch[1]} (consommateur de 2e ordre).`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
