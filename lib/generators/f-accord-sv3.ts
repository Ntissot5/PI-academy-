import { pick } from "../math";
import { deBanque, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ITEMS: readonly Item[] = [
  ["La foule *…* les coureurs.", "applaudit", ["applaudissent", "applaudis"], "Un nom collectif seul (la foule) : le verbe est au singulier."],
  ["Le troupeau *…* la route.", "traverse", ["traversent", "traverses"], "« Le troupeau » est un nom collectif singulier : traverse."],
  ["Le public *…* le spectacle.", "adore", ["adorent", "adores"], "Nom collectif seul : singulier."],
  ["Beaucoup de gens *…* que l’hiver sera froid.", "pensent", ["pense", "penses"], "Avec « beaucoup de », le verbe s’accorde avec le nom qui suit (gens) : pluriel."],
  ["Peu d’élèves *…* cet exercice.", "ont réussi", ["a réussi", "as réussi"], "Avec « peu de », le verbe s’accorde avec le nom qui suit : pluriel."],
  ["La plupart des invités *…* partis.", "sont", ["est", "es"], "Avec « la plupart », le verbe se met au pluriel."],
  ["Plus d’un élève *…* oublié son sac.", "a", ["ont", "as"], "Avec « plus d’un », le verbe reste en général au singulier."],
  ["Chacun *…* ses affaires.", "range", ["rangent", "ranges"], "« Chacun » est singulier."],
  ["Tout le monde *…* là.", "est", ["sont", "es"], "« Tout le monde » est singulier."],
  ["Personne ne *…* la réponse.", "sait", ["savent", "sais"], "« Personne » est singulier."],
  ["Beaucoup *…* venus à la fête.", "sont", ["est", "es"], "« Beaucoup » employé seul (beaucoup de personnes) : pluriel."],
  ["Moins de deux semaines *…* depuis son départ.", "se sont écoulées", ["s’est écoulée", "s’est écoulé"], "Le verbe s’accorde avec « semaines » : pluriel."],
];

/** Nom collectif suivi d'un complément : les deux accords sont possibles. */
function deuxAccords(): Question {
  const [s, v1, v2] = pick([
    ["Une foule de touristes", "visite", "visitent"], ["Une nuée d’oiseaux", "s’envole", "s’envolent"], ["Un groupe d’élèves", "chante", "chantent"],
    ["Une dizaine de vaches", "broute", "broutent"],
  ] as const);
  return qcmFixe(
    `« ${s} ${v1} / ${v2} … » : quel accord est correct ?`,
    "les deux",
    [`seulement « ${v1} »`, `seulement « ${v2} »`, "les deux"],
    `Avec un nom collectif suivi d’un complément au pluriel, on accorde selon ce qu’on veut mettre en valeur : l’ensemble (${v1}) ou les éléments (${v2}).`,
  );
}

/** Accord sujet-verbe : noms collectifs, déterminants et pronoms de quantité. */
export function gen(): Question {
  return tirer([deBanque(ITEMS, "Choisis la bonne forme : "), deBanque(ITEMS, "Choisis la bonne forme : "), deBanque(ITEMS, "Choisis la bonne forme : "), deuxAccords]);
}
