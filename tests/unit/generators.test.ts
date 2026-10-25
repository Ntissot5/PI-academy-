import { describe, expect, it } from "vitest";
import { GENERATORS, GENERATOR_LABEL, DEFAULT_ICON, resolveGenerator, createFinal } from "@/lib/generators";
import { CANTONS } from "@/lib/cantons";
import { answerText, grade } from "@/lib/grade";

const DRAWS = 1000;
const MATHS = ["rel", "frac", "pow", "eq1", "geo", "iso", "lin", "eq2", "trig", "log", "der"];
const ALL_IDS = [...Object.keys(GENERATORS), "final"];
const ALL_UNITS = Object.keys(GENERATORS).map((id) => ({ id_generateur: id, titre: id })).concat({ id_generateur: "final", titre: "Examen final" });
const PREPA = MATHS.map((id) => ({ id_generateur: id, titre: id })).concat({ id_generateur: "final", titre: "Examen final" });

describe("générateurs", () => {
  it("les 12 du prototype sont là (11 unités + examen final)", () => {
    for (const id of MATHS) expect(GENERATORS[id], id).toBeTypeOf("function");
  });

  it("chaque générateur a un libellé et une icône", () => {
    for (const id of ALL_IDS) {
      expect(GENERATOR_LABEL[id], id).toBeTruthy();
      expect(DEFAULT_ICON[id], id).toBeTruthy();
    }
  });

  for (const id of ALL_IDS) {
    it(`${id} : ${DRAWS} tirages propres, réponse attendue acceptée`, () => {
      const g = resolveGenerator(id, id === "final" ? PREPA : ALL_UNITS);
      for (let i = 0; i < DRAWS; i++) {
        const canton = CANTONS[i % CANTONS.length].code;
        const q = g({ canton });
        const ctx = `${id} → ${q.q} (a = ${q.a})`;
        expect(q.q.trim().length, ctx).toBeGreaterThan(0);
        expect(q.why.trim().length, ctx).toBeGreaterThan(0);
        if (typeof q.a === "number") expect(Number.isFinite(q.a), ctx).toBe(true);
        else expect(q.a.trim().length, ctx).toBeGreaterThan(0);
        for (const s of [q.q, q.why, q.hint ?? "", ...(q.choices ?? []), ...(q.accept ?? [])]) {
          expect(s, ctx).not.toMatch(/NaN|Infinity|undefined|null(?!$)/);
        }
        if (q.tol !== undefined) expect(Number.isFinite(q.tol) && q.tol > 0, ctx).toBe(true);
        if (q.choices) {
          expect(q.choices, ctx).toContain(q.a);
          expect(new Set(q.choices).size, `${ctx} · propositions en double`).toBe(q.choices.length);
          expect(q.choices.length, ctx).toBeGreaterThanOrEqual(2);
          for (const c of q.choices) expect(grade(c, q), `${ctx} · proposition « ${c} »`).toBe(c === q.a ? "ok" : "ko");
        }
        // ce que l'élève verrait comme « Réponse : … » doit être accepté
        expect(grade(answerText(q), q), `${ctx} · saisie « ${answerText(q)} »`).toBe("ok");
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
