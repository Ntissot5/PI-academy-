import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Laquelle n’est PAS une caractéristique commune à tous les êtres vivants ?", "Se déplacer", ["Se nourrir", "Se reproduire", "Respirer"], "Un arbre ne se déplace pas, mais il se nourrit, respire, se reproduit et meurt."],
  ["Excréter, pour un être vivant, c’est…", "rejeter ses déchets", ["se reproduire", "grandir", "se protéger"], "Urine, CO<sub>2</sub>, sueur : ce sont des déchets éliminés."],
  ["Range du plus grand au plus petit niveau d’organisation.", "Écosystème, population, individu, cellule", ["Population, écosystème, cellule, individu", "Individu, population, écosystème, cellule", "Cellule, individu, écosystème, population"], "Un écosystème contient des populations, formées d’individus, faits de cellules."],
  ["Une population, en biologie, c’est…", "l’ensemble des individus d’une même espèce dans un milieu", ["tous les êtres vivants de la Terre", "un seul individu", "les humains d’une ville seulement"], "Exemple : toutes les truites d’un lac."],
  ["Un organisme autotrophe…", "fabrique sa matière organique à partir de matière minérale et de lumière", ["mange d’autres êtres vivants", "vit en parasite", "ne se nourrit jamais"], "Les plantes vertes et les algues sont autotrophes."],
  ["Un organisme hétérotrophe…", "se nourrit de matière organique produite par d’autres êtres vivants", ["fabrique sa nourriture grâce à la lumière", "n’a pas besoin de nourriture", "vit seulement dans l’eau"], "Animaux, champignons et la plupart des bactéries sont hétérotrophes."],
  ["Dans un réseau alimentaire, sur quoi repose toute la matière organique ?", "Sur les producteurs (autotrophes)", ["Sur les super-prédateurs", "Sur les décomposeurs seulement", "Sur les humains"], "Sans organismes autotrophes, les hétérotrophes n’auraient rien à manger."],
  ["La photosynthèse utilise…", "du CO<sub>2</sub>, de l’eau et l’énergie lumineuse", ["du dioxygène et du sucre", "de l’azote et de la chaleur seulement", "du sel et de l’obscurité"], "6 CO<sub>2</sub> + 6 H<sub>2</sub>O + lumière → glucose + 6 O<sub>2</sub>."],
  ["La photosynthèse produit…", "du glucose (sucre) et du dioxygène", ["du CO<sub>2</sub> et de l’eau", "de l’azote", "du méthane"], "Le glucose est la nourriture de la plante ; le dioxygène est rejeté."],
  ["Quel pigment vert capte la lumière pour la photosynthèse ?", "La chlorophylle", ["L’hémoglobine", "La mélanine", "La kératine"], "La chlorophylle se trouve dans les chloroplastes des cellules végétales."],
  ["Une plante aquatique éclairée produit des bulles. Quel gaz ?", "Du dioxygène", ["Du dioxyde de carbone", "De l’hydrogène", "Du méthane"], "À la lumière, la photosynthèse rejette du dioxygène."],
  ["Quel réactif met en évidence l’amidon fabriqué par une feuille ?", "L’eau iodée (lugol), qui devient bleu-noir", ["Le vinaigre", "L’eau salée", "Le sucre"], "L’eau iodée colore l’amidon en bleu-noir."],
  ["Pourquoi dit-on que les hétérotrophes dépendent de la photosynthèse ?", "Leur énergie vient au départ de la matière produite par les plantes", ["Ils font eux-mêmes la photosynthèse", "Ils mangent de la lumière", "C’est faux"], "Même un carnivore mange des herbivores, qui ont mangé des plantes."],
  ["Une espèce exotique envahissante (comme la renouée du Japon) peut…", "prendre la place des espèces indigènes", ["augmenter toujours la biodiversité", "n’avoir aucun effet", "disparaître seule en un an"], "Sans ennemis naturels, elle se répand et concurrence les espèces locales."],
  ["Une monoculture (un seul type de plante sur de grandes surfaces) entraîne souvent…", "une baisse de la biodiversité", ["une hausse de la biodiversité", "plus d’espèces d’oiseaux", "aucun changement"], "Un seul type de plante offre peu d’abris et de nourriture variés."],
  ["Une route coupe une forêt en deux. Pour les animaux, c’est…", "un morcellement de leur domaine vital", ["une amélioration de leur habitat", "sans effet", "une nouvelle source de nourriture"], "Les animaux ne peuvent plus circuler librement ; des passages à faune réduisent le problème."],
  ["Les facteurs abiotiques d’un milieu sont…", "les facteurs non vivants : température, lumière, eau, sol", ["les prédateurs", "les parasites", "les plantes"], "Biotique = lié au vivant ; abiotique = physique ou chimique."],
  ["Si on élimine un maillon d’un réseau alimentaire…", "d’autres espèces sont touchées par effet en chaîne", ["seule cette espèce est concernée", "le réseau devient plus stable", "rien ne change"], "Un écosystème fonctionne comme un système : tout est lié."],
];

/** Cycle 3 · caractéristiques du vivant, niveaux d'organisation, réseaux alimentaires, photosynthèse, écosystèmes modifiés. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
