import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Comment la lumière se propage-t-elle ?", "En ligne droite", ["En zigzag", "En cercle", "Seulement vers le bas"], "La lumière va tout droit : c’est pour cela qu’un objet opaque fait une ombre."],
  ["Laquelle est une source de lumière naturelle ?", "Le Soleil", ["Une lampe de poche", "Un écran", "Un lampadaire"], "Le Soleil produit sa propre lumière ; les lampes sont des sources artificielles."],
  ["La Lune produit-elle sa propre lumière ?", "Non, elle renvoie la lumière du Soleil", ["Oui, comme le Soleil", "Oui, seulement la nuit", "Non, elle est éclairée par la Terre seulement"], "La Lune est éclairée par le Soleil et renvoie cette lumière."],
  ["Le Soleil est bas sur l’horizon (le matin). Les ombres sont…", "longues", ["courtes", "invisibles", "toujours de la même taille"], "Plus la source de lumière est basse, plus l’ombre est longue."],
  ["Vers midi, le Soleil est au plus haut. Les ombres sont…", "les plus courtes de la journée", ["les plus longues", "absentes la nuit", "toujours pareilles"], "Quand la lumière vient d’en haut, l’ombre est courte."],
  ["Une lampe éclaire un objet par la gauche. De quel côté est l’ombre portée ?", "À droite de l’objet", ["À gauche de l’objet", "Au-dessus de la lampe", "Il n’y a pas d’ombre"], "L’ombre portée est toujours du côté opposé à la source de lumière."],
  ["La partie d’un objet qui n’est pas éclairée s’appelle…", "l’ombre propre", ["l’ombre portée", "le reflet", "la lumière"], "Ombre propre : sur l’objet. Ombre portée : projetée sur le sol ou un mur."],
  ["De quel côté le Soleil se lève-t-il ?", "À l’est", ["À l’ouest", "Au nord", "Au sud"], "Le Soleil se lève à l’est, environ."],
  ["De quel côté le Soleil se couche-t-il ?", "À l’ouest", ["À l’est", "Au nord", "Au sud"], "Le Soleil se couche à l’ouest, environ."],
  ["En Suisse, à midi, le Soleil se trouve vers le…", "sud", ["nord", "est", "ouest"], "Dans l’hémisphère nord, le Soleil culmine au sud."],
  ["Pourquoi y a-t-il le jour et la nuit ?", "La Terre tourne sur elle-même", ["Le Soleil s’éteint la nuit", "La Lune cache le Soleil", "La Terre s’éloigne du Soleil"], "En tournant, chaque côté de la Terre passe au soleil (jour), puis à l’ombre (nuit)."],
  ["En combien de temps la Terre fait-elle un tour sur elle-même ?", "Environ 24 heures (1 jour)", ["1 heure", "1 mois", "1 année"], "Une rotation complète dure environ 24 heures."],
  ["En combien de temps la Terre fait-elle le tour du Soleil ?", "Environ 365 jours (1 année)", ["1 jour", "1 mois", "100 ans"], "Une révolution autour du Soleil dure environ 365 jours et 6 heures."],
  ["En Suisse, en hiver, les journées sont…", "plus courtes qu’en été", ["plus longues qu’en été", "toujours de 12 heures", "sans soleil du tout"], "En hiver, le Soleil se lève tard et se couche tôt."],
  ["Les saisons sont dues…", "à l’inclinaison de l’axe de la Terre", ["à la distance de la Lune", "aux nuages", "à la vitesse du vent"], "L’axe de la Terre est penché : au cours de l’année, notre hémisphère reçoit plus ou moins de lumière."],
  ["Le Soleil est…", "une étoile", ["une planète", "un satellite", "une comète"], "Le Soleil est une étoile : il produit lumière et chaleur."],
  ["La Terre est…", "une planète", ["une étoile", "un satellite", "une galaxie"], "La Terre est une planète qui tourne autour du Soleil."],
  ["La Lune est…", "le satellite naturel de la Terre", ["une planète", "une étoile", "un morceau du Soleil"], "La Lune tourne autour de la Terre : c’est son satellite."],
  ["Quelle planète est la plus proche du Soleil ?", "Mercure", ["Vénus", "La Terre", "Mars"], "Ordre : Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune."],
  ["Quelle est la plus grande planète du système solaire ?", "Jupiter", ["La Terre", "Mars", "Mercure"], "Jupiter est une planète géante gazeuse."],
  ["Combien de planètes compte le système solaire ?", "8", ["7", "9", "12"], "Mercure, Vénus, Terre, Mars, Jupiter, Saturne, Uranus, Neptune."],
  ["Quelle planète est célèbre pour ses grands anneaux bien visibles ?", "Saturne", ["Mars", "Vénus", "Mercure"], "Les anneaux de Saturne sont faits de glace et de poussières."],
  ["Quelle planète est surnommée la « planète rouge » ?", "Mars", ["Jupiter", "Vénus", "Neptune"], "Le sol de Mars contient beaucoup d’oxyde de fer : il paraît rouge."],
  ["Quelle est la troisième planète en partant du Soleil ?", "La Terre", ["Mars", "Vénus", "Jupiter"], "Mercure, Vénus, puis la Terre."],
  ["Lequel est le plus grand ?", "Le Soleil", ["La Terre", "La Lune", "Jupiter"], "Le Soleil est bien plus grand que toutes les planètes réunies."],
  ["De très fortes pluies pendant plusieurs jours peuvent provoquer…", "une inondation", ["une sécheresse", "une éclipse", "un séisme"], "Les rivières débordent quand il tombe plus d’eau que le sol et les cours d’eau ne peuvent en absorber."],
  ["Plusieurs semaines sans pluie et avec de fortes chaleurs : c’est…", "une sécheresse", ["une avalanche", "une inondation", "une tempête de neige"], "Les sols se dessèchent, les rivières baissent : c’est une sécheresse."],
];

/** Cycle 2 · lumière et ombres, course du Soleil, Terre et système solaire, catastrophes naturelles. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
