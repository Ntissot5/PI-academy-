import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ITEMS: readonly Item[] = [
  ["Dans *Hélas, le spectacle est annulé*, que montre « hélas » ?", "le regret de celui qui parle", ["une certitude", "une cause", "le lieu"], "« hélas » est un modalisateur d’appréciation : il exprime le regret."],
  ["Dans *Heureusement, personne n’a été blessé*, que montre « heureusement » ?", "le soulagement de celui qui parle", ["un doute", "le temps", "une conséquence"], "« heureusement » donne l’appréciation de l’émetteur."],
  ["Dans *Il viendra peut-être demain*, que montre « peut-être » ?", "un doute, une probabilité", ["une certitude", "un regret", "un ordre"], "« peut-être » est un modalisateur de probabilité."],
  ["Dans *Il semble que le pont soit fermé*, que montre « il semble que » ?", "que l’émetteur n’est pas certain", ["que l’émetteur est sûr", "une joie", "un ordre"], "« il semble que » atténue l’affirmation : probabilité."],
  ["Dans *Sans doute arrivera-t-il en retard*, que montre « sans doute » ?", "une forte probabilité", ["une certitude absolue", "un regret", "une cause"], "« sans doute » = probablement (modalisateur de probabilité)."],
  ["Quelle phrase montre que l’émetteur est certain ?", "Il est certain que la neige tombera.", ["Il se peut que la neige tombe.", "La neige tombera peut-être.", "Il semble que la neige va tomber."], "« il est certain que » exprime la certitude."],
  ["Quelle phrase contient un modalisateur d’appréciation ?", "Par bonheur, le train était à l’heure.", ["Le train était à l’heure.", "Le train partira à huit heures.", "Le train est-il à l’heure ?"], "« par bonheur » exprime l’appréciation de l’émetteur."],
  ["Dans *Jean est absent : il serait malade*, que montre le conditionnel « serait » ?", "une information non confirmée", ["un fait certain", "un ordre", "un souhait"], "Le conditionnel permet à l’émetteur de ne pas garantir l’information."],
];

/** Modalisateurs : position de l'émetteur (appréciation, probabilité). */
export function gen(): Question {
  return tirer([deBanque(ITEMS)]);
}
