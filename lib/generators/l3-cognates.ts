import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// Faux amis : [mot anglais, vrai sens, faux sens (piège), autres leurres]
const FAUX: [string, string, string, string[]][] = [
  ["library", "une bibliothèque", "une librairie", ["une liberté"]], ["actually", "en fait", "actuellement", ["exactement"]],
  ["sensible", "raisonnable", "sensible (émotif)", ["sensationnel"]], ["eventually", "finalement", "éventuellement", ["évidemment"]],
  ["to attend", "assister à", "attendre", ["atteindre"]], ["a journey", "un voyage", "une journée", ["un journal"]],
  ["large", "grand", "large (pas étroit)", ["léger"]], ["a cave", "une grotte", "une cave", ["un caveau"]],
  ["to rest", "se reposer", "rester", ["retourner"]], ["a coin", "une pièce de monnaie", "un coin", ["un cône"]],
  ["a lecture", "une conférence, un cours", "une lecture", ["une lettre"]], ["to pass an exam", "réussir un examen", "passer (faire) un examen", ["rater un examen"]],
];
// Mots transparents : [anglais, français]
const TRANSP: [string, string][] = [
  ["information", "l’information"], ["important", "important"], ["animal", "l’animal"], ["family", "la famille"], ["music", "la musique"],
  ["history", "l’histoire"], ["dangerous", "dangereux"], ["television", "la télévision"], ["difficult", "difficile"], ["nature", "la nature"],
];
// Mots anglais venus du français et leurres d'autres origines
const DU_FR = ["restaurant", "ballet", "souvenir", "menu", "café", "garage", "déjà vu", "rendezvous"];
const AUTRES_EN: [string, string][] = [["kindergarten", "allemand"], ["pizza", "italien"], ["tsunami", "japonais"], ["kangaroo", "langue aborigène d’Australie"], ["robot", "tchèque"], ["yoghurt", "turc"]];
// Mots français venus de l'anglais
const DE_EN = ["le week-end", "le parking", "le sandwich", "le football", "le baby-sitter", "le shopping", "le jogging"];
const AUTRES_FR: [string, string][] = [["le hamster", "allemand"], ["la pizza", "italien"], ["le chocolat", "nahuatl, par l’espagnol"], ["le judo", "japonais"], ["l’algèbre", "arabe"]];

/** Approches interlinguistiques : faux amis, mots transparents, emprunts entre l'anglais et le français. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [en, vrai, piege, autres] = pick(FAUX);
    return {
      q: `Attention aux faux amis ! Que signifie <b>${en}</b> ?`,
      txt: 1,
      a: vrai,
      choices: propositions(vrai, [piege, ...autres]),
      why: `${en} = ${vrai}, pas « ${piege} ». Le mot ressemble au français, mais n’a pas le même sens : c’est un faux ami.`,
    };
  }
  if (t === 1) {
    const [en, fr] = pick(TRANSP);
    return {
      q: `Mot transparent : que signifie <b>${en}</b> ?`,
      txt: 1,
      a: fr,
      choices: propositions(fr, TRANSP.filter((x) => x[0] !== en).map((x) => x[1])),
      why: `${en} ressemble au français ${fr} : c’est un mot transparent, il vient souvent du latin comme le mot français.`,
    };
  }
  if (t === 2) {
    const mot = pick(DU_FR);
    return {
      q: "Lequel de ces mots anglais vient du français ?",
      txt: 1,
      a: mot,
      choices: propositions(mot, AUTRES_EN.map((x) => x[0])),
      why: `« ${mot} » est un mot français utilisé en anglais. Les autres viennent d’ailleurs (${AUTRES_EN.map((x) => `${x[0]} : ${x[1]}`).join(", ")}).`,
    };
  }
  const mot = pick(DE_EN);
  return {
    q: "Lequel de ces mots français vient de l’anglais ?",
    txt: 1,
    a: mot,
    choices: propositions(mot, AUTRES_FR.map((x) => x[0])),
    why: `${mot} vient de l’anglais. Les autres viennent d’ailleurs (${AUTRES_FR.map((x) => `${x[0]} : ${x[1]}`).join(", ")}).`,
  };
}
