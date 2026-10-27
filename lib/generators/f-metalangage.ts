import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const TERMES = ["synonymes", "antonymes", "homonymes", "paronymes", "un emprunt", "un néologisme", "un terme générique", "une famille de mots"];

const N1: readonly Item[] = [
  ["*Content* et *joyeux* sont des…", "synonymes", TERMES, "Des synonymes ont un sens proche."],
  ["*Monter* et *descendre* sont des…", "antonymes", TERMES, "Des antonymes ont un sens contraire."],
  ["*Le verre* et *le vert* sont des…", "homonymes", TERMES, "Des homonymes se prononcent de la même façon, mais ont des sens différents."],
  ["Dans *incroyable*, « in- » est…", "un préfixe", ["un suffixe", "un radical", "une terminaison"], "Le préfixe se place avant le radical."],
  ["Dans *lavable*, « -able » est…", "un suffixe", ["un préfixe", "un radical", "un déterminant"], "Le suffixe se place après le radical."],
  ["*Animal* par rapport à *chat, chien, cheval*, c’est…", "un terme générique", TERMES, "Le terme générique désigne toute la catégorie."],
  ["*Pluie, grêle, brouillard, averse* forment…", "un champ lexical", ["une famille de mots", "des synonymes", "des homonymes"], "Des mots qui se rapportent à un même thème (la météo) forment un champ lexical."],
  ["*Terre, terrain, atterrir, souterrain* forment…", "une famille de mots", ["un champ lexical", "des synonymes", "des antonymes"], "Ils ont le même radical : c’est une famille de mots."],
];
const N2: readonly Item[] = [
  ["*Week-end* et *pizza* sont…", "des emprunts", ["des néologismes", "des paronymes", "des homonymes"], "Ce sont des mots pris à d’autres langues (anglais, italien) : des emprunts."],
  ["*Courriel* (pour e-mail) est…", "un néologisme", ["un emprunt", "un archaïsme", "un homonyme"], "Mot créé récemment : un néologisme."],
  ["*Éruption* et *irruption* sont des…", "paronymes", ["homonymes", "synonymes", "antonymes"], "Des paronymes se ressemblent beaucoup, sans être identiques, et n’ont pas le même sens."],
  ["*Affliger* et *infliger* sont des…", "paronymes", ["homonymes", "synonymes", "antonymes"], "Mots presque semblables mais de sens différents : paronymes."],
  ["Le mot *fenêtre*, venu du latin *fenestra*, est…", "un mot hérité", ["un emprunt", "un néologisme", "un paronyme"], "Les mots transmis du latin populaire au français au fil des siècles sont des mots hérités."],
  ["L’étude de l’origine des mots s’appelle…", "l’étymologie", ["la morphologie", "la polysémie", "la syntaxe"], "L’étymologie étudie l’origine et l’histoire des mots."],
  ["L’étude de la forme des mots (radical, affixes) s’appelle…", "la morphologie", ["l’étymologie", "la polysémie", "la phonétique"], "La morphologie étudie la formation des mots."],
  ["Le fait qu’un mot ait plusieurs sens s’appelle…", "la polysémie", ["la synonymie", "l’homonymie", "l’étymologie"], "Un mot polysémique a plusieurs sens (la souris : l’animal, l’objet)."],
  ["Préfixes et suffixes sont des…", "affixes", ["radicaux", "déterminants", "paronymes"], "On appelle affixes les éléments ajoutés au radical : préfixes et suffixes."],
  ["Former *chanteur* à partir de *chanter*, c’est faire une…", "dérivation", ["composition", "conjugaison", "étymologie"], "Ajouter un affixe à un radical, c’est la dérivation."],
];
const DICO: readonly Item[] = [
  ["Pour trouver un mot de sens proche, tu ouvres…", "un dictionnaire des synonymes", ["un dictionnaire encyclopédique", "un atlas", "un dictionnaire bilingue"], "Le dictionnaire des synonymes propose des mots de sens proche."],
  ["Pour en savoir plus sur le Rhône ou sur Guillaume Tell, tu ouvres…", "un dictionnaire encyclopédique", ["un dictionnaire de langue", "un dictionnaire des synonymes", "un dictionnaire de rimes"], "Le dictionnaire encyclopédique renseigne sur les choses, les lieux, les personnes."],
  ["Pour connaître le sens, la nature et l’orthographe d’un mot, tu ouvres…", "un dictionnaire de langue", ["un dictionnaire encyclopédique", "un atlas", "un annuaire"], "Le dictionnaire de langue renseigne sur les mots eux-mêmes."],
  ["Pour traduire un mot en allemand, tu ouvres…", "un dictionnaire bilingue", ["un dictionnaire des synonymes", "un dictionnaire encyclopédique", "un dictionnaire de langue"], "Le dictionnaire bilingue donne la traduction des mots."],
  ["Pour connaître l’origine d’un mot, tu cherches…", "son étymologie", ["sa conjugaison", "son antonyme", "sa nature"], "L’étymologie indique l’origine du mot."],
];

/** Termes pour parler de la langue (synonyme, homonyme, paronyme, emprunt…) et types de dictionnaires. */
export function gen(): Question {
  return tirer([deBanque(N1), deBanque(N2), deBanque(DICO)]);
}
