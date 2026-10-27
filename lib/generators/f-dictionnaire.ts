import { R, pick } from "../math";
import { futur, imparfait, present, pronom, TOUS_VERBES, type Personne } from "./data/verbes-fr";
import { qcm, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/** Un verbe conjugué se cherche à l'infinitif. */
function verbe(): Question {
  const v = pick(TOUS_VERBES);
  const p = R(0, 5) as Personne;
  const forme = pick([present, imparfait, futur])(v)[p];
  const pr = pronom(p, forme);
  return saisie(
    `Sous quel mot cherches-tu <b>${pr}${forme}</b> dans le dictionnaire ?`,
    v,
    `Un verbe conjugué se cherche à l’infinitif : « ${pr}${forme} » → « ${v} ».`,
    forme === "suis" ? ["suivre"] : [],
    "Écris l’infinitif du verbe.",
  );
}

/* Noms et adjectifs : [forme rencontrée, entrée du dictionnaire, nom ou adjectif]. */
const NOMS: readonly (readonly [string, string])[] = [
  ["chevaux", "cheval"], ["journaux", "journal"], ["animaux", "animal"], ["travaux", "travail"], ["cailloux", "caillou"],
  ["bijoux", "bijou"], ["genoux", "genou"], ["hiboux", "hibou"], ["bateaux", "bateau"], ["jeux", "jeu"], ["feux", "feu"],
];
const ADJ: readonly (readonly [string, string])[] = [
  ["belles", "beau"], ["nouvelle", "nouveau"], ["heureuse", "heureux"], ["gentille", "gentil"], ["vieille", "vieux"],
  ["longues", "long"], ["douces", "doux"], ["sèches", "sec"], ["grosses", "gros"], ["fraîche", "frais"], ["sportives", "sportif"],
  ["blanches", "blanc"], ["joyeuses", "joyeux"], ["fausse", "faux"], ["neuve", "neuf"],
];

function forme(): Question {
  const adj = Math.random() < 0.55;
  const [f, e] = pick(adj ? ADJ : NOMS);
  return saisie(
    `Sous quel mot cherches-tu <b>${f}</b> dans le dictionnaire ?`,
    e,
    adj
      ? `Un adjectif se cherche au masculin singulier : « ${f} » → « ${e} ».`
      : `Un nom se cherche au singulier : « ${f} » → « ${e} ».`,
    [],
    adj ? "Écris le mot au masculin singulier." : "Écris le mot au singulier.",
  );
}

const ABR: readonly (readonly [string, string])[] = [
  ["n. m.", "nom masculin"], ["n. f.", "nom féminin"], ["adj.", "adjectif"], ["v.", "verbe"], ["adv.", "adverbe"],
  ["prép.", "préposition"], ["syn.", "synonyme"], ["contr.", "contraire"], ["pl.", "pluriel"],
];

function abreviation(): Question {
  const [ab, sens] = pick(ABR);
  return qcm(
    `Dans un dictionnaire, que signifie l’abréviation <b>${ab}</b> ?`,
    sens,
    ABR.map(([, s]) => s),
    `« ${ab} » veut dire « ${sens} ». Les abréviations expliquées au début du dictionnaire font gagner de la place.`,
  );
}

/* Définitions construites sur le modèle « terme générique + précisions » : [mot, générique, suite, autres génériques]. */
const DEFS: readonly (readonly [string, string, string, readonly string[]])[] = [
  ["Une tulipe", "une fleur", "à bulbe, aux couleurs vives, qui fleurit au printemps", ["un arbre", "un légume", "un fruit"]],
  ["Un marteau", "un outil", "formé d’un manche et d’une tête en métal, qui sert à enfoncer des clous", ["un meuble", "un instrument de musique", "un véhicule"]],
  ["Un sapin", "un arbre", "aux aiguilles toujours vertes", ["une fleur", "un légume", "un champignon"]],
  ["Un piano", "un instrument de musique", "à cordes et à clavier", ["un outil", "un meuble de cuisine", "un véhicule"]],
  ["Un moineau", "un oiseau", "petit, au plumage brun et gris, très commun dans les villes", ["un poisson", "un insecte", "un mammifère"]],
  ["Une carotte", "un légume", "de couleur orange, dont on mange la racine", ["un fruit", "une fleur", "un arbre"]],
  ["Une cerise", "un fruit", "petit et rouge, avec un noyau", ["un légume", "une fleur", "une céréale"]],
  ["Un autobus", "un véhicule", "qui transporte de nombreux voyageurs dans une ville", ["un bâtiment", "un outil", "un meuble"]],
  ["Une chemise", "un vêtement", "à manches et à col, qui se boutonne devant", ["un meuble", "un outil", "une chaussure"]],
  ["Une armoire", "un meuble", "haut, fermé par des portes, où l’on range le linge", ["un vêtement", "un outil", "un véhicule"]],
  ["Une truite", "un poisson", "qui vit dans les rivières et les lacs", ["un oiseau", "un insecte", "un reptile"]],
  ["Une fourmi", "un insecte", "qui vit en colonie dans une fourmilière", ["un oiseau", "un poisson", "un mammifère"]],
  ["Une vache", "un mammifère", "ruminant, élevé pour son lait et sa viande", ["un oiseau", "un insecte", "un poisson"]],
  ["Le football", "un sport", "où deux équipes essaient d’envoyer un ballon dans le but adverse, sans utiliser les mains", ["un jeu de cartes", "un instrument", "un métier"]],
  ["Un boulanger", "une personne", "dont le métier est de faire et de vendre du pain", ["un outil", "un magasin", "un animal"]],
];

function definition(): Question {
  const [mot, gen, suite, autres] = pick(DEFS);
  return qcm(
    `Complète la définition : « <b>${mot}</b> est … ${suite}. »`,
    gen,
    autres,
    `Une bonne définition commence par un terme générique (« ${gen} »), puis donne des précisions qui distinguent le mot des autres.`,
    "Cherche la catégorie à laquelle appartient le mot.",
  );
}

/** Le dictionnaire : forme de base des mots, abréviations, définitions. */
export function gen(): Question {
  return tirer([verbe, verbe, forme, forme, abreviation, definition, definition]);
}
