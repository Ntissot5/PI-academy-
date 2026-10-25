import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// Contraires : [mot, contraire, traduction du mot, traduction du contraire]
const GEGENTEIL: [string, string, string, string][] = [
  ["gross", "klein", "grand", "petit"], ["lang", "kurz", "long", "court"], ["schnell", "langsam", "rapide", "lent"],
  ["warm", "kalt", "chaud", "froid"], ["hell", "dunkel", "clair", "sombre"], ["laut", "leise", "bruyant", "silencieux"],
  ["schwer", "leicht", "lourd", "léger"], ["voll", "leer", "plein", "vide"], ["gut", "schlecht", "bon", "mauvais"],
  ["richtig", "falsch", "juste", "faux"], ["früh", "spät", "tôt", "tard"], ["oben", "unten", "en haut", "en bas"],
  ["links", "rechts", "à gauche", "à droite"], ["dick", "dünn", "épais", "mince"], ["teuer", "billig", "cher", "bon marché"],
  ["nass", "trocken", "mouillé", "sec"], ["stark", "schwach", "fort", "faible"], ["reich", "arm", "riche", "pauvre"],
  ["sauber", "schmutzig", "propre", "sale"], ["immer", "nie", "toujours", "jamais"], ["viel", "wenig", "beaucoup", "peu"],
  ["jung", "alt", "jeune", "vieux"], ["traurig", "fröhlich", "triste", "joyeux"], ["kommen", "gehen", "venir", "partir"],
  ["kaufen", "verkaufen", "acheter", "vendre"], ["öffnen", "schliessen", "ouvrir", "fermer"], ["fragen", "antworten", "demander", "répondre"],
  ["der Tag", "die Nacht", "le jour", "la nuit"], ["der Sommer", "der Winter", "l’été", "l’hiver"], ["ja", "nein", "oui", "non"],
];

// Familles de mots : [verbe, traduction, mot de la même famille, traduction]
const FAMILIE: [string, string, string, string][] = [
  ["spielen", "jouer", "der Spielplatz", "la place de jeux"], ["fahren", "rouler", "der Fahrer", "le conducteur"],
  ["schwimmen", "nager", "das Schwimmbad", "la piscine"], ["lesen", "lire", "der Leser", "le lecteur"],
  ["schreiben", "écrire", "der Schreibtisch", "le bureau"], ["backen", "faire au four", "der Bäcker", "le boulanger"],
  ["kochen", "cuisiner", "das Kochbuch", "le livre de cuisine"], ["waschen", "laver", "die Waschmaschine", "la machine à laver"],
  ["schlafen", "dormir", "das Schlafzimmer", "la chambre à coucher"], ["trinken", "boire", "das Getränk", "la boisson"],
  ["fliegen", "voler (en l’air)", "das Flugzeug", "l’avion"], ["singen", "chanter", "der Sänger", "le chanteur"],
  ["malen", "peindre", "der Maler", "le peintre"], ["wohnen", "habiter", "die Wohnung", "l’appartement"],
  ["zeichnen", "dessiner", "die Zeichnung", "le dessin"],
];

/** Contraires et familles de mots. */
export function gen(): Question {
  if (R(0, 2) > 0) {
    const paire = pick(GEGENTEIL);
    const sens = R(0, 1);
    const [mot, contraire, frMot, frContraire] = sens === 0 ? paire : [paire[1], paire[0], paire[3], paire[2]];
    const leurres = GEGENTEIL.filter((p) => p !== paire).flatMap((p) => [p[0], p[1]]);
    return {
      q: `Quel est le contraire de <b>${mot}</b> (${frMot}) ?`,
      txt: 1,
      a: contraire,
      choices: propositions(contraire, leurres),
      why: `${mot} (${frMot}) ↔ ${contraire} (${frContraire}).`,
    };
  }
  const f = pick(FAMILIE);
  const [verbe, frVerbe, mot, frMotFam] = f;
  const leurres = FAMILIE.filter((x) => x !== f).map((x) => x[2]);
  return {
    q: `Quel mot est de la même famille que <b>${verbe}</b> (${frVerbe}) ?`,
    txt: 1,
    a: mot,
    choices: propositions(mot, leurres),
    why: `${mot} (${frMotFam}) vient de ${verbe} : même radical, même famille. Les autres mots n’ont rien à voir.`,
  };
}
