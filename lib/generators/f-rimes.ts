import { pick } from "../math";
import { melange, qcm, tirer } from "./f-outils";
import type { Question } from "./types";

/* Familles de rimes : [son final écrit comme à l'école, mots qui finissent par ce son]. */
const RIMES: readonly (readonly [string, readonly string[]])[] = [
  ["o", ["chapeau", "bateau", "gâteau", "vélo", "moto", "robot", "domino", "château", "rideau", "cadeau", "lavabo"]],
  ["on", ["mouton", "ballon", "cochon", "citron", "maison", "poisson", "savon", "crayon", "melon", "camion"]],
  ["in", ["lapin", "sapin", "jardin", "matin", "pain", "train", "main", "bain", "raisin", "chemin"]],
  ["ou", ["hibou", "loup", "chou", "genou", "bisou", "kangourou", "caillou", "bijou"]],
  ["i", ["souris", "tapis", "radis", "lit", "nid", "ami", "kiwi", "midi", "riz", "salami"]],
  ["a", ["chat", "rat", "chocolat", "sofa", "cinéma", "pyjama", "panda", "avocat", "lilas"]],
  ["é", ["café", "nez", "clé", "été", "bébé", "fée", "épée", "canapé", "pied", "dé"]],
  ["an", ["éléphant", "enfant", "dent", "serpent", "maman", "ruban", "banc", "vent", "gant", "volcan"]],
  ["eu", ["feu", "jeu", "cheveu", "neveu", "bleu", "peu"]],
  ["ar", ["canard", "renard", "épinard", "homard", "brouillard", "foulard"]],
];

/** Quel mot rime avec… ? */
function rimeAvec(): Question {
  const [son, mots] = pick(RIMES);
  const [cible, bon] = melange(mots);
  const autres = melange(RIMES.filter(([s]) => s !== son)).slice(0, 2).map(([, m]) => pick(m));
  return qcm(
    `Quel mot rime avec <b>${cible}</b> ?`,
    bon,
    autres,
    `« ${cible} » et « ${bon} » finissent par le même son : « ${son} ».`,
    "Dis les mots à voix haute et écoute la fin.",
    3,
  );
}

/** Quel mot ne rime pas ? */
function intrus(): Question {
  const [son, mots] = pick(RIMES);
  const trois = melange(mots).slice(0, 3);
  const [autreSon, autres] = pick(RIMES.filter(([s]) => s !== son));
  const x = pick(autres);
  return qcm(
    `Quel mot ne rime pas avec les autres ?`,
    x,
    trois,
    `${trois.map((m) => `« ${m} »`).join(", ")} finissent par « ${son} » ; « ${x} » finit par « ${autreSon} ».`,
    undefined,
    4,
  );
}

/** Quel son entends-tu à la fin ? */
function sonFinal(): Question {
  const [son, mots] = pick(RIMES);
  const [m1, m2] = melange(mots);
  const autres = melange(RIMES.filter(([s]) => s !== son)).slice(0, 3).map(([s]) => s);
  return qcm(
    `Quel son entends-tu à la fin de <b>${m1}</b> et de <b>${m2}</b> ?`,
    son,
    autres,
    `On entend « ${son} » à la fin des deux mots : ils riment.`,
  );
}

/** Rimes : jeux avec les sons de fin de mot (comptines, poèmes). */
export function gen(): Question {
  return tirer([rimeAvec, rimeAvec, intrus, sonFinal]);
}
