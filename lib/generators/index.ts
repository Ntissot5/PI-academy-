import { gen as rel } from "./rel";
import { gen as frac } from "./frac";
import { gen as pow } from "./pow";
import { gen as eq1 } from "./eq1";
import { gen as geo } from "./geo";
import { gen as iso } from "./iso";
import { gen as lin } from "./lin";
import { gen as eq2 } from "./eq2";
import { gen as trig } from "./trig";
import { gen as log } from "./log";
import { gen as der } from "./der";
import { createFinal } from "./final";
import type { Generator } from "./types";

export type { Generator, Question } from "./types";
export { createFinal };

/** Générateurs disponibles, référencés par `unites.id_generateur`. "final" est géré à part. */
export const GENERATORS: Record<string, Generator> = { rel, frac, pow, eq1, geo, iso, lin, eq2, trig, log, der };

export const FINAL_ID = "final";

/** Icône par défaut de chaque générateur (rôles définis dans DESIGN.md). */
export const DEFAULT_ICON: Record<string, string> = {
  rel: "flower", frac: "report", pow: "molecule", eq1: "pin", geo: "folder", iso: "mail",
  lin: "plane", eq2: "note", trig: "eye", log: "cal31", der: "laptop", final: "star",
};

/** Résout le générateur d'une unité ; pour l'examen final, mélange les autres unités du parcours. */
export function resolveGenerator(
  id: string,
  parcoursUnits: readonly { id_generateur: string; titre: string }[],
): Generator {
  if (id === FINAL_ID) {
    return createFinal(
      parcoursUnits
        .filter((u) => u.id_generateur !== FINAL_ID && GENERATORS[u.id_generateur])
        .map((u) => ({ titre: u.titre, gen: GENERATORS[u.id_generateur] })),
    );
  }
  const g = GENERATORS[id];
  if (!g) throw new Error(`Générateur inconnu : ${id}`);
  return g;
}
