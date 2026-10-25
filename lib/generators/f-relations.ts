import { pick } from "../math";
import { deBanque, melange, qcm, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* Générique / spécifique. */
const GEN: readonly (readonly [string, readonly string[]])[] = [
  ["fleur", ["rose", "tulipe", "orchidée", "marguerite"]], ["arbre", ["sapin", "chêne", "érable", "bouleau"]],
  ["mammifère", ["chamois", "bouquetin", "marmotte", "renard"]], ["outil", ["marteau", "tournevis", "scie", "pince"]],
  ["sport", ["ski", "natation", "football", "hockey"]], ["métier", ["boulanger", "infirmière", "menuisier", "pompier"]],
  ["fromage", ["gruyère", "vacherin", "tomme", "raclette"]], ["poisson", ["truite", "perche", "brochet", "féra"]],
  ["céréale", ["blé", "orge", "seigle", "avoine"]], ["moyen de transport", ["train", "tram", "bateau", "téléphérique"]],
];

function generique(): Question {
  const [g, mots] = pick(GEN);
  const trois = melange(mots).slice(0, 3);
  return qcm(`Quel est le terme générique de : <b>${trois.join(", ")}</b> ?`, g, GEN.map(([x]) => x), `« ${g} » est le terme générique ; ${trois.join(", ")} sont des termes spécifiques.`);
}

function specifique(): Question {
  const [g, mots] = pick(GEN);
  const m = pick(mots);
  const autres = GEN.filter(([x]) => x !== g).map(([, ms]) => pick(ms));
  return qcm(`Quel mot est un terme spécifique de <b>${g}</b> ?`, m, autres, `« ${m} » est un terme spécifique ; « ${g} » est le terme générique qui le désigne.`);
}

/* Antonymes : [mot, contraire, type]. */
const ANT: readonly (readonly [string, string, "antonymie" | "complémentarité" | "réciprocité"])[] = [
  ["chaud", "froid", "antonymie"], ["grand", "petit", "antonymie"], ["rapide", "lent", "antonymie"], ["joyeux", "triste", "antonymie"],
  ["accepter", "refuser", "complémentarité"], ["présent", "absent", "complémentarité"], ["vivant", "mort", "complémentarité"], ["ouvert", "fermé", "complémentarité"],
  ["vendre", "acheter", "réciprocité"], ["prêter", "emprunter", "réciprocité"], ["donner", "recevoir", "réciprocité"], ["parent", "enfant", "réciprocité"],
];
const TYPE_WHY = {
  antonymie: "ils s’opposent sur une échelle : il y a des degrés entre les deux (tiède entre chaud et froid).",
  complémentarité: "l’un exclut l’autre, sans milieu : si on n’accepte pas, on refuse.",
  réciprocité: "les deux décrivent la même situation vue de deux côtés : si je vends, quelqu’un achète.",
};

function contraire(): Question {
  const [m, c] = pick(ANT);
  return qcm(`Quel est le contraire de <b>${m}</b> ?`, c, ANT.filter((x) => x[1] !== c).map((x) => x[1]), `« ${m} » ≠ « ${c} ».`);
}

function typeContraire(): Question {
  const [m, c, t] = pick(ANT);
  return qcmFixe(`Quelle relation unit <b>${m}</b> et <b>${c}</b> ?`, t, ["antonymie", "complémentarité", "réciprocité"], `${t[0].toUpperCase() + t.slice(1)} : ${TYPE_WHY[t]}`);
}

/* Synonymes selon le contexte. */
const SYN: readonly Item[] = [
  ["Une situation *dangereuse* : quel synonyme convient ?", "périlleuse", ["paisible", "rassurante", "drôle"], "Une situation dangereuse = périlleuse. Mais un homme dangereux n’est pas « périlleux » : le synonyme dépend du contexte."],
  ["Un élève *brillant* : quel synonyme convient ?", "doué", ["lumineux", "étincelant", "ciré"], "Pour un élève, « brillant » veut dire doué ; « lumineux » conviendrait pour une étoile."],
  ["Une *grosse* pluie : quel synonyme convient ?", "forte", ["obèse", "épaisse", "grasse"], "Pour la pluie, « grosse » = forte."],
  ["Un *vieux* château : quel synonyme convient ?", "ancien", ["âgé", "usé", "vieilli"], "Pour un bâtiment, on dit « ancien » ; « âgé » s’emploie pour une personne."],
  ["Un *grand* homme (célèbre pour ses actions) : quel synonyme convient ?", "illustre", ["haut", "long", "immense"], "Placé avant le nom, « grand homme » veut dire célèbre, illustre."],
  ["Elle *fait* un gâteau : quel synonyme convient ?", "prépare", ["fabrique", "construit", "produit"], "Pour un gâteau, « faire » = préparer."],
  ["Il *dit* un poème : quel synonyme convient ?", "récite", ["raconte", "bavarde", "annonce"], "On récite un poème appris par cœur."],
  ["Un temps *doux* : quel synonyme convient ?", "agréable", ["sucré", "tendre", "moelleux"], "Pour la météo, « doux » = agréable, pas trop froid."],
];

/* Suite logique dans un champ lexical. */
const SUITES: readonly (readonly string[])[] = [
  ["naître", "grandir", "vieillir", "mourir"], ["semer", "germer", "fleurir", "récolter"], ["aube", "matin", "midi", "soir"],
  ["bourgeon", "fleur", "fruit"], ["œuf", "têtard", "grenouille"], ["enfance", "adolescence", "âge adulte", "vieillesse"],
];

function suite(): Question {
  const s = pick(SUITES);
  const k = pick([0, s.length - 1]);
  return qcm(`Ces mots forment une suite logique : <b>${melange(s).join(", ")}</b>. Lequel vient en ${k === 0 ? "premier" : "dernier"} ?`, s[k], s, `Dans l’ordre : ${s.join(" → ")}.`);
}

/** Relations entre les mots : générique/spécifique, contraires, synonymes selon le contexte, suites logiques. */
export function gen(): Question {
  return tirer([generique, specifique, contraire, typeContraire, deBanque(SYN), deBanque(SYN), suite]);
}
