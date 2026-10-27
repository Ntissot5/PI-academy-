import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Avec quoi est-ce que je marche ?", "Avec mes jambes", ["Avec mes oreilles", "Avec mon nez"], "Les jambes et les pieds servent à se déplacer."],
  ["Avec quoi est-ce que j’attrape un ballon ?", "Avec mes mains", ["Avec mon dos", "Avec mes cheveux"], "La main sert à prendre, à tenir, à attraper."],
  ["Où sont mes yeux ?", "Sur mon visage", ["Sur mon ventre", "Sur mes genoux"], "Les yeux, le nez et la bouche sont sur le visage."],
  ["Quelle partie relie la tête au reste du corps ?", "Le cou", ["Le coude", "La cheville"], "Le cou tient la tête et lui permet de tourner."],
  ["Quelle articulation plie le bras ?", "Le coude", ["Le genou", "La cheville"], "Le coude est au milieu du bras."],
  ["Quelle articulation plie la jambe ?", "Le genou", ["Le coude", "Le poignet"], "Le genou est au milieu de la jambe."],
  ["Quelle articulation est entre la main et le bras ?", "Le poignet", ["L’épaule", "Le genou"], "Le poignet fait bouger la main."],
  ["Quelle articulation est entre le pied et la jambe ?", "La cheville", ["Le poignet", "Le coude"], "La cheville fait bouger le pied."],
  ["Quelle articulation relie le bras au tronc ?", "L’épaule", ["La cheville", "Le genou"], "L’épaule permet de lever le bras."],
  ["Lequel est vital pour mon corps ?", "Respirer", ["Regarder la télé", "Avoir des jouets"], "Respirer, boire, manger et dormir sont vitaux."],
  ["Lequel est vital pour mon corps ?", "Boire de l’eau", ["Jouer à la console", "Porter une casquette"], "Sans eau, le corps ne peut pas vivre."],
  ["Lequel est vital pour mon corps ?", "Dormir", ["Manger des bonbons", "Regarder un film"], "La nuit, le corps se repose et grandit."],
  ["Pour être en forme, quel goûter est le meilleur ?", "Une pomme", ["Des bonbons", "Une boisson sucrée"], "Un fruit donne de l’énergie sans trop de sucre."],
  ["Quand dois-je me laver les mains ?", "Avant de manger", ["Seulement le dimanche", "Jamais"], "Se laver les mains enlève les microbes."],
  ["Combien de fois par jour faut-il se brosser les dents ?", "Au moins 2 fois", ["1 fois par semaine", "Jamais"], "Matin et soir, au moins 2 fois par jour."],
  ["Que fait mon corps au réveil, le matin ?", "Il a besoin d’un petit-déjeuner", ["Il a besoin de dormir encore 10 heures", "Il n’a besoin de rien"], "Après la nuit, le corps a besoin d’énergie : le petit-déjeuner."],
  ["Il fait très chaud au soleil. Que dois-je faire ?", "Mettre un chapeau et boire", ["Enlever mes chaussures", "Courir sans m’arrêter"], "Le chapeau protège la tête et l’eau évite d’avoir trop chaud."],
  ["Je trouve des médicaments sur la table. Que dois-je faire ?", "Ne pas y toucher et appeler un adulte", ["Les goûter", "Les donner à mon chat"], "Les médicaments peuvent être dangereux : seul un adulte s’en occupe."],
  ["Je vois un flacon avec ce dessin : une tête de mort. Cela veut dire…", "Danger : produit toxique", ["Bonbons", "Jouet"], "Ce signe veut dire que le produit est un poison."],
  ["Pour traverser la route, je…", "regarde à gauche, à droite, puis encore à gauche", ["cours sans regarder", "ferme les yeux"], "On regarde des deux côtés avant de traverser, au passage piéton."],
  ["À vélo, qu’est-ce qui protège ma tête ?", "Un casque", ["Une écharpe", "Des lunettes de soleil"], "Le casque protège la tête en cas de chute."],
  ["Au bord du lac, que dois-je faire ?", "Rester avec un adulte", ["Aller seul dans l’eau profonde", "Pousser les copains"], "Près de l’eau, on reste toujours avec un adulte."],
  ["Je touche une plaque de cuisson. Quel est le danger ?", "Je peux me brûler", ["Je peux me mouiller", "Aucun"], "Une plaque chaude brûle la peau."],
];

/** Cycle 1 · le corps : parties, articulations, besoins vitaux, hygiène, dangers. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
