import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C = "Choisis le participe passé correctement accordé : ";
const AVANT: readonly Item[] = [
  ["Les pommes que j’ai *…* sont délicieuses. (cueillir)", "cueillies", ["cueilli", "cueillis", "cueillie"], "Le complément direct « que » (= les pommes) est placé avant « avoir » : accord au féminin pluriel."],
  ["Je les ai *…* hier soir. (voir — les = tes sœurs)", "vues", ["vu", "vus", "vue"], "« les » (= tes sœurs), complément direct placé avant : accord au féminin pluriel."],
  ["Quelle robe as-tu *…* ? (choisir)", "choisie", ["choisi", "choisies", "choisis"], "« Quelle robe », complément direct placé avant : accord au féminin singulier."],
  ["Les lettres que nous avons *…* sont arrivées. (écrire)", "écrites", ["écrit", "écrits", "écrite"], "« que » (= les lettres) est placé avant : écrites."],
  ["Ces films, je les ai tous *…*. (regarder)", "regardés", ["regardé", "regardées", "regardée"], "« les » (= ces films) est placé avant : masculin pluriel."],
  ["La chanson qu’elle a *…* m’a ému. (chanter)", "chantée", ["chanté", "chantées", "chantés"], "« qu’ » (= la chanson) est placé avant : féminin singulier."],
  ["Où as-tu mis la clé ? Je l’ai *…*. (perdre)", "perdue", ["perdu", "perdues", "perdus"], "« l’ » (= la clé) est placé avant : perdue."],
];
const APRES: readonly Item[] = [
  ["Nous avons *…* des pommes. (cueillir)", "cueilli", ["cueillies", "cueillis", "cueillie"], "Le complément direct « des pommes » est placé après le verbe : pas d’accord."],
  ["Elles ont *…* une lettre à leur grand-mère. (écrire)", "écrit", ["écrites", "écrite", "écrits"], "Avec « avoir », pas d’accord avec le sujet ; le complément direct est après : écrit."],
  ["Mes sœurs ont *…* toute la journée. (marcher)", "marché", ["marchées", "marchés", "marchée"], "Pas de complément direct : le participe reste invariable."],
  ["Les enfants ont *…* à leurs parents. (obéir)", "obéi", ["obéis", "obéies", "obéie"], "« à leurs parents » est un complément indirect : pas d’accord."],
  ["Lina a *…* ses devoirs. (finir)", "fini", ["finis", "finie", "finies"], "Le complément direct « ses devoirs » est après le verbe : pas d’accord."],
  ["Cette histoire leur a *…*. (plaire)", "plu", ["plue", "plus", "plues"], "« leur » est un complément indirect (plaire à quelqu’un) : pas d’accord."],
];

/** Participe passé employé avec avoir : accord avec le complément direct placé avant. */
export function gen(): Question {
  return tirer([deBanque(AVANT, C), deBanque(AVANT, C), deBanque(APRES, C)]);
}
