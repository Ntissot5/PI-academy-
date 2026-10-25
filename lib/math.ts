/* Helpers du moteur d'exercices, portés tels quels depuis reference/route-epfl.html. */

export const R = (a: number, b: number): number => Math.floor(Math.random() * (b - a + 1)) + a;
export const NZ = (a: number, b: number): number => {
  let v: number;
  do v = R(a, b);
  while (v === 0);
  return v;
};
export const pick = <T,>(a: readonly T[]): T => a[Math.floor(Math.random() * a.length)];
/** Parenthèses autour des négatifs. */
export const P = (n: number): string => (n < 0 ? `(−${-n})` : `${n}`);
/** Signe typographique. */
export const S = (n: number): string => (n < 0 ? `−${-n}` : `${n}`);
/** Format suisse romand : virgule décimale, 2 décimales max, espaces des milliers au-delà du million. */
export const fr = (n: number): string => {
  if (!isFinite(n)) return "—";
  const v = Number.isInteger(n) ? n : +n.toFixed(2);
  if (Math.abs(v) >= 1e6 && Number.isInteger(v)) return S(v).replace(/\B(?=(\d{3})+(?!\d))/g, "\u2009");
  return S(v).replace(".", ",");
};
export const sup = (n: number): string => `<sup>${S(n)}</sup>`;
export const deg = Math.PI / 180;

/** a·x + b joliment. */
export function lin(a: number, b: number, v = "x"): string {
  let s = a === 1 ? v : a === -1 ? `−${v}` : `${S(a)}${v}`;
  if (b > 0) s += ` + ${b}`;
  else if (b < 0) s += ` − ${-b}`;
  return s;
}

export function quad(a: number, b: number, c: number): string {
  let s = a === 1 ? "x²" : a === -1 ? "−x²" : `${S(a)}x²`;
  if (b) s += (b > 0 ? " + " : " − ") + (Math.abs(b) === 1 ? "" : Math.abs(b)) + "x";
  if (c) s += (c > 0 ? " + " : " − ") + Math.abs(c);
  return s;
}

export const tolAbs = (a: number, r = 0.01, min = 0.05): number => Math.max(Math.abs(a) * r, min);

/** Lit une réponse : accepte −3, -3, 4,5, 4.5, 7/12. Renvoie NaN si illisible. */
export function parse(input: string): number {
  const s = input.trim().replace(/\s/g, "").replace(/[−–]/g, "-").replace(/,/g, ".");
  if (!s) return NaN;
  if (/^-?\d*\.?\d+\/-?\d*\.?\d+$/.test(s)) {
    const [a, b] = s.split("/").map(Number);
    return b ? a / b : NaN;
  }
  return Number(s);
}
