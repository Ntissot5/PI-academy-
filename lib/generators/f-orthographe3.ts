import { pick } from "../math";
import { qcm } from "./f-outils";
import type { Question } from "./types";

/* Mots difficiles : [bonne orthographe, pièges, astuce]. */
const MOTS: readonly (readonly [string, readonly string[], string])[] = [
  ["accueil", ["acceuil", "acueil", "accueuil"], "Après « c », on écrit « ueil » pour garder le son [k] : accueil, cueillir, orgueil."],
  ["développement", ["dévelopement", "développemment", "dévellopement"], "Un seul l, deux p : développer."],
  ["apparaître", ["aparaître", "apparraître", "appaître"], "Deux p, un r. (« apparaitre » est aussi admis depuis 1990.)"],
  ["occasion", ["ocasion", "occassion", "occazion"], "Deux c, un s qui se prononce [z] entre deux voyelles."],
  ["rythme", ["rhythme", "rytme", "ritme"], "Mot d’origine grecque : y et th."],
  ["bibliothèque", ["bibliotèque", "biblioteque", "bibliothéque"], "« thèque » vient du grec (dépôt) : th + accent grave."],
  ["événement", ["évènnement", "évenement", "évenément"], "« événement » (ou « évènement », admis depuis 1990)."],
  ["professeur", ["proffesseur", "profésseur", "profeseur"], "Un f, deux s."],
  ["honnête", ["honête", "honnète", "onnête"], "Deux n et un accent circonflexe."],
  ["environnement", ["environement", "envirronnement", "environnemant"], "Deux n après « environ » : environnement."],
  ["mathématiques", ["mathématique", "matématiques", "mathématiquent"], "Le nom de la discipline est au pluriel et prend th."],
  ["téléphone", ["téléfone", "telephone", "téléphonne"], "« phone » vient du grec (voix) : ph."],
  ["géographie", ["jéographie", "géografie", "géograhie"], "« géo » (terre) + « graphie » (écriture) : ph."],
  ["hypothèse", ["hipothèse", "hypotèse", "hypothése"], "Mot d’origine grecque : y, th et accent grave."],
  ["ambiguïté", ["ambiguité", "ambiguitté", "embiguïté"], "Tréma sur le i (ambiguïté) ; « ambigüité » est admis depuis 1990."],
];

/** Orthographe lexicale de mots difficiles (origine, consonnes doubles, lettres grecques). */
export function gen(): Question {
  const [m, faux, astuce] = pick(MOTS);
  return qcm("Quel mot est correctement orthographié ?", m, faux, `« ${m} ». ${astuce}`);
}
