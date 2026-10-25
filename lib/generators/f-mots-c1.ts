import { pick } from "../math";
import { melange, qcm, tirer } from "./f-outils";
import type { Question } from "./types";

/* Terme générique : [générique, mots spécifiques]. */
const GEN: readonly (readonly [string, readonly string[]])[] = [
  ["des animaux", ["chat", "chien", "vache", "cochon", "lapin"]], ["des fruits", ["pomme", "poire", "cerise", "banane", "fraise"]],
  ["des légumes", ["carotte", "poireau", "salade", "haricot", "courgette"]], ["des vêtements", ["pull", "pantalon", "jupe", "chemise", "veste"]],
  ["des fleurs", ["rose", "tulipe", "marguerite", "pâquerette", "jonquille"]], ["des couleurs", ["rouge", "bleu", "vert", "jaune", "violet"]],
  ["des meubles", ["table", "chaise", "armoire", "lit", "canapé"]], ["des véhicules", ["voiture", "camion", "bus", "tracteur", "moto"]],
  ["des instruments de musique", ["piano", "flûte", "violon", "guitare", "tambour"]], ["des oiseaux", ["merle", "moineau", "pigeon", "corbeau", "mésange"]],
];

function generique(): Question {
  const [g, mots] = pick(GEN);
  const trois = melange(mots).slice(0, 3);
  return qcm(`Quel mot peut remplacer tous ces mots : <b>${trois.join(", ")}</b> ?`, g, GEN.map(([x]) => x), `${trois.join(", ")} sont ${g}.`);
}

function intrus(): Question {
  const [g, mots] = pick(GEN);
  const trois = melange(mots).slice(0, 3);
  const [g2, autres] = pick(GEN.filter(([x]) => x !== g));
  const x = pick(autres);
  return qcm("Quel mot n’est pas de la même catégorie que les autres ?", x, trois, `${trois.join(", ")} sont ${g} ; « ${x} » fait partie ${g2}.`, undefined, 4);
}

/* Contraires et mots de sens proche : [mot, contraire, sens proche]. */
const SENS: readonly (readonly [string, string, string])[] = [
  ["grand", "petit", "immense"], ["content", "triste", "joyeux"], ["monter", "descendre", "grimper"], ["chaud", "froid", "brûlant"],
  ["gentil", "méchant", "aimable"], ["fort", "faible", "puissant"], ["commencer", "finir", "débuter"], ["rire", "pleurer", "rigoler"],
  ["beau", "laid", "joli"], ["plein", "vide", "rempli"], ["entrer", "sortir", "pénétrer"], ["peur", "courage", "frayeur"],
  ["vite", "lentement", "rapidement"],
];

function contraire(): Question {
  const [m, c] = pick(SENS);
  return qcm(`Quel est le contraire de <b>${m}</b> ?`, c, SENS.filter((x) => x[1] !== c).map((x) => x[1]), `« ${c} » est le contraire de « ${m} ».`, undefined, 3);
}

function proche(): Question {
  const [m, c, p] = pick(SENS);
  return qcm(`Quel mot a un sens proche de <b>${m}</b> ?`, p, [c, ...SENS.filter((x) => x[2] !== p).map((x) => x[2])].slice(0, 3), `« ${p} » veut dire presque la même chose que « ${m} ». « ${c} » est son contraire.`, undefined, 3);
}

/* Familles de mots : [famille, intrus qui lui ressemble]. */
const FAMILLES: readonly (readonly [readonly string[], string])[] = [
  [["chant", "chanter", "chanteur", "chanson"], "champ"], [["dent", "dentiste", "dentifrice"], "danse"], [["lait", "laitier", "laiterie"], "laid"],
  [["fleur", "fleuriste", "fleurir"], "flûte"], [["neige", "neiger", "enneigé"], "nuage"], [["terre", "terrain", "enterrer"], "tirer"],
  [["jardin", "jardinier", "jardiner"], "jarre"], [["jouer", "joueur", "jouet"], "jour"], [["mer", "marin", "maritime"], "mare"],
];

function famille(): Question {
  const [fam, x] = pick(FAMILLES);
  const trois = melange(fam).slice(0, 3);
  return qcm("Quel mot n’est pas de la même famille ?", x, trois, `${trois.join(", ")} sont de la même famille (même radical, sens lié). « ${x} » se ressemble, mais n’a pas le même sens.`, undefined, 4);
}

/* Mots dérivés : [question, réponse, pièges, explication]. */
const DERIVES: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Une petite maison, c’est une…", "maisonnette", ["maisonnier", "maisonnage"], "Le suffixe -ette veut dire « petit »."],
  ["Une personne qui joue, c’est un…", "joueur", ["jouet", "jouage"], "Le suffixe -eur indique la personne qui fait l’action."],
  ["Jouer encore une fois, c’est…", "rejouer", ["déjouer", "jouet"], "Le préfixe re- veut dire « encore une fois »."],
  ["Un petit garçon, c’est un…", "garçonnet", ["garçonnier", "garçonnage"], "Le suffixe -et veut dire « petit »."],
  ["La personne qui vend des fleurs, c’est le…", "fleuriste", ["fleuron", "fleurage"], "Le suffixe -iste indique souvent un métier."],
  ["La personne qui travaille au jardin, c’est le…", "jardinier", ["jardinet", "jardinage"], "Le suffixe -ier indique souvent un métier."],
];

function derive(): Question {
  const [q, a, faux, why] = pick(DERIVES);
  return qcm(q, a, faux, why, undefined, 3);
}

/** Vocabulaire au cycle 1 : catégories, familles de mots, contraires, sens proches. */
export function gen(): Question {
  return tirer([generique, intrus, contraire, proche, famille, derive]);
}
