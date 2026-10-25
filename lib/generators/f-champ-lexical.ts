import { pick } from "../math";
import { melange, qcm, tirer } from "./f-outils";
import type { Question } from "./types";

/* Champs lexicaux : [thème, mots]. */
const CHAMPS: readonly (readonly [string, readonly string[]])[] = [
  ["la météo", ["pluie", "grêle", "brouillard", "averse", "orage", "bruine", "éclaircie"]],
  ["la mer", ["vague", "marée", "plage", "écume", "coquillage", "phare", "voilier"]],
  ["l’école", ["cahier", "récréation", "maîtresse", "tableau", "classeur", "devoirs", "pupitre"]],
  ["la montagne", ["sommet", "glacier", "col", "versant", "alpage", "crête", "piolet"]],
  ["la cuisine", ["casserole", "recette", "four", "mijoter", "épluche-légumes", "louche", "émincer"]],
  ["le football", ["but", "gardien", "penalty", "arbitre", "corner", "tacle", "hors-jeu"]],
  ["la peur", ["frayeur", "trembler", "effroi", "angoisse", "terreur", "panique"]],
  ["la joie", ["bonheur", "rire", "sourire", "gaieté", "enthousiasme", "allégresse"]],
  ["le théâtre", ["scène", "rideau", "comédien", "décor", "réplique", "coulisses"]],
  ["la forêt", ["clairière", "sous-bois", "écureuil", "mousse", "champignon", "bûcheron"]],
  ["la santé", ["médecin", "fièvre", "ordonnance", "pharmacie", "guérir", "vaccin", "hôpital"]],
];

function intrus(): Question {
  const [t, mots] = pick(CHAMPS);
  const trois = melange(mots).slice(0, 3);
  const [t2, autres] = pick(CHAMPS.filter(([x]) => x !== t));
  const x = pick(autres);
  return qcm(`Quel mot n’appartient pas au même champ lexical que les autres ?`, x, trois, `${trois.join(", ")} appartiennent au champ lexical de ${t} ; « ${x} » appartient plutôt à celui de ${t2}.`);
}

function theme(): Question {
  const [t, mots] = pick(CHAMPS);
  const quatre = melange(mots).slice(0, 4);
  return qcm(`À quel champ lexical appartiennent ces mots : <b>${quatre.join(", ")}</b> ?`, t, CHAMPS.map(([x]) => x), `Tous ces mots se rapportent à ${t} : ils forment un champ lexical.`);
}

function appartient(): Question {
  const [t, mots] = pick(CHAMPS);
  const m = pick(mots);
  const autres = CHAMPS.filter(([x]) => x !== t).map(([, ms]) => pick(ms));
  return qcm(`Quel mot appartient au champ lexical de <b>${t}</b> ?`, m, autres, `« ${m} » se rapporte à ${t}.`);
}

/* Thème d'un court passage. */
const PASSAGES: readonly (readonly [string, string])[] = [
  ["Le ciel s’assombrit. Un éclair déchira les nuages, le tonnerre gronda et une averse s’abattit sur le village.", "l’orage"],
  ["Les vagues roulaient sur le sable ; au loin, un voilier glissait près du phare.", "la mer"],
  ["Il tremblait, le cœur battant ; une sueur froide coulait dans son dos et il n’osait plus bouger.", "la peur"],
  ["Le rideau se leva : les comédiens entrèrent sur la scène sous les applaudissements.", "le théâtre"],
  ["Elle éclata de rire, le visage rayonnant, et sauta dans les bras de son frère.", "la joie"],
];

function passage(): Question {
  const [p, t] = pick(PASSAGES);
  return qcm(`Quel est le champ lexical dominant de ce passage ? <b>${p}</b>`, t, ["l’orage", "la mer", "la peur", "le théâtre", "la joie", "la montagne"], `Les mots du passage se rapportent à ${t} : c’est le champ lexical dominant.`);
}

/** Champ lexical : regrouper les mots qui se rapportent à un même thème. */
export function gen(): Question {
  return tirer([intrus, intrus, theme, appartient, passage]);
}
