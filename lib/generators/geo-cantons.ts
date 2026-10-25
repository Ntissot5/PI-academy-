import { R, pick } from "../math";
import { CANTONS, languesLabel } from "../cantons";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

/** Les 26 cantons : chef-lieu, abréviation, langues officielles. */
export function gen(): Question {
  const c = pick(CANTONS);
  const t = R(0, 2);
  if (t === 0) {
    return { q: `Quel est le chef-lieu du canton de ${c.nom} (${c.code}) ?`, txt: 1, a: c.chefLieu, accept: c.chefLieuAccept, keys: ["é", "è", "â", "ü"], why: `Le chef-lieu de ${c.nom} est ${c.chefLieu}.` };
  }
  if (t === 1) {
    const others = shuffle(CANTONS.filter((x) => x.code !== c.code)).slice(0, 3).map((x) => x.nom);
    return { q: `Quel canton a pour abréviation <b>${c.code}</b> ?`, txt: 1, a: c.nom, choices: shuffle([c.nom, ...others]), why: `${c.code} = ${c.nom}.` };
  }
  const label = languesLabel(c);
  const pool = [...new Set(CANTONS.map(languesLabel))];
  const choices = shuffle([label, ...shuffle(pool.filter((x) => x !== label)).slice(0, 2)]);
  return { q: `Langue(s) officielle(s) du canton de ${c.nom} ?`, txt: 1, a: label, choices, why: `${c.nom} : ${label}.` };
}
