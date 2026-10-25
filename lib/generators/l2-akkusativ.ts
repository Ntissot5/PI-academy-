import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, maj } from "./data/l2-outils";
import { NOMEN, type Art } from "./data/l2-woerter";

type Det = "der" | "ein" | "kein" | "mein";
// Formes [nominatif, accusatif] selon le genre
const FORMES: Record<Det, Record<Art, [string, string]>> = {
  der: { der: ["der", "den"], die: ["die", "die"], das: ["das", "das"] },
  ein: { der: ["ein", "einen"], die: ["eine", "eine"], das: ["ein", "ein"] },
  kein: { der: ["kein", "keinen"], die: ["keine", "keine"], das: ["kein", "kein"] },
  mein: { der: ["mein", "meinen"], die: ["meine", "meine"], das: ["mein", "mein"] },
};
const THEMES = ["école", "maison", "vêtements", "loisirs", "animaux", "nourriture"];

/** Nominatif ou accusatif : le complément d'objet direct masculin change (der → den, ein → einen). */
export function gen(): Question {
  const n = pick(NOMEN.filter((x) => THEMES.includes(x.theme) && x.pl !== null));
  const animal = n.theme === "animaux";
  if (R(0, 2) > 0) {
    const det = pick(["der", "ein", "kein", "mein"] as Det[]);
    const verbes = ["Ich sehe", "Ich suche"];
    if (det === "ein" || det === "kein") verbes.push("Ich habe");
    if (!animal && det !== "mein") verbes.push("Ich brauche", "Ich kaufe");
    const verbe = pick(verbes);
    const [nom, acc] = FORMES[det][n.art];
    return {
      q: `Complète : <b>${verbe} … ${n.de}.</b> (${det === "der" ? n.art : nom})`,
      txt: 1,
      a: acc,
      keys: KEYS_DE,
      hint: "Complément d’objet direct → accusatif.",
      why: `${verbe} ${acc} ${n.de}. ${n.de} est le complément d’objet direct : accusatif.${n.art === "der" ? ` Au masculin, ${nom} devient ${acc}.` : " Au féminin et au neutre, l’accusatif a la même forme que le nominatif."}`,
    };
  }
  const det = pick(["der", "ein", "mein"] as Det[]);
  const nom = maj(FORMES[det][n.art][0]);
  const fin = pick(["ist hier", "ist dort", "ist sehr gross"]);
  return {
    q: `Complète : <b>… ${n.de} ${fin}.</b> (${det === "der" ? n.art : FORMES[det][n.art][0]})`,
    txt: 1,
    a: nom,
    keys: KEYS_DE,
    hint: "Qui fait l’action ou de qui parle-t-on ? C’est le sujet.",
    why: `${nom} ${n.de} ${fin}. ${n.de} est le sujet : nominatif, la forme ne change pas.`,
  };
}
