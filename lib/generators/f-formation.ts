import { pick } from "../math";
import { deBanque, qcm, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* Décomposition : [mot, préfixe, radical, suffixe]. */
const DECO: readonly (readonly [string, string, string, string])[] = [
  ["incroyable", "in-", "croy", "-able"], ["démontable", "dé-", "mont", "-able"], ["réchauffement", "ré-", "chauff", "-ement"],
  ["enneigement", "en-", "neig", "-ement"], ["prénatal", "pré-", "nat", "-al"], ["malheureux", "mal-", "heur", "-eux"],
  ["incassable", "in-", "cass", "-able"], ["désagréable", "dés-", "agré", "-able"], ["illisible", "il-", "lis", "-ible"],
  ["invisible", "in-", "vis", "-ible"], ["impardonnable", "im-", "pardonn", "-able"],
];

function decomposer(): Question {
  const [m, p, r, s] = pick(DECO);
  const k = pick([0, 1, 2]);
  const lab = ["le préfixe", "le radical", "le suffixe"][k];
  const a = [p, r, s][k];
  const autres = k === 1 ? [p.replace("-", ""), s.replace("-", ""), m.slice(0, 3)] : k === 0 ? [r, s, "-" + m.slice(-3)] : [p, r, m.slice(0, 2) + "-"];
  return qcm(`Dans le mot <b>${m}</b>, quel est ${lab} ?`, a, autres, `${m} = ${p} (préfixe) + ${r} (radical) + ${s} (suffixe).`, "Le préfixe est au début, le suffixe à la fin, le radical porte le sens.");
}

const PREF: readonly Item[] = [
  ["Que signifie le préfixe dans *refaire* ?", "à nouveau", ["pas", "avant", "trop"], "re- = à nouveau, encore."],
  ["Que signifie le préfixe dans *impoli* ?", "le contraire, pas", ["à nouveau", "très", "avant"], "in-/im- = le contraire."],
  ["Que signifie le préfixe dans *préhistoire* ?", "avant", ["après", "contre", "à nouveau"], "pré- = avant."],
  ["Que signifie le préfixe dans *antivol* ?", "contre", ["avant", "avec", "sans"], "anti- = contre."],
  ["Que signifie le préfixe dans *démonter* ?", "défaire, le contraire", ["avant", "très", "ensemble"], "dé- = défaire, action contraire."],
  ["Que signifie le préfixe dans *surpeuplé* ?", "trop, au-dessus", ["sous", "pas", "avant"], "sur- = au-dessus, en excès."],
  ["Que signifie le préfixe dans *sous-marin* ?", "en dessous", ["au-dessus", "contre", "avant"], "sous- = en dessous."],
];
const SUFF: readonly Item[] = [
  ["Que signifie le suffixe dans *lavable* ?", "qu’on peut", ["petit", "personne qui", "action de"], "-able = qu’on peut (laver)."],
  ["Que signifie le suffixe dans *fillette* ?", "petit", ["personne qui", "qu’on peut", "métier"], "-ette = petit."],
  ["Que signifie le suffixe dans *nageur* ?", "personne qui fait l’action", ["petit", "qu’on peut", "lieu"], "-eur = celui ou celle qui (nage)."],
  ["Que signifie le suffixe dans *lavage* ?", "action de", ["petit", "qu’on peut", "personne qui"], "-age = action de (laver)."],
  ["Que signifie le suffixe dans *rougeâtre* ?", "un peu, presque", ["très", "petit", "qu’on peut"], "-âtre = qui tire sur (un peu rouge)."],
];
const COMPOSE: readonly Item[] = [
  ["Quel mot est un mot composé ?", "porte-monnaie", ["monnayer", "portier", "portable"], "« porte-monnaie » est formé de deux mots (porte + monnaie)."],
  ["Quel mot est un mot composé ?", "arc-en-ciel", ["céleste", "arcade", "ciel"], "« arc-en-ciel » est formé de plusieurs mots."],
  ["Quel mot est un mot composé ?", "chou-fleur", ["fleuriste", "fleurir", "choucroute"], "« chou-fleur » = chou + fleur."],
  ["Quel mot est un mot composé ?", "pomme de terre", ["pommier", "terrain", "terrestre"], "« pomme de terre » est composé de trois mots, même sans trait d’union."],
];
const FAMILLE: readonly Item[] = [
  ["Quel mot n’est pas de la famille de *odeur* ?", "ordure", ["odorat", "inodore", "odorant"], "odeur, odorat, inodore, odorant ont le même radical (od-/odor-) et un sens lié."],
  ["Quel mot n’est pas de la famille de *terre* ?", "terrible", ["terrain", "atterrir", "souterrain"], "« terrible » vient de « terreur », pas de « terre »."],
  ["Quel mot n’est pas de la famille de *mer* ?", "merci", ["marin", "maritime", "amerrir"], "marin, maritime, amerrir se rapportent à la mer."],
  ["Quel mot n’est pas de la famille de *chant* ?", "champion", ["chanter", "chanson", "enchanté"], "« champion » n’a rien à voir avec le chant."],
];

/** Formation des mots : préfixe, radical, suffixe ; mots composés ; familles. */
export function gen(): Question {
  return tirer([decomposer, decomposer, deBanque(PREF), deBanque(SUFF), deBanque(COMPOSE), deBanque(FAMILLE)]);
}
