import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  // Risques, zones volcaniques et sismiques
  ["Où se produisent la plupart des séismes et des éruptions volcaniques ?", "Aux limites des plaques tectoniques", ["Au centre des plaques", "Seulement près des pôles", "Au hasard, n’importe où"], "Les plaques se rapprochent, s’écartent ou glissent : le sol tremble, le magma remonte."],
  ["Comment appelle-t-on la zone de volcans et de séismes qui entoure l’océan Pacifique ?", "La ceinture de feu du Pacifique", ["La dorsale des Alpes", "Le triangle des Bermudes", "Le rift du Rhône"], "Japon, Indonésie, Chili, Californie… sont sur la ceinture de feu."],
  ["Un risque naturel, c’est la rencontre entre…", "un aléa (phénomène naturel) et des enjeux (personnes, biens)", ["un volcan et la mer seulement", "deux pays voisins", "la pluie et le soleil"], "Sans population exposée, un aléa n’est pas un risque."],
  ["En Suisse, quel risque naturel menace surtout les vallées alpines ?", "Les avalanches, les laves torrentielles et les éboulements", ["Les tsunamis", "Les cyclones tropicaux", "Les éruptions volcaniques"], "Le relief alpin expose aux mouvements de terrain et aux avalanches."],
  ["Quelle ville suisse a été détruite en grande partie par un tremblement de terre en 1356 ?", "Bâle", ["Lausanne", "Lugano", "Sion"], "Le séisme de Bâle de 1356 est le plus fort connu en Europe centrale ; le Valais est aussi une région sismique."],
  // Production et consommation
  ["Pourquoi le cacao est-il cultivé surtout dans les régions tropicales ?", "Il a besoin de chaleur et d’humidité toute l’année", ["Il pousse mieux dans la neige", "Il a besoin d’un climat sec et froid", "Par tradition seulement"], "Le climat du site de production explique la localisation."],
  ["Pourquoi les chocolatiers suisses importent-ils du cacao ?", "Le cacaoyer ne pousse pas sous le climat suisse", ["La Suisse interdit sa culture", "Le cacao suisse est trop sucré", "Pour économiser le lait"], "Régions de production et de consommation sont souvent éloignées : il faut des échanges."],
  // Villes
  ["Le centre historique d’une ville (vieille ville) est souvent…", "le noyau le plus ancien, autour d’un château, d’une église ou d’un pont", ["la zone la plus récente", "une zone industrielle", "un aéroport"], "Les villes se sont souvent développées à partir d’un site favorable (colline, gué, carrefour)."],
  ["La périurbanisation, c’est…", "l’extension des habitations autour des villes, à la campagne proche", ["la démolition des villes", "le retour de la forêt en ville", "la construction de tours au centre"], "Beaucoup de gens habitent en périphérie et font des trajets vers la ville (pendulaires)."],
  ["Un pendulaire, c’est une personne qui…", "fait chaque jour le trajet entre son domicile et son travail dans une autre commune", ["change de pays chaque année", "travaille la nuit", "ne quitte jamais son quartier"], "Les flux de pendulaires montrent les liens entre ville et périphérie."],
  ["Laquelle est une fonction urbaine ?", "Le commerce et les services (hôpital, université)", ["La culture de la vigne en pente", "L’élevage en alpage", "La pêche en haute mer"], "Une ville concentre des fonctions : habiter, travailler, commercer, se soigner, se former, se divertir."],
  // Climat, migrations
  ["Une conséquence visible du réchauffement climatique dans les Alpes ?", "Le recul des glaciers", ["La hausse du nombre de glaciers", "Plus de neige en plaine chaque hiver", "Le refroidissement des lacs"], "Les glaciers suisses perdent du volume chaque année."],
  ["Quel gaz rejeté par les activités humaines contribue le plus à l’effet de serre ?", "Le dioxyde de carbone (CO<sub>2</sub>)", ["Le dioxygène", "Le diazote", "L’hélium"], "Il est rejeté surtout par la combustion du pétrole, du gaz et du charbon."],
  ["Une cause de migration économique ?", "Chercher un travail mieux payé", ["Fuir une guerre", "Fuir une inondation", "Fuir une persécution"], "Causes économiques, politiques, sociales, culturelles ou environnementales."],
  ["Une personne qui fuit une guerre ou une persécution et demande protection dans un autre pays est…", "une personne réfugiée (qui demande l’asile)", ["un touriste", "un pendulaire", "un frontalier"], "Ce sont des causes politiques de migration."],
  ["Un frontalier, c’est une personne qui…", "habite dans un pays et travaille dans le pays voisin", ["garde la frontière", "a deux passeports", "habite sur la frontière exactement"], "Genève, Bâle et le Tessin accueillent beaucoup de frontaliers."],
  // Eau, énergie, information
  ["Pourquoi parle-t-on de l’« or bleu » ?", "L’eau douce est précieuse et inégalement répartie", ["L’eau est vendue au prix de l’or", "L’or devient bleu dans l’eau", "Les océans sont bleus"], "Certaines régions en manquent, d’autres en ont beaucoup : c’est un enjeu politique et économique."],
  ["On appelle souvent la Suisse le « château d’eau de l’Europe » parce que…", "de grands fleuves y prennent leur source (Rhin, Rhône, Inn)", ["elle a beaucoup de châteaux au bord de l’eau", "elle vend de l’eau en bouteille", "elle est entourée par la mer"], "Glaciers et précipitations alimentent des fleuves qui coulent vers plusieurs mers."],
  ["Les câbles sous-marins servent surtout à…", "transporter les données d’Internet entre les continents", ["transporter du pétrole", "nourrir les poissons", "mesurer la température"], "Les flux d’information passent en grande partie par ces câbles."],
  ["La fracture numérique, c’est…", "l’inégalité d’accès à Internet et aux outils numériques", ["une panne d’ordinateur", "un écran cassé", "un virus informatique"], "Selon les régions et les revenus, l’accès à l’information n’est pas le même."],
];

/** Cycle 3 · localisation et organisation de l'espace : risques, production, villes, climat, migrations, eau, information. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
