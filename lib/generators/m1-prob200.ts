import type { Question } from "./types";
import { probleme } from "./m1-prob20";

/** Problèmes additifs, soustractifs, argent et premières multiplications jusqu'à 200 : PER MSN 13, 4e. */
export function gen(): Question {
  return probleme(200);
}
