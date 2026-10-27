import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quel texte international protège les droits de tous les enfants ?", "La Convention relative aux droits de l’enfant (ONU)", ["Le Pacte fédéral de 1291", "Le règlement de l’école", "Le Code de la route"], "Elle a été adoptée par l’ONU en 1989."],
  ["En quelle année l’ONU a-t-elle adopté la Convention relative aux droits de l’enfant ?", "1989", ["1291", "1848", "2010"], "Adoptée le 20 novembre 1989 ; le 20 novembre est la Journée internationale des droits de l’enfant."],
  ["Selon la Convention, un enfant est une personne de moins de…", "18 ans", ["10 ans", "12 ans", "16 ans"], "Jusqu’à 18 ans, on est protégé par la Convention."],
  ["Lequel est un droit de l’enfant ?", "Le droit d’aller à l’école", ["Le droit de conduire une voiture", "Le droit de voter à 8 ans", "Le droit de ne jamais ranger sa chambre"], "Le droit à l’éducation est un droit fondamental de l’enfant."],
  ["Lequel est un droit de l’enfant ?", "Le droit d’être soigné", ["Le droit de manger que des bonbons", "Le droit de ne pas respecter les autres", "Le droit d’avoir un téléphone"], "Le droit à la santé et aux soins."],
  ["Lequel est un droit de l’enfant ?", "Le droit de jouer et d’avoir des loisirs", ["Le droit de travailler à l’usine", "Le droit de frapper", "Le droit de se moquer"], "Le jeu et le repos font partie des droits de l’enfant."],
  ["Lequel est un droit de l’enfant ?", "Le droit d’avoir un nom et une nationalité", ["Le droit de choisir son prénom à 3 ans", "Le droit de ne pas dormir", "Le droit d’avoir un chien"], "Chaque enfant doit être enregistré à sa naissance."],
  ["Lequel est un droit de l’enfant ?", "Le droit d’être protégé contre la violence", ["Le droit de ne jamais être puni", "Le droit d’avoir de l’argent de poche", "Le droit de sortir seul la nuit"], "Aucun enfant ne doit subir de maltraitance."],
  ["Le droit de donner son avis sur ce qui te concerne s’appelle…", "le droit d’être entendu", ["le droit de vote", "le droit d’auteur", "le droit de propriété"], "L’enfant peut exprimer son opinion ; les adultes en tiennent compte selon son âge."],
  ["À un droit correspond souvent une responsabilité. Le droit d’être respecté va avec…", "le devoir de respecter les autres", ["le droit de se moquer", "le droit de crier en classe", "aucune responsabilité"], "Mes droits s’arrêtent là où commencent ceux des autres."],
  ["Le droit d’aller à l’école va avec la responsabilité…", "de travailler et de respecter les règles de l’école", ["de ne jamais faire ses devoirs", "de décider seul des horaires", "d’être toujours le premier"], "Droits et devoirs vont ensemble."],
  ["En Suisse, l’école obligatoire est…", "gratuite et ouverte à tous les enfants", ["payante pour tous", "réservée aux garçons", "facultative"], "La Constitution garantit un enseignement de base suffisant et gratuit."],
  ["Dans certains pays, des enfants doivent travailler au lieu d’aller à l’école. Quel droit n’est pas respecté ?", "Le droit à l’éducation (et à la protection contre le travail)", ["Le droit de vote", "Le droit de conduire", "Le droit de propriété"], "Le travail des enfants existe encore dans le monde ; la Convention le combat."],
  ["Si un enfant est maltraité en Suisse, il peut appeler gratuitement…", "le 147 (Pro Juventute)", ["le 118", "le 1291", "le 1848"], "Le 147 est le numéro d’aide pour les enfants et les jeunes ; le 118, ce sont les pompiers."],
  ["Quelle organisation de l’ONU s’occupe des enfants dans le monde ?", "L’UNICEF", ["L’OMC", "La FIFA", "Le CERN"], "L’UNICEF aide les enfants (santé, éducation, protection)."],
];

/** Cycle 2 · droits, devoirs et responsabilités de l'enfant (Convention de l'ONU), ici et ailleurs. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
