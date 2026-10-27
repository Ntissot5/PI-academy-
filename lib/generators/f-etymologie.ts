import { pick } from "../math";
import { qcm, tirer } from "./f-outils";
import type { Question } from "./types";

/* Éléments grecs et latins : [élément, sens, exemples]. */
const EL: readonly (readonly [string, string, string])[] = [
  ["hydro-", "eau", "hydravion, hydrater"], ["bio-", "vie", "biologie, biographie"], ["géo-", "terre", "géographie, géologie"],
  ["-phobe", "qui craint, qui déteste", "claustrophobe, hydrophobe"], ["-logie", "science, étude", "biologie, zoologie"],
  ["chrono-", "temps", "chronomètre, chronologie"], ["-graphie", "écriture, description", "géographie, orthographe"],
  ["télé-", "loin", "téléphone, télescope"], ["micro-", "petit", "microscope, microbe"], ["thermo-", "chaleur", "thermomètre, thermos"],
  ["auto-", "soi-même", "autographe, automobile"], ["poly-", "plusieurs", "polygone, polyglotte"], ["-cide", "qui tue", "insecticide, pesticide"],
  ["-vore", "qui mange", "herbivore, carnivore"], ["aqua-", "eau", "aquarium, aquatique"], ["omni-", "tout", "omnivore, omniprésent"],
  ["-fère", "qui porte", "mammifère, conifère"], ["péd-", "enfant", "pédiatre, pédagogie"], ["zoo-", "animal", "zoologie, zoo"],
  ["photo-", "lumière", "photographie, photosynthèse"], ["phon-", "son, voix", "téléphone, microphone"],
];

function sens(): Question {
  const [e, s, ex] = pick(EL);
  return qcm(`Que signifie l’élément <b>${e}</b> (comme dans ${ex}) ?`, s, EL.map(([, x]) => x), `« ${e} » signifie « ${s} » : ${ex}.`);
}

/* Mots à deviner à partir de leurs éléments : [question, réponse, pièges, explication]. */
const MOTS: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Un animal qui mange de l’herbe est…", "herbivore", ["carnivore", "omnivore", "insectivore"], "herbi- (herbe) + -vore (qui mange)."],
  ["L’instrument qui mesure la chaleur est un…", "thermomètre", ["chronomètre", "baromètre", "kilomètre"], "thermo- (chaleur) + -mètre (mesure)."],
  ["L’instrument qui permet de voir les très petites choses est un…", "microscope", ["télescope", "périscope", "kaléidoscope"], "micro- (petit) + -scope (observer)."],
  ["La science qui étudie les êtres vivants est la…", "biologie", ["géologie", "zoologie", "chronologie"], "bio- (vie) + -logie (étude)."],
  ["Une personne qui parle plusieurs langues est…", "polyglotte", ["polygone", "monolingue", "polytechnicien"], "poly- (plusieurs) + -glotte (langue)."],
  ["Un produit qui tue les insectes est un…", "insecticide", ["insectivore", "herbicide", "fongicide"], "insecti- (insecte) + -cide (qui tue)."],
  ["Le récit de la vie de quelqu’un est une…", "biographie", ["géographie", "autographe", "bibliographie"], "bio- (vie) + -graphie (écriture)."],
  ["Le médecin des enfants est le…", "pédiatre", ["pédicure", "dentiste", "psychiatre"], "péd- (enfant) + -iatre (médecin)."],
];

function deviner(): Question {
  const [q, a, autres, why] = pick(MOTS);
  return qcm(q, a, autres, `« ${a} » : ${why}`);
}

/** Éléments d'origine grecque et latine ; étymologie. */
export function gen(): Question {
  return tirer([sens, sens, deviner]);
}
