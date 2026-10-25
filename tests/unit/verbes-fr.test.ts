import { describe, expect, it } from "vitest";
import { futur, imparfait, passeCompose, present, pronom } from "@/lib/generators/data/verbes-fr";

// Formes vérifiées à la main : si l'une change, la règle est fausse.
describe("conjugaison française", () => {
  it.each([
    ["parler", "present", ["parle", "parles", "parle", "parlons", "parlez", "parlent"]],
    ["manger", "present", ["mange", "manges", "mange", "mangeons", "mangez", "mangent"]],
    ["commencer", "present", ["commence", "commences", "commence", "commençons", "commencez", "commencent"]],
    ["finir", "present", ["finis", "finis", "finit", "finissons", "finissez", "finissent"]],
    ["faire", "present", ["fais", "fais", "fait", "faisons", "faites", "font"]],
    ["manger", "imparfait", ["mangeais", "mangeais", "mangeait", "mangions", "mangiez", "mangeaient"]],
    ["commencer", "imparfait", ["commençais", "commençais", "commençait", "commencions", "commenciez", "commençaient"]],
    ["finir", "imparfait", ["finissais", "finissais", "finissait", "finissions", "finissiez", "finissaient"]],
    ["être", "imparfait", ["étais", "étais", "était", "étions", "étiez", "étaient"]],
    ["faire", "imparfait", ["faisais", "faisais", "faisait", "faisions", "faisiez", "faisaient"]],
    ["voir", "imparfait", ["voyais", "voyais", "voyait", "voyions", "voyiez", "voyaient"]],
    ["prendre", "imparfait", ["prenais", "prenais", "prenait", "prenions", "preniez", "prenaient"]],
    ["parler", "futur", ["parlerai", "parleras", "parlera", "parlerons", "parlerez", "parleront"]],
    ["finir", "futur", ["finirai", "finiras", "finira", "finirons", "finirez", "finiront"]],
    ["aller", "futur", ["irai", "iras", "ira", "irons", "irez", "iront"]],
    ["venir", "futur", ["viendrai", "viendras", "viendra", "viendrons", "viendrez", "viendront"]],
    ["voir", "futur", ["verrai", "verras", "verra", "verrons", "verrez", "verront"]],
  ] as const)("%s au %s", (v, t, forms) => {
    const f = t === "present" ? present(v) : t === "imparfait" ? imparfait(v) : futur(v);
    expect(f).toEqual(forms);
  });

  it("passé composé et accords avec être", () => {
    expect(passeCompose("manger", 0)).toBe("ai mangé");
    expect(passeCompose("finir", 3)).toBe("avons fini");
    expect(passeCompose("prendre", 5)).toBe("ont pris");
    expect(passeCompose("aller", 2, true)).toBe("est allée");
    expect(passeCompose("venir", 5)).toBe("sont venus");
    expect(passeCompose("tomber", 5, true)).toBe("sont tombées");
    expect(passeCompose("devoir", 1)).toBe("as dû");
  });

  it("élision du pronom", () => {
    expect(pronom(0, "aime")).toBe("j’");
    expect(pronom(0, "ai mangé")).toBe("j’");
    expect(pronom(0, "parle")).toBe("je ");
    expect(pronom(5, "sont venues", true)).toBe("elles ");
  });
});
