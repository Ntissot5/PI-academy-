import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { LOTS } from "@/lib/generators/lots";
import { CANTONS } from "@/lib/cantons";
import { answerText, grade } from "@/lib/grade";
// @ts-expect-error module JS sans types
import { resoudreLien, verifierEnClasse } from "@/scripts/lib/per-resolve.mjs";
import notions from "@/data/per/per_notions.json";

// Un lot à la fois : LOT=maths3 npx vitest run tests/unit/lots.test.ts (sinon tous les lots).
const ROOT = path.resolve(__dirname, "../..");
const choisis = process.env.LOT ? [process.env.LOT] : Object.keys(LOTS);
const DRAWS = 1000;

for (const nom of choisis) {
  describe(`lot ${nom}`, () => {
    const lot = LOTS[nom];
    const frag = JSON.parse(fs.readFileSync(path.join(ROOT, `lib/per-generateurs/${nom}.json`), "utf8"));
    const lecons = JSON.parse(fs.readFileSync(path.join(ROOT, `pocketbase/seed/lecons/${nom}.json`), "utf8")).lecons;

    it("existe", () => expect(lot, nom).toBeTruthy());

    it("chaque exercice a un rattachement PER qui retrouve le texte officiel, et une leçon complète", () => {
      for (const id of Object.keys(lot)) {
        const m = frag.generateurs[id];
        expect(m, `${id} : pas de rattachement dans lib/per-generateurs/${nom}.json`).toBeTruthy();
        expect(m.liens.length, `${id} : aucun lien`).toBeGreaterThan(0);
        for (const l of m.liens) expect(resoudreLien(notions, l).length, `${id} → ${l.code} « ${l.notion} » ${l.plage} « ${l.cherche} »`).toBeGreaterThan(0);
        const le = lecons[id];
        expect(le, `${id} : pas de leçon`).toBeTruthy();
        for (const k of ["titre", "regle", "exemple", "image", "piege", "icone"]) expect(String(le[k] ?? "").trim(), `${id}.${k}`).not.toBe("");
      }
      for (const id of Object.keys(frag.generateurs)) expect(lot[id], `${id} : rattaché mais absent du lot`).toBeTruthy();
    });

    it("notions « en classe » : existent dans le PER, avec une raison", () => {
      expect(verifierEnClasse(notions, frag.en_classe ?? [])).toEqual([]);
    });

    for (const [id, x] of Object.entries(lot)) {
      it(`${id} : ${DRAWS} tirages propres, réponse attendue acceptée`, () => {
        expect(x.label.trim(), id).not.toBe("");
        expect(fs.existsSync(path.join(ROOT, `public/icons/${x.icon}.webp`)), `${id} : icône ${x.icon}`).toBe(true);
        for (let i = 0; i < DRAWS; i++) {
          const q = x.gen({ canton: CANTONS[i % CANTONS.length].code });
          const ctx = `${id} → ${q.q} (a = ${q.a})`;
          expect(q.q.trim().length, ctx).toBeGreaterThan(0);
          expect(q.why.trim().length, ctx).toBeGreaterThan(0);
          if (typeof q.a === "number") expect(Number.isFinite(q.a), ctx).toBe(true);
          else expect(q.a.trim().length, ctx).toBeGreaterThan(0);
          for (const s of [q.q, q.why, q.hint ?? "", ...(q.choices ?? []), ...(q.accept ?? [])]) expect(s, ctx).not.toMatch(/NaN|Infinity|undefined|null(?!$)/);
          if (q.choices) {
            expect(q.choices, ctx).toContain(q.a);
            expect(new Set(q.choices).size, `${ctx} · propositions en double`).toBe(q.choices.length);
            expect(q.choices.length, ctx).toBeGreaterThanOrEqual(2);
            for (const c of q.choices) expect(grade(c, q), `${ctx} · proposition « ${c} »`).toBe(c === q.a ? "ok" : "ko");
          }
          expect(grade(answerText(q), q), `${ctx} · saisie « ${answerText(q)} »`).toBe("ok");
        }
      });
    }
  });
}
