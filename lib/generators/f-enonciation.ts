import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const DEICT: readonly Item[] = [
  ["Sur un billet trouvé par terre : *Je reviens demain.* Pourquoi ne sait-on pas quand la personne revient ?", "« demain » dépend du jour où le billet a été écrit", ["« je » désigne toujours le lecteur", "le verbe est mal conjugué", "il manque un point d’exclamation"], "« demain » est un déictique : il n’a de sens que par rapport à la situation d’énonciation (qui écrit, quand, où)."],
  ["Quel mot est un déictique (il ne se comprend que si l’on connaît la situation) ?", "ici", ["à Lausanne", "le 3 mars 2025", "la gare de Berne"], "« ici » désigne le lieu où se trouve celui qui parle."],
  ["Quel mot est un déictique ?", "aujourd’hui", ["le 1<sup>er</sup> août", "en 1291", "le lendemain"], "« aujourd’hui » dépend du jour où l’on parle ; « le lendemain » se comprend par rapport au récit."],
  ["Quel mot est un déictique ?", "maintenant", ["à ce moment-là", "la veille", "ce jour-là"], "« maintenant » dépend du moment où l’on parle."],
  ["Dans un récit au passé, quelle expression remplace « demain » ?", "le lendemain", ["hier", "aujourd’hui", "maintenant"], "Coupé de la situation d’énonciation, le récit emploie « le lendemain »."],
];
const ANCRAGE: readonly Item[] = [
  ["*Hier, j’ai vu ton frère ici.* Cet énoncé est…", "ancré dans la situation d’énonciation", ["coupé de la situation d’énonciation"], "« hier », « je », « ton », « ici » renvoient à celui qui parle et au moment où il parle."],
  ["*En 1515, les Confédérés furent battus à Marignan.* Cet énoncé est…", "coupé de la situation d’énonciation", ["ancré dans la situation d’énonciation"], "Aucune marque de « je/tu », ni d’« ici/maintenant » : l’énoncé se comprend sans connaître celui qui parle."],
  ["*Je vous écris de Sion, où il neige depuis ce matin.* Cet énoncé est…", "ancré dans la situation d’énonciation", ["coupé de la situation d’énonciation"], "« je », « vous », « ce matin » renvoient à la situation de celui qui écrit."],
  ["*Le loup vivait au fond des bois. Ce jour-là, il avait faim.* Cet énoncé est…", "coupé de la situation d’énonciation", ["ancré dans la situation d’énonciation"], "Récit à la 3e personne, au passé simple et à l’imparfait, avec « ce jour-là »."],
];
const ACTES: readonly Item[] = [
  ["*Pourriez-vous fermer la fenêtre, s’il vous plaît ?* Que veut obtenir la personne ?", "que l’on ferme la fenêtre", ["savoir si l’on est capable de la fermer", "donner une information", "exprimer sa joie"], "La phrase est interrogative, mais c’est une demande polie d’agir."],
  ["*Il fait froid ici…* (dit en regardant la fenêtre ouverte). Que veut sans doute la personne ?", "qu’on ferme la fenêtre", ["donner la météo", "poser une question", "féliciter quelqu’un"], "Une phrase déclarative peut cacher une demande : c’est un acte de parole indirect."],
  ["*Défense de fumer.* Quel acte de parole est accompli ?", "une interdiction", ["une question", "une promesse", "une excuse"], "Le texte règle un comportement : il interdit."],
  ["*Je te promets de venir.* Quel acte de parole est accompli ?", "une promesse", ["un ordre", "une question", "un reproche"], "En disant « je promets », on accomplit l’acte de promettre."],
];

/** Énonciation : déictiques, énoncé ancré ou coupé, actes de parole. */
export function gen(): Question {
  return tirer([deBanque(DEICT), deBanque(ANCRAGE), deBanque(ACTES)]);
}
