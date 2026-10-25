import { createRequire } from "node:module";
import { describe, expect, it } from "vitest";

const { zurichDate, addDays } = createRequire(import.meta.url)("../../pocketbase/pb_hooks/lib/zurich.js") as {
  zurichDate: (ms: number) => string;
  addDays: (d: string, n: number) => string;
};

describe("jour Europe/Zurich (serveur)", () => {
  it.each([
    ["2026-01-15T22:59:00Z", "2026-01-15"], // hiver : UTC+1
    ["2026-01-15T23:00:00Z", "2026-01-16"],
    ["2026-07-10T21:59:00Z", "2026-07-10"], // été : UTC+2
    ["2026-07-10T22:00:00Z", "2026-07-11"],
    ["2026-03-29T00:59:00Z", "2026-03-29"], // passage à l'heure d'été
    ["2026-10-24T22:30:00Z", "2026-10-25"], // nuit du changement d'heure d'octobre
    ["2026-10-25T22:59:00Z", "2026-10-25"],
    ["2026-10-25T23:00:00Z", "2026-10-26"],
    ["2026-12-31T23:30:00Z", "2027-01-01"],
  ])("%s → %s", (iso, day) => {
    expect(zurichDate(Date.parse(iso))).toBe(day);
  });

  it("addDays traverse les mois et les années", () => {
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-10-25", -27)).toBe("2026-09-28");
  });
});
