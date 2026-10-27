import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const NATUREL = ["une rivière", "une forêt", "une montagne", "un lac", "un rocher", "une colline"];
const CONSTRUIT = ["un pont", "une route", "une maison", "un parking", "une place de jeux", "un immeuble", "une gare"];

const ITEMS: [string, string, string[], string][] = [
  ["À quoi sert le préau de l’école ?", "À jouer pendant la récréation", ["À dormir", "À faire la cuisine"], "Le préau est un espace de jeu et de récréation."],
  ["À quoi sert le vestiaire ?", "À ranger ses habits et ses chaussures", ["À manger", "À lire des livres"], "Au vestiaire, on accroche sa veste et on change de chaussures."],
  ["Où vas-tu pour lire tranquillement en classe ?", "Au coin lecture (bibliothèque)", ["Au vestiaire", "Dans la salle de gym"], "Le coin lecture est fait pour lire au calme."],
  ["Qui décide de l’aménagement de la place de jeux du village ?", "La commune", ["Les oiseaux", "Les touristes"], "C’est la commune qui construit et entretient la place de jeux."],
  ["Pourquoi y a-t-il une barrière autour de la place de jeux ?", "Pour la sécurité des enfants (loin de la route)", ["Pour faire joli seulement", "Pour enfermer les parents"], "La barrière protège les enfants des voitures."],
  ["Pourquoi le passage piéton est-il devant l’école ?", "Pour que les enfants traversent en sécurité", ["Pour décorer la route", "Pour les vélos seulement"], "Les voitures doivent s’arrêter au passage piéton."],
  ["Un espace pour nager en été dans ton village, c’est…", "la piscine", ["la patinoire", "la bibliothèque"], "La piscine est un espace de loisirs pour nager."],
  ["Un espace pour patiner en hiver, c’est…", "la patinoire", ["la piscine", "le préau"], "À la patinoire, la glace permet de patiner."],
  ["Qu’est-ce qu’on voit dans une grande ville et pas souvent dans un petit village ?", "Beaucoup de grands immeubles", ["Des vaches au pré", "Des champs partout"], "En ville, beaucoup de gens habitent dans des immeubles."],
  ["J’entends des vagues et je sens l’odeur de l’eau. Je suis peut-être…", "au bord du lac", ["dans la forêt", "à la bibliothèque"], "Les vagues et l’odeur de l’eau me disent que je suis près d’un lac."],
  ["J’entends des oiseaux et le vent dans les feuilles. Je suis peut-être…", "dans la forêt", ["au supermarché", "dans un tunnel"], "Les bruits des oiseaux et des feuilles : la forêt."],
  ["J’entends des klaxons et des moteurs. Je suis peut-être…", "au bord d’une route", ["au sommet d’une montagne calme", "dans ma chambre la nuit"], "Les voitures font du bruit : je suis près d’une route."],
  ["Je sens l’odeur du pain chaud. Je suis peut-être…", "près d’une boulangerie", ["à la piscine", "à la gare"], "La bonne odeur de pain vient de la boulangerie."],
  ["En montagne, le chemin qui monte beaucoup est…", "en pente raide", ["tout plat", "sous l’eau"], "Une pente raide monte fort ; à la montée, on va plus lentement."],
  ["Pour aller à l’école, Mia met 5 minutes et Tim 20 minutes. Qui habite le plus loin, s’ils marchent pareil ?", "Tim", ["Mia", "Ils habitent au même endroit"], "Plus le trajet dure longtemps, plus c’est loin (à la même vitesse)."],
];

/** Cycle 1 · l'espace vécu : naturel ou construit, fonctions et aménagements des espaces, ce que perçoivent les sens. */
export function gen(): Question {
  if (Math.random() < 0.35) {
    const nat = Math.random() < 0.5;
    const a = pick(nat ? NATUREL : CONSTRUIT);
    const faux = shuffle(nat ? CONSTRUIT : NATUREL).slice(0, 2);
    return {
      q: nat ? "Lequel est un élément naturel (pas construit par l’Homme) ?" : "Lequel a été construit par l’Homme ?", txt: 1, a, choices: shuffle([a, ...faux]),
      why: nat ? `${a[0].toUpperCase() + a.slice(1)} : c’est la nature qui l’a fait.` : `${a[0].toUpperCase() + a.slice(1)} : ce sont des personnes qui l’ont construit.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
