import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const NATURES = ["source écrite", "source iconographique", "source archéologique", "source orale"];
// [document, nature]
const DOCS: [string, string][] = [
  ["le texte du Pacte fédéral de 1291", "source écrite"],
  ["un journal intime d’un soldat de 1914", "source écrite"],
  ["une affiche de propagande de 1940", "source iconographique"],
  ["un tableau peint au XVIIe siècle", "source iconographique"],
  ["les ruines du théâtre romain d’Avenches", "source archéologique"],
  ["des pieux de maisons lacustres retrouvés au bord d’un lac", "source archéologique"],
  ["l’enregistrement d’une personne qui raconte la mobilisation de 1939", "source orale"],
];

const ITEMS: [string, string, string[], string][] = [
  ["Une source primaire (première), c’est…", "un document produit à l’époque étudiée", ["un manuel d’histoire écrit aujourd’hui", "un film de fiction récent", "un résumé d’élève"], "Une source secondaire est une étude écrite plus tard à partir des sources primaires."],
  ["Un livre d’historien écrit en 2010 sur le Moyen Âge est…", "une source secondaire", ["une source primaire", "une source archéologique", "un témoignage d’époque"], "Il est écrit bien après les faits, à partir d’autres sources."],
  ["Pourquoi faut-il se méfier d’une affiche de propagande ?", "Elle cherche à convaincre, pas à informer objectivement", ["Elle est toujours fausse sur la date", "Elle est trop colorée", "Il ne faut jamais l’étudier"], "On l’étudie pour comprendre qui l’a faite, pour qui, et dans quel but."],
  ["Pour juger une source, quelle question est la plus utile ?", "Qui l’a produite, quand, et dans quel but ?", ["Est-elle jolie ?", "Est-elle longue ?", "Est-elle en couleur ?"], "Auteur, date et intention permettent d’évaluer l’objectivité d’une source."],
  ["Un chevalier du Moyen Âge regarde l’heure sur sa montre-bracelet dans un film. C’est…", "un anachronisme", ["une source primaire", "une commémoration", "une périodisation"], "Un anachronisme place un élément à une époque où il n’existait pas."],
  ["Un film tourné en 1995 sur la guerre de 1914-1918 : quel est le « temps représentant » ?", "1995 (moment de production du film)", ["1914-1918", "le jour où tu le regardes", "le Moyen Âge"], "Temps représenté : l’époque montrée. Temps représentant : l’époque de production. Temps de visionnement : quand on le regarde."],
  ["Le même film : quel est le « temps représenté » ?", "1914-1918", ["1995", "le jour où tu le regardes", "l’an 2000"], "C’est l’époque historique montrée dans l’œuvre."],
  ["Quelle est la différence entre histoire et mémoire ?", "L’histoire analyse le passé avec méthode ; la mémoire est le souvenir vécu ou transmis par un groupe", ["C’est exactement la même chose", "La mémoire est toujours plus exacte", "L’histoire ne s’occupe que des rois"], "La mémoire peut idéaliser ou oublier ; l’historien croise les sources."],
  ["Le récit de la fondation de Rome par Romulus et Remus, élevés par une louve, est…", "un mythe fondateur", ["un fait prouvé par des photos", "une source archéologique", "un traité"], "Les mythes fondateurs donnent une identité à un peuple, sans être des faits établis."],
  ["Le serment du Grütli et Guillaume Tell sont surtout…", "des légendes liées aux origines de la Confédération", ["des faits prouvés par des documents de 1291", "des inventions du XXe siècle", "des récits romains"], "Le Pacte de 1291 est un document réel ; Tell et le Grütli relèvent de la tradition et de la légende."],
  ["Le 1er août est devenu la fête nationale suisse officielle…", "à la fin du XIXe siècle (1891, 600 ans du Pacte)", ["en 1291", "en 1515", "en 2002"], "La commémoration a été choisie plus tard : la mémoire se construit."],
  ["Le rapport Bergier (2002) a étudié…", "le rôle de la Suisse pendant la Seconde Guerre mondiale", ["la fondation de Rome", "la Réforme à Genève", "la construction du Gothard"], "Il a nuancé la mémoire collective sur cette période."],
];

/** Cycle 3 · démarches historiennes : nature et critique des sources, représentations de l'histoire, histoire et mémoire. */
export function gen(): Question {
  if (Math.random() < 0.35) {
    const [doc, nat] = pick(DOCS);
    return { q: `De quelle nature est cette source : ${doc} ?`, txt: 1, a: nat, choices: shuffle([...NATURES]), why: `${doc[0].toUpperCase() + doc.slice(1)} : ${nat}.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
