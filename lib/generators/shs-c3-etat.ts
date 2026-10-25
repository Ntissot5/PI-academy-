import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quels sont les trois éléments qui définissent un État ?", "Un territoire, une population et un pouvoir politique (gouvernement)", ["Une langue, une religion et une monnaie", "Une armée, un drapeau et un hymne", "Une capitale, un fleuve et une montagne"], "Un État exerce un pouvoir souverain sur une population, sur un territoire délimité."],
  ["Le pouvoir exécutif…", "applique les lois et gouverne", ["fait les lois", "juge les litiges", "élit le peuple"], "En Suisse, au niveau fédéral : le Conseil fédéral."],
  ["Le pouvoir judiciaire…", "juge selon les lois", ["vote le budget", "dirige l’administration", "rédige la Constitution seul"], "Les tribunaux sont indépendants des autres pouvoirs."],
  ["En Suisse, au niveau fédéral, qui détient le pouvoir législatif ?", "L’Assemblée fédérale (Conseil national et Conseil des États)", ["Le Conseil fédéral", "Le Tribunal fédéral", "La Banque nationale"], "Le Parlement fait les lois ; le peuple peut s’y opposer par référendum."],
  ["Pourquoi sépare-t-on les pouvoirs ?", "Pour éviter qu’une seule personne ou un seul groupe ait tout le pouvoir", ["Pour avoir plus de fonctionnaires", "Pour ralentir l’économie", "Parce que c’est plus joli"], "Les pouvoirs se contrôlent mutuellement : c’est une garantie contre l’abus."],
  ["Un État de droit, c’est un État où…", "tout le monde, y compris le gouvernement, doit respecter la loi", ["le chef peut changer les lois quand il veut", "il n’y a pas de tribunaux", "seuls les riches ont des droits"], "Les droits fondamentaux sont garantis et des juges indépendants contrôlent."],
  ["Quel texte est la loi fondamentale de la Suisse ?", "La Constitution fédérale", ["Le Code civil", "Le règlement communal", "Le Pacte de 1291"], "Toutes les autres lois doivent respecter la Constitution (actuelle : 1999)."],
  ["Une monarchie est un régime dont le chef de l’État est…", "un roi ou une reine (souvent héréditaire)", ["élu par le peuple tous les 4 ans", "tiré au sort", "le plus jeune citoyen"], "Exemples de monarchies : Royaume-Uni, Belgique, Espagne, Liechtenstein."],
  ["Une république est un régime où le chef de l’État…", "n’est pas un monarque héréditaire", ["est toujours un roi", "est nommé par l’Église", "règne à vie par naissance"], "La Suisse, la France et l’Italie sont des républiques."],
  ["Une dictature est un régime où…", "le pouvoir est concentré entre les mains d’une personne ou d’un groupe, sans contrôle", ["le peuple vote librement", "les pouvoirs sont séparés", "la presse est libre"], "Les libertés (presse, opinion, vote) y sont fortement limitées."],
  ["Le fédéralisme, c’est…", "le partage du pouvoir entre l’État central et des États membres (cantons)", ["un seul gouvernement pour tout", "l’absence de lois", "un régime militaire"], "En Suisse : Confédération, 26 cantons et communes."],
  ["Un citoyen suisse majeur peut…", "voter, élire et être élu", ["ne jamais payer d’impôts", "changer seul la Constitution", "juger les autres"], "Être citoyen, c’est avoir des droits politiques… et des devoirs."],
  ["Quel texte a été adopté par l’ONU le 10 décembre 1948 ?", "La Déclaration universelle des droits de l’homme", ["La Convention relative aux droits de l’enfant", "La Constitution fédérale suisse", "Le traité de Rome"], "Le 10 décembre est la Journée des droits de l’homme."],
  ["La Convention européenne des droits de l’homme a été rédigée dans le cadre…", "du Conseil de l’Europe", ["de l’Union européenne", "de l’ONU", "de l’OTAN"], "Les personnes en Suisse peuvent saisir la Cour européenne des droits de l’homme à Strasbourg."],
  ["Lequel est un droit fondamental garanti par la Constitution suisse ?", "La liberté d’opinion et d’expression", ["Le droit de ne jamais travailler", "Le droit d’avoir une voiture", "Le droit de ne pas respecter la loi"], "La Constitution garantit aussi l’égalité, la liberté de croyance, etc."],
  ["La liberté d’expression a-t-elle des limites ?", "Oui, par exemple l’interdiction d’appeler à la haine ou de diffamer", ["Non, on peut tout dire sur tout le monde", "Oui, on ne peut jamais critiquer le gouvernement", "Non, sauf le dimanche"], "Les droits des uns s’arrêtent là où ils portent atteinte à ceux des autres."],
];

/** Cycle 3 · qu'est-ce qu'un État : pouvoirs, État de droit, régimes politiques, citoyenneté, droits humains. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
