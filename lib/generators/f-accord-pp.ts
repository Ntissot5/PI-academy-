import { pick } from "../math";
import { conjugue, def, premiere, type Personne } from "./data/f-verbes";
import { melange, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

/** Les quatre formes du participe passé. */
function formes(v: string): [string, string, string, string] {
  const pp = def(v).pp;
  const f = pp.replace(/û$/, "u") + "e";
  return [pp, f, pp.endsWith("s") ? pp : pp + "s", f + "s"];
}

/* Sujets : [texte, féminin ?, pluriel ?]. */
const SUJETS: readonly (readonly [string, boolean, boolean])[] = [
  ["Ma cousine", true, false], ["Mes cousines", true, true], ["Mon oncle", false, false], ["Les garçons", false, true],
  ["Lina", true, false], ["Léo et Sami", false, true], ["Les filles", true, true], ["Le facteur", false, false],
  ["Lina et Théo", false, true], ["Les élèves", false, true], ["Zoé et Inès", true, true],
];
const ETRE: Record<string, string> = {
  arriver: "hier soir", partir: "en vacances", tomber: "dans la neige", rester: "à la maison", venir: "nous voir", aller: "à Lausanne",
  sortir: "du cinéma", entrer: "dans la classe", rentrer: "tard", monter: "au sommet", descendre: "à la cave", retourner: "à l’école",
};
const AVOIR: Record<string, string> = {
  manger: "une glace", finir: "le puzzle", chanter: "une chanson", regarder: "un film", choisir: "un cadeau", perdre: "les clés",
  lire: "ce livre", voir: "le Cervin", prendre: "le train", écrire: "une lettre", faire: "un gâteau", attendre: "le bus",
};

function avecEtre(): Question {
  const v = pick(Object.keys(ETRE));
  const [s, fem, plur] = pick(SUJETS);
  const f = formes(v);
  const a = f[(fem ? 1 : 0) + (plur ? 2 : 0)];
  const aux = premiere(conjugue("être", "présent", (plur ? 5 : 2) as Personne));
  return qcmFixe(
    `Choisis le participe passé de <b>${v}</b> : <b>${s} ${aux} … ${ETRE[v]}.</b>`,
    a,
    melange([...new Set(f)]),
    `Avec l’auxiliaire « être », le participe passé s’accorde avec le sujet « ${s} » (${fem ? "féminin" : "masculin"} ${plur ? "pluriel" : "singulier"}) : ${a}.`,
    "Avec être, cherche le sujet : qui est-ce qui … ?",
  );
}

function avecAvoir(): Question {
  const v = pick(Object.keys(AVOIR));
  const [s, , plur] = pick(SUJETS);
  const f = formes(v);
  const aux = premiere(conjugue("avoir", "présent", (plur ? 5 : 2) as Personne));
  return qcmFixe(
    `Choisis le participe passé de <b>${v}</b> : <b>${s} ${aux} … ${AVOIR[v]}.</b>`,
    f[0],
    melange([...new Set(f)]),
    `Avec l’auxiliaire « avoir », le participe passé ne s’accorde pas avec le sujet : ${s} ${aux} ${f[0]} ${AVOIR[v]}.`,
    "Avec avoir, le participe ne s’accorde pas avec le sujet.",
  );
}

/* Participe employé seul : [groupe nominal, féminin ?, pluriel ?, verbe, suite]. */
const SEUL: readonly (readonly [string, boolean, boolean, string, string])[] = [
  ["Les feuilles", true, true, "tomber", "couvrent le trottoir."], ["La tarte", true, false, "cuire", "sent bon."],
  ["Les enfants", false, true, "fatiguer", "s’endorment vite."], ["Le linge", false, false, "laver", "sèche au soleil."],
  ["Les fraises", true, true, "cueillir", "remplissent le panier."], ["La lettre", true, false, "écrire", "est sur la table."],
  ["Les exercices", false, true, "finir", "peuvent être corrigés."], ["Les vitres", true, true, "casser", "seront remplacées."],
  ["La porte", true, false, "ouvrir", "laisse entrer le froid."], ["Les chaussures", true, true, "mouiller", "sèchent près du feu."],
];

function seul(): Question {
  const [n, fem, plur, v, suite] = pick(SEUL);
  const f = formes(v);
  const a = f[(fem ? 1 : 0) + (plur ? 2 : 0)];
  return qcmFixe(
    `Choisis le participe passé de <b>${v}</b> : <b>${n} … ${suite}</b>`,
    a,
    melange([...new Set(f)]),
    `Employé sans auxiliaire, le participe passé s’accorde comme un adjectif avec le nom « ${n.split(" ").slice(1).join(" ")} » : ${a}.`,
  );
}

/** Accord du participe passé : employé seul, avec être, avec avoir (cas simple). */
export function gen(): Question {
  return tirer([avecEtre, avecEtre, avecAvoir, avecAvoir, seul]);
}
