import { describe, expect, it } from "vitest";
import { grade, normText } from "@/lib/grade";
import { zahl } from "@/lib/generators/de-zahlen";
import { gen as citCanton } from "@/lib/generators/cit-canton";
import { CANTONS, languesLabel } from "@/lib/cantons";

describe("réponses en texte", () => {
  it("tolère majuscules, espaces, apostrophes et point final, pas les accents", () => {
    expect(normText("  J’AI   mangé. ")).toBe("j'ai mangé");
    expect(grade("Mangeons", { a: "mangeons" })).toBe("ok");
    expect(grade("mangeons ", { a: "mangeons" })).toBe("ok");
    expect(grade("mangons", { a: "mangeons" })).toBe("ko");
    expect(grade("ete", { a: "été" })).toBe("ko");
    expect(grade("   ", { a: "été" })).toBe("unreadable");
    expect(grade("j'ai", { a: "ai", accept: ["j’ai"] })).toBe("ok");
  });

  it("ß compte comme ss (orthographe suisse)", () => {
    expect(grade("heißt", { a: "heisst" })).toBe("ok");
  });
});

describe("nombres en allemand", () => {
  it.each([
    [13, "dreizehn"], [16, "sechzehn"], [17, "siebzehn"], [21, "einundzwanzig"], [30, "dreissig"],
    [35, "fünfunddreissig"], [67, "siebenundsechzig"], [99, "neunundneunzig"], [100, "hundert"],
    [101, "hunderteins"], [121, "hunderteinundzwanzig"], [200, "zweihundert"], [745, "siebenhundertfünfundvierzig"],
  ])("%d → %s", (n, w) => {
    expect(zahl(n).a).toBe(w);
  });
  it("accepte einhundert et dreißig", () => {
    expect(zahl(130).accept).toContain("einhundertdreißig");
  });
});

describe("cantons", () => {
  it("26 cantons, 46 sièges au Conseil des États", () => {
    expect(CANTONS).toHaveLength(26);
    expect(CANTONS.reduce((s, c) => s + (c.demi ? 1 : 2), 0)).toBe(46);
  });
  it("les cantons bilingues ont la même formulation", () => {
    expect(new Set(["BE", "FR", "VS"].map((c) => languesLabel(CANTONS.find((x) => x.code === c)!)))).toEqual(new Set(["français et allemand"]));
  });
  it("les questions cantonales parlent du canton de l'élève quand il est couvert", () => {
    for (let i = 0; i < 50; i++) expect(citCanton({ canton: "JU" }).q).toContain("Jura");
  });
});
