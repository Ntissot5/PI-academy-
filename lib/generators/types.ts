/** Une question générée. `q` peut contenir <sup>/<sub>. */
export interface Question {
  q: string;
  a: number;
  tol?: number;
  hint?: string;
  /** Énoncé en phrase : police texte au lieu de la police mono. */
  txt?: 1;
  why: string;
  /** Unité d'origine, pour l'examen final. */
  tag?: string;
}

export type Generator = () => Question;
