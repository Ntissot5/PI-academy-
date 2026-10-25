import { pick } from "../math";
import type { GenContext, Generator, Question } from "./types";

export interface PoolEntry {
  /** Titre de l'unité dans le parcours, affiché au-dessus de la question. */
  titre: string;
  gen: Generator;
}

/**
 * Examen final : pioche uniquement dans les unités du parcours en cours.
 * (Le prototype piochait en dur dans les 11 premières unités.)
 */
export function createFinal(pool: readonly PoolEntry[]): Generator {
  if (pool.length === 0) throw new Error("Examen final sans unité à mélanger");
  return (ctx?: GenContext): Question => {
    const u = pick(pool);
    const q = u.gen(ctx);
    return { ...q, tag: u.titre };
  };
}
