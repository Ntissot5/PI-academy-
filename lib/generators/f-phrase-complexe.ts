import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const R: Record<string, string> = {
  "phrase simple": "Elle ne contient qu’un seul verbe conjugué.",
  juxtaposition: "Les propositions sont reliées par un signe de ponctuation (virgule, point-virgule, deux-points).",
  coordination: "Les propositions sont reliées par une conjonction de coordination (mais, ou, et, donc, or, ni, car).",
  subordination: "Une proposition dépend d’une autre ; elle est introduite par un mot subordonnant (que, qui, quand, parce que…).",
};
const T = ["phrase simple", "juxtaposition", "coordination", "subordination"];
const I: readonly (readonly [string, string, string?])[] = [
  ["*Le soleil se lève sur le Léman.*", "phrase simple"], ["*Chaque matin, mon voisin promène son chien au bord de la Sarine.*", "phrase simple"],
  ["*Il pleut, nous restons à la maison.*", "juxtaposition"], ["*Le vent souffle ; les volets claquent.*", "juxtaposition"],
  ["*Je suis fatigué : j’ai couru toute la journée.*", "juxtaposition"],
  ["*Il pleut, mais nous sortons quand même.*", "coordination"], ["*Elle a faim, donc elle mange.*", "coordination"],
  ["*Je reste à l’intérieur, car il fait froid.*", "coordination"],
  ["*Je sais que tu viendras.*", "subordination"], ["*Quand il neige, nous faisons de la luge.*", "subordination"],
  ["*Le livre que tu m’as prêté est génial.*", "subordination"], ["*Il est content parce qu’il a gagné.*", "subordination"],
];

/** Phrase simple et phrase complexe : juxtaposition, coordination, subordination. */
export function gen(): Question {
  return tirer([etiquette("Cette phrase est-elle simple ? Sinon, comment ses propositions sont-elles reliées ?", I, T, R)]);
}
