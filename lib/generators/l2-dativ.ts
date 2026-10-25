import { R, pick } from "../math";
import type { Question } from "./types";
import { KEYS_DE, maj } from "./data/l2-outils";
import { NOMEN, type Art } from "./data/l2-woerter";

type Det = "der" | "ein" | "mein";
const DAT: Record<Det, Record<Art, string>> = {
  der: { der: "dem", die: "der", das: "dem" },
  ein: { der: "einem", die: "einer", das: "einem" },
  mein: { der: "meinem", die: "meiner", das: "meinem" },
};
const NOM: Record<Det, Record<Art, string>> = {
  der: { der: "der", die: "die", das: "das" },
  ein: { der: "ein", die: "eine", das: "ein" },
  mein: { der: "mein", die: "meine", das: "mein" },
};
const PERS = NOMEN.filter((n) => n.personne && n.theme !== "animaux" && n.de !== "Junge");
const VEHICULES = NOMEN.filter((n) => ["Bus", "Zug", "Velo", "Auto"].includes(n.de));

const CAS = ["Nominativ", "Akkusativ", "Dativ"];

/** Dativ : après mit, zu, von…, et pour la personne à qui l'on donne ou que l'on aide. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 3) {
    // Reconnaître les fonctions dans une phrase
    const p1 = pick(PERS.filter((n) => !["Lehrer", "Lehrerin", "Vater", "Grossmutter"].includes(n.de)));
    const objets = NOMEN.filter((n) => ["Buch", "Apfel", "Heft", "Ball", "Brief", "Bleistift", "Lampe"].includes(n.de));
    const o = pick(objets);
    const accO = { der: "einen", die: "eine", das: "ein" }[o.art];
    const sujet = pick(["Der Lehrer", "Die Lehrerin", "Mein Vater", "Meine Oma"]);
    const groupes: [string, string, string][] = [
      [sujet, "Nominativ", "sujet"],
      [`${DAT.der[p1.art]} ${p1.de}`, "Dativ", "à qui ? complément d’objet indirect"],
      [`${accO} ${o.de}`, "Akkusativ", "quoi ? complément d’objet direct"],
    ];
    const [g, cas, fonction] = pick(groupes);
    const phrase = `${sujet} gibt ${DAT.der[p1.art]} ${p1.de} ${accO} ${o.de}.`;
    return {
      q: `<b>${phrase}</b> À quel cas est <b>${g}</b> ?`,
      txt: 1,
      a: cas,
      choices: CAS,
      why: `${g} : ${fonction} → ${cas}. Avec geben : on donne quelque chose (Akkusativ) à quelqu’un (Dativ).`,
    };
  }
  const det = pick(["der", "ein", "mein"] as Det[]);
  if (t === 0) {
    const v = pick(VEHICULES);
    return {
      q: `Complète : <b>Ich fahre mit … ${v.de} in die Stadt.</b> (${NOM[det][v.art]})`,
      txt: 1,
      a: DAT[det][v.art],
      keys: KEYS_DE,
      hint: "mit est toujours suivi du datif.",
      why: `mit ${DAT[det][v.art]} ${v.de} : mit + datif. ${v.art} → ${DAT.der[v.art]} (masculin et neutre : -m ; féminin : -r).`,
    };
  }
  const p = pick(PERS);
  const [debut, fin, prep] = pick(([
    ["Ich spreche mit", "", "mit + datif"],
    ["Ich helfe", "", "helfen + datif"],
    ["Ich gebe", " das Buch", "geben : à qui ? → datif"],
    ["Ich schreibe", " eine Karte", "schreiben : à qui ? → datif"],
    ["Das Geschenk ist von", "", "von + datif"],
  ] as [string, string, string][]).filter((x) => det !== "der" || !x[0].endsWith("von")));
  const pluriel = R(0, 3) === 0 && p.pl;
  if (pluriel) {
    const datPl = p.pl!.endsWith("n") || p.pl!.endsWith("s") ? p.pl! : `${p.pl}n`;
    const detPl = det === "mein" ? "meinen" : "den";
    return {
      q: `Complète : <b>${debut} … ${datPl}${fin}.</b> (${det === "mein" ? "meine" : "die"}, pluriel)`,
      txt: 1,
      a: detPl,
      keys: KEYS_DE,
      why: `${debut} ${detPl} ${datPl}${fin} : ${prep}. Au datif pluriel : den / meinen, et le nom prend un -n.`,
    };
  }
  return {
    q: `Complète : <b>${debut} … ${p.de}${fin}.</b> (${NOM[det][p.art]})`,
    txt: 1,
    a: DAT[det][p.art],
    keys: KEYS_DE,
    why: `${maj(debut)} ${DAT[det][p.art]} ${p.de}${fin} : ${prep}. ${p.art} → ${DAT.der[p.art]}${det !== "der" ? `, ${NOM[det][p.art]} → ${DAT[det][p.art]}` : ""}.`,
  };
}
