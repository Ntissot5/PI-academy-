import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["La Suisse est-elle membre de l’Union européenne ?", "Non, elle a des accords bilatéraux avec l’UE", ["Oui, depuis 1992", "Oui, depuis 2002", "Oui, elle l’a fondée"], "La Suisse n’est pas membre de l’UE ; ses relations reposent sur des accords bilatéraux."],
  ["La Suisse fait-elle partie de l’espace Schengen ?", "Oui", ["Non", "Seulement le Tessin", "Seulement pour les marchandises"], "La Suisse applique les accords de Schengen depuis 2008 : pas de contrôle systématique des personnes aux frontières intérieures."],
  ["Quelle monnaie utilise-t-on en Suisse ?", "Le franc suisse", ["L’euro", "Le dollar", "La livre"], "La Suisse ne fait pas partie de la zone euro."],
  ["En quelle année la Suisse est-elle devenue membre de l’ONU ?", "2002", ["1945", "1971", "1848"], "Après une votation populaire en mars 2002."],
  ["Quelle ville suisse accueille le siège européen de l’ONU ?", "Genève", ["Berne", "Zurich", "Bâle"], "Le Palais des Nations est à Genève."],
  ["Où se trouve le siège de l’Organisation mondiale de la santé (OMS) ?", "À Genève", ["À New York", "À Paris", "À Berne"], "Genève accueille de nombreuses organisations internationales."],
  ["Qui a fondé la Croix-Rouge, à Genève, en 1863 ?", "Henry Dunant (avec d’autres Genevois)", ["Jean Calvin", "Guillaume Tell", "Le général Dufour seul"], "Le Comité international de la Croix-Rouge (CICR) aide les victimes de conflits."],
  ["Le CICR (Comité international de la Croix-Rouge) a pour mission…", "de protéger et d’assister les victimes des guerres", ["de vendre des médicaments", "d’organiser les Jeux olympiques", "de surveiller les élections suisses"], "Il veille aussi au respect des conventions de Genève."],
  ["Depuis quand la Suisse est-elle membre du Conseil de l’Europe ?", "1963", ["2002", "1848", "1992"], "Le Conseil de l’Europe défend les droits humains et la démocratie (siège à Strasbourg)."],
  ["À quoi sert une ambassade suisse à l’étranger ?", "À représenter la Suisse auprès du gouvernement d’un autre pays", ["À vendre du chocolat", "À accueillir les touristes étrangers en Suisse", "À juger les Suisses à l’étranger"], "L’ambassade est la représentation diplomatique, en général dans la capitale."],
  ["Un consulat aide surtout…", "les Suisses qui vivent ou voyagent à l’étranger (passeport, aide)", ["les entreprises à payer moins d’impôts", "les sportifs à gagner", "les cantons à voter"], "Le consulat offre des services aux ressortissants."],
  ["La Direction du développement et de la coopération (DDC) s’occupe…", "de l’aide au développement et de l’aide humanitaire de la Suisse", ["des routes nationales", "des écoles primaires", "de l’armée"], "La DDC fait partie du Département fédéral des affaires étrangères."],
  ["Greenpeace et Amnesty International sont…", "des organisations non gouvernementales (ONG)", ["des agences de l’ONU", "des partis politiques suisses", "des entreprises d’État"], "Les ONG sont indépendantes des gouvernements."],
  ["Amnesty International agit surtout pour…", "la défense des droits humains", ["la protection des forêts uniquement", "le commerce mondial", "le sport"], "Elle dénonce par exemple la torture et les emprisonnements injustes."],
  ["Quelle organisation internationale a son siège à Genève et règle le commerce mondial ?", "L’OMC (Organisation mondiale du commerce)", ["L’OTAN", "L’UNESCO", "La FIFA"], "L’OMC fixe des règles pour les échanges entre pays."],
  ["La neutralité suisse signifie que la Suisse…", "ne participe pas aux conflits armés entre États", ["n’a pas d’armée", "n’a aucune relation avec les autres pays", "ne commerce pas avec l’étranger"], "Sa neutralité a été reconnue par les puissances européennes en 1815."],
];

/** Cycle 3 · la Suisse et le monde : UE, Schengen, ONU, organisations internationales, ONG, diplomatie. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
