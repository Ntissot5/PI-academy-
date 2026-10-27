import { pick } from "../math";
import { gras, qcmFixe } from "./f-outils";
import type { Question } from "./types";

const FIG = ["comparaison", "métaphore", "personnification", "périphrase"] as const;
const ITEMS: readonly (readonly [string, (typeof FIG)[number], string])[] = [
  ["Ses yeux brillent *comme des étoiles*.", "comparaison", "Deux éléments sont rapprochés avec un outil de comparaison (« comme »)."],
  ["Le lac est *pareil à un miroir*.", "comparaison", "Outil de comparaison : « pareil à »."],
  ["Il est rusé *tel un renard*.", "comparaison", "Outil de comparaison : « tel »."],
  ["Le lac est *un miroir*.", "métaphore", "Le lac est rapproché d’un miroir sans outil de comparaison : métaphore."],
  ["Cet élève est *une mine d’or* d’idées.", "métaphore", "Rapprochement sans outil de comparaison."],
  ["*Le vent hurle* dans la cheminée.", "personnification", "Le vent est présenté comme un être humain (hurler)."],
  ["*Les arbres dansent* sous la tempête.", "personnification", "On prête aux arbres une action humaine (danser)."],
  ["*La ville dort* encore.", "personnification", "On attribue à la ville une action humaine (dormir)."],
  ["Nous avons visité *la Ville fédérale*.", "périphrase", "Plusieurs mots désignent Berne sans la nommer : périphrase."],
  ["*Le roi des animaux* dort au soleil.", "périphrase", "« Le roi des animaux » désigne le lion."],
  ["*L’astre du jour* se lève sur les Alpes.", "périphrase", "« L’astre du jour » désigne le soleil."],
];

/** Figures de style : comparaison, métaphore, personnification, périphrase. */
export function gen(): Question {
  const [p, f, why] = pick(ITEMS);
  return qcmFixe(`Quelle figure de style reconnais-tu dans le passage en gras ? ${gras(p)}`, f, FIG, why);
}
