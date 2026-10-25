import { describe, expect, it } from "vitest";
import { GENERATORS, resolveGenerator } from "@/lib/generators";
import { OBJECTIFS_PER, PER_PAR_GENERATEUR, SLUG_PREPA, TAG_SECONDAIRE_II, exerciceValide, perPourUnite } from "@/lib/per";
import notions from "@/data/per/per_notions.json";
import seed from "@/pocketbase/seed/parcours.json";
import seedPer from "@/pocketbase/seed/parcours-per.json";

type U = { id_generateur: string; titre: string; statut?: string; per_codes?: string[]; per_notions?: string[]; annee?: string; tag?: string };
type P = { slug: string; public: string; plan?: string; unites: U[] };
const cles = new Set((notions as { cle: string }[]).map((n) => n.cle));
const tous = [...(seed as { parcours: P[] }).parcours, ...(seedPer as { parcours: P[] }).parcours];

describe("rattachement au Plan d'études romand", () => {
  it("chaque type d'exercices est rattaché à au moins une progression officielle, ou marqué secondaire II", () => {
    for (const id of Object.keys(GENERATORS)) {
      const l = PER_PAR_GENERATEUR[id];
      expect(l, id).toBeTruthy();
      if (l.secondaire_II && !l.codes.length) continue;
      expect(l.cles.length, `${id} : aucune progression PER`).toBeGreaterThan(0);
      for (const c of l.cles) expect(cles.has(c), `${id} → clé ${c} absente de per_notions.json`).toBe(true);
      for (const code of l.codes) expect(OBJECTIFS_PER[code], `${id} → ${code}`).toBeTruthy();
      expect(l.annees.length, `${id} : sans année`).toBeGreaterThan(0);
    }
  });

  it("chaque question porte un code PER et une année (sauf secondaire II)", () => {
    for (const id of Object.keys(GENERATORS)) {
      const g = resolveGenerator(id, []);
      for (let i = 0; i < 50; i++) expect(exerciceValide(g(), id), id).toBe(true);
    }
  });

  it("chaque unité a un code PER et une année ; les clés per_notion existent", () => {
    for (const p of tous) {
      for (const u of p.unites) {
        const where = `${p.slug} › ${u.titre}`;
        if (u.tag === TAG_SECONDAIRE_II) continue;
        expect(u.per_codes?.length, `${where} : sans code PER`).toBeGreaterThan(0);
        expect(u.annee, `${where} : sans année`).toBeTruthy();
        for (const c of u.per_notions ?? []) expect(cles.has(c), `${where} → ${c}`).toBe(true);
        if (u.statut === "bientot") expect(u.id_generateur, where).toBe("");
        else expect(u.id_generateur === "final" || !!GENERATORS[u.id_generateur], where).toBe(true);
      }
    }
  });

  it("le secondaire II (trigo, logarithmes, dérivées, Δ) n'apparaît que dans la Prépa EPFL", () => {
    for (const p of tous) {
      for (const u of p.unites) {
        const sec = u.tag === TAG_SECONDAIRE_II || !!PER_PAR_GENERATEUR[u.id_generateur]?.secondaire_II;
        if (sec) expect(p.slug, `${u.id_generateur} dans ${p.slug}`).toBe(SLUG_PREPA);
      }
    }
    for (const id of ["trig", "log", "der", "eq2"]) expect(PER_PAR_GENERATEUR[id].secondaire_II, id).toBeTruthy();
  });

  it("un parcours par année et par discipline, de la 1re à la 11e", () => {
    const slugs = new Set((seedPer as { parcours: P[] }).parcours.map((p) => p.slug));
    for (let n = 1; n <= 11; n++) {
      const a = n === 1 ? "1re" : `${n}e`;
      for (const m of ["mathematiques", "sciences", "francais", "geographie", "histoire"]) expect(slugs.has(`${m}-${a}`), `${m}-${a}`).toBe(true);
      if (n >= 5) for (const m of ["allemand", "citoyennete"]) expect(slugs.has(`${m}-${a}`), `${m}-${a}`).toBe(true);
      if (n >= 7) expect(slugs.has(`anglais-${a}`), `anglais-${a}`).toBe(true);
    }
  });

  it("l'examen final reprend les objectifs de son parcours", () => {
    const units = [{ id_generateur: "rel" }, { id_generateur: "eq1" }, { id_generateur: "final" }];
    expect(perPourUnite({ id_generateur: "final" }, units).codes).toEqual(["MSN 32", "MSN 33"]);
    expect(perPourUnite({ id_generateur: "trig" }).horsPer).toBe(true);
  });
});
