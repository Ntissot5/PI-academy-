import { pick } from "../math";
import type { Question } from "./types";

// [français, réponse, autres réponses, règle]
const P: [string, string, string[], string][] = [
  ["le vélo de Tom", "Tom's bike", [], "un possesseur au singulier : 's"],
  ["la voiture de mes parents", "my parents' car", [], "pluriel en -s : seulement l’apostrophe (parents')"],
  ["les jouets des enfants", "the children's toys", [], "pluriel irrégulier sans -s (children) : 's"],
  ["le chien de ma sœur", "my sister's dog", [], "un possesseur au singulier : 's"],
  ["la chambre de mes frères", "my brothers' room", ["my brothers' bedroom"], "pluriel en -s : seulement l’apostrophe (brothers')"],
  ["le livre de l’enseignante", "the teacher's book", [], "un possesseur au singulier : 's"],
  ["les chaussures des hommes", "the men's shoes", [], "pluriel irrégulier sans -s (men) : 's"],
  ["la maison de mes grands-parents", "my grandparents' house", [], "pluriel en -s : seulement l’apostrophe (grandparents')"],
  ["le chat d’Anna", "Anna's cat", [], "un possesseur au singulier : 's"],
  ["le sac de James", "James's bag", ["James' bag"], "nom en -s au singulier : James's (ou James')"],
  ["la chambre des filles", "the girls' room", ["the girls' bedroom"], "pluriel en -s : seulement l’apostrophe (girls')"],
  ["l’anniversaire de mon père", "my dad's birthday", ["my father's birthday"], "un possesseur au singulier : 's"],
];

/** Possessive 's : Tom's bike, my parents' car, the children's toys. */
export function gen(): Question {
  const [fr, a, alt, regle] = pick(P);
  return {
    q: `Traduis avec le génitif (’s) : <b>${fr}</b>`,
    txt: 1,
    a,
    accept: alt,
    hint: "possesseur + 's (ou ' après un pluriel en -s) + objet",
    why: `${fr} = ${a} — ${regle}.`,
  };
}
