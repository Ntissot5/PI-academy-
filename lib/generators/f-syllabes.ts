import { pick } from "../math";
import { melange, nombre, qcm, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* Mots découpés en syllabes : le découpage oral et le découpage écrit sont les mêmes
   (pas de « e » muet final, pas de consonne double, pas d'hiatus discutable). */
const MOTS: readonly (readonly string[])[] = [
  ["chat"], ["lit"], ["pain"], ["train"], ["loup"], ["sac"], ["nez"], ["dos"], ["bus"], ["lait"], ["riz"], ["bois"], ["feu"], ["main"],
  ["la", "pin"], ["vé", "lo"], ["ca", "deau"], ["mou", "ton"], ["ro", "bot"], ["mo", "to"], ["ju", "do"], ["ki", "wi"], ["mi", "nuit"],
  ["lun", "di"], ["mar", "di"], ["jeu", "di"], ["ra", "dis"], ["ri", "deau"], ["bu", "reau"], ["ba", "teau"], ["gâ", "teau"],
  ["châ", "teau"], ["cha", "peau"], ["ca", "nard"], ["re", "nard"], ["co", "chon"], ["pou", "let"], ["hi", "bou"], ["zé", "ro"],
  ["ci", "tron"], ["me", "lon"], ["ta", "pis"], ["cra", "paud"], ["tam", "bour"], ["dra", "peau"], ["sa", "pin"],
  ["cho", "co", "lat"], ["do", "mi", "no"], ["ca", "na", "pé"], ["ha", "ri", "cot"], ["ci", "né", "ma"], ["sa", "la", "mi"],
  ["py", "ja", "ma"], ["ven", "dre", "di"], ["nu", "mé", "ro"], ["a", "ni", "mal"],
  ["a", "bri", "cot"], ["kan", "gou", "rou"], ["es", "car", "got"], ["pan", "ta", "lon"], ["po", "ti", "ron"], ["ma", "ca", "ron"],
  ["a", "vo", "cat"], ["é", "pi", "nard"], ["ta", "bou", "ret"], ["pa", "ra", "sol"],
  ["or", "di", "na", "teur"], ["vé", "lo", "mo", "teur"], ["o", "ri", "ga", "mi"], ["har", "mo", "ni", "ca"], ["ma", "ca", "ro", "ni"], ["rhi", "no", "cé", "ros"],
];

const mot = (m: readonly string[]): string => m.join("");
const NB = ["", "une", "deux", "trois", "quatre"];

/** Combien de syllabes ? */
function compter(): Question {
  const m = pick(MOTS);
  return nombre(
    `Combien de syllabes entends-tu dans le mot <b>${mot(m)}</b> ?`,
    m.length,
    `« ${mot(m)} » : ${m.join(" – ")}, ${m.length === 1 ? "une seule syllabe" : `${NB[m.length]} syllabes`}.`,
    "Tape dans tes mains à chaque syllabe.",
  );
}

/** Quel mot a n syllabes ? */
function choisirLongueur(): Question {
  const n = pick([1, 2, 3, 4]);
  const bon = pick(MOTS.filter((m) => m.length === n));
  const autres = melange(MOTS.filter((m) => m.length !== n)).slice(0, 2).map(mot);
  return qcm(
    `Quel mot a <b>${n === 1 ? "une seule syllabe" : `${NB[n]} syllabes`}</b> ?`,
    mot(bon),
    autres,
    `« ${mot(bon)} » : ${bon.join(" – ")}.`,
    "Tape dans tes mains pour compter.",
    3,
  );
}

/** Remettre les syllabes dans l'ordre. */
function assembler(): Question {
  const m = pick(MOTS.filter((x) => x.length >= 2));
  let desordre = melange(m);
  while (desordre.join("") === m.join("")) desordre = melange(m);
  return saisie(
    `Remets les syllabes dans l’ordre pour former un mot : <b>${desordre.join(" – ")}</b>`,
    mot(m),
    `${m.join(" – ")} : « ${mot(m)} ».`,
    [],
    "Lis les syllabes dans un autre ordre jusqu’à entendre un mot que tu connais.",
  );
}

/** Quelle est la première (ou la dernière) syllabe ? */
function premiere(): Question {
  const m = pick(MOTS.filter((x) => x.length >= 2));
  const derniere = Math.random() < 0.4;
  const bon = derniere ? m[m.length - 1] : m[0];
  const autres = melange(MOTS.flat().filter((s) => s !== bon)).slice(0, 2);
  return qcm(
    `Quelle est la ${derniere ? "dernière" : "première"} syllabe du mot <b>${mot(m)}</b> ?`,
    bon,
    autres,
    `« ${mot(m)} » : ${m.join(" – ")}. La ${derniere ? "dernière" : "première"} syllabe est « ${bon} ».`,
    undefined,
    3,
  );
}

/** Quel mot commence par cette syllabe ? */
function commencePar(): Question {
  const m = pick(MOTS.filter((x) => x.length >= 2));
  const autres = melange(MOTS.filter((x) => x[0] !== m[0] && !mot(x).startsWith(m[0]))).slice(0, 2).map(mot);
  return qcm(
    `Quel mot commence par la syllabe <b>${m[0]}</b> ?`,
    mot(m),
    autres,
    `« ${mot(m)} » : ${m.join(" – ")}.`,
    undefined,
    3,
  );
}

/** Syllabes : segmenter un mot oral ou écrit (jeux de syllabes). */
export function gen(): Question {
  return tirer([compter, compter, choisirLongueur, assembler, premiere, commencePar]);
}
