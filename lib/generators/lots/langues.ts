import type { Lot } from "./types";
import { gen as l2LesenA } from "../l2-lesen-a";
import { gen as l2LesenB } from "../l2-lesen-b";
import { gen as l2LesenC } from "../l2-lesen-c";
import { gen as l2Wortschatz } from "../l2-wortschatz";
import { gen as l2Gegenteil } from "../l2-gegenteil";
import { gen as l2Komposita } from "../l2-komposita";
import { gen as l2Laute } from "../l2-laute";
import { gen as l2Vokale } from "../l2-vokale";
import { gen as l2Uhrzeit } from "../l2-uhrzeit";
import { gen as l2Modalverben } from "../l2-modalverben";
import { gen as l2Imperativ } from "../l2-imperativ";
import { gen as l2Trennbar } from "../l2-trennbar";
import { gen as l2Praeteritum } from "../l2-praeteritum";
import { gen as l2Plural } from "../l2-plural";
import { gen as l2Pronomen } from "../l2-pronomen";
import { gen as l2PronomenKasus } from "../l2-pronomen-kasus";
import { gen as l2Satzbau } from "../l2-satzbau";
import { gen as l2Nebensatz } from "../l2-nebensatz";
import { gen as l2Negation } from "../l2-negation";
import { gen as l2Wfragen } from "../l2-wfragen";
import { gen as l2Akkusativ } from "../l2-akkusativ";
import { gen as l2Dativ } from "../l2-dativ";
import { gen as l2Praepositionen } from "../l2-praepositionen";
import { gen as l2Wortarten } from "../l2-wortarten";
import { gen as l2Komparativ } from "../l2-komparativ";
import { gen as l2Interlingue } from "../l2-interlingue";
import { gen as l3ReadingA } from "../l3-reading-a";
import { gen as l3ReadingB } from "../l3-reading-b";
import { gen as l3Vocab } from "../l3-vocab";
import { gen as l3Capitals } from "../l3-capitals";
import { gen as l3Plurals } from "../l3-plurals";
import { gen as l3Sounds } from "../l3-sounds";
import { gen as l3Continuous } from "../l3-continuous";
import { gen as l3Imperative } from "../l3-imperative";
import { gen as l3CanDo } from "../l3-can-do";
import { gen as l3Past } from "../l3-past";
import { gen as l3Future } from "../l3-future";
import { gen as l3Perfect } from "../l3-perfect";
import { gen as l3Conditional } from "../l3-conditional";
import { gen as l3Modals } from "../l3-modals";
import { gen as l3Pronouns } from "../l3-pronouns";
import { gen as l3Determiners } from "../l3-determiners";
import { gen as l3Questions } from "../l3-questions";
import { gen as l3Comparatives } from "../l3-comparatives";
import { gen as l3Superlatives } from "../l3-superlatives";
import { gen as l3SomeAny } from "../l3-some-any";
import { gen as l3WordOrder } from "../l3-word-order";
import { gen as l3Possessive } from "../l3-possessive";
import { gen as l3Gerund } from "../l3-gerund";
import { gen as l3Prepositions } from "../l3-prepositions";
import { gen as l3Connectors } from "../l3-connectors";
import { gen as l3Passive } from "../l3-passive";
import { gen as l3WordClasses } from "../l3-word-classes";
import { gen as l3Cognates } from "../l3-cognates";

/** Lot « langues » : allemand (L2, 5e-11e) et anglais (L3, 7e-11e). Voir docs/COMPLETER-LE-PER.md. */
export const LOT: Lot = {
  "l2-lesen-a": { gen: l2LesenA, label: "Allemand · lire (5e-6e)", icon: "eye" },
  "l2-lesen-b": { gen: l2LesenB, label: "Allemand · lire (7e-8e)", icon: "eye" },
  "l2-lesen-c": { gen: l2LesenC, label: "Allemand · lire (9e-11e)", icon: "report" },
  "l2-wortschatz": { gen: l2Wortschatz, label: "Allemand · vocabulaire", icon: "note" },
  "l2-gegenteil": { gen: l2Gegenteil, label: "Allemand · contraires et familles", icon: "flower" },
  "l2-komposita": { gen: l2Komposita, label: "Allemand · mots composés", icon: "molecule" },
  "l2-laute": { gen: l2Laute, label: "Allemand · alphabet et sons", icon: "note" },
  "l2-vokale": { gen: l2Vokale, label: "Allemand · voyelles et accent", icon: "note" },
  "l2-uhrzeit": { gen: l2Uhrzeit, label: "Allemand · heure et calendrier", icon: "cal31" },
  "l2-modalverben": { gen: l2Modalverben, label: "Allemand · verbes de mode", icon: "mail" },
  "l2-imperativ": { gen: l2Imperativ, label: "Allemand · impératif", icon: "pin" },
  "l2-trennbar": { gen: l2Trennbar, label: "Allemand · verbes à particule", icon: "molecule" },
  "l2-praeteritum": { gen: l2Praeteritum, label: "Allemand · Präteritum et futur", icon: "cal31" },
  "l2-plural": { gen: l2Plural, label: "Allemand · pluriel", icon: "folder" },
  "l2-pronomen": { gen: l2Pronomen, label: "Allemand · er, sie, es", icon: "pin" },
  "l2-pronomen-kasus": { gen: l2PronomenKasus, label: "Allemand · mich, mir…", icon: "pin" },
  "l2-satzbau": { gen: l2Satzbau, label: "Allemand · place du verbe", icon: "plane" },
  "l2-nebensatz": { gen: l2Nebensatz, label: "Allemand · weil, dass, wenn", icon: "plane" },
  "l2-negation": { gen: l2Negation, label: "Allemand · nicht ou kein", icon: "eye" },
  "l2-wfragen": { gen: l2Wfragen, label: "Allemand · W-Fragen", icon: "mail" },
  "l2-akkusativ": { gen: l2Akkusativ, label: "Allemand · accusatif", icon: "folder" },
  "l2-dativ": { gen: l2Dativ, label: "Allemand · datif", icon: "folder" },
  "l2-praepositionen": { gen: l2Praepositionen, label: "Allemand · prépositions", icon: "pin" },
  "l2-wortarten": { gen: l2Wortarten, label: "Allemand · nature des mots", icon: "report" },
  "l2-komparativ": { gen: l2Komparativ, label: "Allemand · comparatif", icon: "star" },
  "l2-interlingue": { gen: l2Interlingue, label: "Allemand · entre les langues", icon: "plane" },
  "l3-reading-a": { gen: l3ReadingA, label: "Anglais · lire (7e-8e)", icon: "eye" },
  "l3-reading-b": { gen: l3ReadingB, label: "Anglais · lire (9e-11e)", icon: "report" },
  "l3-vocab": { gen: l3Vocab, label: "Anglais · vocabulaire", icon: "note" },
  "l3-capitals": { gen: l3Capitals, label: "Anglais · majuscules", icon: "eye" },
  "l3-plurals": { gen: l3Plurals, label: "Anglais · pluriels et contractions", icon: "folder" },
  "l3-sounds": { gen: l3Sounds, label: "Anglais · alphabet et sons", icon: "note" },
  "l3-continuous": { gen: l3Continuous, label: "Anglais · present continuous", icon: "laptop" },
  "l3-imperative": { gen: l3Imperative, label: "Anglais · impératif", icon: "pin" },
  "l3-can-do": { gen: l3CanDo, label: "Anglais · can et do", icon: "mail" },
  "l3-past": { gen: l3Past, label: "Anglais · past simple", icon: "cal31" },
  "l3-future": { gen: l3Future, label: "Anglais · going to et will", icon: "plane" },
  "l3-perfect": { gen: l3Perfect, label: "Anglais · present perfect", icon: "cal31" },
  "l3-conditional": { gen: l3Conditional, label: "Anglais · conditionnels", icon: "molecule" },
  "l3-modals": { gen: l3Modals, label: "Anglais · verbes modaux", icon: "mail" },
  "l3-pronouns": { gen: l3Pronouns, label: "Anglais · pronoms", icon: "pin" },
  "l3-determiners": { gen: l3Determiners, label: "Anglais · a/an, possessifs, this/that", icon: "folder" },
  "l3-questions": { gen: l3Questions, label: "Anglais · mots interrogatifs", icon: "mail" },
  "l3-comparatives": { gen: l3Comparatives, label: "Anglais · comparatif", icon: "star" },
  "l3-superlatives": { gen: l3Superlatives, label: "Anglais · superlatif", icon: "star" },
  "l3-some-any": { gen: l3SomeAny, label: "Anglais · some/any, much/many", icon: "flower" },
  "l3-word-order": { gen: l3WordOrder, label: "Anglais · ordre des mots", icon: "plane" },
  "l3-possessive": { gen: l3Possessive, label: "Anglais · génitif ’s", icon: "folder" },
  "l3-gerund": { gen: l3Gerund, label: "Anglais · -ing ou to", icon: "laptop" },
  "l3-prepositions": { gen: l3Prepositions, label: "Anglais · in, on, at", icon: "pin" },
  "l3-connectors": { gen: l3Connectors, label: "Anglais · connecteurs", icon: "molecule" },
  "l3-passive": { gen: l3Passive, label: "Anglais · passif", icon: "report" },
  "l3-word-classes": { gen: l3WordClasses, label: "Anglais · nature des mots", icon: "report" },
  "l3-cognates": { gen: l3Cognates, label: "Anglais · faux amis et emprunts", icon: "plane" },
};
