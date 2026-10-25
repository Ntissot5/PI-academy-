import { describe, expect, it } from "vitest";
import { GENERATORS, resolveGenerator, createFinal } from "@/lib/generators";
import { fr } from "@/lib/math";
import { grade } from "@/lib/grade";

const DRAWS = 1000;
const ALL_IDS = [...Object.keys(GENERATORS), "final"];

const PREPA = Object.keys(GENERATORS).map((id) => ({ id_generateur: id, titre: id })).concat({ id_generateur: "final", titre: "Examen final" });

describe("12 générateurs", () => {
  it("il y en a bien 12 (11 unités + examen final)", () => {
    expect(ALL_IDS).toHaveLength(12);
  });

  for (const id of ALL_IDS) {
    it(`${id} : ${DRAWS} tirages propres, réponse attendue acceptée`, () => {
      const g = resolveGenerator(id, PREPA);
      for (let i = 0; i < DRAWS; i++) {
        const q = g();
        const ctx = `${id} → ${q.q} (a = ${q.a})`;
        expect(typeof q.q, ctx).toBe("string");
        expect(q.q.trim().length, ctx).toBeGreaterThan(0);
        expect(q.why.trim().length, ctx).toBeGreaterThan(0);
        expect(Number.isFinite(q.a), ctx).toBe(true);
        for (const s of [q.q, q.why, q.hint ?? ""]) {
          expect(s, ctx).not.toMatch(/NaN|Infinity|undefined/);
        }
        if (q.tol !== undefined) expect(Number.isFinite(q.tol) && q.tol > 0, ctx).toBe(true);
        // ce que l'élève verrait comme « Réponse : … » doit être accepté
        expect(grade(fr(q.a), q), `${ctx} · saisie « ${fr(q.a)} »`).toBe("ok");
      }
    });
  }
});

describe("examen final paramétrable", () => {
  it("ne pioche que dans les unités du parcours", () => {
    const nine = [
      { id_generateur: "rel", titre: "Les nombres négatifs" },
      { id_generateur: "frac", titre: "Fractions et pourcentages" },
      { id_generateur: "pow", titre: "Puissances" },
      { id_generateur: "eq1", titre: "Équations" },
      { id_generateur: "final", titre: "Examen final" },
    ];
    const g = resolveGenerator("final", nine);
    const tags = new Set<string>();
    for (let i = 0; i < 500; i++) tags.add(g().tag!);
    expect([...tags].sort()).toEqual(nine.slice(0, 4).map((u) => u.titre).sort());
  });

  it("refuse un parcours vide", () => {
    expect(() => createFinal([])).toThrow();
  });
});
