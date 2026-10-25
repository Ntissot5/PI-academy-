import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis le participe passé correctement accordé : ";
const ITEMS: readonly Item[] = [
  ["Elles se sont *…* avant le repas. (laver)", "lavées", ["lavé", "lavés", "lavée"], "« se » (= elles-mêmes) est complément direct, placé avant : accord au féminin pluriel."],
  ["Elles se sont *…* les mains. (laver)", "lavé", ["lavées", "lavés", "lavée"], "Le complément direct est « les mains », placé après ; « se » est indirect : pas d’accord."],
  ["Ils se sont *…* au téléphone. (parler)", "parlé", ["parlés", "parlée", "parlées"], "On parle à quelqu’un : « se » est complément indirect, pas d’accord."],
  ["Lina s’est *…* en voyant le sang. (évanouir)", "évanouie", ["évanoui", "évanouis", "évanouies"], "Verbe essentiellement pronominal (s’évanouir) : accord avec le sujet."],
  ["Les lettres qu’ils se sont *…* sont touchantes. (écrire)", "écrites", ["écrit", "écrits", "écrite"], "« qu’ » (= les lettres) est complément direct placé avant : écrites."],
  ["Nous nous sommes *…* au bord du lac, Zoé et moi. (promener)", "promenées", ["promené", "promenés", "promenée"], "« nous » (Zoé et moi, deux filles) est complément direct : féminin pluriel."],
  ["Les deux équipes se sont *…* à la fin du match. (serrer la main)", "serré", ["serrées", "serrés", "serrée"], "Le complément direct est « la main », placé après : pas d’accord."],
  ["Les oiseaux se sont *…* à l’approche du chat. (envoler)", "envolés", ["envolé", "envolées", "envolée"], "Verbe essentiellement pronominal (s’envoler) : accord avec le sujet."],
  ["Elles se sont *…* de la situation. (moquer)", "moquées", ["moqué", "moqués", "moquée"], "Verbe essentiellement pronominal (se moquer) : accord avec le sujet."],
  ["Ils se sont *…* toute la soirée. (sourire)", "souri", ["souris", "sourie", "souries"], "On sourit à quelqu’un : « se » est indirect. Le participe reste invariable."],
];

/** Participe passé des verbes pronominaux. */
export function gen(): Question {
  return tirer([deBanque(ITEMS, C)]);
}
