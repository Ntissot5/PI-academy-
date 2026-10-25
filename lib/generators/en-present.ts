import { pick } from "../math";
import type { Question } from "./types";

// [base, forme he/she/it, complément]
const V: [string, string, string][] = [
  ["play", "plays", "football on Saturdays"], ["watch", "watches", "TV in the evening"], ["go", "goes", "to school by bus"],
  ["do", "does", "her homework"], ["have", "has", "a brother"], ["study", "studies", "English"], ["try", "tries", "again"],
  ["fix", "fixes", "his bike"], ["miss", "misses", "the train"], ["carry", "carries", "a heavy bag"], ["live", "lives", "in Geneva"],
  ["read", "reads", "a lot"], ["wash", "washes", "the dishes"], ["fly", "flies", "to London"], ["like", "likes", "chocolate"],
  ["catch", "catches", "the ball"], ["say", "says", "hello"], ["enjoy", "enjoys", "skiing"], ["teach", "teaches", "maths"],
];

/** Present simple : la 3e personne du singulier prend un -s. */
export function gen(): Question {
  const [base, s, rest] = pick(V);
  const subj = pick(["He", "She", "My sister", "Tom"]);
  const regle = s.endsWith("ies") ? "consonne + y → -ies" : s.endsWith("es") ? "après -o, -s, -sh, -ch, -x → -es" : base === "have" ? "have → has" : "on ajoute -s";
  return { q: `${subj} <b>…</b> ${rest}. (to ${base})`, txt: 1, a: s, accept: [`${subj.toLowerCase()} ${s}`], why: `${subj} ${s} ${rest} : ${regle}.` };
}
