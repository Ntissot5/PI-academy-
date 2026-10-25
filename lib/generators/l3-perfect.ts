import { R, pick } from "../math";
import type { Question } from "./types";

// [base, participe passé, prétérit, complément]
const V: [string, string, string, string][] = [
  ["finish", "finished", "finished", "my homework"], ["visit", "visited", "visited", "London"], ["see", "seen", "saw", "that film"],
  ["eat", "eaten", "ate", "sushi"], ["be", "been", "was", "to Paris"], ["lose", "lost", "lost", "my keys"], ["read", "read", "read", "this book"],
  ["write", "written", "wrote", "a poem"], ["buy", "bought", "bought", "a new bike"], ["break", "broken", "broke", "a glass"],
  ["meet", "met", "met", "her parents"], ["clean", "cleaned", "cleaned", "the kitchen"], ["forget", "forgotten", "forgot", "his password"],
];
// [sujet, have/has, forme courte]
const S: [string, string, string][] = [["I", "have", "I've"], ["She", "has", "She's"], ["We", "have", "We've"], ["Tom", "has", ""], ["They", "have", "They've"]];
const PP_SIGNAUX = ["already", "just", "never"];
const PASSE_SIGNAUX = ["yesterday", "last week", "two days ago", "in 2020"];

/** Present perfect : have/has + participe passé ; for / since ; present perfect ou past simple. */
export function gen(): Question {
  const t = R(0, 3);
  const [base, pp, past, compl] = pick(V);
  const [suj, have, court] = pick(S);
  if (t === 0) {
    const adv = pick(PP_SIGNAUX);
    const a = `${have} ${adv} ${pp}`;
    return {
      q: `Present perfect : <b>${suj} … ${compl}.</b> (${adv} / ${base})`,
      txt: 1,
      a,
      accept: [`${suj} ${a}`, ...(court ? [`${court} ${adv} ${pp}`, `${court.slice(court.indexOf("'"))} ${adv} ${pp}`] : [])],
      hint: "have / has + adverbe + participe passé",
      why: `${suj} ${a} ${compl}. ${adv} se place entre have/has et le participe passé.`,
    };
  }
  if (t === 1) {
    const pp1 = base === "be" || R(0, 1) === 0;
    const experience = ["see", "eat", "be", "read", "visit", "meet", "write"].includes(base);
    const signal = pp1 ? (experience ? pick(["before", "twice", "three times"]) : "already") : pick(PASSE_SIGNAUX);
    const avecPP = `${have} ${pp}`;
    return {
      q: `Present perfect ou past simple ? <b>${suj} … ${compl} ${signal}.</b> (${base})`,
      txt: 1,
      a: pp1 ? avecPP : past,
      choices: [avecPP, past].sort(),
      why: pp1
        ? `« ${signal} » : une expérience ou un résultat, sans moment précis → present perfect : ${suj} ${avecPP} ${compl} ${signal}.`
        : `« ${signal} » = un moment précis du passé → past simple : ${suj} ${past} ${compl} ${signal}.`,
    };
  }
  const forSince: [string, "for" | "since"][] = [
    ["2019", "since"], ["three years", "for"], ["last summer", "since"], ["two weeks", "for"], ["Monday", "since"], ["a long time", "for"],
    ["I was six", "since"], ["ten minutes", "for"], ["January", "since"], ["an hour", "for"],
  ];
  const [duree, a] = pick(forSince);
  const debut = pick(["I have lived in Lausanne", "We have known Anna", "She has played the piano", "They have been here"]);
  return {
    q: `For ou since ? <b>${debut} … ${duree}.</b>`,
    txt: 1,
    a,
    choices: ["for", "since"],
    why: a === "for" ? `for + une durée (${duree}).` : `since + un point de départ (${duree}).`,
  };
}
