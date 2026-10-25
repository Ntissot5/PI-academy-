import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Dans quel ordre le bol alimentaire traverse-t-il le tube digestif ?", "Bouche, pharynx, œsophage, estomac, intestin grêle, côlon, rectum", ["Bouche, œsophage, intestin grêle, estomac, côlon", "Bouche, trachée, estomac, côlon, intestin grêle", "Estomac, bouche, œsophage, intestin grêle, côlon"], "Le tube digestif va de la cavité buccale à l’anus."],
  ["Quels organes associés au tube digestif produisent des sucs sans être traversés par les aliments ?", "Le foie, le pancréas et les glandes salivaires", ["Les poumons et le cœur", "Les reins et la vessie", "L’estomac et l’intestin grêle"], "La bile (foie) et le suc pancréatique se déversent dans l’intestin grêle."],
  ["Mâcher et brasser les aliments, c’est la digestion…", "mécanique", ["chimique", "cellulaire", "pulmonaire"], "Dents et muscles de l’estomac découpent et mélangent."],
  ["Les enzymes des sucs digestifs découpent les grosses molécules. C’est la digestion…", "chimique", ["mécanique", "nerveuse", "musculaire"], "Les enzymes transforment l’amidon, les protéines et les graisses en petits nutriments."],
  ["Où se fait l’essentiel de l’absorption des nutriments ?", "Dans l’intestin grêle (villosités)", ["Dans l’estomac", "Dans le côlon", "Dans l’œsophage"], "Les villosités offrent une immense surface d’échange avec le sang."],
  ["Le gros intestin (côlon) absorbe surtout…", "de l’eau", ["des protéines", "du dioxygène", "des globules"], "Les restes non digérés s’y concentrent avant d’être éliminés."],
  ["Les fibres non digérées sont éliminées par l’anus. L’urée (déchet des cellules) est éliminée par…", "les reins, dans l’urine", ["l’anus, dans les selles", "les poumons", "la salive"], "Les reins filtrent le sang et éliminent les déchets du métabolisme."],
  ["Combien de cavités le cœur humain compte-t-il ?", "4 (2 oreillettes, 2 ventricules)", ["2", "3", "6"], "Le cœur droit envoie le sang aux poumons, le cœur gauche vers tout le corps."],
  ["Les vaisseaux qui partent du cœur vers les organes sont…", "les artères", ["les veines", "les bronches", "les nerfs"], "Artères : du cœur vers les organes. Veines : des organes vers le cœur."],
  ["Les vaisseaux qui ramènent le sang vers le cœur sont…", "les veines", ["les artères", "les alvéoles", "les tendons"], "Les veines ramènent le sang au cœur."],
  ["Les tout petits vaisseaux où se font les échanges avec les cellules sont…", "les capillaires", ["les artères principales", "les bronches", "les ventricules"], "La paroi très fine des capillaires laisse passer gaz et nutriments."],
  ["Le sang qui revient des poumons vers le cœur est riche en…", "dioxygène", ["dioxyde de carbone", "urée", "amidon"], "Dans les alvéoles, le sang se charge en O<sub>2</sub> et se débarrasse du CO<sub>2</sub>."],
  ["Où se font les échanges gazeux dans les poumons ?", "Dans les alvéoles pulmonaires", ["Dans la trachée", "Dans le larynx", "Dans les côtes"], "Les alvéoles sont entourées de capillaires sanguins."],
  ["Dans les alvéoles, le dioxygène passe…", "de l’air vers le sang", ["du sang vers l’air", "de l’estomac vers le sang", "de l’air vers l’estomac"], "Le CO<sub>2</sub>, lui, passe du sang vers l’air expiré."],
  ["Quel muscle, sous les poumons, permet surtout l’inspiration ?", "Le diaphragme", ["Le biceps", "Le cœur", "Le muscle de l’estomac"], "En se contractant, le diaphragme s’abaisse et l’air entre dans les poumons."],
  ["La ventilation pulmonaire, c’est…", "le renouvellement de l’air dans les poumons (inspiration, expiration)", ["la production d’énergie dans les cellules", "la digestion de l’air", "le battement du cœur"], "À ne pas confondre avec la respiration cellulaire."],
  ["La respiration cellulaire, c’est…", "la production d’énergie dans les cellules à partir de glucose et de dioxygène", ["l’entrée de l’air par le nez", "le battement du cœur", "la toux"], "Glucose + O<sub>2</sub> → CO<sub>2</sub> + eau + énergie, dans chaque cellule."],
  ["Le chemin de l’air : nez, pharynx, larynx, trachée, puis…", "bronches, bronchioles, alvéoles", ["œsophage, estomac", "artères, veines", "alvéoles, bronches, trachée"], "L’air descend par des conduits de plus en plus fins."],
];

/** Cycle 3 · systèmes digestif, cardiovasculaire et respiratoire ; excrétion ; échanges gazeux. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
