import { pick } from "../math";
import { qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

/* [phrase, passive ?, explication]. */
const PHRASES: readonly (readonly [string, boolean, string])[] = [
  ["Le match a été gagné par l’équipe de Sion.", true, "Le sujet « le match » subit l’action ; l’auteur de l’action est introduit par « par »."],
  ["La lettre est écrite par Inès.", true, "« La lettre » subit l’action d’écrire ; « par Inès » est le complément d’agent."],
  ["Le village sera traversé par le cortège.", true, "« Le village » subit l’action ; « être » au futur + participe passé accordé."],
  ["Les pommes ont été cueillies par les enfants.", true, "« Les pommes » subissent l’action ; le participe « cueillies » s’accorde avec le sujet."],
  ["Ce château fut construit au XIII<sup>e</sup> siècle.", true, "Le château subit l’action de construire ; le complément d’agent n’est pas exprimé."],
  ["Le voleur a été arrêté par la police.", true, "« Le voleur » subit l’action ; « par la police » est le complément d’agent."],
  ["Les invités sont accueillis par le directeur.", true, "Les invités subissent l’action d’accueillir, faite par le directeur."],
  ["Elle est partie tôt.", false, "« Partir » se conjugue avec « être » au passé composé, mais le sujet fait l’action : forme active."],
  ["Les invités sont arrivés.", false, "Passé composé de « arriver » avec l’auxiliaire « être » : le sujet fait l’action, la phrase est active."],
  ["Il est tombé dans l’escalier.", false, "Passé composé de « tomber » : forme active, même avec l’auxiliaire « être »."],
  ["La police a arrêté le voleur.", false, "Le sujet « la police » fait l’action : forme active."],
  ["Les enfants cueillent des pommes.", false, "Le sujet « les enfants » fait l’action : forme active."],
  ["Mon frère est content de son vélo.", false, "« Content » est un adjectif attribut : il n’y a pas d’action subie. Forme active."],
];

function identifier(): Question {
  const [p, pass, why] = pick(PHRASES);
  return qcmFixe(`Cette phrase est-elle à la forme active ou passive ? <b>${p}</b>`, pass ? "passive" : "active", ["active", "passive"], why, "Le sujet fait-il l’action ou la subit-il ?");
}

/* [phrase passive, complément d'agent, autres groupes]. */
const AGENT: readonly (readonly [string, string, readonly string[]])[] = [
  ["Le gâteau a été préparé par Mamie.", "par Mamie", ["le gâteau", "a été préparé"]],
  ["Les chamois sont observés par les gardes-faune.", "par les gardes-faune", ["les chamois", "sont observés"]],
  ["Ce tableau a été peint par une jeune artiste.", "par une jeune artiste", ["ce tableau", "a été peint"]],
  ["La route est bloquée par la neige depuis hier.", "par la neige", ["depuis hier", "la route"]],
  ["Le spectacle sera présenté par les élèves de 10<sup>e</sup>.", "par les élèves de 10<sup>e</sup>", ["le spectacle", "sera présenté"]],
];

function agent(): Question {
  const [p, a, autres] = pick(AGENT);
  return qcm(`Quel est le complément d’agent dans cette phrase ? <b>${p}</b>`, a, autres, `« ${a} » désigne qui fait l’action : c’est le complément d’agent, introduit par « par ».`);
}

/* [phrase active, phrase passive, pièges, explication]. */
const TRANSFO: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Le chat attrape la souris.", "La souris est attrapée par le chat.", ["La souris a été attrapée par le chat.", "Le chat est attrapé par la souris.", "La souris attrape le chat."], "Le verbe est au présent : « être » au présent + participe passé accordé avec « la souris »."],
  ["Les élèves ont préparé le spectacle.", "Le spectacle a été préparé par les élèves.", ["Le spectacle est préparé par les élèves.", "Le spectacle était préparé par les élèves.", "Les élèves ont été préparés par le spectacle."], "Le verbe est au passé composé : « être » au passé composé (a été) + participe passé."],
  ["Le vent emportera les feuilles.", "Les feuilles seront emportées par le vent.", ["Les feuilles sont emportées par le vent.", "Les feuilles seront emportés par le vent.", "Le vent sera emporté par les feuilles."], "Le verbe est au futur : « être » au futur (seront) + participe passé accordé au féminin pluriel."],
  ["Un orage détruisait les récoltes.", "Les récoltes étaient détruites par un orage.", ["Les récoltes ont été détruites par un orage.", "Les récoltes étaient détruits par un orage.", "Les récoltes sont détruites par un orage."], "Le verbe est à l’imparfait : « être » à l’imparfait (étaient) + participe passé accordé."],
  ["La directrice félicite Paul.", "Paul est félicité par la directrice.", ["Paul a été félicité par la directrice.", "La directrice est félicitée par Paul.", "Paul est félicitée par la directrice."], "Présent : « est félicité », accordé avec le nouveau sujet « Paul »."],
];

function transformer(): Question {
  const [act, pass, faux, why] = pick(TRANSFO);
  return qcm(`Quelle phrase est la forme passive de <b>${act}</b> ?`, pass, faux, `Le complément du verbe devient sujet, le sujet devient complément d’agent. ${why}`);
}

/** La forme passive : identifier, trouver le complément d'agent, transformer. */
export function gen(): Question {
  return tirer([identifier, identifier, agent, transformer, transformer]);
}
