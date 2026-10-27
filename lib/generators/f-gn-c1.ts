import { pick } from "../math";
import { qcm, qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

const MASC = ["vélo", "ballon", "chat", "livre", "bateau", "camion", "cahier", "crayon", "jardin", "lapin", "gâteau", "chapeau", "soleil", "train", "pull", "sac"];
const FEM = ["chaise", "pomme", "fleur", "voiture", "maison", "table", "poule", "robe", "lune", "fenêtre", "montagne", "chanson", "tortue", "trousse", "porte", "carotte"];
const PLUR_X: Record<string, string> = { bateau: "bateaux", gâteau: "gâteaux", chapeau: "chapeaux" };
const pl = (n: string): string => PLUR_X[n] ?? n + "s";

function genre(): Question {
  const m = Math.random() < 0.5;
  const n = pick(m ? MASC : FEM);
  return qcmFixe(
    `Le nom <b>${n}</b> est-il masculin ou féminin ?`,
    m ? "masculin" : "féminin",
    ["masculin", "féminin"],
    m ? `On dit « un ${n} » : le nom est masculin.` : `On dit « une ${n} » : le nom est féminin.`,
    "Essaie de dire « un » ou « une » devant le nom.",
  );
}

function nombre(): Question {
  const n = pick([...MASC, ...FEM]);
  const f = FEM.includes(n);
  const k = pick([0, 1, 2, 3]);
  const gn = [`${f ? "une" : "un"} ${n}`, `les ${pl(n)}`, `${f ? "la" : "le"} ${n}`, `des ${pl(n)}`][k];
  const plur = k % 2 === 1;
  return qcmFixe(
    `Le groupe <b>${gn}</b> est-il au singulier ou au pluriel ?`,
    plur ? "pluriel" : "singulier",
    ["singulier", "pluriel"],
    plur ? `« ${gn} » : plusieurs. Le déterminant « ${gn.split(" ")[0]} » et la marque -${pl(n).slice(-1)} montrent le pluriel.` : `« ${gn} » : un seul. C’est le singulier.`,
  );
}

function accordNom(): Question {
  const n = pick([...MASC, ...FEM]);
  const f = FEM.includes(n);
  const d = pick(f ? ["les", "des", "mes", "deux", "la", "une", "ma"] : ["les", "des", "mes", "trois", "le", "un", "mon"]);
  const plur = ["les", "des", "mes", "deux", "trois"].includes(d);
  const a = plur ? pl(n) : n;
  return qcmFixe(
    `Choisis la bonne écriture : <b>${d} …</b>`,
    a,
    [n, pl(n)],
    plur ? `Après « ${d} », le nom est au pluriel : on ajoute -${pl(n).slice(-1)} (${a}).` : `Après « ${d} », le nom est au singulier : « ${a} », sans -s.`,
    "Regarde le déterminant.",
  );
}

function determinant(): Question {
  const n = pick([...MASC, ...FEM]);
  const f = FEM.includes(n);
  const plur = Math.random() < 0.4;
  const a = plur ? "les" : f ? "la" : "le";
  return qcmFixe(
    `Choisis le bon déterminant : <b>… ${plur ? pl(n) : n}</b>`,
    a,
    ["le", "la", "les"],
    plur ? `« ${pl(n)} » est au pluriel : « les ${pl(n)} ».` : `« ${n} » est ${f ? "féminin" : "masculin"} singulier : « ${a} ${n} ».`,
  );
}

/* GN : [groupe, nom]. */
const GN: readonly (readonly [string, string])[] = [
  ["le petit chien", "chien"], ["une belle fleur", "fleur"], ["mon vélo rouge", "vélo"], ["la grande maison", "maison"],
  ["des pommes vertes", "pommes"], ["ce gros camion", "camion"], ["les jolies robes", "robes"], ["ta trousse bleue", "trousse"],
];

function nomDuGn(): Question {
  const [gn, n] = pick(GN);
  const mots = gn.split(" ");
  if (Math.random() < 0.5) {
    return qcm(`Dans le groupe <b>${gn}</b>, quel mot est le nom ?`, n, mots, `« ${n} » est le nom : il désigne une chose, un animal ou une personne. « ${mots[0]} » est le déterminant.`, undefined, 3);
  }
  return qcm(`Dans le groupe <b>${gn}</b>, quel mot est le déterminant ?`, mots[0], mots, `« ${mots[0]} » est le déterminant : il se place avant le nom « ${n} ».`, undefined, 3);
}

/** Le groupe nominal au cycle 1 : genre, nombre, accord du déterminant et du nom. */
export function gen(): Question {
  return tirer([genre, nombre, accordNom, accordNom, determinant, nomDuGn]);
}
