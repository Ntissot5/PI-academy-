import { describe, expect, it } from "vitest";
import { fr, parse } from "@/lib/math";
import { grade } from "@/lib/grade";

describe("parse()", () => {
  it.each([
    ["−3", -3], ["-3", -3], ["–3", -3], ["4,5", 4.5], ["4.5", 4.5], ["7/12", 7 / 12],
    [" 1 000 ", 1000], ["-7/12", -7 / 12], [",5", 0.5], ["0", 0],
  ])("%s → %d", (s, v) => {
    expect(parse(s)).toBeCloseTo(v, 12);
  });

  it.each(["", "abc", "1/0", "3x", "--2"])("« %s » est illisible", (s) => {
    expect(grade(s, { a: 0 })).toBe("unreadable");
  });
});

describe("fr()", () => {
  it.each([
    [-3, "−3"], [4.5, "4,5"], [1 / 3, "0,33"], [2_000_000, "2 000 000"], [Infinity, "—"], [-0, "0"],
  ])("%d → %s", (n, s) => {
    expect(fr(n)).toBe(s);
  });
});
