/* Exercices de conjugaison par temps et par liste de verbes du PER (L1 26, L1 36). */
import { R, pick } from "../math";
import { COMPOSE_DE, conjugue, def, MODE, premiere, pronomF, queF, SIMPLES, variantes, VERBES_PER, type Personne, type TempsF } from "./data/f-verbes";
import { conjF, imperatifF, reconnaitreTemps } from "./f-conjuguer";
import { qcm, qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

const V7 = ["être", "avoir", "aller", "chanter", "finir", "dire", "faire", "entendre", "savoir", "vouloir", "manger", "commencer", "mettre", "pouvoir", "oublier", "prendre", "sortir", "courir", "voir", "venir", "employer", "payer", "acheter", "peler"];
const V8 = [...V7, "aimer", "rendre", "appeler", "jeter", "craindre", "plaire", "fuir", "valoir", "falloir", "boire", "ouvrir", "vivre"];
const SANS_IMPERATIF = new Set(["pouvoir", "valoir", "falloir", "vouloir"]);
const SIMPLES_SEUL = new Set(["asseoir"]); // conjugué seulement aux temps simples

export const conditionnel = (): Question => conjF(V7, ["conditionnel présent"]);
export const imperatif = (): Question => imperatifF(V7.filter((v) => !SANS_IMPERATIF.has(v)));
export const tempsComposes = (): Question => conjF(V8, ["plus-que-parfait", "futur antérieur", "plus-que-parfait", "futur antérieur", "passé composé"]);
export const psIl = (): Question => conjF(V8, ["passé simple"], [2, 5]);
export const subjonctif = (): Question => conjF(V8, ["subjonctif présent"]);

const TOUS9: TempsF[] = [...SIMPLES, "passé composé", "plus-que-parfait", "futur antérieur", "passé antérieur", "conditionnel passé", "subjonctif passé"];
/** Liste de verbes d'une année, à un temps tiré parmi `temps` (asseoir : temps simples seulement). */
function annee(verbes: readonly string[], temps: readonly TempsF[]): Question {
  const t = pick(temps);
  const simple = SIMPLES.includes(t) || t === "subjonctif imparfait";
  return conjF(simple ? verbes : verbes.filter((v) => !SIMPLES_SEUL.has(v)), [t]);
}
export const conj9 = (): Question => tirer([() => annee(VERBES_PER["9e"], TOUS9), () => annee(VERBES_PER["9e"], ["passé simple", "subjonctif présent", "passé antérieur", "conditionnel passé", "subjonctif passé"])]);
export const conj10 = (): Question => annee(VERBES_PER["10e"], TOUS9);
export const conj11 = (): Question =>
  tirer([() => annee(VERBES_PER["11e"], TOUS9), () => annee([...VERBES_PER["11e"], "être", "avoir", "venir", "chanter", "finir", "faire"], ["subjonctif imparfait", "subjonctif plus-que-parfait"])]);

/* ---------- Analyse d'une forme verbale (5e-8e) ---------- */
const T_C2: TempsF[] = ["présent", "imparfait", "futur simple", "passé composé", "conditionnel présent"];

function infinitif(): Question {
  const v = pick(V8.filter((x) => x !== "falloir"));
  const t = pick(T_C2);
  const p = R(0, 5) as Personne;
  const f = premiere(conjugue(v, t, p, p === 2 || p === 5 ? false : null));
  const pr = pronomF(p, f);
  return saisie(`Quel est l’infinitif du verbe dans <b>${pr}${f}</b> ?`, v, `« ${pr}${f} » : verbe « ${v} », ${t}.`, v === "être" && f === "suis" ? ["suivre"] : [], "Écris le verbe à l’infinitif.");
}

const tempsC2 = (): Question => reconnaitreTemps(V8.filter((x) => x !== "falloir"), T_C2);

function personne(): Question {
  const v = pick(V7);
  const t = pick<TempsF>(["présent", "imparfait", "futur simple"]);
  const p = R(0, 5) as Personne;
  const f = premiere(conjugue(v, t, p));
  // Formes identiques à plusieurs personnes (je chante / il chante) : on demande alors avec le pronom manquant.
  const memes = [0, 1, 2, 3, 4, 5].filter((k) => premiere(conjugue(v, t, k as Personne)) === f);
  if (memes.length > 1) return tirer([infinitif, tempsC2]);
  const PR = ["je", "tu", "il / elle / on", "nous", "vous", "ils / elles"];
  return qcmFixe(`Quel pronom de conjugaison va avec <b>${f}</b> (${v}, ${t}) ?`, PR[p], PR, `« ${f} » se conjugue avec « ${PR[p]} ».`);
}

/* Radical et terminaison. */
function terminaison(): Question {
  const v = pick(["chanter", "parler", "finir", "jouer", "danser", "choisir", "regarder", "grandir"]);
  const t = pick<TempsF>(["présent", "imparfait", "futur simple"]);
  const p = R(0, 5) as Personne;
  const f = premiere(conjugue(v, t, p));
  const rad = v.slice(0, -2);
  const term = f.slice(rad.length);
  const pr = pronomF(p, f);
  return qcm(
    `Dans <b>${pr}${f}</b>, quelle est la terminaison ?`,
    "-" + term,
    ["-" + f.slice(-1), "-" + f.slice(-2), "-" + f.slice(-3), "-" + f.slice(rad.length - 1)].filter((x) => x !== "-" + term),
    `« ${f} » = radical « ${rad} » + terminaison « -${term} ». La terminaison change selon la personne et le temps.`,
  );
}

export const analyse = (): Question => tirer([infinitif, tempsC2, tempsC2, personne, terminaison]);

/* ---------- Système des temps et des modes (9e-11e) ---------- */
const tempsTous = (): Question => reconnaitreTemps(VERBES_PER["9e"].filter((x) => x !== "falloir"), TOUS9);

function mode(): Question {
  for (;;) {
    const v = pick(VERBES_PER["9e"].filter((x) => x !== "falloir"));
    const t = pick(TOUS9);
    const p = R(0, 5) as Personne;
    const fem = p === 2 || p === 5 ? false : null;
    const f = premiere(conjugue(v, t, p, fem));
    // Même forme à deux modes (que je chante / je chante) : on tire une autre forme.
    if (TOUS9.some((u) => MODE[u] !== MODE[t] && variantes(conjugue(v, u, p, fem)).includes(f))) continue;
    const pr = t.startsWith("subjonctif") ? queF(p, f) : pronomF(p, f);
    return qcmFixe(`À quel mode est la forme <b>${pr}${f}</b> ?`, MODE[t], ["indicatif", "subjonctif", "conditionnel"], `« ${pr}${f} » : ${t}, mode ${MODE[t]}.`);
  }
}

function correspondance(): Question {
  const t = pick(Object.keys(COMPOSE_DE) as TempsF[]);
  const c = COMPOSE_DE[t]!;
  return qcm(
    `Quel temps composé correspond au <b>${t}</b> ? (l’auxiliaire est conjugué au ${t})`,
    c,
    Object.values(COMPOSE_DE) as string[],
    `Auxiliaire au ${t} + participe passé = ${c}.`,
  );
}

function groupe(): Question {
  const v = pick([...VERBES_PER["9e"], ...VERBES_PER["10e"]]);
  const g = def(v).groupe;
  const lab = ["1er groupe (verbes en -er)", "2e groupe (verbes en -ir, nous -issons)", "3e groupe (autres verbes)"];
  return qcmFixe(
    `À quel groupe appartient le verbe <b>${v}</b> ?`,
    lab[g - 1],
    lab,
    g === 1 ? `« ${v} » se termine par -er (sauf aller) : 1er groupe.` : g === 2 ? `« ${v} » fait « nous ${v.slice(0, -2)}issons » : 2e groupe.` : `« ${v} » est un verbe du 3e groupe${v === "aller" ? " (aller est une exception)" : ""}.`,
  );
}

export const systeme = (): Question => tirer([tempsTous, tempsTous, mode, correspondance, groupe]);
