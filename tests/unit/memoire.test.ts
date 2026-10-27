import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";
import * as demo from "@/demo/shims/memoire";

type Serie = { streak: number; gels: number; geles: string[] };
const srv = createRequire(import.meta.url)("../../pocketbase/pb_hooks/lib/memoire.js") as {
  serieAvecGels: (d: Record<string, number>, t: string) => Serie;
  prochainIntervalle: (i: number, ok: boolean) => number;
};

const jour = (n: number) => new Date(Date.UTC(2026, 9, 1 + n)).toISOString().slice(0, 10);
/** Historique : actif les jours listés (indices à partir du 1er octobre 2026). */
const hist = (actifs: number[]) => Object.fromEntries(actifs.map((n) => [jour(n), 5]));

describe("série de jours avec gels", () => {
  it("compte les jours d'affilée, aujourd'hui vide ne casse rien", () => {
    expect(srv.serieAvecGels(hist([0, 1, 2]), jour(2)).streak).toBe(3);
    expect(srv.serieAvecGels(hist([0, 1, 2]), jour(3)).streak).toBe(3);
  });

  it("sans gel, un jour manqué remet à zéro", () => {
    expect(srv.serieAvecGels(hist([0, 1, 3]), jour(3)).streak).toBe(1);
  });

  it("7 jours d'affilée donnent un gel, qui sauve le jour manqué", () => {
    const r = srv.serieAvecGels(hist([0, 1, 2, 3, 4, 5, 6, 8, 9]), jour(9));
    expect(r.streak).toBe(9);
    expect(r.gels).toBe(0);
    expect(r.geles).toEqual([jour(7)]);
  });

  it("au plus 2 gels en réserve", () => {
    const actifs = Array.from({ length: 30 }, (_, i) => i);
    expect(srv.serieAvecGels(hist(actifs), jour(29)).gels).toBe(2);
  });

  it("deux jours manqués avec un seul gel : la série repart", () => {
    const r = srv.serieAvecGels(hist([0, 1, 2, 3, 4, 5, 6, 9]), jour(9));
    expect(r.streak).toBe(1);
    expect(r.geles).toEqual([]);
  });

  it("la démo calcule exactement comme le serveur", () => {
    for (let k = 0; k < 300; k++) {
      const actifs = Array.from({ length: 60 }, (_, i) => i).filter(() => Math.random() < 0.8);
      const today = jour(59 + Math.floor(Math.random() * 3));
      expect(demo.serieAvecGels(hist(actifs), today)).toEqual(srv.serieAvecGels(hist(actifs), today));
    }
  });
});

describe("répétition espacée", () => {
  it("espace après une réussite, revient à 1 jour après un échec", () => {
    const suite = [1];
    for (let i = 0; i < 7; i++) suite.push(srv.prochainIntervalle(suite[suite.length - 1], true));
    expect(suite).toEqual([1, 3, 7, 14, 30, 60, 120, 120]);
    expect(srv.prochainIntervalle(30, false)).toBe(1);
    for (const iv of [0, 1, 3, 7, 14, 30, 60, 120]) for (const ok of [true, false]) {
      expect(demo.prochainIntervalle(iv, ok)).toBe(srv.prochainIntervalle(iv, ok));
    }
  });
});
