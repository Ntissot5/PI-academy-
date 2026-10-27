import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE } from "./data/l2-outils";

// [adjectif, traduction, comparatif, superlatif (am …), phrase avec … et als]
const K: [string, string, string, string, string][] = [
  ["gross", "grand", "grösser", "am grössten", "Ein Elefant ist … als eine Maus."],
  ["klein", "petit", "kleiner", "am kleinsten", "Eine Maus ist … als eine Katze."],
  ["alt", "vieux", "älter", "am ältesten", "Mein Grossvater ist … als mein Vater."],
  ["jung", "jeune", "jünger", "am jüngsten", "Meine Schwester ist drei Jahre … als ich."],
  ["schnell", "rapide", "schneller", "am schnellsten", "Ein Zug ist … als ein Velo."],
  ["gut", "bon", "besser", "am besten", "Meine Note ist heute … als letzte Woche."],
  ["lang", "long", "länger", "am längsten", "Der Rhein ist … als die Aare."],
  ["kurz", "court", "kürzer", "am kürzesten", "Im Winter sind die Tage … als im Sommer."],
  ["warm", "chaud", "wärmer", "am wärmsten", "Im Juli ist es … als im Januar."],
  ["kalt", "froid", "kälter", "am kältesten", "Im Januar ist es … als im Mai."],
  ["hoch", "haut", "höher", "am höchsten", "Das Matterhorn ist … als der Salève."],
  ["teuer", "cher", "teurer", "am teuersten", "Ein Auto ist … als ein Velo."],
  ["schwer", "lourd", "schwerer", "am schwersten", "Ein Pferd ist … als ein Hund."],
  ["viel", "beaucoup", "mehr", "am meisten", "Ich habe … Hausaufgaben als mein Bruder."],
  ["gern", "volontiers", "lieber", "am liebsten", "Ich esse … Pizza als Suppe."],
  ["interessant", "intéressant", "interessanter", "am interessantesten", "Dieses Buch ist … als der Film."],
];

/** Komparativ und Superlativ : -er (souvent avec tréma) + als ; am …sten. */
export function gen(): Question {
  const t = R(0, 3);
  const [adj, fr, comp, sup, phrase] = pick(t === 2 ? K.filter((k) => ["gross", "klein", "alt", "jung", "schnell"].includes(k[0])) : K);
  const irr = ["gut", "viel", "gern", "hoch"].includes(adj);
  if (t === 3) {
    return {
      q: `Superlatif de <b>${adj}</b> (${fr}), avec am : <b>am …</b>`,
      txt: 1,
      a: sup,
      accept: [sup.replace("am ", "")],
      keys: KEYS_DE,
      hint: "am + adjectif + -sten",
      why: `${adj} → ${comp} → ${sup}.${irr ? " Forme irrégulière à apprendre par cœur." : ""}`,
    };
  }
  if (t === 2) {
    const egal = R(0, 1) === 0;
    const q = egal ? `Ich bin so ${adj} … du.` : `Ich bin ${comp} … du.`;
    return {
      q: `Complète avec <b>als</b> ou <b>wie</b> : <b>${q}</b>`,
      txt: 1,
      a: egal ? "wie" : "als",
      choices: ["als", "wie"],
      why: egal ? `so ${adj} wie = aussi ${fr} que (égalité).` : `${comp} als = plus ${fr} que (comparatif + als).`,
    };
  }
  return {
    q: `Comparatif de <b>${adj}</b> (${fr}) : <b>${phrase}</b>`,
    txt: 1,
    a: comp,
    keys: KEYS_DE,
    hint: "adjectif + -er, souvent avec un tréma.",
    why: `${phrase.replace("…", comp)} ${adj} → ${comp}${irr ? " : forme irrégulière." : comp.match(/[äöü]/) && !adj.match(/[äöü]/) ? " : on ajoute -er et un tréma." : " : on ajoute -er."}`,
  };
}
