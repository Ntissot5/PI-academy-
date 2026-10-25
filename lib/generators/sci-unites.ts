import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

// [de, vers, facteur, explication]
const CONV: [string, string, number, string][] = [
  ["km/h", "m/s", 1 / 3.6, "÷ 3,6 (1 km/h = 1000 m ÷ 3600 s)"],
  ["m/s", "km/h", 3.6, "× 3,6"],
  ["g", "kg", 1 / 1000, "÷ 1 000"],
  ["kg", "g", 1000, "× 1 000"],
  ["cm³", "L", 1 / 1000, "÷ 1 000 (1 L = 1 dm³ = 1 000 cm³)"],
  ["L", "cm³", 1000, "× 1 000"],
  ["h", "min", 60, "× 60"],
  ["min", "s", 60, "× 60"],
  ["cm", "m", 1 / 100, "÷ 100"],
  ["mm", "cm", 1 / 10, "÷ 10"],
  ["m", "km", 1 / 1000, "÷ 1 000"],
  ["dl", "L", 1 / 10, "÷ 10"],
];

/** Conversions d'unités. */
export function gen(): Question {
  const [de, vers, f, how] = pick(CONV);
  const base = de === "km/h" ? 18 * R(1, 8) : de === "m/s" ? R(1, 40) : pick([R(2, 99), R(100, 9000), R(2, 90) * 50]);
  const a = base * f;
  return { q: `Convertis ${fr(base)} ${de} en ${vers}.`, txt: 1, a, tol: tolAbs(a, 0.005, 0.01), why: `${fr(base)} ${de} ${how} = ${fr(a)} ${vers}.` };
}
