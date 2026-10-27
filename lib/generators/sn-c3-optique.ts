import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// Synthèse additive des lumières (modèle trichromique : rouge, vert, bleu).
const MIX: [string, string, string][] = [
  ["rouge", "verte", "jaune"],
  ["rouge", "bleue", "magenta"],
  ["verte", "bleue", "cyan"],
];
const COUL = ["jaune", "magenta", "cyan", "blanche", "noire"];

// Objet coloré éclairé : [couleur de l'objet, lumières qu'il diffuse]
const OBJ: [string, string[]][] = [
  ["rouge", ["rouge"]],
  ["vert", ["verte"]],
  ["bleu", ["bleue"]],
  ["jaune", ["rouge", "verte"]],
  ["blanc", ["rouge", "verte", "bleue"]],
];
const NOM: Record<string, string> = { rouge: "rouge", verte: "vert", bleue: "bleu" };

const ITEMS: [string, string, string[], string][] = [
  ["Quelles sont les trois couleurs primaires de la lumière (écrans, projecteurs) ?", "Rouge, vert, bleu", ["Rouge, jaune, bleu", "Cyan, magenta, jaune", "Blanc, noir, gris"], "Avec du rouge, du vert et du bleu, un écran fabrique toutes les couleurs (modèle trichromique)."],
  ["Lumière rouge + verte + bleue superposées donnent…", "du blanc", ["du noir", "du brun", "du gris foncé"], "La synthèse additive des trois primaires donne de la lumière blanche."],
  ["Un arc-en-ciel montre que la lumière blanche du Soleil…", "est un mélange de lumières colorées", ["est une seule couleur pure", "est noire", "vient de la pluie"], "Les gouttes de pluie décomposent la lumière blanche en ses couleurs."],
  ["Dans l’arc-en-ciel, quelle couleur est entre le jaune et le bleu ?", "Le vert", ["Le rouge", "Le violet", "L’orange"], "Ordre : rouge, orange, jaune, vert, bleu, indigo, violet."],
  ["Pourquoi un objet noir chauffe-t-il plus au soleil ?", "Il absorbe presque toute la lumière", ["Il renvoie toute la lumière", "Il produit de la lumière", "Il est toujours plus lourd"], "La lumière absorbée se transforme en chaleur."],
  ["Un objet nous paraît rouge en lumière blanche parce qu’il…", "diffuse surtout la lumière rouge et absorbe les autres", ["absorbe le rouge", "produit de la lumière rouge", "est chaud"], "Notre œil reçoit la lumière renvoyée par l’objet."],
  ["En peinture (mélange de pigments), jaune + cyan donnent…", "du vert", ["du rouge", "du blanc", "du magenta"], "Les pigments absorbent des couleurs (synthèse soustractive) : le jaune absorbe le bleu, le cyan absorbe le rouge ; il reste le vert."],
  ["En peinture, mélanger beaucoup de couleurs donne une couleur…", "de plus en plus sombre", ["de plus en plus claire, jusqu’au blanc", "toujours jaune", "transparente"], "Chaque pigment absorbe une partie de la lumière : le mélange en absorbe de plus en plus."],
  ["Quelles cellules de l’œil permettent de voir les couleurs ?", "Les cônes de la rétine (sensibles au rouge, vert, bleu)", ["Les cils", "Les larmes", "L’iris seulement"], "Trois types de cônes : c’est la base du modèle trichromique."],
];

/** Cycle 3 · optique : couleur perçue, modèle trichromique, arc-en-ciel, mélanges de lumières et de peintures. */
export function gen(): Question {
  const t = Math.random();
  if (t < 0.3) {
    const [c1, c2, r] = pick(MIX);
    const faux = shuffle(COUL.filter((x) => x !== r)).slice(0, 3);
    return { q: `On superpose sur un écran blanc une lumière ${c1} et une lumière ${c2}. Quelle couleur voit-on ?`, txt: 1, a: r, choices: shuffle([r, ...faux]), why: `Synthèse additive : ${c1} + ${c2} = ${r}.` };
  }
  if (t < 0.6) {
    const [obj, diff] = pick(OBJ);
    const lum = pick(["rouge", "verte", "bleue"]);
    const vu = diff.includes(lum) ? NOM[lum] : "noir";
    const choices = shuffle([...new Set([vu, "noir", "rouge", "vert", "bleu", "blanc"])].filter((x, i, arr) => arr.indexOf(x) === i)).slice(0, 4);
    if (!choices.includes(vu)) choices[0] = vu;
    return {
      q: `Un objet ${obj} (en lumière blanche) est éclairé seulement par une lumière ${lum}. De quelle couleur paraît-il ?`, txt: 1, a: vu, choices: shuffle(choices),
      why: diff.includes(lum) ? `L’objet ${obj} renvoie la lumière ${lum} : il paraît ${vu}.` : `L’objet ${obj} absorbe la lumière ${lum} et ne renvoie rien : il paraît noir.`,
    };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
