import { R, fr, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quel gaz est le plus abondant dans l’air ?", "Le diazote (N<sub>2</sub>), environ 78 %", ["Le dioxygène (O<sub>2</sub>), environ 78 %", "Le dioxyde de carbone, environ 50 %", "L’argon, environ 21 %"], "Air sec : environ 78 % de diazote, 21 % de dioxygène, 1 % d’autres gaz (argon, CO<sub>2</sub>…)."],
  ["Quelle part de l’air le dioxygène (O<sub>2</sub>) représente-t-il environ ?", "21 %", ["78 %", "1 %", "50 %"], "Environ 21 % de dioxygène dans l’air."],
  ["Dans un solide, les particules sont…", "serrées et en place, elles vibrent seulement", ["libres et très éloignées", "serrées mais glissent les unes sur les autres", "immobiles et séparées par du vide immense"], "Solide : forme propre ; les particules restent à leur place."],
  ["Dans un liquide, les particules sont…", "proches mais peuvent glisser les unes sur les autres", ["fixes et rangées", "très éloignées les unes des autres", "absentes"], "Liquide : pas de forme propre, mais un volume propre."],
  ["Dans un gaz, les particules sont…", "éloignées et se déplacent dans tous les sens", ["serrées et fixes", "collées en chaîne", "rangées en cristal"], "Gaz : ni forme ni volume propres, il occupe tout l’espace offert."],
  ["Quand on chauffe un gaz, ses particules…", "s’agitent plus vite", ["s’arrêtent", "deviennent plus grosses", "disparaissent"], "La température mesure l’agitation des particules."],
  ["Pourquoi les rails de chemin de fer ont-ils de petits espaces entre eux ?", "Le métal se dilate quand il chauffe", ["Pour faire du bruit", "Pour économiser du métal", "Pour laisser passer l’eau"], "En été, le métal chauffé s’allonge : c’est la dilatation."],
  ["À quelle température l’eau pure bout-elle au niveau de la mer ?", "100 °C", ["0 °C", "37 °C", "273 °C"], "Chaque substance pure a ses températures de changement d’état : pour l’eau, 0 °C et 100 °C."],
  ["Comment s’appelle le passage de l’état gazeux à l’état liquide ?", "La liquéfaction (condensation)", ["La fusion", "La sublimation", "La solidification"], "La vapeur qui redevient liquide sur une vitre froide."],
  ["Lequel est une transformation chimique ?", "Le bois qui brûle", ["La glace qui fond", "Le sucre qui se dissout dans l’eau", "L’eau qui bout"], "Lors d’une combustion, de nouvelles substances se forment (CO<sub>2</sub>, eau…)."],
  ["Lequel est une transformation physique ?", "L’eau qui gèle", ["Le fer qui rouille", "Le sucre qui caramélise", "Le gaz qui brûle"], "Un changement d’état ne crée pas de nouvelle substance : c’est physique."],
  ["Le sucre chauffé fortement devient noir (pyrolyse). C’est une transformation…", "chimique", ["physique", "nucléaire", "réversible"], "Le sucre se décompose : de nouvelles substances (carbone, eau) apparaissent."],
  ["L’électrolyse de l’eau la décompose en…", "dihydrogène et dioxygène", ["sel et eau", "azote et carbone", "vapeur d’eau seulement"], "2 H<sub>2</sub>O → 2 H<sub>2</sub> + O<sub>2</sub>."],
  ["La distillation sépare un mélange grâce…", "à des températures d’ébullition différentes", ["à des couleurs différentes", "à un aimant", "à un filtre"], "On chauffe, le liquide qui bout le plus bas s’évapore le premier, puis on le condense."],
  ["La combustion du carbone : C + O<sub>2</sub> → ?", "CO<sub>2</sub>", ["H<sub>2</sub>O", "CH<sub>4</sub>", "O<sub>3</sub>"], "Le carbone brûle avec le dioxygène et forme du dioxyde de carbone."],
  ["La combustion du dihydrogène : 2 H<sub>2</sub> + O<sub>2</sub> → ?", "2 H<sub>2</sub>O", ["2 CO<sub>2</sub>", "H<sub>2</sub>O<sub>2</sub>", "2 OH"], "Le dihydrogène brûle et produit de l’eau."],
  ["La combustion du méthane : CH<sub>4</sub> + 2 O<sub>2</sub> → ?", "CO<sub>2</sub> + 2 H<sub>2</sub>O", ["C + 2 H<sub>2</sub>", "CO + H<sub>2</sub>O", "CH<sub>4</sub>O<sub>2</sub>"], "Équation équilibrée : 1 C, 4 H et 4 O de chaque côté."],
  ["Lors d’une réaction chimique, que se passe-t-il avec les atomes ?", "Ils se réarrangent : leur nombre est conservé", ["Ils disparaissent", "De nouveaux atomes sont créés", "Ils changent tous de nature"], "Rien ne se perd, rien ne se crée : les atomes se recombinent autrement (Lavoisier)."],
  ["Range du plus petit au plus grand.", "Électron, atome, molécule, cellule", ["Atome, électron, cellule, molécule", "Molécule, atome, électron, cellule", "Cellule, molécule, atome, électron"], "L’électron est bien plus petit que l’atome ; une molécule réunit plusieurs atomes ; une cellule contient d’innombrables molécules."],
  ["Range du plus petit au plus grand.", "Terre, système solaire, galaxie, Univers", ["Galaxie, Terre, Univers, système solaire", "Système solaire, Terre, galaxie, Univers", "Univers, galaxie, système solaire, Terre"], "La Terre est une planète du système solaire, qui fait partie de notre galaxie, la Voie lactée."],
  ["La masse d’un objet, c’est…", "la quantité de matière qu’il contient", ["l’espace qu’il occupe", "sa température", "sa couleur"], "Masse en kg ; volume (espace occupé) en m<sup>3</sup> ou en litres."],
];

/** Cycle 3 · matière : modèle particulaire, états, air, transformations physiques et chimiques, conservation des atomes. */
export function gen(): Question {
  if (Math.random() < 0.25) {
    // Conservation de la masse : combustion du carbone dans un récipient fermé.
    const mc = R(3, 12) * 3; // g de carbone (multiple de 3)
    const mo = (mc * 32) / 12; // dioxygène nécessaire
    const t = R(0, 1);
    if (t === 0) return { q: `Dans un récipient fermé, ${mc} g de carbone brûlent complètement avec ${fr(mo)} g de dioxygène. Masse de CO<sub>2</sub> formée, en g ?`, txt: 1, a: mc + mo, tol: 0.01, why: `Conservation de la masse : masse des réactifs = masse des produits. ${mc} + ${fr(mo)} = ${fr(mc + mo)} g.` };
    return { q: `Dans un récipient fermé, du carbone brûle avec ${fr(mo)} g de dioxygène et forme ${fr(mc + mo)} g de CO<sub>2</sub>. Quelle masse de carbone a brûlé, en g ?`, txt: 1, a: mc, tol: 0.01, why: `Masse des produits = masse des réactifs : ${fr(mc + mo)} − ${fr(mo)} = ${mc} g.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
