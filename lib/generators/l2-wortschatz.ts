import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, propositions } from "./data/l2-outils";
import { NOMEN, WOERTER, THEME_FR, avecArt } from "./data/l2-woerter";

/** Wortschatz : vocabulaire des thèmes familiers, dans les deux sens. */
export function gen(): Question {
  const nom = R(0, 2) > 0;
  if (nom) {
    const n = pick(NOMEN);
    const memes = NOMEN.filter((x) => x.theme === n.theme && x !== n);
    if (R(0, 1) === 0) {
      // Allemand → français (QCM dans le même thème)
      return {
        q: `Thème ${THEME_FR[n.theme]} : que signifie <b>${avecArt(n)}</b> ?`,
        txt: 1,
        a: n.fr,
        choices: propositions(n.fr, memes.map((x) => x.fr)),
        why: `${avecArt(n)} = ${n.fr}.`,
      };
    }
    // Français → allemand (saisie, avec ou sans article)
    const alts = n.alt ?? [];
    return {
      q: `Écris en allemand, avec l’article : <b>${n.fr}</b>`,
      txt: 1,
      a: avecArt(n),
      accept: [n.de, ...alts, ...alts.map((x) => x.split(" ").slice(1).join(" "))],
      keys: KEYS_DE,
      hint: "der, die ou das + le nom avec une majuscule.",
      why: `${n.fr} = ${avecArt(n)}${alts.length ? ` (on dit aussi ${alts.join(", ")})` : ""}. Les noms allemands prennent toujours une majuscule.`,
    };
  }
  const [de, fr, theme, alt] = pick(WOERTER);
  const memes = WOERTER.filter((x) => x[2] === theme && x[0] !== de);
  if (R(0, 1) === 0) {
    return {
      q: `Thème ${THEME_FR[theme]} : que signifie <b>${de}</b> ?`,
      txt: 1,
      a: fr,
      choices: propositions(fr, memes.map((x) => x[1])),
      why: `${de} = ${fr}.`,
    };
  }
  const majuscule = theme === "jours" || theme === "mois";
  return {
    q: `Écris en allemand : <b>${fr}</b>`,
    txt: 1,
    a: de,
    accept: alt ?? [],
    keys: KEYS_DE,
    why: `${fr} = ${de}${alt ? ` (ou ${alt.join(", ")})` : ""}.${majuscule ? " Les jours et les mois sont des noms : majuscule." : ""}`,
  };
}
