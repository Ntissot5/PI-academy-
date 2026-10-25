import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// Noms des lettres en allemand, écrits « à la française ».
const ALPHABET: [string, string][] = [
  ["A", "a"], ["C", "tsé"], ["E", "é"], ["G", "gué"], ["H", "ha"], ["I", "i"], ["J", "yott"], ["Q", "kou"],
  ["R", "èr"], ["U", "ou"], ["V", "faou"], ["W", "vé"], ["Y", "upsilonn"], ["Z", "tsètt"],
];

// [graphie, son (à la française), exemples, graphies qui donnent aussi ce son]
const LAUTE: [string, string, string[], string[]][] = [
  ["ei", "« aï » comme dans « aïe »", ["mein", "Eis", "drei", "klein", "Bein"], ["ei", "ai"]],
  ["eu", "« oï » comme dans « boy »", ["neu", "heute", "Freund", "Leute"], ["eu", "äu"]],
  ["äu", "« oï » comme dans « boy »", ["Häuser", "Bäume", "Mäuse"], ["eu", "äu"]],
  ["sch", "« ch » comme dans « chat »", ["Schule", "Fisch", "schön", "Tasche"], ["sch", "st", "sp", "ch"]],
  ["w", "« v » comme dans « vélo »", ["Wasser", "wo", "Wald", "Winter"], ["w", "v"]],
  ["z", "« ts » comme dans « tsar »", ["Zug", "zehn", "Zimmer", "Zahn"], ["z", "ts", "tz"]],
  ["ie", "« i » long", ["Liebe", "vier", "spielen", "Brief"], ["ie", "i", "ih"]],
  ["u", "« ou » comme dans « loup »", ["Hund", "gut", "Mund", "Bus"], ["u"]],
  ["ü", "« u » comme dans « rue »", ["Tür", "müde", "grün", "fünf"], ["ü", "y"]],
  ["j", "« y » comme dans « yoga »", ["ja", "Jahr", "Junge", "jung"], ["j", "y"]],
];

// Mots pour les leurres (aucun ne contient st- ou sp- en début de mot).
const MOTS = ["Hund", "Tag", "Mama", "Hose", "Ball", "Kopf", "Brot", "Auto", "Nase", "Lampe", "Hut", "Bett", "Ente", "Rock", "Maus", "Mond", "Ohr"];

/** Laute und Buchstaben : l'alphabet allemand et les sons qui s'écrivent autrement qu'en français. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [lettre, nom] = pick(ALPHABET);
    const leurres = ALPHABET.filter((x) => x[0] !== lettre).map((x) => `« ${x[1]} »`);
    return {
      q: `En allemand, comment se dit la lettre <b>${lettre}</b> ?`,
      txt: 1,
      a: `« ${nom} »`,
      choices: propositions(`« ${nom} »`, leurres),
      why: `${lettre} se dit « ${nom} ».${lettre === "V" ? " Et dans les mots, v se prononce souvent [f] : Vater, vier." : lettre === "W" ? " Et dans les mots, w se prononce [v] : Wasser." : ""}`,
    };
  }
  if (t === 1) {
    const [lettre, nom] = pick(ALPHABET);
    const leurres = ALPHABET.filter((x) => x[0] !== lettre).map((x) => x[0]);
    return {
      q: `En allemand, quelle lettre se dit <b>« ${nom} »</b> ?`,
      txt: 1,
      a: lettre,
      choices: propositions(lettre, leurres),
      why: `« ${nom} », c’est la lettre ${lettre}.`,
    };
  }
  const l = pick(LAUTE);
  const [graphie, son, exemples] = l;
  const mot = pick(exemples);
  if (t === 2) {
    const sons = [...new Set(LAUTE.filter((x) => x[1] !== son).map((x) => x[1]))];
    return {
      q: `Dans <b>${mot}</b>, comment se prononce <b>${graphie}</b> ?`,
      txt: 1,
      a: son,
      choices: propositions(son, sons),
      why: `En allemand, ${graphie} se prononce ${son} : ${exemples.join(", ")}.`,
    };
  }
  const leurres = MOTS.filter((m) => !l[3].some((g) => m.toLowerCase().includes(g)));
  return {
    q: `Quel mot contient le son ${son} ?`,
    txt: 1,
    a: mot,
    choices: propositions(mot, leurres),
    why: `${mot} : ${graphie} se prononce ${son}.`,
  };
}
