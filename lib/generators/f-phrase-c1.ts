import { pick } from "../math";
import { qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

/* Phrases simples : sujet, pronom, verbe, complément du verbe (ou rien), complément de phrase. */
interface P { s: string; pro: "il" | "elle" | "ils" | "elles"; v: string; cv: string; cp: string }
const PH: readonly P[] = [
  { s: "les enfants", pro: "ils", v: "jouent", cv: "au ballon", cp: "dans la cour" },
  { s: "ma grand-mère", pro: "elle", v: "prépare", cv: "une tarte aux pommes", cp: "le dimanche" },
  { s: "le facteur", pro: "il", v: "apporte", cv: "une lettre", cp: "chaque matin" },
  { s: "le petit chat", pro: "il", v: "boit", cv: "son lait", cp: "dans la cuisine" },
  { s: "Noé et Lina", pro: "ils", v: "construisent", cv: "une cabane", cp: "au bord du lac" },
  { s: "mon oncle", pro: "il", v: "répare", cv: "son vélo", cp: "dans le garage" },
  { s: "les hirondelles", pro: "elles", v: "quittent", cv: "la Suisse", cp: "en automne" },
  { s: "la maîtresse", pro: "elle", v: "lit", cv: "une histoire", cp: "après la récréation" },
  { s: "les marmottes", pro: "elles", v: "dorment", cv: "", cp: "tout l’hiver" },
  { s: "Zoé", pro: "elle", v: "dessine", cv: "un dragon", cp: "sur son cahier" },
  { s: "mes cousines", pro: "elles", v: "visitent", cv: "le château de Chillon", cp: "pendant les vacances" },
  { s: "le train", pro: "il", v: "traverse", cv: "le tunnel", cp: "à toute vitesse" },
  { s: "mon père", pro: "il", v: "cultive", cv: "des tomates", cp: "dans le jardin" },
  { s: "les skieurs", pro: "ils", v: "descendent", cv: "la piste", cp: "avant midi" },
  { s: "le chien", pro: "il", v: "aboie", cv: "", cp: "toute la nuit" },
  { s: "Tom", pro: "il", v: "mange", cv: "une pomme", cp: "à la récréation" },
  { s: "la neige", pro: "elle", v: "recouvre", cv: "les toits", cp: "ce matin" },
  { s: "mes amis", pro: "ils", v: "regardent", cv: "un film", cp: "ce soir" },
  { s: "Sara et Julie", pro: "elles", v: "cueillent", cv: "des fraises", cp: "au mois de juin" },
];

const maj = (s: string): string => s[0].toUpperCase() + s.slice(1);

/** La phrase, avec le complément de phrase au début ou à la fin. */
function phrase(p: P, cpDebut = Math.random() < 0.5): string {
  const gv = p.cv ? `${p.v} ${p.cv}` : p.v;
  return cpDebut ? `${maj(p.cp)}, ${p.s} ${gv}.` : `${maj(p.s)} ${gv} ${p.cp}.`;
}

function sujet(): Question {
  const p = pick(PH);
  return qcm(
    `Quel est le sujet de cette phrase ? <b>${phrase(p)}</b>`,
    p.s,
    [p.cp, p.cv || p.v, p.cv ? `${p.v} ${p.cv}` : p.cp].filter((x) => x !== p.s),
    `Qui est-ce qui ${p.v} ? C’est « ${p.s} » : le sujet. On peut le remplacer par « ${p.pro} ».`,
    "Pose la question « Qui est-ce qui … ? » devant le verbe.",
  );
}

function verbe(): Question {
  const p = pick(PH);
  const noms = [p.s, p.cv, p.cp].filter(Boolean).map((g) => g.split(" ").pop()!);
  return qcm(
    `Quel est le verbe conjugué ? <b>${phrase(p)}</b>`,
    p.v,
    noms,
    `« ${p.v} » est le verbe : il change si on change le temps (hier, demain…).`,
    "Mets « hier » ou « demain » au début : le mot qui change est le verbe.",
  );
}

function gv(): Question {
  const p = pick(PH.filter((x) => x.cv));
  const g = `${p.v} ${p.cv}`;
  return qcm(
    `Quel est le groupe verbal de cette phrase ? <b>${phrase(p)}</b>`,
    g,
    [`${p.s} ${p.v}`, p.cp, p.s],
    `Le groupe verbal est formé du verbe et de son complément : « ${g} ».`,
  );
}

function cp(): Question {
  const p = pick(PH);
  return qcm(
    `Quel groupe peut-on déplacer ou supprimer ? <b>${phrase(p)}</b>`,
    p.cp,
    [p.s, p.cv ? `${p.v} ${p.cv}` : p.v],
    `« ${p.cp} » est le complément de phrase : on peut le déplacer (${phrase(p, true).split(",")[0]}, …) ou le supprimer. Le sujet et le groupe verbal sont obligatoires.`,
    "Essaie d’enlever chaque groupe : la phrase a-t-elle encore du sens ?",
    3,
  );
}

function obligatoire(): Question {
  const p = pick(PH);
  const gv = p.cv ? `${p.v} ${p.cv}` : p.v;
  const sansCp = Math.random() < 0.5;
  const reste = sansCp ? `${maj(p.s)} ${gv}.` : `${maj(gv)} ${p.cp}.`;
  return qcmFixe(
    `On enlève un groupe à la phrase « ${phrase(p, false)} » et on obtient : <b>${reste}</b> Le groupe enlevé était-il obligatoire ou facultatif ?`,
    sansCp ? "facultatif" : "obligatoire",
    ["obligatoire", "facultatif"],
    sansCp
      ? `On a enlevé « ${p.cp} » : la phrase a encore du sens. C’est un groupe facultatif (complément de phrase).`
      : `On a enlevé le sujet « ${p.s} » : la phrase n’a plus de sens. Le sujet est obligatoire.`,
  );
}

function pronom(): Question {
  const p = pick(PH);
  return qcmFixe(
    `Par quel pronom peux-tu remplacer le sujet <b>${p.s}</b> ? (${phrase(p, false)})`,
    p.pro,
    ["il", "elle", "ils", "elles"],
    `« ${p.s} » → « ${p.pro} ».${p.s.includes(" et ") && p.pro === "ils" ? " Un garçon et une fille ensemble : on dit « ils »." : ""}`,
  );
}

/** Groupes de la phrase au cycle 1 : sujet, verbe, groupe verbal, complément de phrase, pronom. */
export function gen(): Question {
  return tirer([sujet, sujet, verbe, verbe, gv, cp, obligatoire, pronom, pronom]);
}
