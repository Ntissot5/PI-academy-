/* Conjugaison française : verbes du 1er et 2e groupe par règle, verbes fréquents du 3e groupe en tables. */

export type Temps = "present" | "imparfait" | "futur" | "pc";
export const PERSONNES = ["je", "tu", "il", "nous", "vous", "ils"] as const;
export type Personne = 0 | 1 | 2 | 3 | 4 | 5;

interface Irr {
  present: [string, string, string, string, string, string];
  futur: string; // radical du futur
  pp: string; // participe passé
  etre?: boolean; // passé composé avec être
}

const IRR: Record<string, Irr> = {
  être: { present: ["suis", "es", "est", "sommes", "êtes", "sont"], futur: "ser", pp: "été" },
  avoir: { present: ["ai", "as", "a", "avons", "avez", "ont"], futur: "aur", pp: "eu" },
  aller: { present: ["vais", "vas", "va", "allons", "allez", "vont"], futur: "ir", pp: "allé", etre: true },
  faire: { present: ["fais", "fais", "fait", "faisons", "faites", "font"], futur: "fer", pp: "fait" },
  dire: { present: ["dis", "dis", "dit", "disons", "dites", "disent"], futur: "dir", pp: "dit" },
  pouvoir: { present: ["peux", "peux", "peut", "pouvons", "pouvez", "peuvent"], futur: "pourr", pp: "pu" },
  vouloir: { present: ["veux", "veux", "veut", "voulons", "voulez", "veulent"], futur: "voudr", pp: "voulu" },
  venir: { present: ["viens", "viens", "vient", "venons", "venez", "viennent"], futur: "viendr", pp: "venu", etre: true },
  prendre: { present: ["prends", "prends", "prend", "prenons", "prenez", "prennent"], futur: "prendr", pp: "pris" },
  voir: { present: ["vois", "vois", "voit", "voyons", "voyez", "voient"], futur: "verr", pp: "vu" },
  savoir: { present: ["sais", "sais", "sait", "savons", "savez", "savent"], futur: "saur", pp: "su" },
  devoir: { present: ["dois", "dois", "doit", "devons", "devez", "doivent"], futur: "devr", pp: "dû" },
  mettre: { present: ["mets", "mets", "met", "mettons", "mettez", "mettent"], futur: "mettr", pp: "mis" },
  partir: { present: ["pars", "pars", "part", "partons", "partez", "partent"], futur: "partir", pp: "parti", etre: true },
};

/** Verbes du 1er groupe (-er) et du 2e groupe (-ir, nous -issons). */
export const VERBES_ER = ["parler", "chanter", "aimer", "regarder", "jouer", "marcher", "danser", "écouter", "trouver", "habiter", "manger", "commencer", "nager", "arriver", "rester", "tomber"];
export const VERBES_IR = ["finir", "choisir", "grandir", "réussir", "obéir", "remplir"];
export const VERBES_IRR = Object.keys(IRR);
export const TOUS_VERBES = [...VERBES_ER, ...VERBES_IR, ...VERBES_IRR];

/** Verbes du 1er groupe conjugués avec être au passé composé. */
const ER_ETRE = new Set(["arriver", "rester", "tomber"]);

const TERM_IMP = ["ais", "ais", "ait", "ions", "iez", "aient"];
const TERM_FUT = ["ai", "as", "a", "ons", "ez", "ont"];

function presentRegulier(v: string): string[] {
  if (v.endsWith("ir") && VERBES_IR.includes(v)) {
    const r = v.slice(0, -2);
    return [r + "is", r + "is", r + "it", r + "issons", r + "issez", r + "issent"];
  }
  const r = v.slice(0, -2);
  const nous = v.endsWith("ger") ? r + "eons" : v.endsWith("cer") ? r.slice(0, -1) + "çons" : r + "ons";
  return [r + "e", r + "es", r + "e", nous, r + "ez", r + "ent"];
}

export function present(v: string): string[] {
  return IRR[v] ? [...IRR[v].present] : presentRegulier(v);
}

export function imparfait(v: string): string[] {
  if (v === "être") return ["étais", "étais", "était", "étions", "étiez", "étaient"];
  const nous = present(v)[3];
  const rad = nous.slice(0, -3); // nous mangeons → mange, nous commençons → commenç
  return TERM_IMP.map((t) => {
    let r = rad;
    // manger : mangeais mais mangions ; commencer : commençais mais commencions
    if (t.startsWith("i") && r.endsWith("ge")) r = r.slice(0, -1);
    if (t.startsWith("i") && r.endsWith("ç")) r = r.slice(0, -1) + "c";
    return r + t;
  });
}

export function futur(v: string): string[] {
  const rad = IRR[v] ? IRR[v].futur : v; // parler → parlerai, finir → finirai
  return TERM_FUT.map((t) => rad + t);
}

export function participe(v: string): string {
  if (IRR[v]) return IRR[v].pp;
  return VERBES_IR.includes(v) ? v.slice(0, -2) + "i" : v.slice(0, -2) + "é";
}

export function avecEtre(v: string): boolean {
  return IRR[v]?.etre === true || ER_ETRE.has(v);
}

/** Passé composé : auxiliaire + participe, accordé avec le sujet quand l'auxiliaire est être. */
export function passeCompose(v: string, p: Personne, feminin = false): string {
  const etre = avecEtre(v);
  const aux = (etre ? IRR["être"] : IRR["avoir"]).present[p];
  let pp = participe(v);
  if (etre) {
    if (feminin) pp += "e";
    if (p >= 3) pp += "s";
  }
  return `${aux} ${pp}`;
}

/** Pronom sujet, avec élision devant voyelle : j'aime, j'ai. */
export function pronom(p: Personne, forme: string, feminin = false): string {
  const base = p === 2 ? (feminin ? "elle" : "il") : p === 5 ? (feminin ? "elles" : "ils") : PERSONNES[p];
  if (p === 0 && /^[aeiouyéèêâîôûh]/i.test(forme)) return "j’";
  return base + " ";
}
