import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [question, bonne réponse, mauvaises réponses, explication] — cycle 1 : phrases très courtes.
const ITEMS: [string, string, string[], string][] = [
  ["Une cuillère en métal. En quoi est-elle faite ?", "En métal", ["En bois", "En papier"], "Elle est dure, froide et brillante : c’est du métal."],
  ["Un crayon de couleur. En quoi est-il fait surtout ?", "En bois", ["En verre", "En tissu"], "Le crayon est en bois, avec une mine au milieu."],
  ["Un t-shirt. En quoi est-il fait ?", "En tissu", ["En pierre", "En métal"], "Un vêtement est fait de tissu (coton, laine…)."],
  ["Une bouteille transparente qui casse si elle tombe. En quoi est-elle ?", "En verre", ["En tissu", "En bois"], "Le verre est transparent et il casse facilement."],
  ["Un cahier. En quoi sont faites ses pages ?", "En papier", ["En métal", "En pierre"], "Les pages du cahier sont en papier."],
  ["Un caillou. En quoi est-il fait ?", "En pierre", ["En plastique", "En papier"], "Le caillou est un morceau de pierre (de roche)."],
  ["Je pose un bouchon de liège dans l’eau. Que fait-il ?", "Il flotte", ["Il coule", "Il fond"], "Le liège est très léger : il flotte."],
  ["Je pose une bille en métal dans l’eau. Que fait-elle ?", "Elle coule", ["Elle flotte", "Elle fond"], "La bille en métal coule au fond."],
  ["Je pose une feuille d’arbre sur l’eau. Que fait-elle ?", "Elle flotte", ["Elle coule", "Elle disparaît"], "La feuille est légère et plate : elle flotte."],
  ["Je mets un glaçon au soleil. Que se passe-t-il ?", "Il fond et devient de l’eau", ["Il devient un caillou", "Il grandit"], "Avec la chaleur, la glace fond : elle redevient de l’eau liquide."],
  ["Je mets de l’eau au congélateur. Que devient-elle ?", "De la glace", ["Du sable", "De la vapeur"], "Dans le grand froid, l’eau gèle : elle devient de la glace."],
  ["La neige, c’est…", "de l’eau gelée", ["du sucre", "du coton"], "La neige est faite de petits cristaux d’eau gelée."],
  ["La grêle, ce sont…", "des boules de glace qui tombent du ciel", ["des gouttes de lait", "des petits cailloux"], "La grêle tombe pendant certains orages : ce sont des grains de glace."],
  ["D’où tombe la pluie ?", "Des nuages", ["Du soleil", "Des arbres"], "Les nuages sont faits de toutes petites gouttes d’eau. Quand elles grossissent, il pleut."],
  ["Je mélange du sucre dans de l’eau chaude. Que devient le sucre ?", "Il fond dans l’eau, on ne le voit plus", ["Il flotte", "Il devient du sable"], "Le sucre se dissout : il est encore là (l’eau est sucrée), mais on ne le voit plus."],
  ["Je mélange du sable dans de l’eau. Que fait le sable ?", "Il tombe au fond", ["Il disparaît", "Il flotte en haut"], "Le sable ne se dissout pas : il tombe au fond."],
  ["Quel objet est mou ?", "Une éponge", ["Une pierre", "Une cuillère en métal"], "On peut écraser l’éponge avec la main : elle est molle."],
  ["Quel objet laisse passer l’eau ?", "Une passoire", ["Un seau", "Une bouteille fermée"], "La passoire a des trous : l’eau passe à travers."],
  ["Où jette-t-on une bouteille en verre vide ?", "Au conteneur à verre", ["Dans la forêt", "Dans le lac"], "Le verre se recycle : on le refond pour faire de nouvelles bouteilles."],
  ["Où met-on un vieux journal ?", "Au ramassage du papier", ["Dans le compost", "Dans la rivière"], "Le papier se recycle : on en refait du papier."],
  ["Une canette de boisson est en…", "métal (aluminium)", ["bois", "tissu"], "La canette est en aluminium, un métal qui se recycle très bien."],
  ["Où met-on une épluchure de pomme ?", "Au compost", ["Au conteneur à verre", "Au papier"], "Les épluchures pourrissent et deviennent de la terre : c’est le compost."],
];

/** Cycle 1 · la matière : de quoi sont faits les objets, flotte/coule, eau et glace, recyclage. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
