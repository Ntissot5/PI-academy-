import { fr, parse } from "./math";
import type { Question } from "./generators/types";

export type Grade = "ok" | "ko" | "unreadable";

/**
 * Texte comparé sans tenir compte des majuscules, des espaces en trop, du type d'apostrophe
 * ni du point final. Les accents comptent. ß vaut ss (orthographe suisse de l'allemand).
 */
export function normText(s: string): string {
  return s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[’ʼ`´]/g, "'")
    .replace(/ß/g, "ss")
    .replace(/\s+/g, " ")
    .replace(/\s*'\s*/g, "'")
    .trim()
    .replace(/[.!]+$/, "")
    .trim();
}

/** Ce qu'on affiche comme bonne réponse. */
export function answerText(q: Pick<Question, "a">): string {
  return typeof q.a === "number" ? fr(q.a) : q.a;
}

/** Correction d'une réponse. Nombres : |v − a| ≤ tol (1e-9 par défaut), comme le prototype. */
export function grade(input: string, q: Pick<Question, "a" | "tol" | "accept">): Grade {
  if (typeof q.a === "string") {
    const v = normText(input);
    if (!v) return "unreadable";
    return [q.a, ...(q.accept ?? [])].some((x) => normText(x) === v) ? "ok" : "ko";
  }
  const v = parse(input);
  if (!Number.isFinite(v)) return "unreadable";
  return Math.abs(v - q.a) <= (q.tol ?? 1e-9) ? "ok" : "ko";
}
