import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const R: Record<string, string> = {
  "groupe nominal": "Il est construit autour d’un nom, avec son déterminant.",
  "groupe verbal": "Il est construit autour du verbe conjugué, avec ses compléments.",
  "groupe nominal avec préposition": "Il commence par une préposition (à, de, dans, sur, avec, pour…) suivie d’un groupe nominal.",
  "groupe adjectival": "Il est construit autour d’un adjectif.",
  "groupe adverbial": "Il est construit autour d’un adverbe.",
  "subordonnée relative": "Elle commence par un pronom relatif (qui, que, dont, où) et complète un nom.",
  "D + N": "Déterminant + nom.",
  "D + N + Adj": "Déterminant + nom + adjectif.",
  "D + N + GN avec préposition": "Déterminant + nom + groupe nominal introduit par une préposition.",
  "D + N + Ph rel": "Déterminant + nom + subordonnée relative.",
};

const T1 = ["groupe nominal", "groupe verbal", "groupe nominal avec préposition"];
const I1: readonly (readonly [string, string, string?])[] = [
  ["*Le chien* aboie.", "groupe nominal"], ["*Mes amis* arrivent.", "groupe nominal"], ["Elle range *ses affaires*.", "groupe nominal"],
  ["*La voisine de Léa* promène son chien.", "groupe nominal"], ["Lucas lit *une bande dessinée*.", "groupe nominal"],
  ["Le chien *mange sa pâtée*.", "groupe verbal"], ["Il *lit un livre*.", "groupe verbal"], ["Les oiseaux *chantent*.", "groupe verbal"],
  ["Ma sœur *prépare une tarte*.", "groupe verbal"],
  ["Le chat dort *sur le lit*.", "groupe nominal avec préposition"], ["Je vais *à la piscine*.", "groupe nominal avec préposition"],
  ["Il parle *avec son frère*.", "groupe nominal avec préposition"], ["Nous partons *en vacances*.", "groupe nominal avec préposition"],
];
const S1 = ["D + N", "D + N + Adj", "D + N + GN avec préposition"];
const J1: readonly (readonly [string, string, string?])[] = [
  ["*une maison*", "D + N"], ["*ce livre*", "D + N"], ["*mes chaussures*", "D + N"],
  ["*un vélo rouge*", "D + N + Adj"], ["*des chaussures neuves*", "D + N + Adj"], ["*les montagnes enneigées*", "D + N + Adj"],
  ["*le chat de Zoé*", "D + N + GN avec préposition"], ["*une tasse de thé*", "D + N + GN avec préposition"], ["*mon cahier de français*", "D + N + GN avec préposition"],
  ["*le sac à dos*", "D + N + GN avec préposition"],
];

const T2 = ["groupe nominal", "groupe verbal", "groupe nominal avec préposition", "groupe adjectival", "groupe adverbial", "subordonnée relative"];
const I2: readonly (readonly [string, string, string?])[] = [
  ...I1,
  ["Il est *très content*.", "groupe adjectival"], ["Cette robe est *trop longue*.", "groupe adjectival"], ["Je suis *fier de toi*.", "groupe adjectival"],
  ["Elle parle *très doucement*.", "groupe adverbial"], ["Il est arrivé *bien trop tard*.", "groupe adverbial"], ["Nous partirons *demain*.", "groupe adverbial"],
  ["Le livre *que tu m’as prêté* est passionnant.", "subordonnée relative"], ["J’ai vu le garçon *qui habite en face*.", "subordonnée relative"],
  ["C’est la ville *où je suis né*.", "subordonnée relative"], ["Voici l’ami *dont je t’ai parlé*.", "subordonnée relative"],
];
const S2 = ["D + N", "D + N + Adj", "D + N + GN avec préposition", "D + N + Ph rel"];
const J2: readonly (readonly [string, string, string?])[] = [
  ...J1, ["*le garçon qui court*", "D + N + Ph rel"], ["*la lettre que j’ai reçue*", "D + N + Ph rel"], ["*le village où j’habite*", "D + N + Ph rel"],
];

/** Groupes de la phrase (5e-6e) : GN, GV, GN avec préposition ; structure du GN. */
export function gen1(): Question {
  return tirer([etiquette("Quel est le type du groupe en gras ?", I1, T1, R), etiquette("Quelle est la structure de ce groupe nominal ?", J1, S1, R)]);
}

/** Groupes de la phrase (7e-11e) : + groupe adjectival, adverbial, subordonnée relative. */
export function gen2(): Question {
  return tirer([etiquette("Quel est le type du groupe en gras ?", I2, T2, R), etiquette("Quelle est la structure de ce groupe nominal ?", J2, S2, R)]);
}
