import { R, pick } from "../math";
import type { Question } from "./types";

export const KEYS_DE = ["ä", "ö", "ü"];
const PRON = ["ich", "du", "er", "wir", "ihr", "sie"] as const;

// Formes complètes, orthographe suisse (ss, jamais ß).
const VERBEN: Record<string, { fr: string; f: [string, string, string, string, string, string] }> = {
  sein: { fr: "être", f: ["bin", "bist", "ist", "sind", "seid", "sind"] },
  haben: { fr: "avoir", f: ["habe", "hast", "hat", "haben", "habt", "haben"] },
  machen: { fr: "faire", f: ["mache", "machst", "macht", "machen", "macht", "machen"] },
  spielen: { fr: "jouer", f: ["spiele", "spielst", "spielt", "spielen", "spielt", "spielen"] },
  wohnen: { fr: "habiter", f: ["wohne", "wohnst", "wohnt", "wohnen", "wohnt", "wohnen"] },
  lernen: { fr: "apprendre", f: ["lerne", "lernst", "lernt", "lernen", "lernt", "lernen"] },
  kaufen: { fr: "acheter", f: ["kaufe", "kaufst", "kauft", "kaufen", "kauft", "kaufen"] },
  gehen: { fr: "aller (à pied)", f: ["gehe", "gehst", "geht", "gehen", "geht", "gehen"] },
  kommen: { fr: "venir", f: ["komme", "kommst", "kommt", "kommen", "kommt", "kommen"] },
  arbeiten: { fr: "travailler", f: ["arbeite", "arbeitest", "arbeitet", "arbeiten", "arbeitet", "arbeiten"] },
  heissen: { fr: "s’appeler", f: ["heisse", "heisst", "heisst", "heissen", "heisst", "heissen"] },
  fahren: { fr: "aller (en véhicule)", f: ["fahre", "fährst", "fährt", "fahren", "fahrt", "fahren"] },
  schlafen: { fr: "dormir", f: ["schlafe", "schläfst", "schläft", "schlafen", "schlaft", "schlafen"] },
  lesen: { fr: "lire", f: ["lese", "liest", "liest", "lesen", "lest", "lesen"] },
  sehen: { fr: "voir", f: ["sehe", "siehst", "sieht", "sehen", "seht", "sehen"] },
  sprechen: { fr: "parler", f: ["spreche", "sprichst", "spricht", "sprechen", "sprecht", "sprechen"] },
  essen: { fr: "manger", f: ["esse", "isst", "isst", "essen", "esst", "essen"] },
  geben: { fr: "donner", f: ["gebe", "gibst", "gibt", "geben", "gebt", "geben"] },
  nehmen: { fr: "prendre", f: ["nehme", "nimmst", "nimmt", "nehmen", "nehmt", "nehmen"] },
  helfen: { fr: "aider", f: ["helfe", "hilfst", "hilft", "helfen", "helft", "helfen"] },
};

// Verbes forts : la voyelle change avec du et er/sie/es (fahren → fährt, sehen → sieht).
const STARK = new Set(["fahren", "schlafen", "lesen", "sehen", "sprechen", "essen", "geben", "nehmen", "helfen"]);

/** Präsens : conjuguer un verbe allemand fréquent. */
export function gen(): Question {
  const inf = pick(Object.keys(VERBEN));
  const v = VERBEN[inf];
  const p = R(0, 5);
  const pron = p === 2 ? pick(["er", "sie (elle)", "es"]) : p === 5 ? "sie (ils)" : PRON[p];
  const forme = v.f[p];
  const change = STARK.has(inf) && (p === 1 || p === 2);
  return {
    q: `Conjugue « ${inf} » (${v.fr}) au présent : <b>${pron} …</b>`,
    txt: 1,
    a: forme,
    accept: [`${pron.replace(/ \(.+\)/, "")} ${forme}`],
    keys: KEYS_DE,
    hint: "Écris seulement le verbe.",
    why: `${pron.replace(/ \(.+\)/, "")} ${forme}${change ? " : attention, la voyelle change avec du et er/sie/es." : "."}`,
  };
}
