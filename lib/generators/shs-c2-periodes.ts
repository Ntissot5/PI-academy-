import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const PERIODES = ["la Préhistoire", "l’Antiquité", "le Moyen Âge", "les Temps modernes", "l’Époque contemporaine"];

// [élément, période (index dans PERIODES), explication]
const ELEMENTS: [string, number, string][] = [
  ["les peintures dans les grottes (comme à Lascaux)", 0, "Les peintures rupestres datent de la Préhistoire."],
  ["les premiers outils en pierre taillée", 0, "La Préhistoire commence avec les premiers outils."],
  ["les villages lacustres (maisons sur pilotis au bord des lacs suisses)", 0, "Les palafittes datent du Néolithique et de l’âge du Bronze, à la Préhistoire."],
  ["le début de l’agriculture et de l’élevage (Néolithique)", 0, "Au Néolithique, les humains deviennent agriculteurs et sédentaires."],
  ["les pyramides d’Égypte", 1, "Les grandes pyramides ont été construites dans l’Antiquité égyptienne."],
  ["les Romains en Helvétie (Aventicum, aujourd’hui Avenches)", 1, "Aventicum était la capitale romaine de l’Helvétie, dans l’Antiquité."],
  ["les Jeux olympiques de la Grèce antique", 1, "Ils se déroulaient à Olympie, dans l’Antiquité."],
  ["les châteaux forts et les chevaliers", 2, "Châteaux forts et chevaliers sont typiques du Moyen Âge."],
  ["le Pacte fédéral de 1291", 2, "1291 se situe au Moyen Âge."],
  ["les moines qui recopient les livres à la main", 2, "Avant l’imprimerie, les livres étaient recopiés à la main, surtout au Moyen Âge."],
  ["l’arrivée de Christophe Colomb en Amérique (1492)", 3, "On fait souvent commencer les Temps modernes vers 1492."],
  ["la Réforme protestante (Luther, Calvin à Genève)", 3, "La Réforme a lieu au XVIe siècle, aux Temps modernes."],
  ["la bataille de Marignan (1515)", 3, "1515 se situe aux Temps modernes."],
  ["la Révolution française (1789)", 4, "On fait commencer l’Époque contemporaine en 1789."],
  ["la naissance de l’État fédéral suisse (1848)", 4, "1848 appartient à l’Époque contemporaine."],
  ["les premiers pas sur la Lune (1969)", 4, "1969 appartient à l’Époque contemporaine."],
  ["la machine à vapeur et les chemins de fer", 4, "La révolution industrielle se développe surtout au XIXe siècle."],
];

const ITEMS: [string, string, string[], string][] = [
  ["Quelle invention marque, par convention, la fin de la Préhistoire ?", "L’écriture", ["La roue", "Le feu", "L’imprimerie"], "La Préhistoire se termine quand apparaît l’écriture, vers 3300 av. J.-C. en Mésopotamie."],
  ["Remets les périodes dans l’ordre.", "Préhistoire, Antiquité, Moyen Âge, Temps modernes, Époque contemporaine", ["Antiquité, Préhistoire, Moyen Âge, Époque contemporaine, Temps modernes", "Préhistoire, Moyen Âge, Antiquité, Temps modernes, Époque contemporaine", "Moyen Âge, Antiquité, Préhistoire, Temps modernes, Époque contemporaine"], "Ce sont les cinq grandes périodes de l’histoire."],
  ["Quelle date marque souvent la fin de l’Antiquité (chute de l’Empire romain d’Occident) ?", "476", ["1291", "1492", "1789"], "En 476, le dernier empereur romain d’Occident est renversé."],
  ["Quel peuple celte vivait sur le Plateau suisse avant la conquête romaine ?", "Les Helvètes", ["Les Vikings", "Les Aztèques", "Les Égyptiens"], "En 58 av. J.-C., les Helvètes sont battus par Jules César à Bibracte."],
  ["Quelle invention de Gutenberg (vers 1450) change la diffusion des livres ?", "L’imprimerie à caractères mobiles", ["La machine à vapeur", "Le téléphone", "La boussole"], "Les livres peuvent être imprimés en grand nombre, beaucoup plus vite."],
  ["Quel événement est un moment de rupture avec l’introduction des machines dans les usines ?", "La révolution industrielle", ["La guerre de Troie", "Le Néolithique", "La fondation de Rome"], "Elle commence en Angleterre au XVIIIe siècle et transforme le travail et les villes."],
  ["En même temps que le Moyen Âge en Europe, que se passait-il en Amérique ?", "Les civilisations maya et aztèque se développaient", ["Il n’y avait encore personne", "Les dinosaures vivaient encore", "Les Romains y régnaient"], "Des sociétés différentes existent ailleurs à la même époque : c’est la simultanéité."],
];

/** Cycle 2 · les grandes périodes de l'histoire, leurs repères et leurs moments de rupture. */
export function gen(): Question {
  const t = R(0, 2);
  if (t <= 1) {
    const [el, i, why] = pick(ELEMENTS);
    const a = PERIODES[i];
    const faux = shuffle(PERIODES.filter((p) => p !== a)).slice(0, 3);
    return { q: `À quelle période appartiennent ${el} ?`, txt: 1, a, choices: shuffle([a, ...faux]), why };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
