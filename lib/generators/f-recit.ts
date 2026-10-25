import { deBanque, etiquette, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ETAPES = ["situation initiale", "complication", "actions", "résolution", "situation finale"];
const RE: Record<string, string> = {
  "situation initiale": "Elle présente les personnages, le lieu et le moment, avant le problème.",
  complication: "Un événement vient perturber la situation (souvent introduit par « soudain », « un jour »).",
  actions: "Les personnages agissent pour résoudre le problème.",
  résolution: "Le problème est réglé.",
  "situation finale": "Elle montre le nouvel équilibre, après l’histoire.",
};
const PARTIES: readonly (readonly [string, string, string?])[] = [
  ["*Il était une fois, au pied du Moléson, un berger qui vivait tranquillement avec ses chèvres.*", "situation initiale"],
  ["*Un soir d’orage, sa plus belle chèvre disparut.*", "complication"],
  ["*Il chercha dans les rochers, interrogea les voisins, puis grimpa jusqu’au sommet.*", "actions"],
  ["*Au matin, il la découvrit enfin, coincée sur une corniche, et la ramena.*", "résolution"],
  ["*Depuis ce jour, le berger accroche une clochette au cou de chaque chèvre.*", "situation finale"],
  ["*Lina vivait dans une petite maison à Morat avec son chat Filou.*", "situation initiale"],
  ["*Un matin, Filou ne revint pas de sa promenade.*", "complication"],
  ["*Lina colla des affiches dans tout le quartier et appela les voisins.*", "actions"],
  ["*Le troisième jour, une voisine le retrouva endormi dans son garage.*", "résolution"],
  ["*Désormais, Filou porte un collier avec le numéro de téléphone de Lina.*", "situation finale"],
];

const NARR: readonly Item[] = [
  ["*Je courus vers la porte, le cœur battant. Qui pouvait frapper à cette heure ?* Le narrateur est…", "un personnage de l’histoire (narrateur interne)", ["extérieur à l’histoire (narrateur externe)", "l’auteur du livre, forcément", "le lecteur"], "Le « je » montre que le narrateur participe à l’histoire."],
  ["*Le vieux pêcheur rentra au port. Il ne dit rien à personne.* Le narrateur est…", "extérieur à l’histoire (narrateur externe)", ["un personnage de l’histoire (narrateur interne)", "le vieux pêcheur", "le lecteur"], "Récit à la 3e personne : le narrateur ne participe pas à l’histoire."],
  ["Dans un roman écrit à la première personne, le « je » est…", "le narrateur, qui n’est pas forcément l’auteur", ["toujours l’auteur", "toujours le lecteur", "un personnage secondaire"], "Il ne faut pas confondre l’auteur (la personne réelle qui écrit) et le narrateur (la voix qui raconte)."],
  ["*Paul souriait, mais au fond de lui, il avait terriblement peur ; son frère, lui, ne se doutait de rien.* Le narrateur connaît les pensées de tous : c’est un point de vue…", "omniscient", ["interne", "externe", "théâtral"], "Le narrateur sait tout, même ce que les personnages pensent : point de vue omniscient."],
  ["*Un homme entra. Il posa son chapeau sur la table et sortit sans un mot.* On ne connaît ni ses pensées ni son nom : c’est un point de vue…", "externe", ["interne", "omniscient", "lyrique"], "Le narrateur décrit seulement ce qu’on voit, comme une caméra."],
];

const STRUCT: readonly Item[] = [
  ["*Trois ans plus tard, le village avait bien changé.* Quel procédé fait avancer le récit ?", "une ellipse", ["un retour en arrière", "un dialogue", "une description"], "Le récit saute trois ans sans les raconter : ellipse."],
  ["*Assis sur le quai, il se souvint de son premier voyage, vingt ans plus tôt…* Quel procédé reconnais-tu ?", "un retour en arrière", ["une anticipation", "une ellipse", "un résumé"], "Le récit revient à des événements antérieurs : retour en arrière (analepse)."],
  ["*La salle était immense : de lourds rideaux rouges, un lustre doré, des fauteuils de velours.* Ce passage est…", "descriptif", ["dialogué", "explicatif", "argumentatif"], "Il décrit un lieu."],
  ["*— Tu viens ? demanda Zoé. — Pas tout de suite, répondit Malik.* Ce passage est…", "dialogué", ["descriptif", "narratif", "explicatif"], "Les tirets marquent les répliques d’un dialogue."],
  ["Dans un conte, le personnage qui aide le héros est…", "l’adjuvant", ["l’opposant", "l’objet de la quête", "le destinataire"], "Schéma actanciel : l’adjuvant aide, l’opposant gêne."],
  ["Dans un conte, la sorcière qui empêche le héros d’atteindre son but est…", "l’opposant", ["l’adjuvant", "le héros", "l’objet de la quête"], "L’opposant s’oppose à la quête du héros."],
];

/** Le récit : schéma narratif, narrateur et point de vue, structure (ellipse, retour en arrière), schéma actanciel. */
export function gen(): Question {
  return tirer([etiquette("À quelle étape du schéma narratif correspond ce passage ?", PARTIES, ETAPES, RE), deBanque(NARR), deBanque(STRUCT)]);
}

export function genSchema(): Question {
  return etiquette("À quelle étape du schéma narratif correspond ce passage ?", PARTIES, ETAPES, RE)();
}
