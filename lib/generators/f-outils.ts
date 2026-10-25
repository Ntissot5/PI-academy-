/* Outils communs aux exercices de français du lot « francais » (préfixe f-). */
import { pick } from "../math";
import { KEYS_FR } from "./fr-conj";
import type { Question } from "./types";

export { KEYS_FR };

/** Mélange (copie). */
export function melange<T>(a: readonly T[]): T[] {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}

/** Met en gras le passage entre *étoiles*. */
export const gras = (s: string): string => s.replace(/\*(.+?)\*/g, "<b>$1</b>");
/** Le passage entre *étoiles*, sans les étoiles. */
export const vise = (s: string): string => s.match(/\*(.+?)\*/)?.[1] ?? s;

/** QCM : `a` + au plus `n − 1` autres propositions distinctes, dans le désordre. */
export function qcm(q: string, a: string, autres: readonly string[], why: string, hint?: string, n = 4): Question {
  const others = melange([...new Set(autres)].filter((x) => x !== a)).slice(0, n - 1);
  const out: Question = { q: gras(q), txt: 1, a, choices: melange([a, ...others]), why: gras(why) };
  if (hint) out.hint = hint;
  return out;
}

/** QCM à propositions dans un ordre fixe (ex. : types de phrase, lettres). */
export function qcmFixe(q: string, a: string, choix: readonly string[], why: string, hint?: string): Question {
  const out: Question = { q: gras(q), txt: 1, a, choices: [...new Set(choix)], why: gras(why) };
  if (!out.choices!.includes(a)) out.choices!.push(a);
  if (hint) out.hint = hint;
  return out;
}

/** Saisie libre d'un mot (accents proposés au clavier). */
export function saisie(q: string, a: string, why: string, accept: readonly string[] = [], hint?: string): Question {
  const out: Question = { q: gras(q), txt: 1, a, why: gras(why), keys: KEYS_FR };
  if (accept.length) out.accept = [...accept];
  if (hint) out.hint = hint;
  return out;
}

/** Saisie d'un nombre (compter des syllabes, des mots…). */
export function nombre(q: string, a: number, why: string, hint?: string): Question {
  const out: Question = { q: gras(q), txt: 1, a, why: gras(why) };
  if (hint) out.hint = hint;
  return out;
}

/** Tire un sous-type d'exercice au hasard. */
export const tirer = (sousTypes: readonly (() => Question)[]): Question => pick(sousTypes)();

/** Article élidé : « de » → « d’ » devant voyelle ou h muet. */
export const voyelle = (s: string): boolean => /^[aeiouyéèêëàâîïôûh]/i.test(s);

/** Banque d'items QCM : [énoncé avec *mot visé*, bonne réponse, autres propositions, explication]. */
export type Item = readonly [q: string, a: string, autres: readonly string[], why: string];

/** Générateur qui tire un item d'une banque, avec une consigne commune en tête. */
export const deBanque = (items: readonly Item[], consigne = ""): (() => Question) => () => {
  const [q, a, autres, why] = pick(items);
  return qcm(consigne + q, a, autres, why);
};
