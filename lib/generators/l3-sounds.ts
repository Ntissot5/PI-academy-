import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// Noms des lettres en anglais, écrits « à la française ».
const ALPHABET: [string, string][] = [
  ["A", "éï"], ["E", "i"], ["I", "aï"], ["G", "dji"], ["J", "djéï"], ["H", "éïtch"], ["R", "ar"], ["Y", "ouaï"], ["U", "you"],
  ["K", "kéï"], ["W", "double-you"], ["Q", "kiou"],
];
// [mot, lettre muette, lettres prononcées (leurres)]
const MUETTES: [string, string, string[]][] = [
  ["knife", "k", ["n", "f"]], ["write", "w", ["r", "t"]], ["lamb", "b", ["l", "m"]], ["hour", "h", ["r"]], ["listen", "t", ["l", "s", "n"]],
  ["castle", "t", ["c", "s", "l"]], ["island", "s", ["l", "n", "d"]], ["walk", "l", ["w", "k"]], ["climb", "b", ["c", "l", "m"]],
  ["half", "l", ["h", "f"]], ["honest", "h", ["n", "s", "t"]], ["knee", "k", ["n"]], ["wrong", "w", ["r", "n"]], ["talk", "l", ["t", "k"]],
];
// Homophones : mots qui se prononcent de la même façon
const HOMO: string[][] = [
  ["see", "sea"], ["two", "too"], ["there", "their"], ["know", "no"], ["write", "right"], ["eye", "I"], ["hear", "here"],
  ["meet", "meat"], ["son", "sun"], ["buy", "bye"], ["flower", "flour"], ["four", "for"], ["eight", "ate"], ["blue", "blew"],
  ["week", "weak"], ["new", "knew"], ["red", "read (passé)"],
];

/** Sounds and spelling : l'alphabet anglais, les lettres muettes, les mots qui se prononcent pareil. */
export function gen(): Question {
  const t = R(0, 3);
  if (t <= 1) {
    const [l, nom] = pick(ALPHABET);
    if (t === 0) {
      return {
        q: `En anglais, quelle lettre se prononce <b>« ${nom} »</b> ?`,
        txt: 1,
        a: l,
        choices: propositions(l, ALPHABET.filter((x) => x[0] !== l).map((x) => x[0])),
        why: `« ${nom} », c’est la lettre ${l}.${l === "I" || l === "E" || l === "A" ? " Attention, les voyelles anglaises ne se disent pas comme en français : A « éï », E « i », I « aï »." : ""}`,
      };
    }
    return {
      q: `En anglais, comment se dit la lettre <b>${l}</b> ?`,
      txt: 1,
      a: `« ${nom} »`,
      choices: propositions(`« ${nom} »`, ALPHABET.filter((x) => x[0] !== l).map((x) => `« ${x[1]} »`)),
      why: `${l} se dit « ${nom} ».`,
    };
  }
  if (t === 2) {
    const [mot, muette, autres] = pick(MUETTES);
    return {
      q: `Quelle lettre ne se prononce pas dans <b>${mot}</b> ?`,
      txt: 1,
      a: muette,
      choices: propositions(muette, autres),
      why: `Dans ${mot}, le ${muette} est muet. L’orthographe anglaise garde des lettres qu’on ne prononce plus.`,
    };
  }
  const g = pick(HOMO);
  const [mot, pareil] = R(0, 1) === 0 ? g : [g[1], g[0]];
  const leurres = HOMO.filter((x) => x !== g).map((x) => pick(x));
  return {
    q: `Quel mot se prononce exactement comme <b>${mot}</b> ?`,
    txt: 1,
    a: pareil,
    choices: propositions(pareil, leurres),
    why: `${mot} et ${pareil} se prononcent de la même façon mais s’écrivent différemment (homophones).`,
  };
}
