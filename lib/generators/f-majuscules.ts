import { pick } from "../math";
import { gras, qcm, qcmFixe, tirer, vise } from "./f-outils";
import type { Question } from "./types";

/* [phrase avec *nom*, propre ?]. */
const NOMS: readonly (readonly [string, boolean])[] = [
  ["Nous allons à *Neuchâtel*.", true], ["Ma meilleure amie s’appelle *Lucie*.", true], ["Le *Rhône* traverse Genève.", true],
  ["La *Suisse* a quatre langues nationales.", true], ["Le *Cervin* est une montagne célèbre.", true], ["Mon chat s’appelle *Filou*.", true],
  ["Nous avons visité *Lugano*.", true], ["Le *Doubs* est une rivière.", true],
  ["Le *lac* est gelé.", false], ["Cette *ville* est très animée.", false], ["La *montagne* est enneigée.", false],
  ["Mon *chat* dort.", false], ["La *maîtresse* lit une histoire.", false], ["Le *fleuve* est large.", false],
];

function propreCommun(): Question {
  const [p, prop] = pick(NOMS);
  return qcmFixe(
    `Le nom en gras est-il un nom propre ou un nom commun ? ${gras(p)}`,
    prop ? "nom propre" : "nom commun",
    ["nom propre", "nom commun"],
    prop
      ? `« ${vise(p)} » désigne une seule personne, un seul animal ou un seul lieu précis : c’est un nom propre, il prend une majuscule.`
      : `« ${vise(p)} » désigne n’importe quel élément d’une catégorie : c’est un nom commun, sans majuscule.`,
  );
}

/* Phrase où un seul mot doit prendre une majuscule (hors début de phrase) : [phrase, mot, pièges, règle].
   La correction ne tient pas compte des majuscules : on fait donc choisir le mot, pas une écriture. */
const QUEL: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Nous partons lundi pour lugano.", "lugano", ["lundi", "partons"], "« Lugano » est un nom de ville : nom propre, majuscule. Les jours de la semaine s’écrivent sans majuscule."],
  ["En juillet, sami visite le musée.", "sami", ["juillet", "musée"], "« Sami » est un prénom : majuscule. Les mois s’écrivent sans majuscule."],
  ["Mon amie inès parle allemand.", "inès", ["allemand", "amie"], "« Inès » est un prénom. Le nom d’une langue (l’allemand) s’écrit sans majuscule."],
  ["Les valaisans aiment la raclette.", "valaisans", ["raclette", "aiment"], "Les habitants d’un lieu prennent une majuscule : les Valaisans."],
  ["Le bateau traverse le lac léman.", "léman", ["lac", "bateau"], "Dans « le lac Léman », seul le nom propre « Léman » prend une majuscule."],
  ["Mon chat s’appelle filou.", "filou", ["chat", "appelle"], "Le nom d’un animal précis est un nom propre : Filou."],
  ["Mes cousins habitent à delémont.", "delémont", ["cousins", "habitent"], "« Delémont » est un nom de ville : majuscule."],
  ["Le matin, les genevois prennent le tram.", "genevois", ["matin", "tram"], "Les habitants d’une ville prennent une majuscule : les Genevois."],
  ["Chaque été, nous montons au sommet du moléson.", "moléson", ["été", "sommet"], "« Moléson » est le nom d’une montagne : nom propre."],
  ["Ma grand-mère parle italien avec les italiens du quartier.", "italiens", ["italien", "quartier"], "Les habitants (les Italiens) prennent une majuscule ; la langue (l’italien) n’en prend pas."],
];

function quelMot(): Question {
  const [p, a, faux, regle] = pick(QUEL);
  return qcm(`Dans cette phrase, quel mot doit commencer par une majuscule ? <b>${p}</b>`, a, faux, regle, undefined, 3);
}

/* Majuscule ou minuscule après un signe de ponctuation : [avant, majuscule ?, explication]. */
const APRES: readonly (readonly [string, boolean, string])[] = [
  ["Il pleuvait.", true, "Après un point, une nouvelle phrase commence : majuscule."],
  ["Il pleuvait,", false, "Après une virgule, la phrase continue : minuscule."],
  ["Où vas-tu ?", true, "Après un point d’interrogation qui termine la phrase, majuscule."],
  ["Quelle surprise !", true, "Après un point d’exclamation qui termine la phrase, majuscule."],
  ["J’ai acheté trois fruits :", false, "Après les deux-points, la phrase continue : minuscule."],
  ["Le soleil brillait ;", false, "Après un point-virgule, la phrase continue : minuscule."],
  ["Il a dit : «", true, "Les paroles rapportées entre guillemets commencent par une majuscule."],
  ["Il est tard, dit Paul,", false, "Après une virgule, minuscule."],
];

function apresPonctuation(): Question {
  const [avant, m, why] = pick(APRES);
  return qcmFixe(`Après ce signe, le mot suivant commence-t-il par une majuscule ou une minuscule ? <b>${avant} …</b>`, m ? "par une majuscule" : "par une minuscule", ["par une majuscule", "par une minuscule"], why);
}

/** Majuscules : noms propres et noms communs, début de phrase, après la ponctuation. */
export function gen(): Question {
  return tirer([propreCommun, propreCommun, quelMot, quelMot, apresPonctuation]);
}
