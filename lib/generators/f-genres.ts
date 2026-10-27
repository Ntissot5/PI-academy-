import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const REG = ["le texte qui raconte", "le texte qui relate", "le texte qui argumente", "le texte qui transmet des savoirs", "le texte qui règle des comportements", "le texte qui joue avec la langue"];

const EXTRAITS: readonly Item[] = [
  ["*Il était une fois, dans un château au bord du lac, une princesse qui ne savait pas rire.* De quel regroupement de genres s’agit-il ?", "le texte qui raconte", REG, "Un conte merveilleux : un récit de fiction."],
  ["*Le 3 mars, un camion s’est renversé sur l’autoroute près d’Yverdon. Personne n’a été blessé.* De quel regroupement de genres s’agit-il ?", "le texte qui relate", REG, "Un fait divers relate un événement réel."],
  ["*À mon avis, la récréation devrait durer plus longtemps, car les élèves ont besoin de bouger.* De quel regroupement de genres s’agit-il ?", "le texte qui argumente", REG, "Une opinion justifiée par un argument : texte qui argumente."],
  ["*Le lynx est un félin qui vit dans les forêts du Jura et des Alpes. Il chasse surtout des chevreuils.* De quel regroupement de genres s’agit-il ?", "le texte qui transmet des savoirs", REG, "Un texte documentaire transmet des connaissances."],
  ["*Préchauffe le four à 180 degrés. Beurre le moule. Verse la pâte.* De quel regroupement de genres s’agit-il ?", "le texte qui règle des comportements", REG, "Une recette dit quoi faire, dans l’ordre (verbes à l’impératif)."],
  ["*Le soleil se couche, / La nuit nous touche, / Les étoiles brillent / Et la lune pétille.* De quel regroupement de genres s’agit-il ?", "le texte qui joue avec la langue", REG, "Vers, rimes et images : c’est un poème."],
  ["*Ma grand-mère est née dans un petit village du Val d’Anniviers. Enfant, elle gardait les chèvres l’été.* De quel regroupement de genres s’agit-il ?", "le texte qui relate", REG, "Un récit de vie relate des faits réels."],
  ["*Il est interdit de courir dans les couloirs. Les élèves doivent ranger leur matériel avant de sortir.* De quel regroupement de genres s’agit-il ?", "le texte qui règle des comportements", REG, "Un règlement prescrit des comportements."],
];

const GENRES: readonly Item[] = [
  ["Un court récit dont les personnages sont souvent des animaux et qui se termine par une morale est…", "une fable", ["un fait divers", "une biographie", "une recette"], "La fable donne une leçon (la morale)."],
  ["Le récit de la vie d’une personne réelle, écrit par quelqu’un d’autre, est…", "une biographie", ["une autobiographie", "une légende", "un conte"], "Biographie : la vie de quelqu’un racontée par un autre."],
  ["Un récit qui explique de façon imaginaire l’origine d’un lieu, d’un nom ou d’une coutume, souvent lié à un fait réel, est…", "une légende", ["un fait divers", "un mode d’emploi", "un article encyclopédique"], "La légende mêle le réel et l’imaginaire."],
  ["Un récit où le héros doit découvrir la solution d’un mystère est…", "un récit d’énigme", ["une fable", "une recette", "une lettre de demande"], "Récit d’énigme (ou récit policier)."],
  ["Un texte qui explique « pourquoi » ou « comment » un phénomène se produit est…", "un texte explicatif", ["un conte", "une lettre d’opinion", "un poème"], "Il transmet des savoirs."],
  ["Un récit qui raconte l’avenir avec des technologies imaginaires est…", "un récit de science-fiction", ["un récit historique", "un fait divers", "un récit de vie"], "La science-fiction imagine un futur ou des mondes techniques."],
  ["Un récit où un événement inexplicable fait hésiter entre le réel et le surnaturel est…", "un récit fantastique", ["un récit de science-fiction", "une biographie", "un documentaire"], "Le fantastique joue sur le doute face au surnaturel."],
];

const VISEES: readonly Item[] = [
  ["Quelle est la visée principale d’une publicité ?", "convaincre d’acheter", ["raconter une histoire", "expliquer un phénomène", "faire rêver sans rien vendre"], "La publicité veut persuader."],
  ["Quelle est la visée principale d’un mode d’emploi ?", "faire agir", ["distraire", "convaincre", "émouvoir"], "Il dit comment utiliser un objet."],
  ["Quelle est la visée principale d’un article encyclopédique ?", "informer, expliquer", ["faire rire", "faire agir", "vendre"], "Il transmet des connaissances."],
  ["Quelle est la visée principale d’une lettre de demande ?", "obtenir quelque chose", ["décrire un paysage", "raconter un rêve", "jouer avec les sons"], "On écrit pour demander et justifier sa demande."],
  ["Quelle est la visée principale d’un conte ?", "distraire en racontant une histoire", ["informer sur l’actualité", "vendre un produit", "donner un mode d’emploi"], "Le conte raconte une histoire imaginaire."],
];

/** Regroupements de genres, genres de textes et visées. */
export function gen(): Question {
  return tirer([deBanque(EXTRAITS), deBanque(EXTRAITS), deBanque(GENRES), deBanque(VISEES)]);
}
