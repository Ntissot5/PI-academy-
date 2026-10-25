import { pick } from "../math";
import { qcmFixe, tirer } from "./f-outils";
import type { Question } from "./types";

type M = "dans le passé" | "maintenant" | "dans le futur";
const CHOIX: M[] = ["dans le passé", "maintenant", "dans le futur"];

/* [phrase, moment, indice]. */
const PHRASES: readonly (readonly [string, M, string])[] = [
  ["Hier, nous sommes allés au cirque.", "dans le passé", "« hier » et le passé composé"],
  ["L’été dernier, Léo nageait dans le lac.", "dans le passé", "« l’été dernier » et l’imparfait"],
  ["Autrefois, les enfants allaient à l’école à pied.", "dans le passé", "« autrefois » et l’imparfait"],
  ["La semaine passée, j’ai perdu mon bonnet.", "dans le passé", "« la semaine passée » et le passé composé"],
  ["Quand j’étais petit, j’avais peur du noir.", "dans le passé", "l’imparfait « j’étais », « j’avais »"],
  ["En ce moment, il neige sur la montagne.", "maintenant", "« en ce moment » et le présent"],
  ["Maintenant, je lis un livre.", "maintenant", "« maintenant » et le présent"],
  ["Regarde, le chat dort sur le canapé !", "maintenant", "le présent : l’action se passe sous nos yeux"],
  ["Actuellement, ma sœur habite à Bulle.", "maintenant", "« actuellement » et le présent"],
  ["Demain, nous irons à la piscine.", "dans le futur", "« demain » et le futur"],
  ["L’année prochaine, Zoé entrera en 5<sup>e</sup>.", "dans le futur", "« l’année prochaine » et le futur"],
  ["Dans deux jours, ce sera mon anniversaire.", "dans le futur", "« dans deux jours » et le futur"],
  ["Plus tard, je serai vétérinaire.", "dans le futur", "« plus tard » et le futur"],
  ["Samedi prochain, mes cousins viendront à la maison.", "dans le futur", "« samedi prochain » et le futur"],
];

function moment(): Question {
  const [p, m, indice] = pick(PHRASES);
  return qcmFixe(`Quand se passe l’action ? <b>${p}</b>`, m, CHOIX, `L’action se passe ${m} : ${indice}.`, "Cherche les mots qui disent quand, et regarde le verbe.");
}

/* Mots qui situent dans le temps. */
const MOTS: readonly (readonly [string, M])[] = [
  ["hier", "dans le passé"], ["autrefois", "dans le passé"], ["l’an dernier", "dans le passé"], ["il y a longtemps", "dans le passé"],
  ["maintenant", "maintenant"], ["en ce moment", "maintenant"], ["actuellement", "maintenant"],
  ["demain", "dans le futur"], ["bientôt", "dans le futur"], ["la semaine prochaine", "dans le futur"], ["plus tard", "dans le futur"],
];

function mot(): Question {
  const [m, t] = pick(MOTS);
  return qcmFixe(`Le mot <b>${m}</b> place l’action :`, t, CHOIX, `« ${m} » place l’action ${t}.`);
}

/* Chronologie d'événements. */
const SUITES: readonly (readonly string[])[] = [
  ["Je me lève.", "Je prends mon petit-déjeuner.", "Je pars à l’école."],
  ["Lina plante une graine.", "La plante pousse.", "Une fleur apparaît."],
  ["Le cuisinier mélange la pâte.", "Il met le gâteau au four.", "Il sert le gâteau."],
  ["La chenille mange des feuilles.", "Elle s’enferme dans un cocon.", "Un papillon en sort."],
  ["Il neige toute la nuit.", "Les enfants font un bonhomme de neige.", "Le soleil fait fondre le bonhomme."],
];

function avantApres(): Question {
  const s = pick(SUITES);
  const k = pick([0, 2]);
  return qcmFixe(
    `Que se passe-t-il en ${k === 0 ? "premier" : "dernier"} ?`,
    s[k],
    [...s].sort(),
    `Dans l’ordre : ${s.join(" → ")}`,
  );
}

/** Ligne du temps : passé, présent, futur ; ordre des événements. */
export function gen(): Question {
  return tirer([moment, moment, moment, mot, avantApres]);
}
