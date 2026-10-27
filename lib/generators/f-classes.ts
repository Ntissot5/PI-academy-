import { etiquette, tirer } from "./f-outils";
import type { Question } from "./types";

const R: Record<string, string> = {
  déterminant: "Il se place devant le nom et indique son genre et son nombre.",
  "nom commun": "Il désigne une personne, un animal, une chose ou une idée ; il est précédé d’un déterminant.",
  "nom propre": "Il désigne une personne, un lieu ou un animal précis ; il prend une majuscule.",
  verbe: "Il change avec le temps (hier, demain) et se conjugue.",
  adjectif: "Il précise le nom et s’accorde avec lui.",
  "pronom personnel": "Il remplace un nom ou désigne une personne de la conversation (je, tu, il, nous…).",
  pronom: "Il remplace un nom ou un groupe nominal.",
  adverbe: "Il est invariable et modifie un verbe, un adjectif ou un autre adverbe.",
  préposition: "Mot invariable qui introduit un complément (à, de, dans, pour, avec…).",
  "conjonction de coordination": "Elle relie deux éléments de même fonction : mais, ou, et, donc, or, ni, car.",
  "conjonction de subordination": "Elle introduit une subordonnée : que, quand, si, parce que, comme, lorsque…",
  interjection: "Mot invariable qui exprime une émotion ou un bruit : aïe, oh, bravo, chut…",
  "pronom relatif": "Il introduit une subordonnée relative et reprend un nom (l’antécédent).",
};

/* Classes de base (5e-6e). */
const C1 = ["déterminant", "nom commun", "nom propre", "verbe", "adjectif", "pronom personnel"];
const I1: readonly (readonly [string, string, string?])[] = [
  ["*Le* chat dort.", "déterminant"], ["J’ai perdu *mon* écharpe.", "déterminant"], ["*Ces* fleurs sentent bon.", "déterminant"],
  ["*Trois* enfants jouent.", "déterminant", "Déterminant numéral."],
  ["Le *chat* dort.", "nom commun"], ["La *montagne* est haute.", "nom commun"], ["Il a beaucoup de *courage*.", "nom commun"],
  ["*Lugano* est au bord d’un lac.", "nom propre"], ["Le *Jura* est une chaîne de montagnes.", "nom propre"], ["*Inès* chante.", "nom propre"],
  ["Le chat *dort*.", "verbe"], ["Nous *mangeons* à midi.", "verbe"], ["Ils *étaient* contents.", "verbe"],
  ["Un *petit* chat dort.", "adjectif"], ["La montagne est *haute*.", "adjectif"], ["Il porte un pull *vert*.", "adjectif"],
  ["*Elle* chante.", "pronom personnel"], ["*Nous* partons demain.", "pronom personnel"], ["Je *te* prête mon livre.", "pronom personnel"],
  ["*Ils* jouent dehors.", "pronom personnel"],
];

/* Classes difficiles (9e) : mots qui changent de classe selon l'emploi. */
const C3 = ["déterminant", "pronom", "adverbe", "préposition", "conjonction de coordination", "conjonction de subordination", "interjection", "pronom relatif", "adjectif", "nom commun"];
const I3: readonly (readonly [string, string, string?])[] = [
  ["Je *le* vois tous les jours.", "pronom", "Devant un verbe, « le » est un pronom (il remplace un nom)."],
  ["*Le* bus est en retard.", "déterminant", "Devant un nom, « le » est un déterminant."],
  ["Je sais *que* tu viendras.", "conjonction de subordination", "« que » introduit une subordonnée complément du verbe (sans antécédent)."],
  ["Le livre *que* je lis est passionnant.", "pronom relatif", "« que » reprend « le livre » (antécédent) : pronom relatif."],
  ["*Aïe* ! Je me suis cogné.", "interjection"], ["*Bravo*, tu as réussi !", "interjection"],
  ["Je reste, *car* il pleut.", "conjonction de coordination"], ["Il est fatigué, *donc* il se couche.", "conjonction de coordination"],
  ["*Quand* il neige, nous skions.", "conjonction de subordination"], ["Je viendrai *si* tu m’invites.", "conjonction de subordination"],
  ["Il est parti *parce qu’*il était en retard.", "conjonction de subordination", "Locution conjonctive de subordination."],
  ["Il travaille *bien*.", "adverbe"], ["C’est un *bien* précieux.", "nom commun", "Précédé d’un déterminant, « bien » est ici un nom."],
  ["Il revient *de* Genève.", "préposition"], ["Elle mange *des* pommes.", "déterminant"],
  ["Il se promène *avant* le repas.", "préposition"], ["Il est arrivé *avant*.", "adverbe", "Employé seul, sans complément, « avant » est un adverbe."],
  ["Il fait *très* froid.", "adverbe"], ["Elle porte une robe *bleue*.", "adjectif"],
  ["La maison *où* j’habite est ancienne.", "pronom relatif"], ["*Chacun* range ses affaires.", "pronom", "Pronom indéfini."],
];

/** Classes grammaticales (5e-6e) : déterminant, nom commun, nom propre, verbe, adjectif, pronom personnel. */
export function gen1(): Question {
  return tirer([etiquette("Quelle est la classe (nature) du mot en gras ?", I1, C1, R)]);
}

/** Classes grammaticales (9e) : distinguer les classes selon l'emploi (le, que, bien, avant…). */
export function gen3(): Question {
  return tirer([etiquette("Quelle est la classe (nature) du mot en gras ?", I3, C3, R)]);
}
