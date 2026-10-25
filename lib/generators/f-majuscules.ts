import { pick } from "../math";
import { gras, melange, qcm, qcmFixe, tirer, vise } from "./f-outils";
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

/* [phrase correcte, phrases fausses, règle]. */
const BIEN: readonly (readonly [string, readonly string[], string])[] = [
  ["Mon chat s’appelle Filou.", ["mon chat s’appelle Filou.", "Mon chat s’appelle filou.", "Mon Chat s’appelle Filou."], "Majuscule au début de la phrase et au nom propre « Filou »."],
  ["Léa habite à Morges.", ["léa habite à Morges.", "Léa habite à morges.", "Léa Habite à Morges."], "Majuscule aux noms propres « Léa » et « Morges », pas au verbe."],
  ["Nous partons lundi pour Lugano.", ["Nous partons Lundi pour Lugano.", "Nous partons lundi pour lugano.", "nous partons lundi pour Lugano."], "Les jours de la semaine s’écrivent sans majuscule ; « Lugano » est un nom propre."],
  ["En juillet, Sami visite Berne.", ["En Juillet, Sami visite Berne.", "En juillet, sami visite Berne.", "en juillet, Sami visite Berne."], "Les mois s’écrivent sans majuscule ; « Sami » et « Berne » sont des noms propres."],
  ["Mon amie Inès parle allemand.", ["Mon amie Inès parle Allemand.", "Mon amie inès parle allemand.", "mon amie Inès parle allemand."], "Le nom d’une langue s’écrit sans majuscule."],
  ["Un Italien parle italien.", ["Un italien parle italien.", "Un Italien parle Italien.", "un Italien parle italien."], "L’habitant (un Italien) prend une majuscule ; la langue (l’italien) n’en prend pas."],
  ["Les Valaisans aiment la raclette.", ["Les valaisans aiment la raclette.", "les Valaisans aiment la raclette.", "Les Valaisans aiment la Raclette."], "Les habitants d’un lieu prennent une majuscule : les Valaisans."],
  ["Le Rhône se jette dans le lac Léman.", ["Le rhône se jette dans le lac Léman.", "Le Rhône se jette dans le Lac léman.", "le Rhône se jette dans le lac Léman."], "Dans « le lac Léman », seul le nom propre « Léman » prend une majuscule."],
  ["Les Genevois fêtent l’Escalade en décembre.", ["Les genevois fêtent l’Escalade en décembre.", "Les Genevois fêtent l’escalade en Décembre.", "les Genevois fêtent l’Escalade en décembre."], "Habitants et nom de fête : majuscule ; mois : minuscule."],
];

function bienEcrite(): Question {
  const [a, faux, regle] = pick(BIEN);
  return qcm("Quelle phrase est bien écrite ?", a, faux, regle);
}

/* Majuscule ou minuscule après un signe de ponctuation : [avant, mot, maj ?, explication]. */
const APRES: readonly (readonly [string, string, boolean, string])[] = [
  ["Il pleuvait.", "nous", true, "Après un point, une nouvelle phrase commence : majuscule."],
  ["Il pleuvait,", "nous", false, "Après une virgule, la phrase continue : minuscule."],
  ["Où vas-tu ?", "je", true, "Après un point d’interrogation qui termine la phrase, majuscule."],
  ["Quelle surprise !", "tu", true, "Après un point d’exclamation qui termine la phrase, majuscule."],
  ["J’ai acheté trois fruits :", "une", false, "Après les deux-points, la phrase continue : minuscule."],
  ["Le soleil brillait ;", "les", false, "Après un point-virgule, la phrase continue : minuscule."],
  ["Il a dit : «", "je", true, "Les paroles rapportées entre guillemets commencent par une majuscule."],
  ["Il est tard,", "dit", false, "Après une virgule, minuscule."],
  ["Le bus est parti.", "tant", true, "Après un point, majuscule."],
];

function apresPonctuation(): Question {
  const [avant, mot, m, why] = pick(APRES);
  const Maj = mot[0].toUpperCase() + mot.slice(1);
  return qcmFixe(`Quel mot faut-il écrire après le signe ? <b>${avant} …</b>`, m ? Maj : mot, melange([mot, Maj]), why);
}

/** Majuscules : noms propres et noms communs, début de phrase, après la ponctuation. */
export function gen(): Question {
  return tirer([propreCommun, propreCommun, bienEcrite, bienEcrite, apresPonctuation]);
}
