import { parse } from "./math";
import type { Question } from "./generators/types";

export type Grade = "ok" | "ko" | "unreadable";

/** Correction d'une réponse, comme dans le prototype : |v − a| ≤ tol (1e-9 par défaut). */
export function grade(input: string, q: Pick<Question, "a" | "tol">): Grade {
  const v = parse(input);
  if (!Number.isFinite(v)) return "unreadable";
  return Math.abs(v - q.a) <= (q.tol ?? 1e-9) ? "ok" : "ko";
}
