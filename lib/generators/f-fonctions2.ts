import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const F = ["sujet", "complément du verbe", "complément de phrase", "attribut du sujet", "complément du nom", "modificateur du verbe"];
const R: Record<string, string> = {
  sujet: "On peut l’encadrer par « c’est … qui ».",
  "complément du verbe": "Il fait partie du groupe verbal : on ne peut ni le déplacer ni le supprimer.",
  "complément de phrase": "On peut le déplacer et le supprimer.",
  "attribut du sujet": "Il suit un verbe attributif et dit comment est le sujet.",
  "complément du nom": "Il complète un nom à l’intérieur d’un groupe nominal.",
  "modificateur du verbe": "Un adverbe qui précise le verbe (comment ?) : il fait partie du groupe verbal.",
};
const ITEMS: readonly (readonly [string, string, string?])[] = [
  ["*Nager* fait du bien.", "sujet", "Le sujet est un verbe à l’infinitif."], ["*Lire* est mon passe-temps préféré.", "sujet", "Le sujet est un infinitif."],
  ["*Tes amis* arrivent bientôt.", "sujet"], ["*Le vent* souffle fort.", "sujet"], ["*Ils* ont gagné le match.", "sujet"],
  ["J’ai acheté une veste *en laine*.", "complément du nom", "Groupe nominal avec préposition qui complète « veste »."],
  ["Le chat *de ma voisine* est noir.", "complément du nom"], ["Il porte un pull *rouge*.", "complément du nom", "Un adjectif qui complète un nom est complément du nom."],
  ["La fille *qui chante* est ma sœur.", "complément du nom", "Une subordonnée relative complète le nom « fille »."],
  ["Le livre *sur la table* est à moi.", "complément du nom"], ["La maison *de mes grands-parents* est grande.", "complément du nom"],
  ["Il mange *lentement*.", "modificateur du verbe"], ["Elle parle *doucement*.", "modificateur du verbe"],
  ["Les enfants courent *vite*.", "modificateur du verbe"], ["Le vent souffle *fort*.", "modificateur du verbe"],
  ["*Demain*, nous partirons à Lugano.", "complément de phrase", "Ici, un adverbe complément de phrase (déplaçable)."],
  ["*Quand il pleut*, je reste à la maison.", "complément de phrase", "Une subordonnée complément de phrase."],
  ["Je reste à la maison *quand il pleut*.", "complément de phrase", "Une subordonnée complément de phrase, déplaçable."],
  ["*Dans la forêt*, nous avons vu un chevreuil.", "complément de phrase"], ["*Ce matin*, il faisait froid.", "complément de phrase"],
  ["Nous avons vu *un chevreuil*.", "complément du verbe"], ["Elle ressemble *à sa mère*.", "complément du verbe"],
  ["Le directeur a félicité *les élèves*.", "complément du verbe"], ["Il a donné son ballon *à son frère*.", "complément du verbe"],
  ["Les élèves sont *attentifs*.", "attribut du sujet"], ["Mon voisin est *pompier*.", "attribut du sujet"],
  ["Cette histoire paraît *étrange*.", "attribut du sujet"],
];

/** Fonctions grammaticales (7e-11e) : sujet, compléments du verbe, de phrase, du nom, attribut, modificateur. */
export function gen(): Question {
  return tirer([etiquette("Quelle est la fonction du groupe en gras ?", ITEMS, F, R)]);
}
