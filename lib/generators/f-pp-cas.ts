import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis le participe passé correctement accordé : ";
const ITEMS: readonly Item[] = [
  ["Les fortes chaleurs qu’il a *…* ont desséché les champs. (faire)", "fait", ["faites", "faits", "faite"], "Verbe impersonnel (il a fait chaud) : le participe passé reste invariable."],
  ["Les efforts qu’il a *…* pour réussir étaient immenses. (falloir)", "fallu", ["fallus", "fallue", "fallues"], "« Falloir » est impersonnel : son participe est toujours invariable."],
  ["Les tempêtes qu’il y a *…* cet hiver ont abîmé la forêt. (avoir)", "eu", ["eues", "eus", "eue"], "« Il y a » est impersonnel : le participe reste invariable."],
  ["Les deux heures que j’ai *…* m’ont reposé. (dormir)", "dormi", ["dormies", "dormis", "dormie"], "« Que » (les deux heures) indique une durée, pas un complément direct : invariable."],
  ["Les vingt francs que ce livre a *…* étaient bien dépensés. (coûter)", "coûté", ["coûtés", "coûtées", "coûtée"], "Le prix n’est pas un complément direct : le participe de « coûter » (au sens propre) reste invariable."],
  ["Les chanteuses que j’ai *…* chanter étaient excellentes. (entendre)", "entendues", ["entendu", "entendus", "entendue"], "Ce sont les chanteuses qui chantent : le complément direct fait l’action de l’infinitif, on accorde."],
  ["Les chansons que j’ai *…* chanter étaient belles. (entendre)", "entendu", ["entendues", "entendus", "entendue"], "Les chansons ne chantent pas : le complément direct est celui de l’infinitif, pas d’accord."],
  ["Elle s’est *…* couper les cheveux. (faire)", "fait", ["faite", "faits", "faites"], "« Fait » suivi d’un infinitif est toujours invariable."],
  ["Des framboises ? J’en ai *…* beaucoup. (manger)", "mangé", ["mangées", "mangés", "mangée"], "Avec le pronom « en », le participe passé reste invariable."],
];

/** Cas particuliers de l'accord du participe passé (verbes impersonnels, infinitif, « en »…). */
export function gen(): Question {
  return tirer([deBanque(ITEMS, C)]);
}
