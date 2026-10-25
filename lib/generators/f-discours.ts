import { pick } from "../math";
import { deBanque, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const TYPES = ["discours direct", "discours indirect", "discours indirect libre"];
const ID: readonly (readonly [string, string, string])[] = [
  ["Léa demanda : « Est-ce que tu viens ? »", "discours direct", "Les paroles sont rapportées telles quelles, entre guillemets, après les deux-points."],
  ["« Je suis fatigué », soupira Noé.", "discours direct", "Paroles exactes entre guillemets, avec un verbe de parole."],
  ["— Où vas-tu ? demanda sa mère.", "discours direct", "Le tiret marque le changement d’interlocuteur dans un dialogue."],
  ["Léa demanda si je venais.", "discours indirect", "Les paroles sont intégrées dans une subordonnée, sans guillemets ; pronoms et temps changent."],
  ["Noé dit qu’il était fatigué.", "discours indirect", "Subordonnée introduite par « que » après un verbe de parole."],
  ["Sa mère lui demanda où il allait.", "discours indirect", "Question rapportée dans une subordonnée interrogative indirecte."],
  ["Il regarda par la fenêtre. Demain, il partirait enfin ! Plus personne ne l’en empêcherait.", "discours indirect libre", "Les pensées du personnage sont rapportées sans verbe de parole ni guillemets, avec les temps du récit."],
];

function identifier(): Question {
  const [p, t, why] = pick(ID);
  return qcmFixe(`Comment les paroles sont-elles rapportées ? <b>${p}</b>`, t, TYPES, why);
}

/* Transformation au discours indirect. */
const TRANSFO: readonly Item[] = [
  ["Quelle phrase rapporte au discours indirect : *Lina dit : « Je suis contente. »* ?", "Lina dit qu’elle est contente.", ["Lina dit qu’elle était contente.", "Lina dit que je suis contente.", "Lina dit : elle est contente."], "« je » devient « elle » ; le verbe introducteur est au présent, le temps ne change pas."],
  ["Quelle phrase rapporte au discours indirect : *Paul a dit : « Je viendrai demain. »* ?", "Paul a dit qu’il viendrait le lendemain.", ["Paul a dit qu’il viendra demain.", "Paul a dit que je viendrai demain.", "Paul a dit s’il viendrait le lendemain."], "Après un verbe au passé : futur → conditionnel (futur du passé) ; « demain » → « le lendemain »."],
  ["Quelle phrase rapporte au discours indirect : *Elle m’a demandé : « As-tu faim ? »* ?", "Elle m’a demandé si j’avais faim.", ["Elle m’a demandé que j’avais faim.", "Elle m’a demandé si tu as faim.", "Elle m’a demandé : avais-je faim."], "Question totale → « si » ; « tu » → « je » ; présent → imparfait après un verbe au passé."],
  ["Quelle phrase rapporte au discours indirect : *Le maître dit : « Fermez vos livres. »* ?", "Le maître dit de fermer nos livres.", ["Le maître dit que fermez vos livres.", "Le maître dit si nous fermons nos livres.", "Le maître dit : fermer nos livres."], "Un ordre à l’impératif devient « de » + infinitif."],
  ["Quelle phrase rapporte au discours indirect : *Il demanda : « Où est la gare ? »* ?", "Il demanda où était la gare.", ["Il demanda où est-ce que la gare était.", "Il demanda si où était la gare.", "Il demanda : où était la gare."], "Question partielle : on garde le mot interrogatif « où » ; présent → imparfait."],
];

/** Paroles rapportées : discours direct, indirect, indirect libre. */
export function gen1(): Question {
  return tirer([identifier, deBanque(TRANSFO)]);
}

export function gen(): Question {
  return tirer([identifier, identifier, deBanque(TRANSFO)]);
}
