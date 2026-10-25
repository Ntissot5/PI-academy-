import { pick } from "../math";
import { qcm } from "./f-outils";
import type { Question } from "./types";

/* Mots fréquents et mots-outils : [bonne orthographe, pièges, phrase d'emploi]. */
const MOTS: readonly (readonly [string, readonly string[], string])[] = [
  ["parce que", ["parceque", "parsque", "parce-que"], "Je reste à la maison parce que je suis malade."],
  ["beaucoup", ["boucoup", "beaucou", "baucoup"], "J’aime beaucoup le chocolat."],
  ["toujours", ["toujour", "toujoure", "toujourt"], "Il arrive toujours à l’heure."],
  ["maintenant", ["maintenan", "maintenent", "mintenant"], "Maintenant, nous allons lire."],
  ["aujourd’hui", ["aujourdhui", "aujour d’hui", "aujourd’ui"], "Aujourd’hui, il fait beau."],
  ["quelquefois", ["quelque fois", "quelquefoi", "quelque-fois"], "Je vais quelquefois à la piscine."],
  ["longtemps", ["longtemp", "lontemps", "longtant"], "Il a attendu longtemps."],
  ["pendant", ["pandant", "pendent", "pendan"], "Il a dormi pendant le film."],
  ["ensuite", ["ansuite", "ensuitte", "ensuit"], "Ensuite, nous avons mangé."],
  ["souvent", ["souvant", "souven", "souvend"], "Il pleut souvent en automne."],
  ["comme", ["come", "comm", "commes"], "Il court comme un lapin."],
  ["sans", ["san", "sens", "cent"], "Il est parti sans son sac."],
  ["dans", ["dant", "dens", "dan"], "Le chat dort dans son panier."],
  ["avec", ["avek", "avecque", "avèc"], "Je joue avec mon frère."],
  ["après", ["aprés", "apprès", "aprè"], "Après l’école, je fais mes devoirs."],
  ["déjà", ["déja", "dèjà", "dejà"], "Tu as déjà fini ?"],
  ["voilà", ["voila", "voilat", "voilàs"], "Voilà ton livre."],
  ["très", ["trés", "trais", "trè"], "Ce gâteau est très bon."],
  ["hier", ["hièr", "yer", "hiers"], "Hier, nous sommes allés au zoo."],
  ["demain", ["demin", "deumain", "demein"], "Demain, il neigera."],
  ["ensemble", ["ansemble", "ensembl", "ensamble"], "Nous chantons ensemble."],
  ["quand", ["quant", "kand", "quan"], "Quand il pleut, je prends mon parapluie."],
  ["chez", ["ché", "chés", "chèz"], "Je vais chez ma grand-mère."],
  ["jamais", ["jamai", "jamès", "jammais"], "Il n’est jamais en retard."],
];

const maj = (s: string): string => s[0].toUpperCase() + s.slice(1);

/** Orthographe des mots fréquents et des mots-outils. */
export function gen(): Question {
  const [m, faux, phrase] = pick(MOTS);
  const debut = phrase.startsWith(maj(m));
  const bon = debut ? maj(m) : m;
  const trou = debut ? "…" + phrase.slice(m.length) : phrase.replace(m, "…");
  return qcm(
    `Choisis la bonne orthographe : <b>${trou}</b>`,
    bon,
    debut ? faux.map(maj) : faux,
    `« ${m} » : c’est un mot très fréquent, à connaître par cœur.`,
  );
}
