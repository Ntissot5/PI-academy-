import { R, pick } from "../math";
import type { Question } from "./types";

// [base, prétérit, participe passé, traduction]
const V: [string, string, string, string][] = [
  ["be", "was", "been", "être"], ["go", "went", "gone", "aller"], ["have", "had", "had", "avoir"], ["do", "did", "done", "faire"],
  ["see", "saw", "seen", "voir"], ["eat", "ate", "eaten", "manger"], ["drink", "drank", "drunk", "boire"], ["write", "wrote", "written", "écrire"],
  ["take", "took", "taken", "prendre"], ["give", "gave", "given", "donner"], ["come", "came", "come", "venir"], ["make", "made", "made", "fabriquer"],
  ["know", "knew", "known", "savoir"], ["think", "thought", "thought", "penser"], ["buy", "bought", "bought", "acheter"], ["bring", "brought", "brought", "apporter"],
  ["catch", "caught", "caught", "attraper"], ["teach", "taught", "taught", "enseigner"], ["swim", "swam", "swum", "nager"], ["sing", "sang", "sung", "chanter"],
  ["begin", "began", "begun", "commencer"], ["run", "ran", "run", "courir"], ["speak", "spoke", "spoken", "parler"], ["break", "broke", "broken", "casser"],
  ["choose", "chose", "chosen", "choisir"], ["forget", "forgot", "forgotten", "oublier"], ["find", "found", "found", "trouver"], ["leave", "left", "left", "partir"],
  ["read", "read", "read", "lire"], ["sleep", "slept", "slept", "dormir"], ["feel", "felt", "felt", "ressentir"], ["fly", "flew", "flown", "voler"],
  ["drive", "drove", "driven", "conduire"], ["fall", "fell", "fallen", "tomber"], ["grow", "grew", "grown", "grandir"], ["throw", "threw", "thrown", "lancer"],
  ["wear", "wore", "worn", "porter (un habit)"], ["win", "won", "won", "gagner"], ["lose", "lost", "lost", "perdre"], ["pay", "paid", "paid", "payer"],
  ["say", "said", "said", "dire"], ["tell", "told", "told", "raconter"], ["sell", "sold", "sold", "vendre"], ["send", "sent", "sent", "envoyer"],
  ["build", "built", "built", "construire"], ["understand", "understood", "understood", "comprendre"], ["sit", "sat", "sat", "s’asseoir"],
  ["meet", "met", "met", "rencontrer"], ["keep", "kept", "kept", "garder"], ["put", "put", "put", "poser"], ["cut", "cut", "cut", "couper"],
];

/** Verbes irréguliers : prétérit ou participe passé. */
export function gen(): Question {
  const [base, past, pp, fr] = pick(V);
  const preterit = R(0, 1) === 0;
  const a = preterit ? past : pp;
  const accept = base === "be" && preterit ? ["were", "was/were"] : base === "get" ? ["gotten"] : [];
  return {
    q: `${preterit ? "Prétérit (simple past)" : "Participe passé"} de « to ${base} » (${fr}) ?`,
    txt: 1,
    a,
    accept,
    why: `${base} – ${past}${base === "be" ? "/were" : ""} – ${pp}.`,
  };
}
