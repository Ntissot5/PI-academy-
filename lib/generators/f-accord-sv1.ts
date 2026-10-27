import { pick } from "../math";
import { conjugue, premiere, type Personne, type TempsF } from "./data/f-verbes";
import { nomTemps } from "./f-conjuguer";
import { qcm, tirer } from "./f-outils";
import type { Question } from "./types";

const SUJETS: readonly (readonly [string, Personne])[] = [
  ["Ma sœur", 2], ["Le voisin", 2], ["Lina", 2], ["Mon cousin", 2], ["Mes cousins", 5], ["Les élèves", 5], ["Les enfants", 5],
  ["Tu", 1], ["Nous", 3], ["Vous", 4], ["Mes amies", 5], ["Le facteur", 2],
];
const COMP: Record<string, string> = {
  chanter: "une chanson", jouer: "au foot", finir: "le puzzle", faire: "un gâteau", dire: "bonjour", prendre: "le bus", aller: "à la piscine",
  être: "en retard", avoir: "faim", venir: "à la fête", regarder: "la télévision", manger: "une glace", choisir: "un livre", écrire: "une lettre",
  lire: "le journal", voir: "le lac", partir: "tôt", savoir: "la réponse", vouloir: "une glace",
};

function simple(): Question {
  const v = pick(Object.keys(COMP));
  const [s, p] = pick(SUJETS);
  const t = pick<TempsF>(["présent", "présent", "imparfait", "futur simple"]);
  const formes = [0, 1, 2, 3, 4, 5].map((k) => premiere(conjugue(v, t, k as Personne)));
  const a = formes[p];
  return qcm(
    `Choisis le verbe correctement accordé (${nomTemps(t)}) : <b>${s} … ${COMP[v]}.</b>`,
    a,
    formes,
    `Le sujet « ${s} » ${p === 2 || p === 5 ? `peut être remplacé par « ${p === 2 ? "il/elle" : "ils/elles"} »` : "est un pronom"} : ${["Tu", "Nous", "Vous"].includes(s) ? s.toLowerCase() : s} ${a}.`,
    "Trouve le sujet : « Qui est-ce qui … ? »",
  );
}

/* Sujet inversé : [phrase avec …, bonne forme, autres, sujet]. */
const INV: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Dans le pré … les moutons.", "broutent", ["broute", "broutes"], "les moutons"],
  ["Que … les enfants pour leur anniversaire ?", "veulent", ["veut", "veux"], "les enfants"],
  ["Où … tes cousins ?", "habitent", ["habite", "habites"], "tes cousins"],
  ["Au loin … les cloches du village.", "sonnent", ["sonne", "sonnes"], "les cloches du village"],
  ["Sur la branche … un merle.", "chante", ["chantent", "chantes"], "un merle"],
  ["« Bonjour ! » … les élèves.", "disent", ["dit", "dis"], "les élèves"],
  ["Quand … ta sœur ?", "arrive", ["arrivent", "arrives"], "ta sœur"],
  ["Dans ce lac … des truites.", "vivent", ["vit", "vis"], "des truites"],
  ["Derrière la maison … un grand sapin.", "pousse", ["poussent", "pousses"], "un grand sapin"],
  ["À quelle heure … les magasins ?", "ferment", ["ferme", "fermes"], "les magasins"],
  ["Sous le pont … la rivière.", "coule", ["coulent", "coules"], "la rivière"],
  ["Que … tes parents ce week-end ?", "font", ["fait", "fais"], "tes parents"],
];

function inverse(): Question {
  const [p, a, autres, s] = pick(INV);
  return qcm(
    `Choisis le verbe correctement accordé : <b>${p}</b>`,
    a,
    autres,
    `Le sujet est placé après le verbe : « ${s} ». Le verbe s’accorde avec lui → ${a}.`,
    "Le sujet n’est pas toujours avant le verbe : pose la question « Qui est-ce qui … ? ».",
    3,
  );
}

/** Accord du verbe avec le sujet : cas simples et sujet inversé. */
export function gen(): Question {
  return tirer([simple, simple, simple, inverse, inverse]);
}
