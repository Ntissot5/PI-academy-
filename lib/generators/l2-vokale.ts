import { R, pick } from "../math";
import type { Question } from "./types";

// [mot, voyelle à juger, longue ?, raison]
const VOKALE: [string, string, boolean, string][] = [
  ["Boot", "oo", true, "voyelle doublée"], ["Tee", "ee", true, "voyelle doublée"], ["Haar", "aa", true, "voyelle doublée"],
  ["Meer", "ee", true, "voyelle doublée"], ["Sohn", "o", true, "voyelle + h muet"], ["Uhr", "u", true, "voyelle + h muet"],
  ["Zahn", "a", true, "voyelle + h muet"], ["fahren", "a", true, "voyelle + h muet"], ["wohnen", "o", true, "voyelle + h muet"],
  ["Stuhl", "u", true, "voyelle + h muet"], ["Lied", "ie", true, "ie se prononce toujours [i] long"],
  ["Brief", "ie", true, "ie se prononce toujours [i] long"], ["spielen", "ie", true, "ie se prononce toujours [i] long"],
  ["Bett", "e", false, "voyelle + consonne doublée"], ["Mutter", "u", false, "voyelle + consonne doublée"],
  ["kommen", "o", false, "voyelle + consonne doublée"], ["Wasser", "a", false, "voyelle + consonne doublée"],
  ["Sonne", "o", false, "voyelle + consonne doublée"], ["Himmel", "i", false, "voyelle + consonne doublée"],
  ["schwimmen", "i", false, "voyelle + consonne doublée"], ["Zucker", "u", false, "voyelle + ck"],
  ["Katze", "a", false, "voyelle + tz"], ["Mann", "a", false, "voyelle + consonne doublée"], ["Ball", "a", false, "voyelle + consonne doublée"],
  ["dick", "i", false, "voyelle + ck"], ["Hand", "a", false, "voyelle + deux consonnes"], ["Kind", "i", false, "voyelle + deux consonnes"],
];

// [syllabes, index de la syllabe accentuée, raison]
const AKZENT: [string[], number, string][] = [
  [["an", "ru", "fen"], 0, "particule séparable an- : toujours accentuée"],
  [["auf", "ste", "hen"], 0, "particule séparable auf- : toujours accentuée"],
  [["ein", "kau", "fen"], 0, "particule séparable ein- : toujours accentuée"],
  [["fern", "se", "hen"], 0, "particule séparable fern- : toujours accentuée"],
  [["mit", "kom", "men"], 0, "particule séparable mit- : toujours accentuée"],
  [["be", "su", "chen"], 1, "préfixe inséparable be- : jamais accentué"],
  [["ver", "ste", "hen"], 1, "préfixe inséparable ver- : jamais accentué"],
  [["er", "zäh", "len"], 1, "préfixe inséparable er- : jamais accentué"],
  [["ge", "hö", "ren"], 1, "préfixe inséparable ge- : jamais accentué"],
  [["stu", "die", "ren"], 1, "les verbes en -ieren sont accentués sur -ie-"],
  [["te", "le", "fo", "nie", "ren"], 3, "les verbes en -ieren sont accentués sur -ie-"],
  [["re", "pa", "rie", "ren"], 2, "les verbes en -ieren sont accentués sur -ie-"],
  [["Mut", "ter"], 0, "les mots allemands simples sont accentués sur la première syllabe"],
  [["Fens", "ter"], 0, "les mots allemands simples sont accentués sur la première syllabe"],
  [["Ar", "beit"], 0, "les mots allemands simples sont accentués sur la première syllabe"],
  [["Mu", "sik"], 1, "mot d’origine étrangère : accent sur la fin"],
  [["Stu", "dent"], 1, "mot d’origine étrangère : accent sur la fin"],
  [["Na", "tur"], 1, "mot d’origine étrangère : accent sur la fin"],
];

/** Voyelles longues ou brèves, accent tonique. */
export function gen(): Question {
  if (R(0, 1) === 0) {
    const [mot, v, longue, raison] = pick(VOKALE);
    return {
      q: `Dans <b>${mot}</b>, la voyelle <b>${v}</b> est-elle longue ou brève ?`,
      txt: 1,
      a: longue ? "longue" : "brève",
      choices: ["longue", "brève"],
      hint: "Regarde la lettre qui suit la voyelle.",
      why: `${mot} : ${raison} → voyelle ${longue ? "longue" : "brève"}.`,
    };
  }
  const [syl, i, raison] = pick(AKZENT);
  const mot = syl.join("");
  return {
    q: `Quelle syllabe est accentuée dans <b>${mot}</b> (${syl.join("-")}) ?`,
    txt: 1,
    a: syl[i],
    choices: syl,
    why: `${syl.map((s, k) => (k === i ? s.toUpperCase() : s)).join("-")} : ${raison}.`,
  };
}
