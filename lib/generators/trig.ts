import { R, deg, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

/** Trigonométrie. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) { const H = R(5, 40), a = pick([15, 20, 25, 30, 35, 40, 45, 50, 60, 70]); return { q: `Hypoténuse ${H} m, angle ${a}°. Côté opposé ?`, txt: 1, a: H * Math.sin(a * deg), tol: tolAbs(H * Math.sin(a * deg)), why: `opposé = H · sin α = ${H} · sin ${a}° ≈ ${fr(H * Math.sin(a * deg))} m.` }; }
  if (t === 1) { const A = R(5, 40), a = pick([20, 30, 40, 45, 50, 60]); return { q: `Côté adjacent ${A} m, angle ${a}°. Hypoténuse ?`, txt: 1, a: A / Math.cos(a * deg), tol: tolAbs(A / Math.cos(a * deg)), why: `H = adjacent ÷ cos α = ${A} ÷ cos ${a}° ≈ ${fr(A / Math.cos(a * deg))} m.` }; }
  if (t === 2) { const O = R(2, 30), A = R(2, 30), ang = Math.atan(O / A) / deg; return { q: `Opposé ${O} m, adjacent ${A} m. Angle en degrés ?`, txt: 1, a: ang, tol: tolAbs(ang, 0.01, 0.3), why: `α = arctan(${O} ÷ ${A}) ≈ ${fr(ang)}°.` }; }
  if (t === 3) { const d = 15 * R(1, 24); return { q: `${d}° en radians (décimal) ?`, txt: 1, a: d * deg, tol: 0.02, why: `${d} × π ÷ 180 ≈ ${fr(d * deg)} rad.` }; }
  const [f, a, v] = pick([["sin", 30, 0.5], ["cos", 60, 0.5], ["sin", 90, 1], ["cos", 0, 1], ["cos", 180, -1], ["sin", 0, 0], ["cos", 90, 0], ["tan", 45, 1], ["sin", 270, -1]] as const);
  return { q: `${f}(${a}°) = ?`, a: v, why: `Valeur à connaître par cœur : ${f}(${a}°) = ${fr(v)}.` };
}
