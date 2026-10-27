import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Une religion monothéiste croit en…", "un seul dieu", ["plusieurs dieux", "aucun dieu", "des dieux animaux seulement"], "Judaïsme, christianisme et islam sont des monothéismes."],
  ["Les Grecs et les Romains de l’Antiquité étaient…", "polythéistes (plusieurs dieux)", ["monothéistes", "sans religion", "bouddhistes"], "Zeus / Jupiter, Athéna / Minerve…"],
  ["Lequel n’est PAS une religion monothéiste ?", "La religion des Grecs anciens", ["Le judaïsme", "Le christianisme", "L’islam"], "Les Grecs anciens adoraient de nombreux dieux."],
  ["Quel est le plus ancien des trois grands monothéismes ?", "Le judaïsme", ["Le christianisme", "L’islam", "Ils sont apparus en même temps"], "Le christianisme naît dans le judaïsme ; l’islam apparaît au VIIe siècle."],
  ["L’islam apparaît au VIIe siècle dans la péninsule…", "arabique (La Mecque, Médine)", ["italienne", "ibérique", "scandinave"], "L’Hégire (622) marque le début du calendrier musulman."],
  ["Qui publie ses 95 thèses en 1517 et lance la Réforme ?", "Martin Luther", ["Jean Calvin", "Napoléon", "Charlemagne"], "Luther critique notamment la vente des indulgences."],
  ["Quel réformateur a fortement marqué Genève au XVIe siècle ?", "Jean Calvin", ["Martin Luther", "Ulrich Zwingli", "Henri Dunant"], "Genève est surnommée la « Rome protestante »."],
  ["Quel réformateur a lancé la Réforme à Zurich ?", "Ulrich Zwingli", ["Jean Calvin", "Martin Luther", "Guillaume Farel"], "Zwingli prêche à Zurich à partir de 1519."],
  ["La séparation entre catholiques et protestants est un…", "schisme", ["traité", "concile œcuménique", "monopole"], "Un schisme est une division au sein d’une religion."],
  ["Au Moyen Âge, un monastère est…", "un lieu où vivent des moines selon une règle", ["un château fort", "un marché", "une école d’ingénieurs"], "Les moines prient, travaillent et recopient des manuscrits (monachisme)."],
  ["Pouvoir temporel et pouvoir spirituel : le pouvoir spirituel concerne…", "la religion (l’Église)", ["l’armée", "les impôts", "le commerce"], "Le pouvoir temporel est celui des rois et des gouvernements."],
  ["La laïcité, c’est…", "la séparation entre l’État et les religions", ["l’obligation d’avoir une religion", "l’interdiction de toutes les religions", "une religion d’État"], "L’État reste neutre ; chacun est libre de croire ou de ne pas croire."],
  ["L’humanisme, à la Renaissance, met au centre…", "l’être humain, son savoir et sa liberté de penser", ["uniquement le roi", "les animaux", "la guerre"], "Les humanistes redécouvrent les textes antiques (Érasme, par exemple)."],
  ["Une cosmogonie est…", "un récit qui explique l’origine du monde", ["un calendrier", "une carte du ciel", "une loi"], "Chaque civilisation a donné ses réponses aux questions de l’origine et de l’au-delà."],
  ["Chez les anciens Égyptiens, la momification servait à…", "préparer le défunt à la vie dans l’au-delà", ["guérir les malades", "conserver la nourriture", "fabriquer du papyrus"], "Elle montre leur représentation de l’au-delà."],
];

/** Cycle 3 · influence du fait religieux : monothéismes et polythéismes, Réforme, pouvoir temporel et spirituel, laïcité. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
