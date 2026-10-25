import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Avec quoi est-ce que je vois ?", "Avec mes yeux", ["Avec mes oreilles", "Avec ma langue"], "La vue : ce sont les yeux."],
  ["Avec quoi est-ce que j’entends ?", "Avec mes oreilles", ["Avec mon nez", "Avec mes yeux"], "L’ouïe : ce sont les oreilles."],
  ["Avec quoi est-ce que je sens une odeur ?", "Avec mon nez", ["Avec mes mains", "Avec mes oreilles"], "L’odorat : c’est le nez."],
  ["Avec quoi est-ce que je goûte ?", "Avec ma langue", ["Avec mes yeux", "Avec mes pieds"], "Le goût : c’est la langue, dans la bouche."],
  ["Avec quoi est-ce que je sens si c’est doux ou rugueux ?", "Avec ma peau", ["Avec mes oreilles", "Avec mon nez"], "Le toucher : c’est la peau, surtout le bout des doigts."],
  ["Combien avons-nous de sens ?", "5", ["3", "10"], "La vue, l’ouïe, l’odorat, le goût et le toucher : 5 sens."],
  ["Le citron a un goût…", "acide", ["sucré", "salé"], "Le citron pique la langue : il est acide."],
  ["Le miel a un goût…", "sucré", ["salé", "amer"], "Le miel est très sucré."],
  ["Les chips ont un goût…", "salé", ["sucré", "acide"], "Il y a du sel sur les chips."],
  ["Quel sens me dit que la soupe est trop chaude ?", "Le toucher (la bouche, la peau)", ["La vue", "L’ouïe"], "La peau et la bouche sentent le chaud et le froid."],
  ["Quel sens me dit que l’herbe est mouillée ?", "Le toucher", ["L’ouïe", "Le goût"], "En touchant l’herbe, je sens qu’elle est mouillée."],
  ["Quel sens me dit que la pomme est rouge ?", "La vue", ["L’odorat", "Le toucher"], "La couleur, on la voit avec les yeux."],
  ["Quel sens me dit qu’un oiseau chante dans la forêt ?", "L’ouïe", ["La vue", "Le goût"], "Le chant de l’oiseau, je l’entends avec les oreilles."],
  ["Quel sens me dit que le pain sort du four ?", "L’odorat", ["L’ouïe", "Le toucher"], "La bonne odeur du pain chaud arrive à mon nez."],
  ["Qu’est-ce qui est le plus doux à toucher ?", "Le pelage d’un lapin", ["L’écorce d’un arbre", "Un caillou pointu"], "Le pelage est doux ; l’écorce est rugueuse."],
  ["Qu’est-ce qui est rugueux à toucher ?", "L’écorce d’un arbre", ["Une plume", "Un drap de soie"], "L’écorce a des bosses et des creux : elle est rugueuse."],
  ["Qu’est-ce qui fait le plus de bruit ?", "Un camion", ["Une fourmi", "Une feuille qui tombe"], "Le camion est très bruyant."],
  ["Les yeux fermés, comment savoir si c’est une orange ?", "En la sentant et en la touchant", ["En l’écoutant", "C’est impossible"], "L’odeur et la peau granuleuse de l’orange m’aident à la reconnaître."],
  ["Dans la forêt, quel sens utilises-tu pour sentir l’odeur des champignons ?", "L’odorat", ["La vue", "Le goût"], "L’odorat, c’est le nez."],
  ["Il faut protéger ses yeux…", "du soleil trop fort", ["des livres", "de la lumière d’une bougie"], "Ne jamais regarder le soleil en face : il abîme les yeux."],
];

/** Cycle 1 · les 5 sens et ce qu'ils perçoivent. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
