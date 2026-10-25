/** Une question générée. `q` peut contenir <sup>/<sub>/<b>. */
export interface Question {
  q: string;
  /** Réponse attendue : un nombre (corrigé avec `tol`) ou un texte. */
  a: number | string;
  /** Autres réponses texte acceptées (variantes d'orthographe, avec pronom…). */
  accept?: string[];
  /** QCM : l'élève choisit une de ces propositions (dont `a`). */
  choices?: string[];
  /** Touches à afficher sous le champ (accents, umlauts). Par défaut : − / , pour les nombres. */
  keys?: string[];
  tol?: number;
  hint?: string;
  /** Énoncé en phrase : police texte au lieu de la police mono. */
  txt?: 1;
  why: string;
  /** Unité d'origine, pour l'examen final. */
  tag?: string;
}

/** Contexte facultatif : le canton de l'élève, pour les questions cantonales. */
export interface GenContext {
  canton?: string;
}

export type Generator = (ctx?: GenContext) => Question;
