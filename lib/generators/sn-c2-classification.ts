import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

// [animal, classe] — classes des vertébrés et quelques invertébrés bien connus.
const ANIMAUX: [string, string][] = [
  ["le renard", "mammifère"], ["la chauve-souris", "mammifère"], ["la baleine", "mammifère"], ["la marmotte", "mammifère"], ["le dauphin", "mammifère"], ["le hérisson", "mammifère"],
  ["le merle", "oiseau"], ["la mésange", "oiseau"], ["le manchot", "oiseau"], ["l’autruche", "oiseau"], ["le hibou", "oiseau"],
  ["la truite", "poisson"], ["le requin", "poisson"], ["la perche", "poisson"],
  ["le lézard", "reptile"], ["la vipère", "reptile"], ["la tortue", "reptile"], ["le crocodile", "reptile"],
  ["la grenouille", "amphibien"], ["le crapaud", "amphibien"], ["la salamandre", "amphibien"], ["le triton", "amphibien"],
  ["la fourmi", "insecte"], ["l’abeille", "insecte"], ["la coccinelle", "insecte"], ["le papillon", "insecte"],
  ["l’araignée", "araignée (arachnide)"],
];
const CLASSES = [...new Set(ANIMAUX.map((x) => x[1]))];
const RAISON: Record<string, string> = {
  mammifère: "il a des poils et la mère allaite ses petits",
  oiseau: "il a des plumes, un bec, et pond des œufs",
  poisson: "il vit dans l’eau, respire par des branchies et nage avec des nageoires",
  reptile: "sa peau est couverte d’écailles sèches",
  amphibien: "sa peau est nue et humide ; ses petits (larves) vivent dans l’eau",
  insecte: "il a 6 pattes et un corps en 3 parties",
  "araignée (arachnide)": "elle a 8 pattes",
};

const ITEMS: [string, string, string[], string][] = [
  ["Combien de pattes a un insecte ?", "6", ["4", "8", "10"], "Les insectes ont 6 pattes et un corps en 3 parties (tête, thorax, abdomen)."],
  ["Combien de pattes a une araignée ?", "8", ["6", "4", "10"], "L’araignée a 8 pattes : ce n’est pas un insecte, c’est un arachnide."],
  ["Quel animal a des plumes ?", "Un oiseau", ["Un mammifère", "Un poisson", "Un reptile"], "Seuls les oiseaux ont des plumes."],
  ["Quel groupe d’animaux allaite ses petits ?", "Les mammifères", ["Les oiseaux", "Les reptiles", "Les poissons"], "Les mammifères nourrissent leurs petits avec leur lait et ont des poils."],
  ["Les reptiles ont la peau couverte…", "d’écailles", ["de plumes", "de poils", "de peau nue et humide"], "Lézards, serpents, tortues : leur peau est couverte d’écailles."],
  ["Le têtard respire dans l’eau, la grenouille adulte respire aussi à l’air. C’est…", "un amphibien", ["un reptile", "un poisson", "un mammifère"], "Les amphibiens vivent d’abord dans l’eau, puis aussi sur terre."],
  ["Un champignon est-il une plante ?", "Non, les champignons forment un groupe à part", ["Oui, c’est une fleur", "Oui, c’est un arbre", "Non, c’est un animal"], "Les champignons n’ont pas de chlorophylle et ne fabriquent pas leur nourriture comme les plantes."],
  ["Un animal qui mange surtout des graines est…", "granivore", ["carnivore", "herbivore", "insectivore"], "Granivore : qui mange des graines (le moineau, par exemple)."],
  ["Un animal qui ne mange que de la viande est…", "carnivore", ["herbivore", "granivore", "omnivore"], "Carnivore : qui mange d’autres animaux (le loup, par exemple)."],
  ["Un animal qui ne mange que des plantes est…", "herbivore", ["carnivore", "insectivore", "piscivore"], "Herbivore : qui mange des plantes (la vache, le chevreuil)."],
  ["Un animal qui mange des plantes et des animaux est…", "omnivore", ["herbivore", "carnivore", "granivore"], "Omnivore : qui mange de tout (le sanglier, l’humain)."],
  ["Le loup a de longues canines pointues. Son régime est…", "carnivore", ["herbivore", "granivore", "omnivore"], "Les canines pointues servent à tenir et déchirer la viande."],
  ["La vache a de larges molaires plates. Son régime est…", "herbivore", ["carnivore", "insectivore", "piscivore"], "Les molaires plates broient l’herbe."],
  ["Le canard a des pattes palmées. Elles l’aident à…", "nager", ["grimper aux arbres", "creuser", "courir vite sur la roche"], "La palmure pousse l’eau comme une rame."],
  ["Le lièvre blanc des Alpes change de pelage en hiver. Pourquoi ?", "Pour se camoufler dans la neige", ["Pour avoir plus chaud seulement", "Pour attirer les prédateurs", "Par hasard"], "Le blanc le rend difficile à voir dans la neige : c’est le camouflage."],
  ["Le hérisson se met en boule et montre ses piquants. C’est une stratégie de…", "protection", ["chasse", "nage", "migration"], "Les piquants protègent le hérisson de ses prédateurs."],
  ["L’araignée tisse une toile. C’est une stratégie de chasse…", "au piège", ["à la poursuite", "en plongée", "au camouflage"], "La toile piège les insectes."],
  ["Quel critère montre qu’un être est vivant ?", "Il naît, se développe, se reproduit et meurt", ["Il bouge avec le vent", "Il est grand", "Il est coloré"], "Un nuage bouge mais n’est pas vivant : il faut naître, se développer, se reproduire et mourir."],
  ["À quoi sert une clé de détermination ?", "À trouver le nom d’un être vivant par des questions successives", ["À ouvrir une serre", "À mesurer un arbre", "À compter les animaux"], "On répond à des questions (a-t-il des ailes ? combien de pattes ?) jusqu’au nom de l’espèce."],
  ["Clé : « 6 pattes → insecte ; 8 pattes → arachnide ». Un animal a 8 pattes. C’est…", "un arachnide", ["un insecte", "un oiseau", "un mammifère"], "8 pattes : arachnide (araignée, tique, scorpion)."],
  ["Quelle partie de la plante est sous la terre et absorbe l’eau ?", "La racine", ["La feuille", "La fleur", "Le fruit"], "Les racines fixent la plante et puisent l’eau et les sels minéraux."],
  ["Quelle partie de la plante contient les graines ?", "Le fruit", ["La racine", "La tige", "L’écorce"], "Le fruit se forme à partir de la fleur et contient les graines."],
  ["La biodiversité, c’est…", "la variété des êtres vivants dans un milieu", ["le nombre d’habitants d’une ville", "la taille d’une forêt", "la couleur des fleurs"], "Plus il y a d’espèces différentes, plus la biodiversité est grande."],
];

/** Cycle 2 · le vivant : classer les animaux, régimes alimentaires, adaptations, critères du vivant, clé de détermination. */
export function gen(): Question {
  if (Math.random() < 0.35) {
    const [nom, cl] = pick(ANIMAUX);
    const faux = shuffle(CLASSES.filter((c) => c !== cl)).slice(0, 3);
    return { q: `Dans quel groupe classe-t-on ${nom} ?`, txt: 1, a: cl, choices: shuffle([cl, ...faux]), why: `${nom[0].toUpperCase() + nom.slice(1)} : ${cl}, car ${RAISON[cl]}.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
