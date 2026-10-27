/* Questions de conjugaison communes aux exercices f-… (moteur : data/f-verbes.ts). */
import { R, pick } from "../math";
import { avecEtre, conjugue, def, imperatif, MODE, premiere, pronomF, queF, variantes, type Personne, type TempsF } from "./data/f-verbes";
import { KEYS_FR } from "./f-outils";
import type { Question } from "./types";

const NOM: Record<TempsF, string> = {
  présent: "au présent", imparfait: "à l’imparfait", "futur simple": "au futur simple", "passé simple": "au passé simple",
  "conditionnel présent": "au conditionnel présent", "subjonctif présent": "au subjonctif présent", "subjonctif imparfait": "au subjonctif imparfait",
  "passé composé": "au passé composé", "plus-que-parfait": "au plus-que-parfait", "futur antérieur": "au futur antérieur",
  "passé antérieur": "au passé antérieur", "conditionnel passé": "au conditionnel passé", "subjonctif passé": "au subjonctif passé",
  "subjonctif plus-que-parfait": "au subjonctif plus-que-parfait",
};
export const nomTemps = (t: TempsF): string => NOM[t];

const COMPOSES = new Set<TempsF>(["passé composé", "plus-que-parfait", "futur antérieur", "passé antérieur", "conditionnel passé", "subjonctif passé", "subjonctif plus-que-parfait"]);

const EXPLI: Partial<Record<TempsF, string>> = {
  imparfait: "Imparfait : radical de « nous » au présent + -ais, -ais, -ait, -ions, -iez, -aient.",
  "futur simple": "Futur simple : radical du futur + -ai, -as, -a, -ons, -ez, -ont.",
  "conditionnel présent": "Conditionnel présent : radical du futur + terminaisons de l’imparfait (-ais, -ais, -ait, -ions, -iez, -aient).",
  "subjonctif présent": "Subjonctif présent : radical de « ils » au présent + -e, -es, -e, -ions, -iez, -ent (sauf verbes irréguliers).",
  "subjonctif imparfait": "Subjonctif imparfait : radical du passé simple + -sse, -sses, -^t, -ssions, -ssiez, -ssent.",
  "passé simple": "Passé simple : terminaisons en -a (verbes en -er), en -i, en -u ou en -in selon le verbe.",
};

/** Une forme conjuguée à taper. `personnes` limite les personnes (ex. [2, 5] pour il/ils). */
export function conjF(verbes: readonly string[], temps: readonly TempsF[], personnes: readonly Personne[] = [0, 1, 2, 3, 4, 5]): Question {
  const v = pick(verbes);
  const t = pick(temps);
  let p = def(v).seul3 ? 2 : pick(personnes);
  const etre = COMPOSES.has(t) && avecEtre(v);
  const fem = (p === 2 || p === 5) && R(0, 1) === 1 && !def(v).seul3;
  const formes = variantes(conjugue(v, t, p as Personne, etre && (p === 2 || p === 5) ? fem : null));
  const affiche = formes[0];
  const sub = t.startsWith("subjonctif");
  const pr = sub ? queF(p as Personne, affiche, fem) : pronomF(p as Personne, affiche, fem);
  const accept = formes.flatMap((f) => {
    const x = sub ? queF(p as Personne, f, fem) : pronomF(p as Personne, f, fem);
    return [f, x + f, x.replace("’", "'") + f];
  });
  const aux = etre ? "être" : "avoir";
  const why = COMPOSES.has(t)
    ? `${pr}${affiche} : auxiliaire « ${aux} » ${NOM[conjAux(t)]} + participe passé${etre ? " accordé avec le sujet" : ""}.`
    : `${pr}${affiche}. ${EXPLI[t] ?? ""}`.trim();
  return {
    q: `Conjugue <b>${v}</b> ${NOM[t]} : <b>${pr.trim() === "j’" || pr.endsWith("j’") ? pr : pr.trim() + " "}…</b>`,
    txt: 1,
    a: affiche,
    accept: [...new Set(accept)].filter((x) => x !== affiche),
    keys: KEYS_FR,
    hint: "Écris seulement le verbe (le pronom est accepté aussi).",
    why,
  };
}

function conjAux(t: TempsF): TempsF {
  return ({
    "passé composé": "présent", "plus-que-parfait": "imparfait", "futur antérieur": "futur simple", "passé antérieur": "passé simple",
    "conditionnel passé": "conditionnel présent", "subjonctif passé": "subjonctif présent", "subjonctif plus-que-parfait": "subjonctif imparfait",
  } as Record<string, TempsF>)[t];
}

const PERS_IMP = ["2e personne du singulier", "1re personne du pluriel", "2e personne du pluriel"];

/** Impératif présent. */
export function imperatifF(verbes: readonly string[]): Question {
  const v = pick(verbes);
  const k = R(0, 2);
  const formes = variantes(imperatif(v)[k]);
  return {
    q: `Conjugue <b>${v}</b> à l’impératif présent, <b>${PERS_IMP[k]}</b>.`,
    txt: 1,
    a: formes[0],
    ...(formes.length > 1 ? { accept: formes.slice(1) } : {}),
    keys: KEYS_FR,
    why: `« ${formes[0]} » : l’impératif n’a que trois personnes et pas de sujet.${k === 0 && def(v).groupe === 1 ? " Les verbes en -er ne prennent pas de « s » à la 2e personne du singulier." : ""}`,
  };
}

/** Reconnaître le temps (et le mode) d'une forme verbale. */
export function reconnaitreTemps(verbes: readonly string[], temps: readonly TempsF[]): Question {
  for (;;) {
    const v = pick(verbes);
    const t = pick(temps);
    const p = (def(v).seul3 ? 2 : R(0, 5)) as Personne;
    const f = premiere(conjugue(v, t, p, p === 2 || p === 5 ? false : null));
    // Formes identiques à plusieurs temps (je finis : présent ou passé simple ; que je chante : subjonctif ou présent) : on rejette.
    const amb = temps.filter((u) => u !== t && variantes(conjugue(v, u, p, p === 2 || p === 5 ? false : null)).includes(f));
    if (amb.length) continue;
    const sub = t.startsWith("subjonctif");
    const pr = sub ? queF(p, f) : pronomF(p, f);
    return {
      q: `À quel temps est conjugué le verbe <b>${v}</b> dans <b>${pr}${f}</b> ?`,
      txt: 1,
      a: t,
      choices: [...new Set([t, ...temps.filter((u) => u !== t).sort(() => Math.random() - 0.5).slice(0, 3)])].sort(() => Math.random() - 0.5),
      why: `« ${pr}${f} » : ${t} (mode ${MODE[t]}).${COMPOSES.has(t) ? ` Temps composé : auxiliaire ${NOM[conjAux(t)]} + participe passé.` : ""}`,
    };
  }
}
