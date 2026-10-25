import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import { describe, expect, it } from "vitest";
import { GENERATORS, createFinal } from "@/lib/generators";
import { fr, parse } from "@/lib/math";

// Exécute le moteur du prototype (helpers + CH) et compare, tirage par tirage,
// avec le portage TypeScript : même graine → même énoncé, même réponse, même explication.
const html = readFileSync(fileURLToPath(new URL("../../reference/route-epfl.html", import.meta.url)), "utf8");
const code = html.slice(html.indexOf("/* ---------- helpers"), html.indexOf("/* ---------- icônes")) +
  html.slice(html.indexOf("function parse(s)"), html.indexOf("function check()"));

interface ProtoQ { q: string; a: number; tol?: number; hint?: string; txt?: number; why: string; tag?: string }
interface ProtoCh { id: string; t: string; gen: () => ProtoQ }

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const protoMath = Object.create(Math) as Math;
const sandbox: Record<string, unknown> = { Math: protoMath, Number, String, isFinite, isNaN };
vm.createContext(sandbox);
vm.runInContext(code + "\nthis.CH = CH; this.fr = fr; this.parse = parse;", sandbox);
const CH = sandbox.CH as ProtoCh[];

describe("fidélité au prototype", () => {
  for (const ch of CH) {
    it(`${ch.id} : 1 000 tirages identiques au prototype`, () => {
      const ours = ch.id === "final"
        ? createFinal(CH.slice(0, 11).map((c) => ({ titre: c.t, gen: GENERATORS[c.id] })))
        : GENERATORS[ch.id];
      const r1 = seeded(7), r2 = seeded(7);
      const real = Math.random;
      try {
        for (let i = 0; i < 1000; i++) {
          protoMath.random = r1;
          const p = ch.gen();
          Math.random = r2;
          const q = ours();
          Math.random = real;
          expect(JSON.stringify(q)).toBe(JSON.stringify(p));
        }
      } finally {
        Math.random = real;
      }
    });
  }

  it("fr() et parse() se comportent comme le prototype", () => {
    const pfr = sandbox.fr as (n: number) => string, pparse = sandbox.parse as (s: string) => number;
    for (const n of [-3, 4.5, 1 / 3, 2_000_000, -1_234_567, Infinity, 0.005, 12.345]) expect(fr(n)).toBe(pfr(n));
    for (const s of ["−3", "4,5", "7/12", "1 000", "2 000 000", "", "x"]) expect(Object.is(parse(s), pparse(s)) || parse(s) === pparse(s)).toBe(true);
  });
});
