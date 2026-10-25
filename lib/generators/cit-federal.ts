import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Combien de membres compte le Conseil fédéral ?", "7", ["5", "9", "26"], "Le Conseil fédéral, gouvernement de la Suisse, a 7 membres."],
  ["Combien de sièges compte le Conseil national ?", "200", ["100", "246", "150"], "Le Conseil national représente le peuple : 200 sièges répartis selon la population des cantons."],
  ["Combien de sièges compte le Conseil des États ?", "46", ["26", "52", "50"], "2 sièges par canton, 1 pour les 6 anciens demi-cantons : 46."],
  ["Comment s’appellent les deux chambres réunies ?", "L’Assemblée fédérale", ["Le Conseil fédéral", "Le Tribunal fédéral", "La Landsgemeinde"], "Conseil national + Conseil des États = Assemblée fédérale (246 membres)."],
  ["Combien de signatures faut-il pour une initiative populaire fédérale ?", "100 000", ["50 000", "10 000", "200 000"], "100 000 signatures, récoltées en 18 mois."],
  ["Combien de signatures faut-il pour un référendum facultatif ?", "50 000", ["100 000", "10 000", "30 000"], "50 000 signatures en 100 jours après la publication de la loi."],
  ["À quel âge peut-on voter au niveau fédéral ?", "18 ans", ["16 ans", "20 ans", "21 ans"], "18 ans au niveau fédéral. Glaris permet de voter dès 16 ans au niveau cantonal."],
  ["Où siège le Tribunal fédéral ?", "Lausanne", ["Berne", "Lucerne", "Genève"], "Le Tribunal fédéral siège à Lausanne (et à Lucerne pour certaines cours)."],
  ["Que faut-il pour modifier la Constitution fédérale ?", "La majorité du peuple et des cantons", ["La majorité du peuple seulement", "L’accord du Conseil fédéral", "La majorité des cantons seulement"], "Référendum obligatoire : double majorité du peuple et des cantons."],
  ["Qui élit les membres du Conseil fédéral ?", "L’Assemblée fédérale", ["Le peuple", "Les cantons", "Le Tribunal fédéral"], "L’Assemblée fédérale élit les 7 conseillers fédéraux."],
  ["Qui préside le Conseil fédéral ?", "Le président de la Confédération, élu pour 1 an", ["Un président élu pour 4 ans", "Le plus âgé des conseillers fédéraux", "Le chancelier de la Confédération"], "Un des 7 conseillers fédéraux, élu pour une année."],
];

/** Les institutions fédérales et les droits populaires. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
