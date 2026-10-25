import { R, pick } from "../math";
import { melange, nombre, qcm, qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

const ALPHA = "abcdefghijklmnopqrstuvwxyz";

/* Noms sans accent : l'ordre alphabétique se lit lettre par lettre, sans hésitation. */
const MOTS = ["abricot", "arbre", "ballon", "banane", "bateau", "cadeau", "canard", "carotte", "cheval", "citron", "dauphin", "domino",
  "fourmi", "fraise", "girafe", "gomme", "hibou", "jardin", "journal", "kiwi", "lampe", "lapin", "livre", "loup", "maison", "montagne",
  "mouton", "nuage", "orange", "ours", "panda", "pomme", "poule", "radis", "renard", "robot", "sapin", "souris", "tigre", "tortue",
  "tulipe", "vache", "valise", "violon", "yaourt", "balai", "bonnet", "bouche", "camion", "chaton", "marmotte", "moto", "piano", "pirate"];

const ordre = (a: string[]): string[] => [...a].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));

function voisine(): Question {
  const k = R(1, 24);
  const l = ALPHA[k];
  const t = pick(["après", "avant", "entre"] as const);
  if (t === "après") return saisie(`Quelle lettre vient juste <b>après</b> la lettre <b>${l}</b> dans l’alphabet ?`, ALPHA[k + 1], `… ${l}, ${ALPHA[k + 1]} …`, [], "Récite l’alphabet à partir de a.");
  if (t === "avant") return saisie(`Quelle lettre vient juste <b>avant</b> la lettre <b>${l}</b> dans l’alphabet ?`, ALPHA[k - 1], `… ${ALPHA[k - 1]}, ${l} …`, [], "Récite l’alphabet à partir de a.");
  return saisie(`Quelle lettre se trouve <b>entre</b> ${ALPHA[k - 1]} et ${ALPHA[k + 1]} dans l’alphabet ?`, l, `… ${ALPHA[k - 1]}, ${l}, ${ALPHA[k + 1]} …`, [], "Récite l’alphabet à partir de a.");
}

function nombreLettres(): Question {
  return nombre("Combien de lettres y a-t-il dans l’alphabet français ?", 26, "L’alphabet a 26 lettres, de a à z : 6 voyelles (a, e, i, o, u, y) et 20 consonnes.");
}

/** Quatre mots, dont la première lettre est différente ou non. */
function quatreMots(): string[] {
  for (;;) {
    const ws = melange(MOTS).slice(0, 4);
    if (Math.random() < 0.5 && new Set(ws.map((w) => w[0])).size < 4) continue;
    return ws;
  }
}

function premierDernier(): Question {
  const ws = quatreMots();
  const tri = ordre(ws);
  const dernier = Math.random() < 0.4;
  const a = dernier ? tri[3] : tri[0];
  return qcm(
    `Quel mot vient en <b>${dernier ? "dernier" : "premier"}</b> dans l’ordre alphabétique ?`,
    a,
    ws,
    `Dans l’ordre alphabétique : ${tri.join(", ")}. Si la première lettre est la même, on compare la deuxième, puis la troisième.`,
    "Compare d’abord la première lettre de chaque mot.",
  );
}

function deuxieme(): Question {
  const ws = quatreMots().slice(0, 3);
  const tri = ordre(ws);
  return qcm(
    "Range ces mots dans l’ordre alphabétique. Quel mot est au <b>milieu</b> ?",
    tri[1],
    ws,
    `Dans l’ordre alphabétique : ${tri.join(", ")}.`,
  );
}

/** Mots repères d'une page de dictionnaire. */
function page(): Question {
  const tri = ordre(MOTS);
  const i = R(0, tri.length - 4);
  const [debut, , fin] = [tri[i], tri[i + 1], tri[i + 2]];
  const k = pick([0, 1, 2]);
  const cible = k === 0 ? tri[i + 1] : k === 1 ? (i > 0 ? tri[i - 1] : tri[i + 3]) : tri[i + 3];
  const pos = cible > fin ? 2 : cible < debut ? 1 : 0;
  const choix = ["oui, sur cette page", "non, sur une page avant", "non, sur une page après"];
  const why = [
    `« ${cible} » se range entre « ${debut} » et « ${fin} » : il est sur cette page.`,
    `« ${cible} » se range avant « ${debut} » : il est sur une page précédente.`,
    `« ${cible} » se range après « ${fin} » : il est sur une page suivante.`,
  ][pos];
  return qcmFixe(
    `Sur une page du dictionnaire, le premier mot est <b>${debut}</b> et le dernier est <b>${fin}</b>. Le mot <b>${cible}</b> est-il sur cette page ?`,
    choix[pos],
    choix,
    why,
    "Compare le mot avec le premier et le dernier mot de la page.",
  );
}

/** Ordre alphabétique : alphabet, classement de mots, recherche dans un dictionnaire. */
export function gen(): Question {
  return tirer([voisine, voisine, nombreLettres, premierDernier, premierDernier, deuxieme, page, page]);
}
