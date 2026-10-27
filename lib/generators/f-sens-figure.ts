import { pick } from "../math";
import { deBanque, gras, qcmFixe, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

/* [phrase avec *mot*, sens propre ?]. */
const PF: readonly (readonly [string, boolean, string])[] = [
  ["Il a une *montagne* de devoirs.", false, "« une montagne de » = une grande quantité"], ["Nous avons gravi la *montagne*.", true, "la montagne réelle"],
  ["Elle a un cœur de *pierre*.", false, "« de pierre » = dur, insensible"], ["Le mur est construit en *pierre*.", true, "la vraie pierre"],
  ["Il *dévore* les romans.", false, "« dévorer » = lire avec passion"], ["Le loup *dévore* sa proie.", true, "manger avec avidité"],
  ["Une *pluie* de compliments.", false, "« une pluie de » = beaucoup"], ["La *pluie* tombe sur Lausanne.", true, "l’eau qui tombe du ciel"],
  ["Cette nouvelle m’a *glacé*.", false, "« glacer » = effrayer, saisir"], ["Le vent a *glacé* le lac.", true, "transformer en glace"],
  ["Il *brûle* d’impatience.", false, "« brûler de » = désirer très fort"], ["Le bois *brûle* dans la cheminée.", true, "être en feu"],
];

function propreFigure(): Question {
  const [p, propre, sens] = pick(PF);
  return qcmFixe(`Le mot en gras est-il employé au sens propre ou au sens figuré ? ${gras(p)}`, propre ? "sens propre" : "sens figuré", ["sens propre", "sens figuré"], propre ? `Sens propre (premier sens, concret) : ${sens}.` : `Sens figuré (sens imagé) : ${sens}.`);
}

const EXPR: readonly Item[] = [
  ["Que veut dire l’expression *avoir un poil dans la main* ?", "être paresseux", ["avoir besoin de se raser", "être très fort", "être malade"], "C’est une expression figée : elle se comprend en entier, pas mot à mot."],
  ["Que veut dire l’expression *coûter les yeux de la tête* ?", "coûter très cher", ["faire mal aux yeux", "être gratuit", "être bon marché"], "Expression figée qui exagère le prix."],
  ["Que veut dire l’expression *poser un lapin* ?", "ne pas venir à un rendez-vous", ["offrir un animal", "poser une question", "partir très vite"], "Expression figée : on fait attendre quelqu’un pour rien."],
  ["Que veut dire l’expression *tomber dans les pommes* ?", "s’évanouir", ["cueillir des fruits", "trébucher", "avoir faim"], "Expression figée familière."],
  ["Que veut dire l’expression *avoir la tête dans les nuages* ?", "être distrait, rêveur", ["être très grand", "être en avion", "avoir mal à la tête"], "Expression figée : la personne n’est pas attentive."],
  ["Que veut dire l’expression *mettre la main à la pâte* ?", "participer au travail", ["faire de la pâtisserie", "se salir les mains", "voler quelque chose"], "Expression figée : aider, travailler avec les autres."],
  ["Que veut dire l’expression *donner sa langue au chat* ?", "renoncer à trouver la réponse", ["nourrir son chat", "se taire pour toujours", "parler aux animaux"], "Expression figée utilisée pour les devinettes."],
  ["Que veut dire l’expression *avoir le cafard* ?", "être triste", ["avoir un insecte", "avoir peur", "être en colère"], "Expression figée : avoir des idées noires."],
];

/** Sens propre et sens figuré ; expressions figées. */
export function gen(): Question {
  return tirer([propreFigure, propreFigure, deBanque(EXPR)]);
}
