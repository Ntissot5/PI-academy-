import { pick } from "../math";
import { deBanque, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const TYPES = ["une opinion", "un argument", "un exemple", "un constat"];
/* Dans un texte sur la piscine du quartier : [phrase, type, explication]. */
const PH: readonly (readonly [string, string, string])[] = [
  ["Je pense que notre commune doit construire une piscine couverte.", "une opinion", "« Je pense que … » : c’est la position défendue."],
  ["À mon avis, les devoirs du week-end sont inutiles.", "une opinion", "« À mon avis » introduit l’opinion."],
  ["Une piscine permettrait aux enfants d’apprendre à nager toute l’année.", "un argument", "Une raison qui soutient l’opinion."],
  ["Le sport aide à rester en bonne santé.", "un argument", "Une raison générale pour défendre la piscine."],
  ["Par exemple, à Fribourg, la nouvelle piscine accueille chaque jour des classes.", "un exemple", "« Par exemple » : un cas précis qui illustre l’argument."],
  ["Ainsi, ma cousine a appris à nager en un mois grâce aux cours du mercredi.", "un exemple", "Un cas concret qui illustre."],
  ["La piscine actuelle ferme chaque année en septembre.", "un constat", "Un fait vérifiable, sans prise de position."],
  ["Notre commune compte trois écoles primaires.", "un constat", "Un fait, ni vrai ni faux selon l’avis de chacun."],
];

function type(): Question {
  const [p, t, why] = pick(PH);
  return qcmFixe(`Dans une lettre de lecteur, cette phrase est-elle une opinion, un argument, un exemple ou un constat ? <b>${p}</b>`, t, TYPES, why);
}

const STRUCT: readonly Item[] = [
  ["Dans un texte argumentatif, la partie qui présente le sujet et l’opinion défendue est…", "l’introduction", ["la conclusion", "l’exemple", "l’objection"], "L’introduction annonce le sujet (la controverse) et la thèse."],
  ["Dans un texte argumentatif, la partie qui résume et réaffirme la position est…", "la conclusion", ["l’introduction", "l’argument", "le constat"], "La conclusion rappelle l’opinion, souvent avec « finalement », « c’est pourquoi »."],
  ["*Certains diront que la piscine coûte trop cher. Pourtant, …* Que fait l’auteur ?", "Il répond à une objection.", ["Il donne un exemple.", "Il conclut.", "Il présente le sujet."], "Il cite le point de vue opposé pour le réfuter."],
  ["*Bien sûr, la piscine coûte cher, mais elle servira à toute la région.* Quel procédé reconnais-tu ?", "une concession suivie d’une réfutation", ["un exemple", "une conclusion", "un constat"], "On admet un point (concession), puis on le dépasse (« mais »)."],
  ["Quel organisateur introduit souvent un argument d’opposition ?", "en revanche", ["tout d’abord", "par exemple", "premièrement"], "« en revanche » marque une opposition."],
  ["Quelle formule de politesse convient pour terminer une lettre au courrier des lecteurs ?", "Je vous prie d’agréer mes salutations distinguées.", ["Salut, à plus !", "Bisous !", "Il était une fois."], "Dans une lettre officielle, on termine par une formule de politesse."],
  ["Quel est le sujet de la controverse dans *Faut-il interdire les téléphones portables à l’école ?*", "l’interdiction des téléphones à l’école", ["la marque des téléphones", "le prix des forfaits", "l’histoire du téléphone"], "Le sujet est la question débattue."],
];

/** Le texte qui argumente : opinion, arguments, exemples, constats, structure, objections. */
export function gen(): Question {
  return tirer([type, type, deBanque(STRUCT)]);
}
