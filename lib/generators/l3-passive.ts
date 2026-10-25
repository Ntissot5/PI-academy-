import { pick } from "../math";
import type { Question } from "./types";

// [phrase avec …, verbe, réponse, raison]
const P: [string, string, string, string][] = [
  ["The Mona Lisa … by Leonardo da Vinci.", "paint", "was painted", "passé, singulier : was + participe passé"],
  ["English … in many countries.", "speak", "is spoken", "présent, singulier : is + participe passé"],
  ["The letters … every morning.", "deliver", "are delivered", "présent, pluriel : are + participe passé"],
  ["This house … in 1900.", "build", "was built", "passé, singulier : was + participe passé"],
  ["The windows … yesterday.", "clean", "were cleaned", "passé, pluriel : were + participe passé"],
  ["Cheese … from milk.", "make", "is made", "présent, singulier : is + participe passé"],
  ["The thief … last night.", "catch", "was caught", "passé, singulier : was + participe passé"],
  ["Football … all over the world.", "play", "is played", "présent, singulier : is + participe passé"],
  ["The Harry Potter books … by J. K. Rowling.", "write", "were written", "passé, pluriel : were + participe passé"],
  ["Rice … in many Asian countries.", "grow", "is grown", "présent, singulier : is + participe passé"],
  ["Watches … in Switzerland.", "make", "are made", "présent, pluriel : are + participe passé"],
  ["The match … because of the rain.", "cancel", "was cancelled", "passé, singulier : was + participe passé (US : canceled)"],
];

/** La voix passive : be + participe passé (Niv 2). */
export function gen(): Question {
  const [phrase, verbe, a, raison] = pick(P);
  return {
    q: `Mets au passif : <b>${phrase}</b> (${verbe})`,
    txt: 1,
    a,
    accept: a === "was cancelled" ? ["was canceled"] : [],
    hint: "be (is, are, was, were) + participe passé",
    why: `${phrase.replace("…", a)} — ${raison}.`,
  };
}
