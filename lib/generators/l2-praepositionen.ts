import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE } from "./data/l2-outils";

type Art = "der" | "die" | "das";
// Lieux : [nom, genre]
const LIEUX: [string, Art][] = [
  ["Schule", "die"], ["Kino", "das"], ["Garten", "der"], ["Park", "der"], ["Küche", "die"], ["Zimmer", "das"],
  ["Stadt", "die"], ["Bett", "das"], ["Schwimmbad", "das"], ["Wald", "der"], ["Bibliothek", "die"], ["Supermarkt", "der"],
];
const WOHIN: Record<Art, string> = { der: "in den", die: "in die", das: "ins" };
const WO: Record<Art, string> = { der: "im", die: "in der", das: "im" };

// Prépositions à cas fixe : [préposition, cas, sens]
const FIXE: [string, "Dativ" | "Akkusativ", string][] = [
  ["mit", "Dativ", "avec"], ["von", "Dativ", "de"], ["zu", "Dativ", "chez, vers"], ["aus", "Dativ", "hors de, de"], ["bei", "Dativ", "chez, près de"],
  ["nach", "Dativ", "après"], ["seit", "Dativ", "depuis"], ["für", "Akkusativ", "pour"], ["ohne", "Akkusativ", "sans"],
  ["gegen", "Akkusativ", "contre"], ["durch", "Akkusativ", "à travers"], ["um", "Akkusativ", "autour de"],
];
const DET: Record<"Dativ" | "Akkusativ", Record<Art, string>> = {
  Dativ: { der: "einem", die: "einer", das: "einem" },
  Akkusativ: { der: "einen", die: "eine", das: "ein" },
};
// Noms pour les prépositions fixes : [nom, genre, prépositions qui vont avec]
const NOMS: [string, Art, string[]][] = [
  ["Freund", "der", ["mit", "von", "zu", "bei", "für", "ohne", "gegen"]],
  ["Freundin", "die", ["mit", "von", "zu", "bei", "für", "ohne"]],
  ["Kind", "das", ["mit", "von", "zu", "bei", "für", "ohne"]],
  ["Stunde", "die", ["nach", "seit", "für"]],
  ["Jahr", "das", ["seit", "für", "nach"]],
  ["Haus", "das", ["aus", "durch", "um"]],
  ["Wald", "der", ["durch", "aus"]],
  ["See", "der", ["um"]],
];

/** Präpositionen : cas fixe (mit + datif, für + accusatif) et prépositions mixtes (wo ? datif / wohin ? accusatif). */
export function gen(): Question {
  if (R(0, 1) === 0) {
    const [lieu, art] = pick(LIEUX);
    const wohin = R(0, 1) === 0;
    const a = wohin ? WOHIN[art] : WO[art];
    const phrase = wohin ? `Ich gehe … ${lieu}.` : `Ich bin … ${lieu}.`;
    return {
      q: `${wohin ? "Wohin ? (où vas-tu ?)" : "Wo ? (où es-tu ?)"} <b>${phrase}</b> (${art} ${lieu})`,
      txt: 1,
      a,
      choices: [WOHIN[art], WO[art]],
      why: `${phrase.replace("…", a)} ${wohin ? "Mouvement vers un lieu (wohin ?) → accusatif" : "Position, sans déplacement (wo ?) → datif"}${art === "das" && wohin ? " : in + das = ins." : art !== "die" && !wohin ? " : in + dem = im." : "."}`,
    };
  }
  const [nom, art, preps] = pick(NOMS);
  const prep = pick(preps);
  const [, cas, sens] = FIXE.find((f) => f[0] === prep)!;
  const a = DET[cas][art];
  const ein = { der: "ein", die: "eine", das: "ein" }[art];
  return {
    q: `Complète : <b>${prep} … ${nom}</b> (${ein} ${nom} ; ${prep} = ${sens})`,
    txt: 1,
    a,
    keys: KEYS_DE,
    hint: "Datif : mit, nach, aus, zu, von, bei, seit. Accusatif : für, ohne, gegen, durch, um.",
    why: `${prep} ${a} ${nom} : ${prep} est toujours suivi ${cas === "Dativ" ? "du datif" : "de l’accusatif"}.`,
  };
}
