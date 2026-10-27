import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quel organe pompe le sang dans tout le corps ?", "Le cœur", ["L’estomac", "Le foie", "Les reins"], "Le cœur est un muscle qui pompe le sang sans arrêt."],
  ["Quel organe commande tout le corps ?", "Le cerveau", ["Le cœur", "Les poumons", "L’estomac"], "Le cerveau reçoit les informations des sens et commande les mouvements."],
  ["Quel organe le crâne protège-t-il ?", "Le cerveau", ["Le cœur", "Les poumons", "Les intestins"], "Le crâne est une boîte en os qui protège le cerveau."],
  ["Quels organes la cage thoracique (les côtes) protège-t-elle ?", "Le cœur et les poumons", ["L’estomac et les intestins", "Le cerveau", "Les reins seulement"], "Les côtes forment une cage autour du cœur et des poumons."],
  ["Quels organes filtrent le sang et fabriquent l’urine ?", "Les reins", ["Les poumons", "Le cœur", "Les muscles"], "Les reins nettoient le sang ; les déchets partent dans l’urine."],
  ["Quel organe des sens capte la lumière ?", "L’œil", ["L’oreille", "La langue", "Le nez"], "L’œil capte la lumière : c’est la vue."],
  ["Quel organe des sens capte les sons ?", "L’oreille", ["L’œil", "La peau", "Le nez"], "L’oreille capte les sons : c’est l’ouïe."],
  ["Quel organe des sens capte les odeurs ?", "Le nez", ["La langue", "L’oreille", "L’œil"], "Le nez capte les odeurs : c’est l’odorat."],
  ["La chaleur d’une tasse, la douceur d’un tissu : quel organe les capte ?", "La peau", ["L’oreille", "L’œil", "Le nez"], "La peau est l’organe du toucher ; elle sent aussi le chaud et le froid."],
  ["Quand on est enrhumé, les aliments semblent avoir moins de goût. Pourquoi ?", "L’odorat aide aussi à percevoir le goût", ["La langue est malade", "Les dents sont fatiguées", "Les aliments changent"], "Le goût et l’odorat travaillent ensemble."],
  ["Une personne aveugle lit avec ses doigts. Quel sens utilise-t-elle ?", "Le toucher (écriture braille)", ["L’ouïe", "L’odorat", "Le goût"], "Le braille est une écriture en points en relief."],
  ["Écouter de la musique très fort longtemps peut abîmer…", "l’ouïe (les oreilles)", ["les yeux", "les dents", "les ongles"], "Un bruit trop fort et trop long abîme l’oreille pour toujours."],
  ["Le tabac abîme surtout…", "les poumons", ["les ongles", "les cheveux", "les os des pieds"], "La fumée du tabac encrasse et abîme les poumons, et touche aussi le cœur."],
  ["Pourquoi l’activité physique est-elle bonne pour la santé ?", "Elle renforce le cœur, les muscles et les os", ["Elle rend les os plus fragiles", "Elle empêche de dormir", "Elle n’a aucun effet"], "Bouger chaque jour garde le cœur et les muscles en forme."],
  ["Pourquoi un enfant de ton âge a-t-il besoin de beaucoup dormir ?", "Le corps grandit et se repose pendant le sommeil", ["Pour manger moins", "Pour ne pas aller à l’école", "Le sommeil ne sert à rien"], "Pendant le sommeil, le corps récupère et grandit ; le cerveau range ce qu’on a appris."],
  ["Le dopage dans le sport, c’est…", "prendre des produits interdits pour être plus fort", ["s’entraîner beaucoup", "bien manger", "dormir longtemps"], "Le dopage est interdit et dangereux pour la santé."],
  ["Une alimentation équilibrée, c’est…", "manger varié : légumes, fruits, céréales, protéines", ["manger seulement des pâtes", "manger seulement ce qu’on préfère", "sauter des repas"], "Chaque groupe d’aliments apporte des éléments différents au corps."],
  ["Quelle boisson est la meilleure pour se désaltérer ?", "L’eau", ["Le soda", "Le sirop pur", "La boisson énergisante"], "L’eau hydrate sans sucre."],
  ["Quels aliments apportent surtout des protéines (pour construire les muscles) ?", "La viande, le poisson, les œufs, les lentilles", ["Les bonbons", "L’huile", "Le sucre"], "Les protéines servent à construire et réparer le corps."],
  ["Quels aliments apportent surtout de l’énergie lente (glucides) ?", "Le pain, les pâtes, le riz, les pommes de terre", ["Le beurre", "L’eau", "Le sel"], "Les féculents donnent de l’énergie pour longtemps."],
  ["Lesquels faut-il manger avec modération ?", "Les sucreries et les aliments très gras", ["Les légumes", "Les fruits", "L’eau"], "En haut de la pyramide alimentaire : à consommer rarement."],
  ["Quelles parties du corps repoussent si on les coupe ?", "Les cheveux et les ongles", ["Les dents d’adulte", "Les doigts", "Les oreilles"], "Cheveux et ongles poussent toute la vie."],
  ["Une coupure sur la peau guérit. Comment s’appelle ce phénomène ?", "La cicatrisation", ["La digestion", "La respiration", "La circulation"], "La peau se répare toute seule : une croûte se forme, puis une nouvelle peau."],
  ["Un os cassé peut-il se réparer ?", "Oui, l’os se ressoude (avec un plâtre pour le tenir)", ["Non, jamais", "Seulement chez les adultes", "Seulement l’os du crâne"], "L’os fabrique du nouveau tissu osseux : il se ressoude en quelques semaines."],
  ["Remets dans l’ordre les étapes de la vie.", "Enfance, adolescence, âge adulte, vieillesse", ["Adolescence, enfance, vieillesse, âge adulte", "Enfance, âge adulte, adolescence, vieillesse", "Vieillesse, adulte, enfance, adolescence"], "On naît bébé, on grandit (enfance), puis l’adolescence, l’âge adulte et la vieillesse."],
  ["À quelle étape de la vie se passe la puberté ?", "À l’adolescence", ["À la naissance", "À la vieillesse", "Pendant l’enfance, vers 3 ans"], "La puberté transforme le corps d’enfant en corps d’adulte, à l’adolescence."],
  ["Les dents de lait tombent et sont remplacées par…", "les dents définitives", ["rien", "d’autres dents de lait", "des dents en métal"], "Vers 6 ans, les dents définitives poussent et poussent les dents de lait."],
];

/** Cycle 2 · le corps humain : organes et fonctions, sens, prévention, alimentation, croissance et régénération. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
