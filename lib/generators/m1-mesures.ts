import { R, pick } from "../math";
import type { Question } from "./types";
import { melange, qcm, tirer } from "./m1-outils";

// [ce qu'on mesure, unité qui convient, grandeur]
const UNITE: [string, string, string][] = [
  ["la longueur de ton pupitre", "des centimètres", "longueur"],
  ["la longueur du préau", "des mètres", "longueur"],
  ["la masse d’une courge", "des kilogrammes", "masse"],
  ["l’eau d’un arrosoir", "des litres", "contenance"],
  ["la durée de la récréation", "des minutes", "temps"],
  ["la durée d’un trajet en train de Genève à Zurich", "des heures", "temps"],
];
const AUTRES: Record<string, string[]> = {
  longueur: ["des kilogrammes", "des litres", "des minutes"],
  masse: ["des centimètres", "des litres", "des heures"],
  contenance: ["des mètres", "des kilogrammes", "des minutes"],
  temps: ["des mètres", "des kilogrammes", "des litres"],
};
// [question, bonne réponse, distracteurs]
const ORDRE: [string, string, string[]][] = [
  ["Une porte mesure environ…", "2 m de haut", ["2 cm de haut", "20 m de haut"]],
  ["Un crayon neuf mesure environ…", "18 cm", ["18 m", "2 cm"]],
  ["Un enfant de 7 ans pèse environ…", "25 kg", ["2 kg", "250 kg"]],
  ["Une bouteille d’eau contient environ…", "1 litre", ["100 litres", "1000 litres"]],
  ["Une récréation dure environ…", "15 minutes", ["15 heures", "15 jours"]],
  ["Une nuit de sommeil d’un enfant dure environ…", "10 heures", ["10 minutes", "10 jours"]],
];
const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const RUBANS = ["rouge", "bleu", "vert"];

/** Mesurer en reportant une unité, choisir une unité, estimer, classer indirectement, durées : PER MSN 14, 3e-4e. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const objets = tirer([["Le crayon", "La gomme"], ["Le livre", "La gomme"], ["La règle", "Le crayon"]], 1)[0], g = R(5, 12), p = R(2, g - 2);
    if (Math.random() < 0.5) {
      return { q: `On mesure avec des trombones 📎. ${objets[0]} mesure ${g} 📎, ${objets[1].toLowerCase()} mesure ${p} 📎. Combien de 📎 de plus pour ${objets[0].toLowerCase()} ?`, txt: 1, a: g - p, why: `On compare avec la même unité : ${g} − ${p} = ${g - p} trombones de plus.` };
    }
    const n = R(3, 12);
    return { q: `Chaque ▬ mesure 1 cm. Combien mesure cette bande ?  ${"▬".repeat(n)}`, txt: 1, a: n, hint: "En cm", why: `On compte combien de fois l’unité est reportée : ${n} fois 1 cm = ${n} cm.` };
  }
  if (t === 1) {
    const r = R(2, 4), c = R(2, 5);
    return { q: `Un tapis est recouvert de ${r} rangées de ${c} carreaux ⬜. Combien de carreaux en tout ?`, txt: 1, a: r * c, why: `${Array.from({ length: r }, () => c).join(" + ")} = ${r * c} carreaux.` };
  }
  if (t === 2) {
    const [quoi, a, g] = pick(UNITE);
    return { q: `Pour mesurer ${quoi}, tu utilises…`, txt: 1, a, choices: qcm(a, AUTRES[g], 4), why: `${quoi[0].toUpperCase() + quoi.slice(1)} : c’est une ${g === "temps" ? "durée" : g}, on la mesure en ${a.replace("des ", "")}.` };
  }
  if (t === 3) {
    const [q, a, autres] = pick(ORDRE);
    return { q, txt: 1, a, choices: qcm(a, autres), why: `Réponse réaliste : ${a}. Les autres sont beaucoup trop petites ou trop grandes.` };
  }
  if (t === 4) {
    const [x, y, z] = tirer(RUBANS, 3), long = Math.random() < 0.5;
    // ordre réel du plus long au plus court : x, y, z
    const phrases = Math.random() < 0.5
      ? `Le ruban ${x} est plus long que le ruban ${y}. Le ruban ${y} est plus long que le ruban ${z}.`
      : `Le ruban ${z} est plus court que le ruban ${y}. Le ruban ${x} est plus long que le ruban ${y}.`;
    const a = `le ruban ${long ? x : z}`;
    return { q: `${phrases} Quel ruban est le plus <b>${long ? "long" : "court"}</b> ?`, txt: 1, a, choices: melange([x, y, z].map((c) => `le ruban ${c}`)), why: `Du plus long au plus court : ${x}, ${y}, ${z}. Le plus ${long ? "long" : "court"} est ${a}.` };
  }
  if (t === 5) {
    if (Math.random() < 0.5) {
      const h = R(1, 8), d = R(1, 3);
      return { q: `Le match commence à ${h} heures. Il dure ${d} heure${d > 1 ? "s" : ""}. À quelle heure finit-il ?`, txt: 1, a: h + d, hint: "Réponds en heures.", why: `${h} heures + ${d} heure${d > 1 ? "s" : ""} = ${h + d} heures.` };
    }
    const j = R(0, 6), k = R(1, 3), a = JOURS[(j + k) % 7];
    return { q: `Aujourd’hui, c’est <b>${JOURS[j]}</b>. Quel jour serons-nous dans ${k} jour${k > 1 ? "s" : ""} ?`, txt: 1, a, choices: qcm(a, [JOURS[(j + k + 1) % 7], JOURS[(j + k + 6) % 7], JOURS[(j + 6) % 7]]), why: `On avance de ${k} jour${k > 1 ? "s" : ""} : ${Array.from({ length: k + 1 }, (_, i) => JOURS[(j + i) % 7]).join(", ")}.` };
  }
  const a = R(3, 12), b = R(2, 8);
  return { q: `Tu mets bout à bout un ruban de ${a} cm et un ruban de ${b} cm. Quelle longueur obtiens-tu ?`, txt: 1, a: a + b, hint: "En cm", why: `Bout à bout, les longueurs s’ajoutent : ${a} + ${b} = ${a + b} cm.` };
}
