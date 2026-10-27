import { R, pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const MOIS = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
const SAISONS = ["le printemps", "l’été", "l’automne", "l’hiver"];

const ITEMS: [string, string, string[], string][] = [
  ["Qu’est-ce qui dure le plus longtemps ?", "Une semaine", ["Une journée", "Une heure"], "1 semaine = 7 jours ; 1 jour = 24 heures."],
  ["Qu’est-ce qui dure le plus longtemps ?", "Les vacances d’été", ["La récréation", "Se brosser les dents"], "Les vacances d’été durent plusieurs semaines."],
  ["Qu’est-ce qui dure le moins longtemps ?", "Éternuer", ["Une nuit de sommeil", "Un match de foot"], "Un éternuement dure à peine une seconde."],
  ["Hier, c’était lundi. Aujourd’hui, c’est…", "mardi", ["dimanche", "mercredi"], "Après lundi vient mardi."],
  ["Le matin, je me lève. Le soir, je…", "me couche", ["vais à la récréation", "prends le petit-déjeuner"], "Le matin on se lève, le soir on va au lit."],
  ["Quel repas prend-on le matin ?", "Le petit-déjeuner", ["Le souper", "Le dîner"], "En Suisse romande : déjeuner ou petit-déjeuner le matin, dîner à midi, souper le soir."],
  ["Qu’est-ce qui annonce la fin de la récréation à l’école ?", "La sonnerie", ["La pluie", "La lune"], "La sonnerie rythme la journée à l’école."],
  ["Quand voit-on la lune et les étoiles ?", "La nuit", ["À midi", "Pendant la récréation"], "La nuit, le ciel est sombre et on voit la lune et les étoiles."],
  ["Un bébé devient…", "un enfant, puis un adulte", ["plus petit", "un bébé pour toujours"], "Le temps passe : on grandit et on change."],
  ["Remets dans l’ordre : naissance, enfance, âge adulte, …", "vieillesse", ["bébé", "naissance"], "Naissance, enfance, âge adulte, vieillesse."],
  ["Les parents de mes parents sont…", "mes grands-parents", ["mes cousins", "mes frères"], "Grands-parents, parents, enfants : trois générations."],
  ["Le frère de ma maman est…", "mon oncle", ["mon grand-père", "mon cousin"], "Le frère d’un parent est un oncle."],
  ["Quelle fête a lieu le 1er août en Suisse ?", "La fête nationale", ["Noël", "Le Nouvel An"], "Le 1er août, on fête l’anniversaire de la Suisse."],
  ["Noël, c’est en…", "décembre", ["juillet", "avril"], "Noël a lieu le 25 décembre."],
  ["Le premier jour de l’année, c’est le…", "1er janvier", ["31 décembre", "1er août"], "Le 1er janvier, c’est le Nouvel An."],
  ["Un arbre planté par ton grand-père est maintenant…", "plus grand qu’au début", ["plus petit", "toujours une graine"], "Avec le temps, les plantes grandissent."],
];

/** Cycle 1 · le temps : jours, mois, saisons, avant/après, durées, rythmes de la journée, étapes de la vie, générations. */
export function gen(): Question {
  const t = R(0, 4);
  if (t === 0) {
    const i = R(0, 6);
    const apres = Math.random() < 0.5;
    const a = JOURS[(i + (apres ? 1 : 6)) % 7];
    const faux = shuffle(JOURS.filter((j) => j !== a && j !== JOURS[i])).slice(0, 2);
    return { q: `Quel jour vient ${apres ? "après" : "avant"} ${JOURS[i]} ?`, txt: 1, a, choices: shuffle([a, ...faux]), why: `Lundi, mardi, mercredi, jeudi, vendredi, samedi, dimanche. ${apres ? "Après" : "Avant"} ${JOURS[i]} : ${a}.` };
  }
  if (t === 1) {
    const i = R(0, 11);
    const a = MOIS[(i + 1) % 12];
    const faux = shuffle(MOIS.filter((m) => m !== a && m !== MOIS[i])).slice(0, 2);
    return { q: `Quel mois vient après ${MOIS[i]} ?`, txt: 1, a, choices: shuffle([a, ...faux]), why: `Après ${MOIS[i]} vient ${a}. Il y a 12 mois dans une année.` };
  }
  if (t === 2) {
    const i = R(0, 3);
    const a = SAISONS[(i + 1) % 4];
    const faux = SAISONS.filter((s) => s !== a && s !== SAISONS[i]);
    return { q: `Quelle saison vient après ${SAISONS[i]} ?`, txt: 1, a, choices: shuffle([a, ...faux]), why: `Le printemps, l’été, l’automne, l’hiver… puis on recommence.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
