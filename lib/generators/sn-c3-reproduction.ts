import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["La puberté, c’est…", "la période où le corps devient capable de se reproduire", ["la naissance", "la vieillesse", "une maladie"], "Elle commence en général entre 9 et 14 ans, à un rythme différent pour chacun."],
  ["Quels organes produisent les spermatozoïdes ?", "Les testicules", ["Les ovaires", "L’utérus", "Les reins"], "Les testicules produisent les spermatozoïdes à partir de la puberté."],
  ["Quels organes produisent les ovules ?", "Les ovaires", ["Les testicules", "La vessie", "L’estomac"], "À partir de la puberté, les ovaires libèrent en général un ovule par cycle."],
  ["Dans quel organe le bébé se développe-t-il pendant la grossesse ?", "L’utérus", ["L’estomac", "L’ovaire", "La vessie"], "L’utérus est un muscle qui s’agrandit pendant la grossesse."],
  ["Les règles (menstruations), c’est…", "l’élimination de la muqueuse de l’utérus quand il n’y a pas eu de fécondation", ["une maladie", "la naissance d’un bébé", "une blessure de l’estomac"], "Le cycle menstruel dure environ 28 jours, souvent un peu plus ou moins."],
  ["La fécondation, c’est…", "la rencontre d’un spermatozoïde et d’un ovule", ["la naissance", "la division d’une cellule de peau", "la puberté"], "La cellule-œuf réunit le patrimoine génétique des deux parents."],
  ["Dans quel ordre se succèdent les étapes de la grossesse ?", "Fécondation, cellule-œuf, embryon, fœtus, nouveau-né", ["Embryon, fécondation, fœtus, œuf", "Fœtus, embryon, œuf, nouveau-né", "Œuf, fœtus, fécondation, embryon"], "On parle d’embryon les deux premiers mois environ, puis de fœtus."],
  ["Combien de temps dure environ une grossesse humaine ?", "9 mois", ["3 mois", "6 mois", "12 mois"], "Une grossesse dure environ 9 mois."],
  ["Par quel organe le fœtus reçoit-il dioxygène et nutriments ?", "Le placenta (par le cordon ombilical)", ["Les poumons du fœtus", "L’estomac du fœtus", "Le nez"], "Le placenta fait les échanges entre le sang de la mère et celui du fœtus."],
  ["Pourquoi un enfant ressemble-t-il à ses deux parents ?", "Il reçoit la moitié de son information génétique de chacun", ["Il copie leurs gestes", "Par hasard seulement", "Il ressemble seulement à sa mère"], "Lors de la fécondation, les bagages génétiques des deux parents s’unissent."],
  ["Une allergie, c’est…", "une réaction excessive du système immunitaire à une substance souvent inoffensive", ["une infection par un virus", "une fracture", "un manque de sommeil"], "Pollen, arachides, poils d’animaux… peuvent déclencher des allergies."],
  ["Un cancer, c’est…", "une multiplication anarchique de certaines cellules", ["une infection toujours contagieuse", "une allergie au pollen", "une blessure musculaire"], "Les cellules cancéreuses se divisent sans contrôle et peuvent envahir d’autres tissus."],
  ["Laquelle est une transformation de la puberté chez les filles comme chez les garçons ?", "Apparition de poils sous les bras et au pubis", ["Rétrécissement de la taille", "Perte des dents définitives", "Arrêt de la croissance à 10 ans"], "Poussée de croissance, pilosité, transpiration, acné possible : changements communs."],
  ["Chez les garçons, à la puberté, la voix…", "devient plus grave (mue)", ["devient plus aiguë", "disparaît", "ne change jamais"], "Le larynx grandit : la voix mue."],
];

/** Cycle 3 · puberté, systèmes reproducteurs, grossesse, hérédité (sensibilisation), dysfonctionnements. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
