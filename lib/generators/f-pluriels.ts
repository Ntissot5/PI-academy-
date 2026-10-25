import { pick } from "../math";
import { qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* [singulier, pluriel, règle]. */
const NOMS: readonly (readonly [string, string, string])[] = [
  ["un bateau", "des bateaux", "Les noms en -eau prennent un x au pluriel."], ["un chapeau", "des chapeaux", "Les noms en -eau prennent un x au pluriel."],
  ["un tuyau", "des tuyaux", "Les noms en -au prennent un x au pluriel (sauf landau, sarrau)."], ["un noyau", "des noyaux", "Les noms en -au prennent un x au pluriel."],
  ["un landau", "des landaus", "« Landau » fait exception : il prend un s."],
  ["un cheveu", "des cheveux", "Les noms en -eu prennent un x au pluriel."], ["un jeu", "des jeux", "Les noms en -eu prennent un x au pluriel."],
  ["un neveu", "des neveux", "Les noms en -eu prennent un x au pluriel."], ["un pneu", "des pneus", "« Pneu » fait exception : il prend un s (comme bleu)."],
  ["un bijou", "des bijoux", "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un caillou", "des cailloux", "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un genou", "des genoux", "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un hibou", "des hiboux", "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un chou", "des choux", "Sept noms en -ou prennent un x : bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un trou", "des trous", "Les noms en -ou prennent un s, sauf bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un clou", "des clous", "Les noms en -ou prennent un s, sauf bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un kangourou", "des kangourous", "Les noms en -ou prennent un s, sauf bijou, caillou, chou, genou, hibou, joujou, pou."],
  ["un cheval", "des chevaux", "Les noms en -al font leur pluriel en -aux."], ["un journal", "des journaux", "Les noms en -al font leur pluriel en -aux."],
  ["un animal", "des animaux", "Les noms en -al font leur pluriel en -aux."], ["un canal", "des canaux", "Les noms en -al font leur pluriel en -aux."],
  ["un hôpital", "des hôpitaux", "Les noms en -al font leur pluriel en -aux."],
  ["un bal", "des bals", "Exceptions en -al qui prennent un s : bal, carnaval, chacal, festival, récital, régal."],
  ["un carnaval", "des carnavals", "Exceptions en -al qui prennent un s : bal, carnaval, chacal, festival, récital, régal."],
  ["un festival", "des festivals", "Exceptions en -al qui prennent un s : bal, carnaval, chacal, festival, récital, régal."],
  ["un travail", "des travaux", "Quelques noms en -ail font -aux : bail, corail, émail, soupirail, travail, vitrail."],
  ["un vitrail", "des vitraux", "Quelques noms en -ail font -aux : bail, corail, émail, soupirail, travail, vitrail."],
  ["un corail", "des coraux", "Quelques noms en -ail font -aux : bail, corail, émail, soupirail, travail, vitrail."],
  ["un rail", "des rails", "La plupart des noms en -ail prennent un s."], ["un détail", "des détails", "La plupart des noms en -ail prennent un s."],
  ["un portail", "des portails", "La plupart des noms en -ail prennent un s."], ["un éventail", "des éventails", "La plupart des noms en -ail prennent un s."],
];

function nom(): Question {
  const [s, p, regle] = pick(NOMS);
  return saisie(`Écris ce nom au pluriel : <b>${s}</b> → des …`, p.replace("des ", ""), `${p}. ${regle}`, [p], "Écris seulement le nom.");
}

/* Adjectifs en -al et -eu : [nom pluriel, adjectif, bonne forme, autre forme, règle]. */
const ADJ: readonly (readonly [string, string, string, string, string])[] = [
  ["des parcs", "national", "nationaux", "nationals", "La plupart des adjectifs en -al font -aux au masculin pluriel."],
  ["des projets", "original", "originaux", "originals", "La plupart des adjectifs en -al font -aux au masculin pluriel."],
  ["des amis", "génial", "géniaux", "génials", "La plupart des adjectifs en -al font -aux au masculin pluriel."],
  ["des problèmes", "banal", "banals", "banaux", "Exceptions : banal, bancal, fatal, naval font -als."],
  ["des chantiers", "naval", "navals", "navaux", "Exceptions : banal, bancal, fatal, naval font -als."],
  ["des yeux", "bleu", "bleus", "bleux", "Les adjectifs en -eu prennent un s (bleus), sauf hébreu."],
  ["des pulls", "bleu", "bleus", "bleux", "Les adjectifs en -eu prennent un s (bleus), sauf hébreu."],
  ["des événements", "régional", "régionaux", "régionals", "La plupart des adjectifs en -al font -aux au masculin pluriel."],
];

function adjectif(): Question {
  const [n, adj, bon, faux, regle] = pick(ADJ);
  return qcmFixe(`Accorde l’adjectif <b>${adj}</b> : <b>${n} …</b>`, bon, [bon, faux].sort(), `${n} ${bon}. ${regle}`);
}

/* Adjectifs de couleur : [groupe, bonne forme, autre forme, règle]. */
const COUL: readonly (readonly [string, string, string, string])[] = [
  ["des robes …", "orange", "oranges", "« Orange » est aussi le nom d’un fruit : comme adjectif de couleur, il reste invariable."],
  ["des pulls …", "marron", "marrons", "« Marron » est un nom employé comme couleur : invariable."],
  ["des chemises …", "kaki", "kakis", "« Kaki » est invariable."],
  ["des yeux …", "bleu clair", "bleus clairs", "Couleur composée de deux mots : invariable."],
  ["des rideaux …", "vert foncé", "verts foncés", "Couleur composée de deux mots : invariable."],
  ["des écharpes …", "roses", "rose", "Exception : « rose » s’accorde, comme mauve, fauve, écarlate, pourpre."],
  ["des voitures …", "noires", "noire", "Un adjectif de couleur simple s’accorde avec le nom."],
  ["des feuilles …", "jaunes", "jaune", "Un adjectif de couleur simple s’accorde avec le nom."],
  ["des fleurs …", "mauves", "mauve", "Exception : « mauve » s’accorde, comme rose, fauve, écarlate, pourpre."],
  ["des chaussettes …", "vertes", "verte", "Un adjectif de couleur simple s’accorde avec le nom."],
];

function couleur(): Question {
  const [g, bon, faux, regle] = pick(COUL);
  return qcmFixe(`Choisis la bonne écriture : <b>${g}</b>`, bon, [bon, faux].sort(), regle);
}

/* Déterminants numéraux : [phrase à trou, bonne forme, autre, règle]. */
const NUM: readonly (readonly [string, string, string, string])[] = [
  ["Il y a … élèves dans l’école.", "quatre-vingts", "quatre-vingt", "« Vingt » prend un s quand il est multiplié et termine le nombre : quatre-vingts."],
  ["Mon grand-père a … ans.", "quatre-vingt-deux", "quatre-vingts-deux", "« Vingt » ne prend pas de s s’il est suivi d’un autre nombre : quatre-vingt-deux."],
  ["Ce livre a … pages.", "deux cents", "deux cent", "« Cent » prend un s quand il est multiplié et termine le nombre : deux cents."],
  ["Le billet coûte … francs.", "trois cent cinquante", "trois cents cinquante", "« Cent » ne prend pas de s s’il est suivi d’un autre nombre."],
  ["Le Cervin mesure plus de quatre … mètres.", "mille", "milles", "« Mille » est toujours invariable."],
  ["La salle compte … places.", "six cents", "six cent", "« Cent » multiplié et en fin de nombre prend un s : six cents."],
];

function numeral(): Question {
  const [p, bon, faux, regle] = pick(NUM);
  return qcmFixe(`Choisis la bonne écriture : <b>${p}</b>`, bon, [bon, faux].sort(), `${p.replace("…", bon)} ${regle}`);
}

/* Féminin des noms et des adjectifs : [masculin, féminin]. */
const FEM: readonly (readonly [string, string])[] = [
  ["un acteur", "une actrice"], ["un directeur", "une directrice"], ["un chanteur", "une chanteuse"], ["un boulanger", "une boulangère"],
  ["un paysan", "une paysanne"], ["un gardien", "une gardienne"], ["un musicien", "une musicienne"], ["un lion", "une lionne"],
  ["un loup", "une louve"], ["un jumeau", "une jumelle"], ["un veuf", "une veuve"], ["un roi", "une reine"],
  ["sportif", "sportive"], ["doux", "douce"], ["faux", "fausse"], ["public", "publique"], ["sec", "sèche"], ["fou", "folle"],
  ["frais", "fraîche"], ["long", "longue"], ["gentil", "gentille"], ["pareil", "pareille"], ["vieux", "vieille"], ["bas", "basse"],
  ["épais", "épaisse"], ["inquiet", "inquiète"], ["complet", "complète"], ["heureux", "heureuse"], ["cruel", "cruelle"], ["ancien", "ancienne"],
];

function feminin(): Question {
  const [m, f] = pick(FEM);
  const nom = m.startsWith("un ");
  return saisie(
    `Écris au féminin : <b>${m}</b>${nom ? " → une …" : ""}`,
    f.replace("une ", ""),
    `${m} → ${f}.`,
    [f, ...(f === "fraîche" ? ["fraiche"] : [])],
    nom ? "Écris seulement le nom." : undefined,
  );
}

/** Pluriel des noms et adjectifs, couleurs, numéraux, féminin. */
export function gen(): Question {
  return tirer([nom, nom, adjectif, couleur, numeral, feminin, feminin]);
}
