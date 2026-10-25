import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [question, bonne réponse, mauvaises réponses, explication]
const ITEMS: [string, string, string[], string][] = [
  ["Combien de cantons compte la Suisse ?", "26", ["23", "24", "28"], "La Suisse compte 26 cantons."],
  ["Quel est le plus haut sommet de Suisse ?", "Pointe Dufour", ["Cervin", "Jungfrau", "Eiger"], "La Pointe Dufour (Mont Rose) culmine à 4 634 m."],
  ["Quel est le plus grand lac entièrement suisse ?", "Lac de Neuchâtel", ["Léman", "Lac de Constance", "Lac de Zurich"], "Le Léman est plus grand, mais il est partagé avec la France."],
  ["Combien de pays voisins a la Suisse ?", "5", ["3", "4", "6"], "France, Allemagne, Autriche, Liechtenstein et Italie."],
  ["Quelle est la ville fédérale de la Suisse ?", "Berne", ["Zurich", "Genève", "Lausanne"], "Berne est le siège des autorités fédérales."],
  ["Combien de langues nationales la Suisse a-t-elle ?", "4", ["2", "3", "5"], "Allemand, français, italien et romanche."],
  ["Quel fleuve traverse Bâle ?", "Le Rhin", ["Le Rhône", "L’Aar", "Le Tessin"], "Le Rhin quitte la Suisse à Bâle."],
  ["Quel fleuve traverse Genève ?", "Le Rhône", ["Le Rhin", "L’Aar", "La Reuss"], "Le Rhône sort du Léman à Genève."],
  ["Dans quel canton se trouve le Cervin ?", "Valais", ["Berne", "Grisons", "Uri"], "Le Cervin domine Zermatt, en Valais."],
  ["Quelles sont les trois grandes régions naturelles de la Suisse ?", "Jura, Plateau, Alpes", ["Jura, Préalpes, Tessin", "Plateau, Alpes, Engadine", "Jura, Alpes, Léman"], "Le Jura, le Plateau et les Alpes."],
];

/** La Suisse : chiffres et repères. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
