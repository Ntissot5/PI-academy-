import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

/** Électricité : loi d'Ohm U = R·I et puissance P = U·I. */
export function gen(): Question {
  const t = R(0, 3);
  const I = pick([0.1, 0.2, 0.25, 0.5, 1, 1.5, 2, 3, 4, 5]);
  const Rr = pick([2, 4, 5, 10, 12, 20, 22, 47, 50, 100]);
  const U = I * Rr;
  if (t === 0) return { q: `Résistance ${Rr} Ω, courant ${fr(I)} A. Tension U en volts ?`, txt: 1, a: U, tol: tolAbs(U), why: `U = R × I = ${Rr} × ${fr(I)} = ${fr(U)} V.` };
  if (t === 1) return { q: `Tension ${fr(U)} V aux bornes d’une résistance de ${Rr} Ω. Courant I en ampères ?`, txt: 1, a: I, tol: tolAbs(I), why: `I = U ÷ R = ${fr(U)} ÷ ${Rr} = ${fr(I)} A.` };
  if (t === 2) return { q: `Tension ${fr(U)} V, courant ${fr(I)} A. Résistance R en ohms ?`, txt: 1, a: Rr, tol: tolAbs(Rr), why: `R = U ÷ I = ${fr(U)} ÷ ${fr(I)} = ${Rr} Ω.` };
  const V = pick([12, 24, 230]), A = pick([0.5, 1, 2, 5, 10]);
  return { q: `Un appareil branché sur ${V} V consomme ${fr(A)} A. Puissance P en watts ?`, txt: 1, a: V * A, tol: tolAbs(V * A), why: `P = U × I = ${V} × ${fr(A)} = ${fr(V * A)} W.` };
}
