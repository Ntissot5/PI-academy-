import { R, pick } from "../math";
import type { Question } from "./types";
import { propositions } from "./data/l2-outils";

// Mots français venus de l'allemand : [mot français, mot allemand d'origine]
const DE_FR: [string, string][] = [
  ["hamster", "der Hamster"], ["bretzel", "die Brezel"], ["vasistas", "« Was ist das? » (Qu’est-ce que c’est ?)"],
  ["edelweiss", "das Edelweiss"], ["képi", "das Käppi (suisse allemand)"], ["kitsch", "der Kitsch"], ["rösti", "die Rösti (suisse allemand)"],
  ["quartz", "der Quarz"], ["nickel", "das Nickel"], ["leitmotiv", "das Leitmotiv"],
];
// Mots allemands venus du français
const FR_DE: [string, string][] = [
  ["das Trottoir", "le trottoir"], ["das Portemonnaie", "le porte-monnaie"], ["das Velo", "le vélo(cipède)"], ["das Billett", "le billet"],
  ["der Coiffeur", "le coiffeur"], ["das Restaurant", "le restaurant"], ["die Garage", "le garage"], ["der Balkon", "le balcon"],
  ["die Glace", "la glace (mot suisse)"], ["die Etage", "l’étage"],
];
// Leurres : mots venus d'autres langues
const AUTRES_FR: [string, string][] = [
  ["pizza", "italien"], ["judo", "japonais"], ["chocolat", "nahuatl (aztèque), par l’espagnol"], ["robot", "tchèque"],
  ["football", "anglais"], ["algèbre", "arabe"], ["kayak", "inuktitut"], ["yoga", "sanskrit"],
];
const AUTRES_DE: [string, string][] = [
  ["der Computer", "anglais"], ["die Pizza", "italien"], ["das Handy", "pseudo-anglais"], ["der Kindergarten", "allemand"],
  ["der Hund", "allemand"], ["das Haus", "allemand"], ["der Rucksack", "allemand"], ["das Baby", "anglais"],
];
// Genre en français et en allemand : [allemand, article, français, genre fr]
const GENRE: [string, "der" | "die" | "das", string, "masculin" | "féminin"][] = [
  ["Mond", "der", "la lune", "féminin"], ["Sonne", "die", "le soleil", "masculin"], ["Mädchen", "das", "la fille", "féminin"],
  ["Auto", "das", "la voiture", "féminin"], ["Tisch", "der", "la table", "féminin"], ["Haus", "das", "la maison", "féminin"],
  ["Buch", "das", "le livre", "masculin"], ["Stuhl", "der", "la chaise", "féminin"], ["Baum", "der", "l’arbre", "masculin"],
  ["Blume", "die", "la fleur", "féminin"], ["Zug", "der", "le train", "masculin"], ["Tür", "die", "la porte", "féminin"],
  ["Hund", "der", "le chien", "masculin"], ["Wasser", "das", "l’eau", "féminin"], ["Zahn", "der", "la dent", "féminin"],
];
const GENRE_DE = { der: "masculin", die: "féminin", das: "neutre" } as const;
// Pluriels comparés : [français sg → pl, anglais sg → pl, allemand sg, allemand pl, leurres]
const PLURIEL: [string, string, string, string, string[]][] = [
  ["livre → livres", "book → books", "das Buch", "die Bücher", ["die Buchs", "die Buche"]],
  ["enfant → enfants", "child → children", "das Kind", "die Kinder", ["die Kinds", "die Kinde"]],
  ["chien → chiens", "dog → dogs", "der Hund", "die Hunde", ["die Hunds", "die Hunden"]],
  ["souris → souris", "mouse → mice", "die Maus", "die Mäuse", ["die Mauss", "die Mausen"]],
  ["voiture → voitures", "car → cars", "das Auto", "die Autos", ["die Autoe", "die Autoen"]],
  ["pomme → pommes", "apple → apples", "der Apfel", "die Äpfel", ["die Apfels", "die Apfeln"]],
  ["maison → maisons", "house → houses", "das Haus", "die Häuser", ["die Hauses", "die Hause"]],
];

/** Approches interlinguistiques : emprunts entre langues, genre et pluriel comparés. */
export function gen(): Question {
  const t = R(0, 3);
  if (t === 0) {
    const [mot, origine] = pick(DE_FR);
    return {
      q: "Lequel de ces mots français vient de l’allemand ?",
      txt: 1,
      a: mot,
      choices: propositions(mot, AUTRES_FR.map((x) => x[0])),
      why: `« ${mot} » vient de l’allemand : ${origine}. Les autres viennent d’ailleurs (${AUTRES_FR.slice(0, 3).map((x) => `${x[0]} : ${x[1]}`).join(", ")}…).`,
    };
  }
  if (t === 1) {
    const [mot, origine] = pick(FR_DE);
    return {
      q: "Lequel de ces mots allemands (utilisés en Suisse) vient du français ?",
      txt: 1,
      a: mot,
      choices: propositions(mot, AUTRES_DE.map((x) => x[0])),
      why: `${mot} vient du français « ${origine} ». En Suisse, l’allemand a emprunté beaucoup de mots au français.`,
    };
  }
  if (t === 2) {
    const [de, art, fr, gfr] = pick(GENRE);
    const gde = GENRE_DE[art];
    return {
      q: `En français, on dit <b>${fr}</b> (${gfr}). En allemand, <b>${art} ${de}</b> est…`,
      txt: 1,
      a: gde,
      choices: ["masculin", "féminin", "neutre"],
      why: `${art} → ${gde}.${gde === gfr ? " Ici, le genre est le même dans les deux langues." : " Le genre change d’une langue à l’autre : il faut l’apprendre avec chaque mot. L’allemand a même un troisième genre, le neutre."}`,
    };
  }
  const [fr, en, sg, pl, leurres] = pick(PLURIEL);
  return {
    q: `Le pluriel dans trois langues : français ${fr}, anglais ${en}. Et en allemand, ${sg} → … ?`,
    txt: 1,
    a: pl,
    choices: propositions(pl, leurres),
    why: `${sg} → ${pl}. En français et en anglais, on ajoute souvent -s ; en allemand, il y a plusieurs marques du pluriel (-e, -er, -n, -s, tréma…).`,
  };
}
