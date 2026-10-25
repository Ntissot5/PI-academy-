import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const F = ["attribut du complément du verbe", "modificateur de l’adjectif", "modificateur de l’adverbe", "modificateur du verbe", "complément de l’adjectif", "complément du verbe"];
const R: Record<string, string> = {
  "attribut du complément du verbe": "Il dit comment est le complément direct du verbe (on peut écrire : … est …).",
  "modificateur de l’adjectif": "Un adverbe qui nuance un adjectif (très, trop, assez…).",
  "modificateur de l’adverbe": "Un adverbe qui nuance un autre adverbe.",
  "modificateur du verbe": "Un adverbe qui précise le verbe.",
  "complément de l’adjectif": "Un groupe introduit par une préposition, qui complète un adjectif.",
  "complément du verbe": "Il complète le verbe et ne peut être ni déplacé ni supprimé.",
};
const ITEMS: readonly (readonly [string, string, string?])[] = [
  ["Les élèves ont élu Mia *déléguée de classe*.", "attribut du complément du verbe", "Mia est déléguée de classe : attribut du complément « Mia »."],
  ["Je trouve ce film *passionnant*.", "attribut du complément du verbe", "Ce film est passionnant : attribut du complément « ce film »."],
  ["On le croyait *malade*.", "attribut du complément du verbe", "Il est malade : attribut du complément « le »."],
  ["La neige rend les routes *glissantes*.", "attribut du complément du verbe", "Les routes sont glissantes : attribut du complément « les routes »."],
  ["Il a appelé son chien *Rex*.", "attribut du complément du verbe", "Son chien est Rex : attribut du complément « son chien »."],
  ["Ce sac est *très* lourd.", "modificateur de l’adjectif"], ["Ce film est *vraiment* drôle.", "modificateur de l’adjectif"],
  ["Elle est *assez* grande pour son âge.", "modificateur de l’adjectif"],
  ["Elle court *trop* vite.", "modificateur de l’adverbe", "« trop » nuance l’adverbe « vite »."], ["Je rentre *assez* tard.", "modificateur de l’adverbe", "« assez » nuance l’adverbe « tard »."],
  ["Il parle *fort*.", "modificateur du verbe"], ["Elle travaille *sérieusement*.", "modificateur du verbe"],
  ["Elle est fière *de son travail*.", "complément de l’adjectif"], ["Ce plat est facile *à préparer*.", "complément de l’adjectif"],
  ["Il est content *de son nouveau vélo*.", "complément de l’adjectif"], ["Le lac est riche *en poissons*.", "complément de l’adjectif"],
  ["Il pense *à son examen*.", "complément du verbe"], ["Elle mange *une pomme*.", "complément du verbe"],
];

/** Fonctions grammaticales (10e-11e) : attribut du complément du verbe, modificateurs, complément de l'adjectif. */
export function gen(): Question {
  return tirer([etiquette("Quelle est la fonction du mot ou du groupe en gras ?", ITEMS, F, R)]);
}
