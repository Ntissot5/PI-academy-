import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Le système nerveux central est formé…", "du cerveau et de la moelle épinière", ["du cœur et des poumons", "des nerfs des mains", "des muscles et des os"], "Les nerfs relient ensuite ce centre à tout le corps."],
  ["Quel est le trajet d’un message quand tu décides de prendre un objet que tu vois ?", "Œil → nerf sensitif → cerveau → nerf moteur → muscle", ["Muscle → cerveau → œil", "Œil → muscle → cerveau", "Cerveau → œil → nerf sensitif → muscle"], "Récepteur sensoriel, nerf sensitif, centre nerveux, nerf moteur, muscle."],
  ["Un nerf qui transmet un message des organes des sens vers le centre nerveux est…", "un nerf sensitif", ["un nerf moteur", "un tendon", "un ligament"], "Sensitif : vers le centre. Moteur : du centre vers les muscles."],
  ["Un nerf qui commande un muscle est…", "un nerf moteur", ["un nerf sensitif", "une artère", "un ligament"], "Le nerf moteur apporte l’ordre de contraction au muscle."],
  ["Tu retires ta main d’une plaque chaude avant même d’y penser. C’est…", "un réflexe (géré par la moelle épinière)", ["un mouvement volontaire réfléchi", "un hasard", "une action du cœur"], "Le réflexe est rapide et involontaire : le message ne passe pas d’abord par la réflexion."],
  ["Les cellules de l’œil qui captent la lumière se trouvent dans…", "la rétine", ["le cristallin", "l’iris", "la pupille"], "La rétine contient les récepteurs de la lumière (cônes et bâtonnets)."],
  ["Combien la colonne vertébrale compte-t-elle de vertèbres cervicales (au cou) ?", "7", ["5", "12", "24"], "7 cervicales, 12 dorsales (thoraciques), 5 lombaires, puis sacrum et coccyx."],
  ["Combien la colonne vertébrale compte-t-elle de vertèbres dorsales (thoraciques) ?", "12", ["7", "5", "10"], "Les 12 vertèbres dorsales portent les côtes."],
  ["Combien la colonne vertébrale compte-t-elle de vertèbres lombaires ?", "5", ["7", "12", "3"], "Les 5 lombaires, en bas du dos, portent une grande partie du poids du corps."],
  ["Les côtes s’attachent aux vertèbres…", "dorsales (thoraciques)", ["cervicales", "lombaires", "du coccyx"], "Avec le sternum, elles forment la cage thoracique."],
  ["Quel os protège le cerveau ?", "Le crâne", ["Le bassin", "Le sternum", "L’omoplate"], "Le crâne est formé de plusieurs os soudés."],
  ["Quel ensemble d’os relie la colonne vertébrale aux jambes ?", "Le bassin", ["La cage thoracique", "Le crâne", "Les clavicules"], "Le bassin porte le tronc et s’articule avec les fémurs."],
  ["Qu’est-ce qui relie un muscle à un os ?", "Un tendon", ["Un ligament", "Un nerf", "Un cartilage"], "Tendon : muscle → os. Ligament : os → os."],
  ["Qu’est-ce qui relie deux os entre eux au niveau d’une articulation ?", "Un ligament", ["Un tendon", "Une veine", "Un muscle"], "Les ligaments tiennent l’articulation ; une entorse les étire ou les déchire."],
  ["Pourquoi les muscles fonctionnent-ils par paires (biceps / triceps) ?", "Un muscle ne peut que tirer en se contractant", ["Un muscle peut pousser et tirer", "Pour être symétrique", "Ce n’est pas le cas"], "Le biceps plie le coude, le triceps le tend : ce sont des muscles antagonistes."],
  ["Le cartilage recouvre le bout des os dans une articulation. Il sert à…", "réduire les frottements et amortir les chocs", ["fabriquer le sang", "commander les muscles", "relier le muscle à l’os"], "Un cartilage lisse permet aux os de glisser l’un sur l’autre."],
];

/** Cycle 3 · système nerveux (sens, mouvement volontaire, réflexe) et système locomoteur (squelette, muscles, articulations). */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
