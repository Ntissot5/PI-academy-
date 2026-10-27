import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";
import { WORDS, THEME_FR } from "./data/l3-words";

/** Vocabulary : les mots des thèmes familiers, dans les deux sens. */
export function gen(): Question {
  const w = pick(WORDS);
  const [fr, en, alt, theme] = w;
  if (R(0, 1) === 0) {
    const memes = WORDS.filter((x) => x[3] === theme && x !== w).map((x) => x[0]);
    return {
      q: `Thème « ${THEME_FR[theme]} » : que signifie <b>${en}</b> ?`,
      txt: 1,
      a: fr,
      choices: propositions(fr, memes),
      why: `${en} = ${fr}.`,
    };
  }
  const formes = [en, ...alt];
  const accept = [...alt, ...formes.flatMap((x) => [`a ${x}`, `an ${x}`, `the ${x}`])];
  return {
    q: `Écris en anglais : <b>${fr}</b>`,
    txt: 1,
    a: en,
    accept,
    hint: "Sans article.",
    why: `${fr} = ${en}${alt.length ? ` (on accepte aussi : ${alt.join(", ")})` : ""}.`,
  };
}
