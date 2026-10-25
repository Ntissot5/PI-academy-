import { pick } from "../math";
import { saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* [adjectif, adverbe, règle]. */
const REG: readonly (readonly [string, string, string])[] = [
  ["lent", "lentement", "On ajoute -ment au féminin de l’adjectif : lente → lentement."],
  ["doux", "doucement", "On ajoute -ment au féminin : douce → doucement."],
  ["heureux", "heureusement", "Féminin heureuse + -ment."], ["fier", "fièrement", "Féminin fière + -ment."],
  ["sérieux", "sérieusement", "Féminin sérieuse + -ment."], ["léger", "légèrement", "Féminin légère + -ment."],
  ["vrai", "vraiment", "Après une voyelle, on ajoute -ment au masculin : vrai → vraiment."],
  ["poli", "poliment", "Après une voyelle, -ment s’ajoute au masculin."], ["absolu", "absolument", "Après une voyelle, -ment s’ajoute au masculin."],
  ["rapide", "rapidement", "Adjectif en -e : on ajoute -ment."], ["calme", "calmement", "Adjectif en -e : on ajoute -ment."],
  ["franc", "franchement", "Féminin franche + -ment."], ["long", "longuement", "Féminin longue + -ment."],
];
const PART: readonly (readonly [string, string, string])[] = [
  ["prudent", "prudemment", "Adjectif en -ent → adverbe en -emment."], ["évident", "évidemment", "-ent → -emment."],
  ["fréquent", "fréquemment", "-ent → -emment."], ["récent", "récemment", "-ent → -emment."], ["patient", "patiemment", "-ent → -emment."],
  ["courant", "couramment", "Adjectif en -ant → adverbe en -amment."], ["bruyant", "bruyamment", "-ant → -amment."],
  ["méchant", "méchamment", "-ant → -amment."], ["suffisant", "suffisamment", "-ant → -amment."], ["brillant", "brillamment", "-ant → -amment."],
  ["gentil", "gentiment", "Cas particulier : gentil → gentiment."], ["précis", "précisément", "Cas particulier : -ément (précisément)."],
  ["énorme", "énormément", "Cas particulier : -ément (énormément)."], ["profond", "profondément", "Cas particulier : -ément (profondément)."],
  ["aveugle", "aveuglément", "Cas particulier : -ément (aveuglément)."], ["gai", "gaiement", "Cas particulier : gaiement."],
];

function q(liste: typeof REG): Question {
  const [a, adv, r] = pick(liste);
  return saisie(`Forme l’adverbe en -ment à partir de l’adjectif <b>${a}</b>.`, adv, `${a} → ${adv}. ${r}`);
}

/** Formation des adverbes en -ment : cas réguliers, adjectifs en -ant/-ent, cas particuliers. */
export function gen(): Question {
  return tirer([() => q(REG), () => q(PART)]);
}
