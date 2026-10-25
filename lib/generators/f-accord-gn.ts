import { pick } from "../math";
import { melange, qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* Adjectifs : [masc. sing., fém. sing., masc. plur., fém. plur., placé avant le nom ?]. */
const A: Record<string, readonly [string, string, string, string, boolean]> = {
  petit: ["petit", "petite", "petits", "petites", true], grand: ["grand", "grande", "grands", "grandes", true],
  joli: ["joli", "jolie", "jolis", "jolies", true], gros: ["gros", "grosse", "gros", "grosses", true],
  beau: ["beau", "belle", "beaux", "belles", true], haut: ["haut", "haute", "hauts", "hautes", true],
  long: ["long", "longue", "longs", "longues", false], noir: ["noir", "noire", "noirs", "noires", false],
  blanc: ["blanc", "blanche", "blancs", "blanches", false], vert: ["vert", "verte", "verts", "vertes", false],
  rouge: ["rouge", "rouge", "rouges", "rouges", false], bleu: ["bleu", "bleue", "bleus", "bleues", false],
  neuf: ["neuf", "neuve", "neufs", "neuves", false], lourd: ["lourd", "lourde", "lourds", "lourdes", false],
  délicieux: ["délicieux", "délicieuse", "délicieux", "délicieuses", false], fleuri: ["fleuri", "fleurie", "fleuris", "fleuries", false],
  enneigé: ["enneigé", "enneigée", "enneigés", "enneigées", false], mûr: ["mûr", "mûre", "mûrs", "mûres", false],
  chaud: ["chaud", "chaude", "chauds", "chaudes", false], froid: ["froid", "froide", "froids", "froides", false],
  profond: ["profond", "profonde", "profonds", "profondes", false], sportif: ["sportif", "sportive", "sportifs", "sportives", false],
  passionnant: ["passionnant", "passionnante", "passionnants", "passionnantes", false], étroit: ["étroit", "étroite", "étroits", "étroites", false],
};

/* Noms : [singulier, pluriel, féminin ?, adjectifs qui conviennent]. */
const N: readonly (readonly [string, string, boolean, readonly string[]])[] = [
  ["chat", "chats", false, ["noir", "blanc", "petit", "gros"]], ["vélo", "vélos", false, ["rouge", "neuf", "petit", "bleu"]],
  ["sac", "sacs", false, ["lourd", "noir", "petit", "neuf"]], ["pull", "pulls", false, ["vert", "chaud", "gros", "neuf"]],
  ["jardin", "jardins", false, ["fleuri", "petit", "grand", "joli"]], ["gâteau", "gâteaux", false, ["délicieux", "gros", "petit"]],
  ["cheval", "chevaux", false, ["blanc", "noir", "beau", "grand"]], ["chemin", "chemins", false, ["long", "étroit", "petit"]],
  ["livre", "livres", false, ["passionnant", "gros", "petit", "neuf"]], ["sommet", "sommets", false, ["enneigé", "haut"]],
  ["maison", "maisons", true, ["blanc", "grand", "petit", "joli"]], ["fleur", "fleurs", true, ["rouge", "blanc", "joli", "petit"]],
  ["voiture", "voitures", true, ["neuf", "rouge", "petit", "gros", "noir"]], ["robe", "robes", true, ["long", "blanc", "joli", "vert", "neuf"]],
  ["montagne", "montagnes", true, ["haut", "enneigé", "grand"]], ["chaussure", "chaussures", true, ["neuf", "noir", "sportif"]],
  ["rivière", "rivières", true, ["long", "profond", "froid"]], ["pomme", "pommes", true, ["vert", "rouge", "mûr"]],
  ["soupe", "soupes", true, ["chaud", "délicieux"]], ["tarte", "tartes", true, ["délicieux", "petit", "gros"]],
];

const DET = [["un", "une", "des"], ["le", "la", "les"], ["mon", "ma", "mes"], ["ce", "cette", "ces"]] as const;

function tirage() {
  const [sg, pl, fem, adjs] = pick(N);
  const plur = Math.random() < 0.55;
  const adj = A[pick(adjs)];
  // « des » devant un adjectif placé avant le nom devient « de » (de petites maisons) : on prend un autre déterminant.
  const d = pick(adj[4] && plur ? DET.slice(1) : DET);
  const det = plur ? d[2] : fem ? d[1] : d[0];
  const nom = plur ? pl : sg;
  const forme = adj[(fem ? 1 : 0) + (plur ? 2 : 0)];
  return { sg, fem, plur, adj, det, nom, forme, avant: adj[4] };
}

const genreNombre = (fem: boolean, plur: boolean): string => `${fem ? "féminin" : "masculin"} ${plur ? "pluriel" : "singulier"}`;

/** Choisir la forme de l'adjectif. */
function adjectif(): Question {
  const t = tirage();
  const gn = t.avant ? `${t.det} … ${t.nom}` : `${t.det} ${t.nom} …`;
  const choix = [...new Set(t.adj.slice(0, 4) as string[])];
  return qcmFixe(
    `Choisis la bonne forme de l’adjectif <b>${t.adj[0]}</b> : <b>${gn}</b>`,
    t.forme,
    melange(choix),
    `« ${t.nom} » est ${genreNombre(t.fem, t.plur)} : l’adjectif s’accorde avec le nom → ${t.avant ? `${t.det} ${t.forme} ${t.nom}` : `${t.det} ${t.nom} ${t.forme}`}.`,
    "Cherche le nom, puis son genre et son nombre.",
  );
}

/** Écrire l'adjectif accordé. */
function ecrire(): Question {
  const t = tirage();
  const gn = t.avant ? `${t.det} … ${t.nom}` : `${t.det} ${t.nom} …`;
  return saisie(
    `Écris l’adjectif <b>${t.adj[0]}</b> correctement accordé : <b>${gn}</b>`,
    t.forme,
    `« ${t.nom} » est ${genreNombre(t.fem, t.plur)} → ${t.avant ? `${t.det} ${t.forme} ${t.nom}` : `${t.det} ${t.nom} ${t.forme}`}.`,
    [],
    "Féminin : souvent -e ; pluriel : souvent -s.",
  );
}

/** Choisir le déterminant. */
function determinant(): Question {
  const t = tirage();
  const d = pick(t.avant && t.plur ? DET.slice(1) : DET);
  const a = t.plur ? d[2] : t.fem ? d[1] : d[0];
  const gn = t.avant ? `… ${t.forme} ${t.nom}` : `… ${t.nom} ${t.forme}`;
  return qcmFixe(
    `Choisis le bon déterminant : <b>${gn}</b>`,
    a,
    [...d],
    `« ${t.nom} » est ${genreNombre(t.fem, t.plur)} : le déterminant s’accorde aussi → « ${a} ».`,
  );
}

/** Accord dans le groupe nominal : déterminant, nom et adjectif. */
export function gen(): Question {
  return tirer([adjectif, adjectif, ecrire, ecrire, determinant]);
}
