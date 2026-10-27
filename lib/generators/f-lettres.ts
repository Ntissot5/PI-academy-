import { pick } from "../math";
import { melange, nombre, qcm, qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* Mots familiers et mots-outils (sans apostrophe ni trait d’union). */
const MOTS = ["papa", "maman", "lune", "bébé", "vélo", "chat", "école", "lapin", "pomme", "ballon", "moto", "soleil", "maison",
  "le", "la", "les", "un", "une", "des", "et", "avec", "dans", "sur", "pour", "mon", "ton", "sous", "nous", "bonbon", "dodo", "nuit", "arbre"];
/* Lettres qui se ressemblent : on les échange pour fabriquer des pièges. */
const SOSIES: Record<string, string[]> = {
  b: ["d", "p", "q"], d: ["b", "p", "q"], p: ["q", "b", "d"], q: ["p", "d", "b"], m: ["n"], n: ["m", "u"], u: ["n", "v"],
  e: ["a", "o"], a: ["o", "e"], o: ["a", "e"], l: ["t", "i"], t: ["l", "f"], i: ["l", "j"], s: ["z", "c"], c: ["e", "o"], v: ["u", "w"], r: ["n"],
};

/** Variantes fausses d'un mot : une lettre changée ou deux lettres inversées. */
function pieges(m: string): string[] {
  const out = new Set<string>();
  const lettres = [...m];
  lettres.forEach((l, i) => {
    for (const s of SOSIES[l] ?? []) out.add([...lettres.slice(0, i), s, ...lettres.slice(i + 1)].join(""));
    if (i < lettres.length - 1 && lettres[i] !== lettres[i + 1]) {
      const x = [...lettres];
      [x[i], x[i + 1]] = [x[i + 1], x[i]];
      out.add(x.join(""));
    }
  });
  out.delete(m);
  return [...out];
}

/** Trouver le mot écrit exactement comme le modèle. */
function memeMot(): Question {
  const m = pick(MOTS.filter((x) => pieges(x).length >= 3));
  return qcm(
    `Quel mot est écrit exactement comme le modèle <b>${m}</b> ?`,
    m,
    pieges(m),
    `« ${m} » : mêmes lettres, dans le même ordre.`,
    "Compare les mots lettre par lettre.",
  );
}

/** Trouver la lettre identique au modèle. */
function memeLettre(): Question {
  const l = pick(Object.keys(SOSIES).filter((k) => SOSIES[k].length >= 2));
  return qcm(`Quelle lettre est la même que le modèle <b>${l}</b> ?`, l, SOSIES[l], `C’est la lettre « ${l} ».`, "Regarde bien le sens des traits.");
}

const MAJ: [string, string, string[]][] = [
  ["a", "A", ["E", "O"]], ["b", "B", ["D", "P"]], ["d", "D", ["B", "P"]], ["e", "E", ["F", "A"]], ["g", "G", ["Q", "C", "J"]],
  ["h", "H", ["N", "K"]], ["m", "M", ["N", "W"]], ["n", "N", ["M", "U"]], ["q", "Q", ["P", "G"]], ["r", "R", ["P", "N"]],
  ["l", "L", ["I", "T"]], ["t", "T", ["F", "L"]], ["u", "U", ["V", "N"]], ["f", "F", ["E", "T"]], ["j", "J", ["I", "G"]],
];

/** Associer minuscule et majuscule. */
function majuscule(): Question {
  const [min, maj, autres] = pick(MAJ);
  return Math.random() < 0.5
    ? qcm(`Quelle est la majuscule de la lettre <b>${min}</b> ?`, maj, autres, `La lettre « ${min} » s’écrit « ${maj} » en majuscule.`)
    : qcm(`Quelle est la minuscule de la lettre <b>${maj}</b> ?`, min, autres.map((x) => x.toLowerCase()), `La lettre « ${maj} » s’écrit « ${min} » en minuscule.`);
}

/** Chiffre, lettre ou mot ? */
function chiffreLettre(): Question {
  const chiffre = String(pick([2, 3, 4, 5, 7, 8, 9]));
  const lettres = melange(["A", "T", "L", "M", "R", "S", "B", "E"]).slice(0, 3);
  if (Math.random() < 0.5) {
    return qcm("Lequel est un <b>chiffre</b> ?", chiffre, lettres, `« ${chiffre} » est un chiffre : il sert à écrire les nombres. Les autres sont des lettres.`);
  }
  const lettre = lettres[0];
  const chiffres = melange(["1", "2", "3", "4", "5", "6", "7", "8", "9"]).slice(0, 3);
  return qcm("Lequel est une <b>lettre</b> ?", lettre, chiffres, `« ${lettre} » est une lettre : elle sert à écrire les mots. Les autres sont des chiffres.`);
}

const PHRASES = [
  "Le chat dort.", "Papa lit un livre.", "Maman fait du vélo.", "Le soleil brille.", "Nous jouons au ballon.",
  "Le lapin mange une carotte.", "Ma sœur chante dans le jardin.", "Il neige sur la montagne.", "Tom mange une pomme.",
  "Le bus arrive à la gare.", "Nina dessine un grand arbre.", "Les enfants jouent dans la cour.", "Mon chien court vite.",
];

/** Combien de mots dans la phrase ? */
function compterMots(): Question {
  const p = pick(PHRASES);
  const mots = p.replace(".", "").split(" ");
  return nombre(
    `Combien de mots y a-t-il dans cette phrase ? <b>${p}</b>`,
    mots.length,
    `${mots.map((m) => `« ${m} »`).join(", ")} : ${mots.length} mots. Les mots sont séparés par des espaces.`,
    "Un mot se termine là où il y a un espace.",
  );
}

/** Combien de lettres dans le mot ? */
function compterLettres(): Question {
  const m = pick(MOTS.filter((x) => x.length >= 3));
  return nombre(`Combien de lettres y a-t-il dans le mot <b>${m}</b> ?`, m.length, `« ${m} » : ${[...m].join(" – ")}, ${m.length} lettres.`);
}

/** Première ou dernière lettre d'un mot. */
function premiereLettre(): Question {
  const m = pick(MOTS.filter((x) => x.length >= 3));
  const derniere = Math.random() < 0.3;
  const l = derniere ? m[m.length - 1] : m[0];
  return saisie(
    `Quelle est la ${derniere ? "dernière" : "première"} lettre du mot <b>${m}</b> ?`,
    l,
    `« ${m} » ${derniere ? "finit" : "commence"} par la lettre « ${l} ».`,
    [],
    "Écris seulement la lettre.",
  );
}

/** Lettre, mot ou phrase ? */
function notion(): Question {
  const p = pick(PHRASES);
  const mots = p.replace(".", "").split(" ");
  const m = pick(mots.filter((x) => x.length >= 3));
  const choix = ["une lettre", "un mot", "une phrase"];
  const k = pick([0, 1, 2]);
  const vise = k === 0 ? m[0] : k === 1 ? m : p;
  const why = [
    `« ${m[0]} » est une lettre : un mot est fait de lettres.`,
    `« ${m} » est un mot : des espaces le séparent des autres mots.`,
    `« ${p} » est une phrase : elle commence par une majuscule et finit par un point.`,
  ][k];
  return qcmFixe(`Dans « ${p} », qu’est-ce que <b>${vise}</b> ?`, choix[k], choix, why);
}

/** Sens de l'écriture. */
function sens(): Question {
  return Math.random() < 0.5
    ? qcmFixe("En français, dans quel sens lit-on et écrit-on une ligne ?", "de gauche à droite", ["de gauche à droite", "de droite à gauche", "de bas en haut"], "En français, on lit et on écrit de gauche à droite, puis on passe à la ligne du dessous.")
    : qcmFixe("Quand une ligne est finie, où continue-t-on à lire ?", "au début de la ligne du dessous", ["au début de la ligne du dessous", "à la fin de la ligne du dessus", "au milieu de la page"], "On lit de gauche à droite et de haut en bas : on continue au début de la ligne suivante.");
}

/** Lettres et mots : reconnaître, comparer, compter (entrée dans l'écrit). */
export function gen(): Question {
  return tirer([memeMot, memeMot, memeLettre, majuscule, chiffreLettre, compterMots, compterLettres, premiereLettre, notion, sens]);
}
