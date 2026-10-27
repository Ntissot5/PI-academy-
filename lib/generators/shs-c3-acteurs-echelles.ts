import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ECHELLES = ["locale", "régionale", "nationale", "mondiale"];
// [problématique, échelle la plus pertinente, explication]
const PB: [string, string, string][] = [
  ["l’emplacement d’un nouvel arrêt de bus dans le quartier", "locale", "C’est une décision de la commune, pour ses habitants."],
  ["le réchauffement climatique et la fonte des calottes polaires", "mondiale", "Le climat concerne toute la planète."],
  ["la construction d’une ligne ferroviaire entre Genève et Saint-Gall", "nationale", "Elle traverse plusieurs cantons : c’est un enjeu national."],
  ["la gestion des transports dans une agglomération et ses communes voisines", "régionale", "Plusieurs communes d’une même région sont concernées."],
  ["les câbles sous-marins qui relient Internet entre les continents", "mondiale", "Ils relient le monde entier."],
  ["la qualité de l’eau du Léman, partagé entre deux cantons suisses et la France", "régionale", "Le lac concerne une région qui dépasse une frontière (région transfrontalière)."],
];

const ITEMS: [string, string, string[], string][] = [
  ["Si l’offre d’un produit baisse alors que la demande reste forte, son prix a tendance à…", "augmenter", ["baisser", "rester exactement pareil", "devenir nul"], "Mécanisme de l’offre et de la demande : la rareté fait monter le prix."],
  ["Si l’offre d’un produit devient très abondante et que la demande ne change pas, son prix a tendance à…", "baisser", ["augmenter", "doubler", "rester fixe par la loi"], "Trop d’offre : les vendeurs baissent les prix pour vendre."],
  ["L’intentionnalité d’un acteur, c’est…", "le but qu’il poursuit en agissant sur l’espace", ["sa taille", "son âge", "son adresse"], "Exemple : une entreprise veut vendre, une association veut protéger la nature."],
  ["Lors d’un projet de station de ski, quel acteur défend surtout la protection de la nature ?", "Une association de protection de l’environnement", ["L’entreprise des remontées mécaniques", "Les hôteliers", "Les vendeurs de skis"], "Les acteurs ont des intérêts différents, parfois opposés."],
  ["Dans un projet d’usine, quel acteur cherche surtout à créer des emplois et des recettes fiscales ?", "La commune", ["Les oiseaux migrateurs", "Les touristes", "Les élèves"], "Chaque acteur a son intentionnalité."],
  ["Quel acteur prend la décision finale sur le plan d’affectation des zones d’une commune (où on peut construire) ?", "Les autorités communales et cantonales", ["Un promeneur", "Une entreprise étrangère seule", "Un touriste"], "L’aménagement du territoire relève d’acteurs publics, en Suisse surtout communes et cantons."],
  ["Une ONG (organisation non gouvernementale) est un acteur…", "privé, sans but lucratif, souvent international", ["public, comme un gouvernement", "une entreprise qui cherche le profit", "une commune"], "Exemples : Greenpeace, Amnesty International."],
  ["Changer d’échelle, c’est par exemple…", "passer de l’étude de sa commune à celle de son pays", ["changer de couleur sur une carte", "mesurer avec une autre règle", "changer de saison"], "Un même problème ne se pose pas de la même façon à chaque échelle."],
];

/** Cycle 3 · acteurs (intentionnalités, offre et demande) et échelles d'analyse. */
export function gen(): Question {
  if (Math.random() < 0.45) {
    const [pb, a, why] = pick(PB);
    return { q: `À quelle échelle étudier surtout ce problème : ${pb} ?`, txt: 1, a, choices: shuffle([...ECHELLES]), why };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
