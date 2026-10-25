import { describe, expect, it } from "vitest";
import { GENERATORS } from "@/lib/generators";
import { OBJECTIFS_PER, PER_PAR_GENERATEUR, perPourUnite } from "@/lib/per";
import seed from "@/pocketbase/seed/parcours.json";

describe("correspondance avec le Plan d'études romand", () => {
  it("chaque type d'exercices a une correspondance, avec des codes connus", () => {
    for (const id of Object.keys(GENERATORS)) {
      const c = PER_PAR_GENERATEUR[id];
      expect(c, id).toBeTruthy();
      expect(c.objectifs.length > 0 || c.horsPer, `${id} : ni objectif ni « hors PER »`).toBe(true);
      for (const code of c.objectifs) expect(OBJECTIFS_PER[code], `${id} → ${code}`).toBeTruthy();
    }
  });

  it("les parcours de l'école obligatoire ne contiennent que des contenus du PER", () => {
    for (const p of (seed as { parcours: { slug: string; public: string; plan?: string; unites: { id_generateur: string }[] }[] }).parcours) {
      if (p.public !== "ecole" || p.plan === "lp21" || p.plan === "pds") continue;
      for (const u of p.unites) {
        if (u.id_generateur === "final") continue;
        expect(PER_PAR_GENERATEUR[u.id_generateur]?.horsPer, `${p.slug} contient ${u.id_generateur}, hors PER`).not.toBe(true);
      }
    }
  });

  it("l'examen final reprend les objectifs de son parcours", () => {
    const units = [{ id_generateur: "rel" }, { id_generateur: "eq1" }, { id_generateur: "final" }];
    expect(perPourUnite("final", units).objectifs).toEqual(["MSN 32", "MSN 33"]);
  });
});
