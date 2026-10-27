import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis la bonne orthographe : ";
const TOUT: readonly Item[] = [
  ["*…* les élèves sont présents.", "Tous", ["Tout", "Toutes"], "Déterminant devant « les élèves » (masculin pluriel) : tous."],
  ["Elle a lu *…* la journée.", "toute", ["tout", "toutes"], "Déterminant devant « la journée » (féminin singulier) : toute."],
  ["*…* les filles chantent.", "Toutes", ["Tous", "Tout"], "Déterminant devant « les filles » : toutes."],
  ["Je les ai *…* invités.", "tous", ["tout", "toutes"], "Pronom qui reprend « les » (des garçons) : tous."],
  ["C’est *…* pour aujourd’hui.", "tout", ["tous", "toute"], "Pronom neutre (= toutes les choses) : tout."],
  ["Mes amies sont *…* arrivées.", "toutes", ["tout", "toute"], "Pronom (toutes mes amies sont arrivées) : toutes."],
  ["Elle est *…* émue.", "tout", ["toute", "tous"], "Adverbe (= très) devant un adjectif féminin commençant par une voyelle : invariable."],
  ["Elle est *…* rouge de colère.", "toute", ["tout", "toutes"], "Adverbe devant un adjectif féminin commençant par une consonne : il s’accorde (toute rouge)."],
  ["Elles sont *…* contentes.", "toutes", ["tout", "toute"], "Adverbe devant un adjectif féminin commençant par une consonne : il s’accorde (toutes contentes)."],
  ["Le chat est *…* noir.", "tout", ["tous", "toute"], "Adverbe (= entièrement) : tout."],
  ["Il a mangé le gâteau *…* entier.", "tout", ["tous", "toute"], "Adverbe (= entièrement) devant un adjectif masculin : tout."],
];
const MEME: readonly Item[] = [
  ["Nous avons les *…* chaussures.", "mêmes", ["même"], "Adjectif devant un nom pluriel (identiques) : mêmes."],
  ["*…* les enfants ont ri.", "Même", ["Mêmes"], "Adverbe (= aussi, y compris) : invariable."],
  ["Ils l’ont construit eux-*…*.", "mêmes", ["même"], "Après un pronom pluriel, « même » s’accorde et prend un trait d’union : eux-mêmes."],
  ["Elle l’a fait elle-*…*.", "même", ["mêmes"], "Après un pronom singulier : elle-même."],
  ["Ce sont les *…* questions qu’hier.", "mêmes", ["même"], "Adjectif (identiques) devant un nom pluriel : mêmes."],
  ["Les sommets, *…* les plus hauts, étaient enneigés.", "même", ["mêmes"], "Adverbe (= y compris) : invariable."],
];

/** Orthographe de « tout » (déterminant, pronom, adverbe) et de « même » (adjectif, adverbe). */
export function gen(): Question {
  return tirer([deBanque(TOUT, C), deBanque(TOUT, C), deBanque(MEME, C)]);
}
