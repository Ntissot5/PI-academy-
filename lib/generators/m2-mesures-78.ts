import { R, pick } from "../math";
import { arr, nb, qcm, repDec } from "./m2-outils";
import type { Question } from "./types";

// [grande unité, petite unité, facteur, aide]
const CONV: [string, string, number][] = [
  ["km", "m", 1000], ["m", "cm", 100], ["m", "dm", 10], ["dm", "cm", 10], ["cm", "mm", 10], ["m", "mm", 1000],
  ["t", "kg", 1000], ["kg", "g", 1000], ["h", "min", 60], ["min", "s", 60], ["l", "dl", 10], ["l", "cl", 100],
  ["dm<sup>2</sup>", "cm<sup>2</sup>", 100], ["m<sup>2</sup>", "dm<sup>2</sup>", 100], ["m<sup>2</sup>", "cm<sup>2</sup>", 10000],
  ["dm<sup>3</sup>", "cm<sup>3</sup>", 1000], ["m<sup>3</sup>", "dm<sup>3</sup>", 1000],
];

const rep = (x: number): { a: number } | { a: string; accept: string[] } => (Math.abs(Math.round(x * 100) - x * 100) < 1e-6 ? { a: arr(x, 2) } : repDec(x));

/** Mesures (7e-8e) : conversions (longueurs, masses, durées, capacités, aires, volumes), angles au rapporteur, doubler, fractionner, comparer, autres unités. */
export function gen(): Question {
  const t = R(0, 8);
  if (t === 0 || t === 1) {
    const [G, p, f] = pick(CONV), versPetit = Math.random() < 0.55;
    const temps = f === 60;
    if (versPetit) {
      const v = temps ? pick([R(2, 9), R(2, 9) + 0.5]) : pick([R(2, 99), R(11, 99) / 10, R(101, 999) / 100]);
      const r = arr(v * f, 3);
      return { q: `${nb(v)} ${G} = ? ${p}`, ...rep(r), hint: `1 ${G} = ${nb(f)} ${p}`, why: `On multiplie par ${nb(f)} : ${nb(v)} × ${nb(f)} = ${nb(r)} ${p}.` };
    }
    const v = temps ? R(2, 12) * 30 : pick([R(2, 99) * f, R(11, 999) * (f / 10 >= 1 ? f / 10 : 1)]);
    const r = arr(v / f, 3);
    return { q: `${nb(v)} ${p} = ? ${G}`, ...rep(r), hint: `${nb(f)} ${p} = 1 ${G}`, why: `On divise par ${nb(f)} : ${nb(v)} : ${nb(f)} = ${nb(r)} ${G}.` };
  }
  if (t === 2) {
    const a = R(0, 17) * 10, l = R(2, 17) * 5, b = Math.min(180, a + l);
    if (Math.random() < 0.5) return { q: `Sur le rapporteur, un côté de l’angle passe par la graduation <b>${a}°</b> et l’autre par <b>${b}°</b> (même échelle). Combien mesure l’angle, en degrés ?`, txt: 1, a: b - a, hint: "Si on ne part pas de 0°, on soustrait", why: `${b} − ${a} = ${b - a}°.` };
    const m = pick([R(5, 85), 90, R(95, 175), 180]);
    const ty = m < 90 ? "aigu" : m === 90 ? "droit" : m < 180 ? "obtus" : "plat";
    return { q: `Un angle mesure ${m}°. Comment s’appelle-t-il ?`, txt: 1, a: ty, choices: ["aigu", "droit", "obtus", "plat"], why: "Aigu : moins de 90° ; droit : 90° ; obtus : entre 90° et 180° ; plat : 180°." };
  }
  if (t === 3) {
    const it = pick([
      () => { const h = R(1, 3), m = R(1, 11) * 5, k = pick([2, 3]); return [`Le ${k === 2 ? "double" : "triple"} de ${h} h ${m} min, en minutes`, k * (h * 60 + m), `${h} h ${m} min = ${h * 60 + m} min ; × ${k} = ${k * (h * 60 + m)} min.`] as const; },
      () => { const g = R(11, 99) * 25, k = pick([2, 3]); return [`Le ${k === 2 ? "double" : "triple"} de ${nb(g / 1000)} kg, en grammes`, k * g, `${nb(g / 1000)} kg = ${g} g ; × ${k} = ${nb(k * g)} g.`] as const; },
      () => { const m = R(2, 8), k = pick([2, 3]); return [`Le ${k === 2 ? "double" : "triple"} de ${m},5 m, en cm`, k * (m * 100 + 50), `${m},5 m = ${m * 100 + 50} cm ; × ${k} = ${k * (m * 100 + 50)} cm.`] as const; },
    ]);
    const [q, a, w] = it();
    return { q: `Calcule ${q[0].toLowerCase() + q.slice(1)}.`, txt: 1, a, why: w };
  }
  if (t === 4) {
    const it = pick([
      () => { const m = pick([2, 4, 6, 8]); return [`les trois quarts de ${m} m, en cm`, (m * 100 * 3) / 4, `${m} m = ${m * 100} cm ; ${m * 100} : 4 = ${(m * 100) / 4}, × 3 = ${(m * 300) / 4} cm.`] as const; },
      () => { const k = pick([[2, "la moitié"], [3, "le tiers"], [4, "le quart"], [6, "le sixième"]] as [number, string][]); return [`${k[1]} d’une heure, en minutes`, 60 / k[0], `60 min : ${k[0]} = ${60 / k[0]} min.`] as const; },
      () => { const kg = pick([3, 6, 9, 12]); return [`le tiers de ${kg} kg, en grammes`, (kg * 1000) / 3, `${kg} kg = ${kg * 1000} g ; : 3 = ${nb((kg * 1000) / 3)} g.`] as const; },
      () => { const l = pick([2, 3, 5]); return [`le quart de ${l} litres, en dl`, (l * 10) / 4, `${l} l = ${l * 10} dl ; : 4 = ${nb((l * 10) / 4)} dl.`] as const; },
    ]);
    const [q, a, w] = it();
    return { q: `Calcule ${q}.`, txt: 1, a, why: w };
  }
  if (t === 5) {
    const g = [1000 + R(1, 30) * 10, R(850, 1150), 1000 + R(31, 60) * 10, R(1, 9) * 100 + 1000];
    const u = [...new Set(g)];
    const lab = u.map((v, i) => (i === 0 ? `${nb(v / 1000)} kg` : i === 1 ? `${v} g` : i === 2 ? `1 kg ${v - 1000} g` : `${nb(v)} g`));
    const grand = Math.random() < 0.5, ix = u.indexOf(grand ? Math.max(...u) : Math.min(...u));
    return { q: `Quelle masse est la plus ${grand ? "grande" : "petite"} ?`, txt: 1, a: lab[ix], choices: qcm(lab[ix], lab), hint: "Écris tout en grammes", why: `En grammes : ${u.map((v) => `${nb(v)} g`).join(", ")}. La plus ${grand ? "grande" : "petite"} est ${lab[ix]}.` };
  }
  if (t === 6) {
    const k = R(0, 1);
    if (k === 0) { const n = pick([5, 10, 15, 20, 25, 50]); return { q: `Aux États-Unis, on mesure les écrans en pouces : 1 pouce = 2,54 cm. Combien de cm mesurent ${n} pouces ?`, txt: 1, a: arr(n * 2.54), why: `${n} × 2,54 = ${nb(arr(n * 2.54))} cm.` }; }
    const n = pick([5, 10, 20, 25, 50]);
    return { q: `En Angleterre, les distances routières sont en miles : 1 mile ≈ 1,6 km. Environ combien de km font ${n} miles ?`, txt: 1, a: arr(n * 1.6), why: `${n} × 1,6 = ${nb(arr(n * 1.6))} km environ (1 mile = 1,609 km).` };
  }
  if (t === 7) {
    const d = R(5, 40), l = R(15, 90);
    return { q: `Sur une règle graduée en mm, un segment commence à <b>${nb(d / 10)} cm</b> et finit à <b>${nb((d + l) / 10)} cm</b>. Combien mesure-t-il, en mm ?`, txt: 1, a: l, hint: "1 cm = 10 mm", why: `${nb((d + l) / 10)} − ${nb(d / 10)} = ${nb(l / 10)} cm = ${l} mm.` };
  }
  const it = pick([
    () => { const v = R(2, 9); return [`Un aquarium contient ${v} dm<sup>3</sup> d’eau. Combien de litres ?`, v, `1 dm<sup>3</sup> = 1 litre : ${v} litres.`] as const; },
    () => { const v = R(2, 20) * 250; return [`Une bouteille contient ${nb(v)} cm<sup>3</sup>. Combien de litres ?`, arr(v / 1000), `1 litre = 1 dm<sup>3</sup> = 1000 cm<sup>3</sup> : ${nb(v)} : 1000 = ${nb(arr(v / 1000))} litre${v >= 2000 ? "s" : ""}.`] as const; },
    () => { const v = R(2, 9) * 10; return [`Le train part à 8 h 47 et le trajet dure ${v} min. Combien de minutes après 9 h arrive-t-il ?`, 47 + v - 60, `8 h 47 + 13 min = 9 h 00 ; il reste ${v - 13} min : ${v - 13}.`] as const; },
  ]);
  const [q, a, w] = it();
  return { q, txt: 1, a, why: w };
}
