import { R, pick } from "../math";
import type { Question } from "./types";

// [infinitif, traduction, participe, auxiliaire]
const V: [string, string, string, "haben" | "sein"][] = [
  ["machen", "faire", "gemacht", "haben"], ["spielen", "jouer", "gespielt", "haben"], ["lernen", "apprendre", "gelernt", "haben"],
  ["kaufen", "acheter", "gekauft", "haben"], ["arbeiten", "travailler", "gearbeitet", "haben"], ["gehen", "aller (à pied)", "gegangen", "sein"],
  ["fahren", "aller (en véhicule)", "gefahren", "sein"], ["kommen", "venir", "gekommen", "sein"], ["essen", "manger", "gegessen", "haben"],
  ["trinken", "boire", "getrunken", "haben"], ["schreiben", "écrire", "geschrieben", "haben"], ["lesen", "lire", "gelesen", "haben"],
  ["sehen", "voir", "gesehen", "haben"], ["sprechen", "parler", "gesprochen", "haben"], ["schlafen", "dormir", "geschlafen", "haben"],
  ["nehmen", "prendre", "genommen", "haben"], ["finden", "trouver", "gefunden", "haben"], ["bleiben", "rester", "geblieben", "sein"],
  ["singen", "chanter", "gesungen", "haben"], ["helfen", "aider", "geholfen", "haben"], ["geben", "donner", "gegeben", "haben"],
  ["sein", "être", "gewesen", "sein"], ["haben", "avoir", "gehabt", "haben"], ["werden", "devenir", "geworden", "sein"],
  ["studieren", "étudier", "studiert", "haben"], ["besuchen", "rendre visite", "besucht", "haben"], ["verstehen", "comprendre", "verstanden", "haben"],
  ["aufstehen", "se lever", "aufgestanden", "sein"], ["einkaufen", "faire les courses", "eingekauft", "haben"],
];

/** Perfekt : participe passé, ou auxiliaire haben/sein. */
export function gen(): Question {
  const [inf, fr, pp, aux] = pick(V);
  if (R(0, 2) === 0) {
    return {
      q: `Perfekt de « ${inf} » (${fr}) : ich <b>…</b> ${pp}`,
      txt: 1,
      a: aux === "sein" ? "bin" : "habe",
      choices: ["habe", "bin"],
      why: aux === "sein" ? `ich bin ${pp} : les verbes de mouvement ou de changement d’état prennent sein.` : `ich habe ${pp}.`,
    };
  }
  return {
    q: `Partizip II de « ${inf} » (${fr}) ?`,
    txt: 1,
    a: pp,
    keys: ["ä", "ö", "ü"],
    why: `${inf} → ${pp}${pp.startsWith("ge") ? "" : " : pas de ge- pour les verbes en -ieren ou avec un préfixe inséparable."}`,
  };
}
