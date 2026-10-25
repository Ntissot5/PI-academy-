import { pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE } from "./data/l2-outils";

// [infinitif, traduction, du, ihr, Sie, autres formes du acceptées, complément]
const V: [string, string, string, string, string, string[], string][] = [
  ["kommen", "venir", "Komm", "Kommt", "Kommen Sie", ["Komme"], "bitte hierher"],
  ["schreiben", "écrire", "Schreib", "Schreibt", "Schreiben Sie", ["Schreibe"], "das Datum an die Tafel"],
  ["lesen", "lire", "Lies", "Lest", "Lesen Sie", [], "den Text"],
  ["machen", "faire", "Mach", "Macht", "Machen Sie", ["Mache"], "die Übung 3"],
  ["öffnen", "ouvrir", "Öffne", "Öffnet", "Öffnen Sie", [], "das Buch"],
  ["sprechen", "parler", "Sprich", "Sprecht", "Sprechen Sie", [], "bitte lauter"],
  ["nehmen", "prendre", "Nimm", "Nehmt", "Nehmen Sie", [], "einen Bleistift"],
  ["geben", "donner", "Gib", "Gebt", "Geben Sie", [], "mir das Heft"],
  ["helfen", "aider", "Hilf", "Helft", "Helfen Sie", [], "mir bitte"],
  ["sein", "être", "Sei", "Seid", "Seien Sie", [], "bitte leise"],
  ["warten", "attendre", "Warte", "Wartet", "Warten Sie", [], "einen Moment"],
  ["schauen", "regarder", "Schau", "Schaut", "Schauen Sie", ["Schaue"], "an die Tafel"],
  ["fahren", "rouler", "Fahr", "Fahrt", "Fahren Sie", ["Fahre"], "langsam"],
  ["essen", "manger", "Iss", "Esst", "Essen Sie", [], "nicht in der Klasse"],
  ["aufstehen", "se lever", "Steh auf", "Steht auf", "Stehen Sie auf", ["Stehe auf"], ""],
  ["aufpassen", "faire attention", "Pass auf", "Passt auf", "Passen Sie auf", ["Passe auf"], ""],
  ["zuhören", "écouter (quelqu’un)", "Hör zu", "Hört zu", "Hören Sie zu", ["Höre zu"], ""],
  ["aufräumen", "ranger", "Räum auf", "Räumt auf", "Räumen Sie auf", ["Räume auf"], ""],
];

const QUI = [
  { k: 2, lab: "à un·e camarade (du)" },
  { k: 3, lab: "à toute la classe (ihr)" },
  { k: 4, lab: "poliment, à un adulte (Sie)" },
] as const;

/** Imperativ : donner une consigne avec du, ihr ou Sie. */
export function gen(): Question {
  const v = pick(V);
  const qui = pick(QUI);
  const forme = v[qui.k] as string;
  const accept = qui.k === 2 ? v[5] : [];
  const avecCompl = (f: string) => {
    if (!v[6]) return f;
    const [verbe, ...reste] = f.split(" ");
    return [verbe, ...reste.filter((x) => x === "Sie"), v[6], ...reste.filter((x) => x !== "Sie")].join(" ");
  };
  const phrase = `${avecCompl(forme)}!`;
  const separable = forme.split(" ").some((x) => x !== "Sie" && x !== forme.split(" ")[0]);
  return {
    q: `Impératif de <b>${v[0]}</b> (${v[1]}), ${qui.lab}${v[6] ? ` : <b>… ${v[6]}!</b>` : "."}`,
    txt: 1,
    a: forme,
    accept: [...accept, `${avecCompl(forme)}`, ...accept.map(avecCompl)],
    keys: KEYS_DE,
    hint: separable ? "La particule va à la fin." : "Écris le verbe seul (avec Sie si c’est poli).",
    why: `${phrase}${qui.k === 2 ? " Avec du : le radical, sans -st et sans pronom." : qui.k === 3 ? " Avec ihr : la forme du présent, sans pronom." : v[0] === "sein" ? " Avec Sie : forme spéciale, seien Sie." : " Avec Sie : l’infinitif suivi de Sie."}${["lesen", "sprechen", "nehmen", "geben", "helfen", "essen"].includes(v[0]) && qui.k === 2 ? " Le e devient i comme au présent (du liest → lies)." : ""}`,
  };
}
