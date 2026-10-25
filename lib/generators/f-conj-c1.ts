import { pick } from "../math";
import { present } from "./data/f-verbes";
import { conjF } from "./f-conjuguer";
import { melange, qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

const CHANTER = ["chanter", "jouer", "danser", "parler", "marcher", "regarder", "aimer", "écouter", "dessiner", "sauter", "ranger", "colorier"];
const VERBES = [...CHANTER, "être", "avoir", "aller"];

const conjuguer = (): Question => conjF(VERBES, ["présent", "imparfait"]);

/** Retrouver l'infinitif. */
function infinitif(): Question {
  const v = pick(VERBES);
  const q = conjF([v], ["présent", "imparfait"]);
  const forme = q.why.split(/[.:]/)[0];
  return qcm(`Quel est l’infinitif du verbe dans <b>${forme}</b> ?`, v, melange(VERBES.filter((x) => x !== v)).slice(0, 2), `« ${forme} » vient du verbe « ${v} ».`, "Dis « il faut … » devant le verbe.", 3);
}

/* Sujets : [sujet, personne]. */
const SUJETS: readonly (readonly [string, 2 | 5])[] = [
  ["Le chat", 2], ["Ma sœur", 2], ["Noé", 2], ["La maîtresse", 2], ["Mon copain", 2],
  ["Les enfants", 5], ["Mes parents", 5], ["Les oiseaux", 5], ["Les filles", 5], ["Tes amis", 5],
];
const SUITE: Record<string, string> = {
  chanter: "une chanson", jouer: "dans la cour", danser: "le samedi", parler: "fort", marcher: "vite", regarder: "les nuages",
  aimer: "le chocolat", écouter: "la maîtresse", dessiner: "une maison", sauter: "dans les flaques", ranger: "les jouets", colorier: "un dessin",
};

/** Accord du verbe avec le sujet (verbes du type « chanter »). */
function accord(): Question {
  const v = pick(CHANTER);
  const [s, p] = pick(SUJETS);
  const f = present(v);
  return qcmFixe(
    `Choisis le bon verbe : <b>${s} … ${SUITE[v]}.</b>`,
    f[p],
    [f[2], f[5]],
    p === 2 ? `« ${s} » = il ou elle : le verbe finit par -e (${f[2]}).` : `« ${s} » = ils ou elles : le verbe finit par -ent (${f[5]}). On ne l’entend pas, mais on l’écrit.`,
    "Remplace le sujet par il, elle, ils ou elles.",
  );
}

/* Qui parle, à qui, de qui ? */
const ACTEURS: readonly (readonly [string, string])[] = [
  ["Tu parles de toi : tu dis « … mange ».", "je"], ["Tu parles à ton ami : tu lui dis « … manges ».", "tu"],
  ["Tu parles de ton papa : tu dis « … mange ».", "il"], ["Tu parles de ta maman : tu dis « … mange ».", "elle"],
  ["Tu parles de ton frère et toi : tu dis « … mangeons ».", "nous"], ["Tu parles à deux amis : tu leur dis « … mangez ».", "vous"],
  ["Tu parles de tes deux frères : tu dis « … mangent ».", "ils"], ["Tu parles de tes deux sœurs : tu dis « … mangent ».", "elles"],
];

function acteurs(): Question {
  const [q, a] = pick(ACTEURS);
  return qcm(`Quel pronom faut-il ? ${q}`, a, ["je", "tu", "il", "elle", "nous", "vous", "ils", "elles"], `On utilise « ${a} ».`);
}

/** Conjugaison au cycle 1 : présent et imparfait des verbes du type « chanter », être, avoir, aller. */
export function gen(): Question {
  return tirer([conjuguer, conjuguer, infinitif, accord, accord, acteurs]);
}
