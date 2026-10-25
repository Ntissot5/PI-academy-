/* Conjugaison complète des verbes du PER (L1 26 et L1 36, « Verbes à aborder »).
   Une forme peut avoir des variantes admises, séparées par « | » : la première est affichée
   (ex. « paie|paye », « céderai|cèderai » depuis les rectifications de 1990). */

export type Personne = 0 | 1 | 2 | 3 | 4 | 5;
export type TempsF =
  | "présent" | "imparfait" | "futur simple" | "passé simple" | "conditionnel présent" | "subjonctif présent" | "subjonctif imparfait"
  | "passé composé" | "plus-que-parfait" | "futur antérieur" | "passé antérieur" | "conditionnel passé" | "subjonctif passé" | "subjonctif plus-que-parfait";

export const SIMPLES: TempsF[] = ["présent", "imparfait", "futur simple", "passé simple", "conditionnel présent", "subjonctif présent"];
/** Temps composé correspondant à chaque temps simple (auxiliaire conjugué à ce temps simple). */
export const COMPOSE_DE: Partial<Record<TempsF, TempsF>> = {
  présent: "passé composé", imparfait: "plus-que-parfait", "futur simple": "futur antérieur", "passé simple": "passé antérieur",
  "conditionnel présent": "conditionnel passé", "subjonctif présent": "subjonctif passé", "subjonctif imparfait": "subjonctif plus-que-parfait",
};
export const MODE: Record<TempsF, string> = {
  présent: "indicatif", imparfait: "indicatif", "futur simple": "indicatif", "passé simple": "indicatif", "passé composé": "indicatif",
  "plus-que-parfait": "indicatif", "futur antérieur": "indicatif", "passé antérieur": "indicatif",
  "conditionnel présent": "conditionnel", "conditionnel passé": "conditionnel",
  "subjonctif présent": "subjonctif", "subjonctif imparfait": "subjonctif", "subjonctif passé": "subjonctif", "subjonctif plus-que-parfait": "subjonctif",
};

type PS = "a" | "i" | "u" | "in";
interface Def {
  pr: string[]; // présent
  fut: string; // radical du futur (variantes avec |)
  ps: [string, PS] | string[]; // passé simple : radical + type, ou 6 formes
  pp: string; // participe passé masculin singulier
  etre?: boolean;
  subj?: string[]; // subjonctif présent irrégulier
  impe?: [string, string, string]; // impératif irrégulier
  ppr?: string; // participe présent irrégulier
  impf?: string; // radical de l'imparfait irrégulier
  groupe: 1 | 2 | 3;
  seul3?: boolean; // verbe impersonnel (falloir)
}

const w = (s: string): string[] => s.split(" ");

/* ---------- 1er groupe ---------- */
function er(inf: string, o: { etre?: boolean } = {}): Def {
  const r = inf.slice(0, -2);
  let pr = ["e", "es", "e", "ons", "ez", "ent"].map((t) => r + t);
  let fut = inf;
  const devantAO = (t: string) => (r.endsWith("g") ? r + "e" : r.endsWith("c") ? r.slice(0, -1) + "ç" : r) + t;
  pr[3] = devantAO("ons");
  const muet = (f: (s: string) => string) => { pr = pr.map((x, i) => ([0, 1, 2, 5].includes(i) ? f(x) : x)); };
  const m = r.match(/^(.*)([eé])([^aeiouyéè])$/); // e/é + consonne(s) + er
  if (/(eter|eler)$/.test(inf) && !["acheter", "peler", "modeler", "geler"].includes(inf)) {
    // jeter, appeler : on double la consonne devant un e muet
    const dbl = (s: string) => s.replace(/(et|el)(e|es|ent)$/, (_, a, t) => a + a.slice(-1) + t);
    muet(dbl);
    fut = r + r.slice(-1) + "er";
  } else if (m && m[2] === "e") {
    // acheter, peser, lever, peler, modeler : e → è devant un e muet
    muet((s) => s.replace(new RegExp(`e(${m[3]})(e|es|ent)$`), "è$1$2"));
    fut = `${m[1]}è${m[3]}er`;
  } else if (m && m[2] === "é") {
    // céder, répéter, espérer, assiéger : é → è devant un e muet ; futur céderai ou cèderai
    muet((s) => s.replace(new RegExp(`é(${m[3]})(e|es|ent)$`), "è$1$2"));
    fut = `${inf}|${m[1]}è${m[3]}er`;
  } else if (/oyer$|uyer$/.test(inf)) {
    // employer, broyer, envoyer : y → i devant un e muet
    muet((s) => s.replace(/y(e|es|ent)$/, "i$1"));
    fut = inf === "envoyer" ? "enverr" : r.slice(0, -1) + "ier";
  } else if (/ayer$/.test(inf)) {
    // payer, essayer : paie ou paye
    muet((s) => s.replace(/y(e|es|ent)$/, "i$1") + "|" + s);
    fut = `${r.slice(0, -1)}ier|${inf}`;
  }
  const ps = ["ai", "as", "a", "âmes", "âtes", "èrent"].map((t) => (t === "èrent" ? r.replace(/ç$/, "c") : devantAO("")) + t);
  return { pr, fut, ps, pp: r + "é", etre: o.etre, groupe: 1 };
}

/* ---------- 2e groupe ---------- */
function ir2(inf: string): Def {
  const r = inf.slice(0, -2);
  if (inf === "haïr") {
    return { pr: w("hais hais hait haïssons haïssez haïssent"), fut: "haïr", ps: w("haïs haïs haït haïmes haïtes haïrent"), pp: "haï", groupe: 2 };
  }
  return { pr: ["is", "is", "it", "issons", "issez", "issent"].map((t) => r + t), fut: inf, ps: [r, "i"], pp: r + "i", groupe: 2 };
}

/* ---------- 3e groupe (et aller) ---------- */
const IRR: Record<string, Def> = {
  être: { pr: w("suis es est sommes êtes sont"), fut: "ser", ps: ["f", "u"], pp: "été", subj: w("sois sois soit soyons soyez soient"), impe: ["sois", "soyons", "soyez"], ppr: "étant", impf: "ét", groupe: 3 },
  avoir: { pr: w("ai as a avons avez ont"), fut: "aur", ps: ["e", "u"], pp: "eu", subj: w("aie aies ait ayons ayez aient"), impe: ["aie", "ayons", "ayez"], ppr: "ayant", groupe: 3 },
  aller: { pr: w("vais vas va allons allez vont"), fut: "ir", ps: w("allai allas alla allâmes allâtes allèrent"), pp: "allé", etre: true, subj: w("aille ailles aille allions alliez aillent"), impe: ["va", "allons", "allez"], groupe: 3 },
  faire: { pr: w("fais fais fait faisons faites font"), fut: "fer", ps: ["f", "i"], pp: "fait", subj: w("fasse fasses fasse fassions fassiez fassent"), groupe: 3 },
  dire: { pr: w("dis dis dit disons dites disent"), fut: "dir", ps: ["d", "i"], pp: "dit", groupe: 3 },
  pouvoir: { pr: w("peux peux peut pouvons pouvez peuvent"), fut: "pourr", ps: ["p", "u"], pp: "pu", subj: w("puisse puisses puisse puissions puissiez puissent"), groupe: 3 },
  voir: { pr: w("vois vois voit voyons voyez voient"), fut: "verr", ps: ["v", "i"], pp: "vu", groupe: 3 },
  savoir: { pr: w("sais sais sait savons savez savent"), fut: "saur", ps: ["s", "u"], pp: "su", subj: w("sache saches sache sachions sachiez sachent"), impe: ["sache", "sachons", "sachez"], ppr: "sachant", groupe: 3 },
  vouloir: { pr: w("veux veux veut voulons voulez veulent"), fut: "voudr", ps: ["voul", "u"], pp: "voulu", subj: w("veuille veuilles veuille voulions vouliez veuillent"), impe: ["veuille", "veuillons", "veuillez"], groupe: 3 },
  falloir: { pr: w("- - faut - - -"), fut: "faudr", ps: ["fall", "u"], pp: "fallu", subj: w("- - faille - - -"), impf: "fall", groupe: 3, seul3: true },
  devoir: { pr: w("dois dois doit devons devez doivent"), fut: "devr", ps: ["d", "u"], pp: "dû", groupe: 3 },
  croire: { pr: w("crois crois croit croyons croyez croient"), fut: "croir", ps: ["cr", "u"], pp: "cru", groupe: 3 },
  prendre: { pr: w("prends prends prend prenons prenez prennent"), fut: "prendr", ps: ["pr", "i"], pp: "pris", groupe: 3 },
  comprendre: { pr: w("comprends comprends comprend comprenons comprenez comprennent"), fut: "comprendr", ps: ["compr", "i"], pp: "compris", groupe: 3 },
  apprendre: { pr: w("apprends apprends apprend apprenons apprenez apprennent"), fut: "apprendr", ps: ["appr", "i"], pp: "appris", groupe: 3 },
  mettre: { pr: w("mets mets met mettons mettez mettent"), fut: "mettr", ps: ["m", "i"], pp: "mis", groupe: 3 },
  tenir: { pr: w("tiens tiens tient tenons tenez tiennent"), fut: "tiendr", ps: ["t", "in"], pp: "tenu", groupe: 3 },
  venir: { pr: w("viens viens vient venons venez viennent"), fut: "viendr", ps: ["v", "in"], pp: "venu", etre: true, groupe: 3 },
  devenir: { pr: w("deviens deviens devient devenons devenez deviennent"), fut: "deviendr", ps: ["dev", "in"], pp: "devenu", etre: true, groupe: 3 },
  rendre: { pr: w("rends rends rend rendons rendez rendent"), fut: "rendr", ps: ["rend", "i"], pp: "rendu", groupe: 3 },
  entendre: { pr: w("entends entends entend entendons entendez entendent"), fut: "entendr", ps: ["entend", "i"], pp: "entendu", groupe: 3 },
  répondre: { pr: w("réponds réponds répond répondons répondez répondent"), fut: "répondr", ps: ["répond", "i"], pp: "répondu", groupe: 3 },
  attendre: { pr: w("attends attends attend attendons attendez attendent"), fut: "attendr", ps: ["attend", "i"], pp: "attendu", groupe: 3 },
  perdre: { pr: w("perds perds perd perdons perdez perdent"), fut: "perdr", ps: ["perd", "i"], pp: "perdu", groupe: 3 },
  descendre: { pr: w("descends descends descend descendons descendez descendent"), fut: "descendr", ps: ["descend", "i"], pp: "descendu", etre: true, groupe: 3 },
  connaître: { pr: w("connais connais connaît|connait connaissons connaissez connaissent"), fut: "connaîtr|connaitr", ps: ["conn", "u"], pp: "connu", groupe: 3 },
  paraître: { pr: w("parais parais paraît|parait paraissons paraissez paraissent"), fut: "paraîtr|paraitr", ps: ["par", "u"], pp: "paru", groupe: 3 },
  sentir: { pr: w("sens sens sent sentons sentez sentent"), fut: "sentir", ps: ["sent", "i"], pp: "senti", groupe: 3 },
  sortir: { pr: w("sors sors sort sortons sortez sortent"), fut: "sortir", ps: ["sort", "i"], pp: "sorti", etre: true, groupe: 3 },
  partir: { pr: w("pars pars part partons partez partent"), fut: "partir", ps: ["part", "i"], pp: "parti", etre: true, groupe: 3 },
  vivre: { pr: w("vis vis vit vivons vivez vivent"), fut: "vivr", ps: ["véc", "u"], pp: "vécu", groupe: 3 },
  écrire: { pr: w("écris écris écrit écrivons écrivez écrivent"), fut: "écrir", ps: ["écriv", "i"], pp: "écrit", groupe: 3 },
  suivre: { pr: w("suis suis suit suivons suivez suivent"), fut: "suivr", ps: ["suiv", "i"], pp: "suivi", groupe: 3 },
  mourir: { pr: w("meurs meurs meurt mourons mourez meurent"), fut: "mourr", ps: ["mour", "u"], pp: "mort", etre: true, groupe: 3 },
  couvrir: { pr: w("couvre couvres couvre couvrons couvrez couvrent"), fut: "couvrir", ps: ["couvr", "i"], pp: "couvert", groupe: 3 },
  ouvrir: { pr: w("ouvre ouvres ouvre ouvrons ouvrez ouvrent"), fut: "ouvrir", ps: ["ouvr", "i"], pp: "ouvert", groupe: 3 },
  offrir: { pr: w("offre offres offre offrons offrez offrent"), fut: "offrir", ps: ["offr", "i"], pp: "offert", groupe: 3 },
  souffrir: { pr: w("souffre souffres souffre souffrons souffrez souffrent"), fut: "souffrir", ps: ["souffr", "i"], pp: "souffert", groupe: 3 },
  lire: { pr: w("lis lis lit lisons lisez lisent"), fut: "lir", ps: ["l", "u"], pp: "lu", groupe: 3 },
  servir: { pr: w("sers sers sert servons servez servent"), fut: "servir", ps: ["serv", "i"], pp: "servi", groupe: 3 },
  recevoir: { pr: w("reçois reçois reçoit recevons recevez reçoivent"), fut: "recevr", ps: ["reç", "u"], pp: "reçu", groupe: 3 },
  apercevoir: { pr: w("aperçois aperçois aperçoit apercevons apercevez aperçoivent"), fut: "apercevr", ps: ["aperç", "u"], pp: "aperçu", groupe: 3 },
  rire: { pr: w("ris ris rit rions riez rient"), fut: "rir", ps: ["r", "i"], pp: "ri", groupe: 3 },
  sourire: { pr: w("souris souris sourit sourions souriez sourient"), fut: "sourir", ps: ["sour", "i"], pp: "souri", groupe: 3 },
  courir: { pr: w("cours cours court courons courez courent"), fut: "courr", ps: ["cour", "u"], pp: "couru", groupe: 3 },
  valoir: { pr: w("vaux vaux vaut valons valez valent"), fut: "vaudr", ps: ["val", "u"], pp: "valu", subj: w("vaille vailles vaille valions valiez vaillent"), groupe: 3 },
  plaire: { pr: w("plais plais plaît|plait plaisons plaisez plaisent"), fut: "plair", ps: ["pl", "u"], pp: "plu", groupe: 3 },
  dormir: { pr: w("dors dors dort dormons dormez dorment"), fut: "dormir", ps: ["dorm", "i"], pp: "dormi", groupe: 3 },
  cuire: { pr: w("cuis cuis cuit cuisons cuisez cuisent"), fut: "cuir", ps: ["cuis", "i"], pp: "cuit", groupe: 3 },
  conduire: { pr: w("conduis conduis conduit conduisons conduisez conduisent"), fut: "conduir", ps: ["conduis", "i"], pp: "conduit", groupe: 3 },
  produire: { pr: w("produis produis produit produisons produisez produisent"), fut: "produir", ps: ["produis", "i"], pp: "produit", groupe: 3 },
  craindre: { pr: w("crains crains craint craignons craignez craignent"), fut: "craindr", ps: ["craign", "i"], pp: "craint", groupe: 3 },
  peindre: { pr: w("peins peins peint peignons peignez peignent"), fut: "peindr", ps: ["peign", "i"], pp: "peint", groupe: 3 },
  éteindre: { pr: w("éteins éteins éteint éteignons éteignez éteignent"), fut: "éteindr", ps: ["éteign", "i"], pp: "éteint", groupe: 3 },
  asseoir: { pr: w("assieds|assois assieds|assois assied|assoit asseyons|assoyons asseyez|assoyez asseyent|assoient"), fut: "assiér|assoir", ps: ["ass", "i"], pp: "assis", subj: w("asseye|assoie asseyes|assoies asseye|assoie asseyions|assoyions asseyiez|assoyiez asseyent|assoient"), groupe: 3 },
  acquérir: { pr: w("acquiers acquiers acquiert acquérons acquérez acquièrent"), fut: "acquerr", ps: ["acqu", "i"], pp: "acquis", groupe: 3 },
  battre: { pr: w("bats bats bat battons battez battent"), fut: "battr", ps: ["batt", "i"], pp: "battu", groupe: 3 },
  boire: { pr: w("bois bois boit buvons buvez boivent"), fut: "boir", ps: ["b", "u"], pp: "bu", groupe: 3 },
  conclure: { pr: w("conclus conclus conclut concluons concluez concluent"), fut: "conclur", ps: ["concl", "u"], pp: "conclu", groupe: 3 },
  croître: { pr: w("croîs croîs croît croissons croissez croissent"), fut: "croîtr|croitr", ps: w("crûs crûs crût crûmes crûtes crûrent"), pp: "crû", groupe: 3 },
  cueillir: { pr: w("cueille cueilles cueille cueillons cueillez cueillent"), fut: "cueiller", ps: ["cueill", "i"], pp: "cueilli", groupe: 3 },
  fuir: { pr: w("fuis fuis fuit fuyons fuyez fuient"), fut: "fuir", ps: ["fu", "i"], pp: "fui", groupe: 3 },
  mouvoir: { pr: w("meus meus meut mouvons mouvez meuvent"), fut: "mouvr", ps: ["m", "u"], pp: "mû", groupe: 3 },
  naître: { pr: w("nais nais naît|nait naissons naissez naissent"), fut: "naîtr|naitr", ps: ["naqu", "i"], pp: "né", etre: true, groupe: 3 },
  vaincre: { pr: w("vaincs vaincs vainc vainquons vainquez vainquent"), fut: "vaincr", ps: ["vainqu", "i"], pp: "vaincu", groupe: 3 },
};

const ER_ETRE = new Set(["arriver", "tomber", "rester", "entrer", "rentrer", "monter", "retourner"]);
const IR2 = new Set(["finir", "choisir", "grandir", "réussir", "agir", "obéir", "remplir", "haïr", "réfléchir", "punir"]);

const cache: Record<string, Def> = {};
export function def(v: string): Def {
  if (cache[v]) return cache[v];
  const d = IRR[v] ?? (IR2.has(v) ? ir2(v) : er(v, { etre: ER_ETRE.has(v) }));
  return (cache[v] = d);
}

/** Les verbes connus (tous les verbes du PER cités en L1 26 et L1 36). */
export const VERBES_PER = {
  c2: ["être", "avoir", "aller", "chanter", "aimer", "finir", "dire", "faire", "entendre", "rendre", "savoir", "vouloir", "manger", "commencer", "mettre", "pouvoir", "oublier", "prendre", "sortir", "courir", "voir", "venir", "employer", "payer", "acheter", "peler", "appeler", "jeter", "craindre", "plaire", "fuir", "valoir", "boire", "ouvrir", "vivre"],
  "9e": ["être", "avoir", "faire", "dire", "pouvoir", "aller", "voir", "savoir", "vouloir", "falloir", "devoir", "croire", "prendre", "comprendre", "apprendre", "aimer", "parler", "mettre", "tenir", "venir", "devenir", "rendre", "entendre", "répondre", "attendre", "perdre", "descendre", "connaître", "paraître", "sentir", "sortir", "partir", "vivre", "écrire", "placer", "commencer", "avancer", "suivre", "mourir", "couvrir", "ouvrir", "offrir", "souffrir", "lire", "acheter"],
  "10e": ["servir", "jeter", "appeler", "recevoir", "apercevoir", "peser", "lever", "rire", "sourire", "finir", "agir", "apprécier", "crier", "oublier", "courir", "envoyer", "manger", "valoir", "plaire", "dormir", "céder", "répéter", "espérer", "cuire", "conduire", "produire", "craindre", "peindre", "éteindre", "payer", "essayer", "asseoir"],
  "11e": ["acquérir", "assiéger", "battre", "boire", "broyer", "conclure", "créer", "croître", "cueillir", "fuir", "haïr", "modeler", "mouvoir", "naître", "vaincre"],
};

/* ---------- Formation des temps ---------- */
const v1 = (s: string): string[] => s.split("|");
const map = (s: string, f: (x: string) => string): string => v1(s).map(f).join("|");

export function present(v: string): string[] {
  return def(v).pr;
}

/** Radical de l'imparfait (nous mangeons → mange, nous plaçons → plaç). */
function radImp(v: string): string {
  const d = def(v);
  return d.impf ?? map(d.pr[3], (x) => x.replace(/ons$/, ""));
}

export function imparfait(v: string): string[] {
  return ["ais", "ais", "ait", "ions", "iez", "aient"].map((t) =>
    map(radImp(v), (r) => {
      let x = r;
      if (t.startsWith("i") && x.endsWith("ge")) x = x.slice(0, -1);
      if (t.startsWith("i") && x.endsWith("ç")) x = x.slice(0, -1) + "c";
      return x + t;
    }),
  );
}

export function futur(v: string): string[] {
  return ["ai", "as", "a", "ons", "ez", "ont"].map((t) => map(def(v).fut, (r) => r + t));
}

export function conditionnel(v: string): string[] {
  return ["ais", "ais", "ait", "ions", "iez", "aient"].map((t) => map(def(v).fut, (r) => r + t));
}

const TERM_PS: Record<PS, string[]> = {
  a: ["ai", "as", "a", "âmes", "âtes", "èrent"],
  i: ["is", "is", "it", "îmes", "îtes", "irent"],
  u: ["us", "us", "ut", "ûmes", "ûtes", "urent"],
  in: ["ins", "ins", "int", "înmes", "întes", "inrent"],
};

export function passeSimple(v: string): string[] {
  const ps = def(v).ps;
  if (ps.length === 6) return ps as string[];
  const [r, t] = ps as [string, PS];
  return TERM_PS[t].map((x) => r + x);
}

export function subjonctif(v: string): string[] {
  const d = def(v);
  if (d.subj) return d.subj;
  const ils = d.pr[5];
  const imp = imparfait(v);
  return [0, 1, 2, 3, 4, 5].map((p) => (p === 3 || p === 4 ? imp[p] : map(ils, (x) => x.replace(/ent$/, "") + ["e", "es", "e", "", "", "ent"][p])));
}

export function subjonctifImparfait(v: string): string[] {
  const ps = passeSimple(v);
  const base = v1(ps[1])[0].replace(/s$/, ""); // tu chantas → chanta, tu finis → fini, tu vins → vin
  const t3 = v1(ps[2])[0]; // il chanta, il finit, il vint
  const il = v === "haïr" ? "haït" : t3.endsWith("t") ? t3.slice(0, -1).replace(/([aiu])(n?)$/, (_, a, n) => ({ a: "â", i: "î", u: "û" })[a as "a"] + n) + "t" : t3.replace(/a$/, "ât");
  const b = v === "croître" ? "crû" : base;
  return [b + "sse", b + "sses", v === "croître" ? "crût" : il, b + "ssions", b + "ssiez", b + "ssent"];
}

export function imperatif(v: string): [string, string, string] {
  const d = def(v);
  if (d.impe) return d.impe;
  const pr = d.pr;
  const sansS = d.groupe === 1 || /e$/.test(v1(pr[0])[0]); // chante, ouvre, cueille
  return [sansS ? map(pr[1], (x) => x.replace(/s$/, "")) : pr[1], pr[3], pr[4]];
}

export function participePresent(v: string): string {
  const d = def(v);
  return d.ppr ?? map(radImp(v), (r) => r + "ant");
}

/* ---------- Temps composés ---------- */
export function avecEtre(v: string): boolean {
  return def(v).etre === true;
}

/** Participe passé accordé ; toutes les variantes admises quand le genre n'est pas connu. */
export function ppAccorde(v: string, p: Personne, fem: boolean | null): string {
  const pp = def(v).pp;
  if (!avecEtre(v)) return pp;
  const plur = p >= 3;
  const forme = (f: boolean, pl: boolean) => {
    let x = pp;
    if (f) x = x.replace(/û$/, "u") + "e";
    if (pl && !x.endsWith("s")) x += "s";
    return x;
  };
  if (fem === null) {
    const all = p === 4 ? [forme(false, true), forme(true, true), forme(false, false), forme(true, false)] : [forme(false, plur), forme(true, plur)];
    return [...new Set(all)].join("|");
  }
  return forme(fem, plur);
}

const AUX_TEMPS: Partial<Record<TempsF, TempsF>> = {
  "passé composé": "présent", "plus-que-parfait": "imparfait", "futur antérieur": "futur simple", "passé antérieur": "passé simple",
  "conditionnel passé": "conditionnel présent", "subjonctif passé": "subjonctif présent", "subjonctif plus-que-parfait": "subjonctif imparfait",
};

export function conjugue(v: string, t: TempsF, p: Personne, fem: boolean | null = null): string {
  const simple = AUX_TEMPS[t];
  if (simple) {
    const aux = conjugue(avecEtre(v) ? "être" : "avoir", simple, p);
    const pp = ppAccorde(v, p, fem);
    return v1(aux).flatMap((a) => v1(pp).map((x) => `${a} ${x}`)).join("|");
  }
  const f = {
    présent: present, imparfait, "futur simple": futur, "passé simple": passeSimple, "conditionnel présent": conditionnel,
    "subjonctif présent": subjonctif, "subjonctif imparfait": subjonctifImparfait,
  }[t as "présent"];
  return f(v)[p];
}

/** Pronom sujet (avec élision « j’ » devant voyelle ou h muet). */
export function pronomF(p: Personne, forme: string, fem = false): string {
  const base = p === 2 ? (fem ? "elle" : "il") : p === 5 ? (fem ? "elles" : "ils") : ["je", "tu", "il", "nous", "vous", "ils"][p];
  if (p === 0 && /^[aeiouyéèêâîôûh]/i.test(forme) && !/^ha[iï]/.test(forme)) return "j’";
  return base + " ";
}

/** Pour le subjonctif : « que je », « qu’il »… */
export function queF(p: Personne, forme: string, fem = false): string {
  const pr = pronomF(p, forme, fem);
  return /^[aeiouyé]/.test(pr) ? `qu’${pr}` : `que ${pr}`;
}

export const premiere = (s: string): string => v1(s)[0];
export const variantes = (s: string): string[] => v1(s);
