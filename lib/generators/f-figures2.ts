import { pick } from "../math";
import { gras, qcmFixe } from "./f-outils";
import type { Question } from "./types";

const FIG = ["hyperbole", "litote", "métonymie", "euphémisme"] as const;
const ITEMS: readonly (readonly [string, (typeof FIG)[number], string])[] = [
  ["*Je meurs de faim* !", "hyperbole", "On exagère pour frapper l’esprit : on a simplement très faim."],
  ["*Je te l’ai dit mille fois.*", "hyperbole", "Exagération du nombre : hyperbole."],
  ["Il a *une force de géant*.", "hyperbole", "Exagération : il est très fort."],
  ["*Ce n’est pas mauvais*, ce gâteau.", "litote", "On dit moins pour faire entendre plus : le gâteau est très bon."],
  ["« *Va, je ne te hais point* » (Corneille, Le Cid).", "litote", "Chimène dit moins (je ne te hais pas) pour faire entendre plus (je t’aime)."],
  ["Elle *n’est pas bête*.", "litote", "On fait entendre qu’elle est intelligente."],
  ["Il a *bu un verre* d’eau.", "métonymie", "On nomme le contenant (le verre) pour le contenu (l’eau)."],
  ["*Toute la salle* applaudit.", "métonymie", "On nomme le lieu (la salle) pour les personnes qui s’y trouvent."],
  ["J’ai lu *un Ramuz* pendant les vacances.", "métonymie", "On nomme l’auteur pour son œuvre."],
  ["*Berne* a pris une décision importante.", "métonymie", "On nomme la ville pour le gouvernement fédéral qui y siège."],
  ["Son grand-père *nous a quittés* l’an dernier.", "euphémisme", "On adoucit une réalité pénible : il est mort."],
  ["Les *personnes à mobilité réduite* ont un accès réservé.", "euphémisme", "Expression adoucie pour parler des personnes handicapées."],
  ["Mon oncle est *un peu enrobé*.", "euphémisme", "On atténue une réalité qui pourrait blesser : il est gros."],
];

/** Figures de style : hyperbole, litote, métonymie, euphémisme. */
export function gen(): Question {
  const [p, f, why] = pick(ITEMS);
  return qcmFixe(`Quelle figure de style reconnais-tu dans le passage en gras ? ${gras(p)}`, f, FIG, why);
}
