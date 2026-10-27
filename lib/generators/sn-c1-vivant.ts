import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const VIVANT = ["un chat", "un arbre", "une fleur", "un escargot", "une fourmi", "un champignon", "un poisson", "une grenouille", "un oiseau", "de l’herbe"];
const NON_VIVANT = ["un caillou", "une voiture", "une chaise", "un ballon", "une montre", "un robot", "un nuage", "une bouteille"];
const ANIMAUX = ["un escargot", "une abeille", "un renard", "une truite", "un merle", "une coccinelle", "un ver de terre"];
const PLANTES = ["un sapin", "une marguerite", "un pissenlit", "un pommier", "une fougère", "un brin d’herbe"];

const ITEMS: [string, string, string[], string][] = [
  ["Que fait un être vivant ?", "Il naît, grandit et meurt", ["Il ne change jamais", "Il roule"], "Un être vivant naît, grandit, se reproduit et meurt."],
  ["De quoi une plante a-t-elle besoin pour pousser ?", "D’eau et de lumière", ["De bonbons", "De nuit tout le temps"], "La plante a besoin d’eau, de lumière et de terre."],
  ["Une graine dans de la terre mouillée. Que se passe-t-il ?", "Elle germe : une petite plante sort", ["Elle devient un caillou", "Elle devient un oiseau"], "La graine germe : une racine et une petite tige apparaissent."],
  ["Quel est l’ordre dans la vie d’un haricot ?", "Graine → petite plante → plante avec fleurs → haricots", ["Plante → graine → fleur → terre", "Fleur → caillou → graine → plante"], "La graine germe, la plante grandit, fleurit et donne de nouvelles graines."],
  ["Le bébé de la poule sort…", "d’un œuf", ["d’une graine", "d’une fleur"], "Le poussin sort d’un œuf."],
  ["La chenille devient…", "un papillon", ["une abeille", "un escargot"], "La chenille fait un cocon (chrysalide), puis devient papillon."],
  ["Le têtard devient…", "une grenouille", ["un poisson", "un serpent"], "Le têtard vit dans l’eau, ses pattes poussent, il devient grenouille."],
  ["Le bébé de la vache s’appelle…", "le veau", ["le poulain", "l’agneau"], "La vache a un veau."],
  ["Le bébé du mouton s’appelle…", "l’agneau", ["le veau", "le chaton"], "La brebis a un agneau."],
  ["Le bébé du cheval s’appelle…", "le poulain", ["le chiot", "le veau"], "La jument a un poulain."],
  ["Que mange un lapin ?", "De l’herbe et des carottes", ["De la viande", "Des cailloux"], "Le lapin mange des plantes."],
  ["Où une plante prend-elle l’eau ?", "Par ses racines", ["Par ses fleurs", "Par ses épines"], "Les racines boivent l’eau dans la terre."],
  ["Qu’est-ce qu’un animal peut faire et pas une plante ?", "Se déplacer seul", ["Grandir", "Avoir besoin d’eau"], "Les deux grandissent et boivent, mais l’animal se déplace."],
  ["De quoi un chat a-t-il besoin chaque jour ?", "De manger, boire et se reposer", ["De lire", "D’une voiture"], "Comme nous, l’animal a besoin de manger, boire, dormir et se protéger."],
];

/** Cycle 1 · le vivant : vivant ou non, animal ou plante, besoins, cycles de vie. */
export function gen(): Question {
  const t = Math.random();
  if (t < 0.3) {
    const v = pick(VIVANT);
    const faux = shuffle(NON_VIVANT).slice(0, 2);
    return { q: "Lequel est vivant ?", txt: 1, a: v, choices: shuffle([v, ...faux]), why: `${v[0].toUpperCase() + v.slice(1)} : c’est un être vivant. Il naît, grandit et meurt.` };
  }
  if (t < 0.5) {
    const animal = Math.random() < 0.5;
    const a = pick(animal ? ANIMAUX : PLANTES);
    const faux = shuffle(animal ? PLANTES : ANIMAUX).slice(0, 2);
    return {
      q: animal ? "Lequel est un animal ?" : "Lequel est une plante ?", txt: 1, a, choices: shuffle([a, ...faux]),
      why: animal ? `${a[0].toUpperCase() + a.slice(1)} : c’est un animal. Il se déplace et mange pour vivre.` : `${a[0].toUpperCase() + a.slice(1)} : c’est une plante. Elle a des racines et ne se déplace pas.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
