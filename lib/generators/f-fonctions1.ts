import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const F = ["sujet", "complément du verbe", "complément de phrase", "attribut du sujet"];
const R: Record<string, string> = {
  sujet: "On peut l’encadrer par « c’est … qui » ; il commande l’accord du verbe.",
  "complément du verbe": "Il fait partie du groupe verbal : on ne peut ni le déplacer ni le supprimer.",
  "complément de phrase": "On peut le déplacer et le supprimer : il est facultatif.",
  "attribut du sujet": "Il suit un verbe attributif (être, sembler, devenir, rester, paraître) et dit comment est le sujet.",
};
const ITEMS: readonly (readonly [string, string, string?])[] = [
  ["*Le petit garçon* regarde les nuages.", "sujet"], ["*Elle* prépare son sac.", "sujet", "Le sujet est un pronom."],
  ["*Julie* chante dans la chorale.", "sujet", "Le sujet est un nom propre."], ["*Le train pour Berne* part à midi.", "sujet"],
  ["*Il* arrive demain.", "sujet", "Le sujet est un pronom."], ["Dans le pré broutent *les vaches*.", "sujet", "Le sujet est placé après le verbe (sujet inversé)."],
  ["Le petit garçon regarde *les nuages*.", "complément du verbe"], ["Mon frère parle *à sa voisine*.", "complément du verbe", "Complément du verbe introduit par une préposition."],
  ["Nous pensons *à nos vacances*.", "complément du verbe"], ["Mes parents habitent *à Montreux*.", "complément du verbe", "« Habiter » demande un complément : on ne peut pas le supprimer."],
  ["Le voisin offre *des fleurs* à sa femme.", "complément du verbe"], ["Le voisin offre des fleurs *à sa femme*.", "complément du verbe"],
  ["Lucas lit *une bande dessinée*.", "complément du verbe"],
  ["*Chaque été*, nous allons à Zermatt.", "complément de phrase"], ["Nous mangeons une fondue *le samedi soir*.", "complément de phrase"],
  ["*Pendant la nuit*, la neige est tombée.", "complément de phrase"], ["Le chien de Léo aboie *tous les soirs*.", "complément de phrase"],
  ["Les enfants jouent au ballon *dans le parc*.", "complément de phrase"],
  ["Ce gâteau est *délicieux*.", "attribut du sujet"], ["Mon oncle est *boulanger*.", "attribut du sujet"],
  ["Les feuilles deviennent *rouges*.", "attribut du sujet"], ["Ma cousine semble *fatiguée*.", "attribut du sujet"],
  ["Le loup est *un animal sauvage*.", "attribut du sujet", "L’attribut est ici un groupe nominal."], ["Tu restes *calme*.", "attribut du sujet"],
];

/** Fonctions grammaticales (5e-6e) : sujet, complément du verbe, complément de phrase, attribut du sujet. */
export function gen(): Question {
  return tirer([etiquette("Quelle est la fonction du groupe en gras ?", ITEMS, F, R)]);
}
