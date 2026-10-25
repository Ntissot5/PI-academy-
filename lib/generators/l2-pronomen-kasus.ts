import { pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE } from "./data/l2-outils";

// [nominatif (affiché), sens, accusatif, datif]
const PRON: [string, string, string, string][] = [
  ["ich", "je", "mich", "mir"], ["du", "tu", "dich", "dir"], ["er", "il", "ihn", "ihm"], ["sie", "elle", "sie", "ihr"],
  ["wir", "nous", "uns", "uns"], ["ihr", "vous (plusieurs amis)", "euch", "euch"], ["sie", "ils, elles", "sie", "ihnen"],
  ["Sie", "vous (politesse)", "Sie", "Ihnen"],
];
// [phrase avec …, cas, raison]
const PHRASES: [string, "acc" | "dat", string][] = [
  ["Lena besucht … morgen.", "acc", "besuchen + accusatif (qui ?)"],
  ["Tom sieht … im Park.", "acc", "sehen + accusatif (qui ?)"],
  ["Lena fragt … etwas.", "acc", "fragen + accusatif"],
  ["Tom ruft … heute an.", "acc", "anrufen + accusatif"],
  ["Das Geschenk ist für … .", "acc", "für + accusatif"],
  ["Lena geht ohne … ins Kino.", "acc", "ohne + accusatif"],
  ["Tom hilft … bei den Hausaufgaben.", "dat", "helfen + datif"],
  ["Die Jacke gefällt … sehr.", "dat", "gefallen + datif (à qui ?)"],
  ["Lena dankt … für das Geschenk.", "dat", "danken + datif"],
  ["Das Velo gehört … .", "dat", "gehören + datif (à qui ?)"],
  ["Tom kommt mit … ins Kino.", "dat", "mit + datif"],
  ["Lena schenkt … ein Buch.", "dat", "schenken : à qui ? → datif"],
];

/** Pronoms personnels à l'accusatif (mich, dich, ihn…) et au datif (mir, dir, ihm…). */
export function gen(): Question {
  const [nom, sens, acc, dat] = pick(PRON);
  const [phrase, cas, raison] = pick(PHRASES);
  const a = cas === "acc" ? acc : dat;
  const fin = phrase.replace("… .", `${a}.`).replace("…", a);
  return {
    q: `Complète avec le pronom <b>${nom}</b> (${sens}) : <b>${phrase}</b>`,
    txt: 1,
    a,
    keys: KEYS_DE,
    hint: cas === "acc" ? "Accusatif : mich, dich, ihn, sie, es, uns, euch, sie." : "Datif : mir, dir, ihm, ihr, ihm, uns, euch, ihnen.",
    why: `${fin} ${raison} → ${nom === a ? `${nom} ne change pas` : `${nom} devient ${a}`}.`,
  };
}
