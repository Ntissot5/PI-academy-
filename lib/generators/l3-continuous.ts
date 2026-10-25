import { R, pick } from "../math";
import type { Question } from "./types";
import { melange } from "./data/l2-outils";

// [base, 3e personne, -ing, complément]
const V: [string, string, string, string][] = [
  ["play", "plays", "playing", "football"], ["read", "reads", "reading", "a book"], ["watch", "watches", "watching", "TV"],
  ["swim", "swims", "swimming", "in the lake"], ["run", "runs", "running", "in the park"], ["write", "writes", "writing", "an email"],
  ["eat", "eats", "eating", "an apple"], ["drink", "drinks", "drinking", "orange juice"], ["dance", "dances", "dancing", "in the living room"],
  ["ride", "rides", "riding", "a horse"], ["cook", "cooks", "cooking", "dinner"], ["study", "studies", "studying", "for a test"],
  ["sing", "sings", "singing", "a song"], ["listen", "listens", "listening", "to music"], ["wash", "washes", "washing", "the dishes"],
  ["make", "makes", "making", "a cake"], ["sit", "sits", "sitting", "in the garden"], ["take", "takes", "taking", "photos"],
];
// [sujet, be, 3e personne ?]
const S: [string, string, boolean][] = [
  ["I", "am", false], ["You", "are", false], ["He", "is", true], ["She", "is", true], ["My brother", "is", true], ["Anna", "is", true],
  ["We", "are", false], ["They", "are", false], ["My friends", "are", false],
];
const HABITUDE = ["every day", "every weekend", "on Sundays", "twice a week", "every evening"];
const MAINTENANT = ["now", "at the moment", "right now"];
const COURT: Record<string, string> = { am: "'m", is: "'s", are: "'re" };

/** Present continuous : be + -ing pour une action en cours ; present simple pour une habitude. */
export function gen(): Question {
  const [base, s3, ing, compl] = pick(V);
  const [suj, be, trois] = pick(S);
  const simple = trois ? s3 : base;
  const cont = `${be} ${ing}`;
  if (R(0, 1) === 0) {
    const debut = pick(["Look! ", "Listen! ", ""]);
    const fin = debut ? "" : ` ${pick(MAINTENANT)}`;
    const pron = /^(I|You|He|She|We|They)$/.test(suj);
    return {
      q: `Present continuous : <b>${debut}${suj} … ${compl}${fin}.</b> (${base})`,
      txt: 1,
      a: cont,
      accept: pron ? [`${COURT[be]} ${ing}`, `${suj}${COURT[be]} ${ing}`, `${suj} ${cont}`] : [`${suj} ${cont}`],
      hint: "be (am, is, are) + verbe en -ing",
      why: `${debut}${suj} ${cont} ${compl}${fin}.${ing.match(/(mm|nn|tt)ing$/) ? " On double la consonne finale (swim → swimming)." : ing.endsWith("ing") && base.endsWith("e") ? " Le e final tombe (make → making)." : ""}`,
    };
  }
  const habitude = R(0, 1) === 0;
  const signal = habitude ? pick(HABITUDE) : pick(MAINTENANT);
  const faux = trois ? base : s3;
  const a = habitude ? simple : cont;
  return {
    q: `Simple ou continuous ? <b>${suj} … ${compl} ${signal}.</b> (${base})`,
    txt: 1,
    a,
    choices: melange([simple, cont, faux === simple ? ing : faux]),
    why: habitude
      ? `« ${signal} » = une habitude → present simple : ${suj} ${simple} ${compl} ${signal}.`
      : `« ${signal} » = en ce moment → present continuous : ${suj} ${cont} ${compl} ${signal}.`,
  };
}
