import { pick } from "../math";
import { melange, qcm, qcmFixe, saisie, tirer } from "./f-outils";
import type { Question } from "./types";

/* Graphies fondamentales : [son, graphies possibles, [mot, graphie utilisée]]. */
const GRAPHIES: readonly (readonly [string, readonly string[], readonly (readonly [string, string])[]])[] = [
  ["o", ["o", "au", "eau"], [["vélo", "o"], ["moto", "o"], ["robot", "o"], ["jaune", "au"], ["chaud", "au"], ["taupe", "au"], ["sauter", "au"], ["chapeau", "eau"], ["gâteau", "eau"], ["cadeau", "eau"], ["seau", "eau"]]],
  ["è", ["è", "ê", "ai", "ei"], [["mère", "è"], ["père", "è"], ["fête", "ê"], ["tête", "ê"], ["forêt", "ê"], ["lait", "ai"], ["fraise", "ai"], ["chaise", "ai"], ["neige", "ei"], ["baleine", "ei"], ["reine", "ei"]]],
  ["in", ["in", "ain", "ein", "im"], [["lapin", "in"], ["sapin", "in"], ["jardin", "in"], ["pain", "ain"], ["main", "ain"], ["train", "ain"], ["ceinture", "ein"], ["peinture", "ein"], ["plein", "ein"], ["timbre", "im"], ["simple", "im"]]],
  ["an", ["an", "en", "am", "em"], [["maman", "an"], ["ruban", "an"], ["orange", "an"], ["dent", "en"], ["vent", "en"], ["lampe", "am"], ["jambe", "am"], ["chambre", "am"], ["temps", "em"], ["tempête", "em"]]],
  ["k", ["c", "qu", "k"], [["sac", "c"], ["école", "c"], ["canard", "c"], ["quatre", "qu"], ["masque", "qu"], ["quille", "qu"], ["kiwi", "k"], ["koala", "k"], ["kilo", "k"]]],
  ["f", ["f", "ph"], [["fée", "f"], ["farine", "f"], ["girafe", "f"], ["phare", "ph"], ["phoque", "ph"], ["photo", "ph"], ["dauphin", "ph"]]],
  ["j", ["j", "g"], [["jupe", "j"], ["jardin", "j"], ["judo", "j"], ["girafe", "g"], ["genou", "g"], ["gilet", "g"], ["page", "g"], ["neige", "g"]]],
  ["s", ["s", "ss", "c", "ç"], [["sac", "s"], ["salade", "s"], ["poisson", "ss"], ["tasse", "ss"], ["glace", "c"], ["cerise", "c"], ["citron", "c"], ["garçon", "ç"], ["leçon", "ç"], ["maçon", "ç"]]],
  ["é", ["é", "er", "ez"], [["bébé", "é"], ["café", "é"], ["clé", "é"], ["nez", "ez"], ["chez", "ez"], ["boulanger", "er"], ["rocher", "er"], ["panier", "er"]]],
];

function graphie(): Question {
  const [son, graphies, mots] = pick(GRAPHIES);
  const [mot, g] = pick(mots);
  return qcmFixe(
    `Dans le mot <b>${mot}</b>, comment s’écrit le son « ${son} » ?`,
    g,
    graphies,
    `« ${mot} » : le son « ${son} » s’écrit « ${g} ». Le son « ${son} » peut s’écrire ${graphies.map((x) => `« ${x} »`).join(", ")}.`,
  );
}

/* Entendre un son : [son, mots qui le contiennent, mots qui ne le contiennent pas]. */
const ENTENDRE: readonly (readonly [string, readonly string[], readonly string[]])[] = [
  ["ou", ["loup", "poule", "mouton", "bouche", "genou", "soupe", "roue"], ["lune", "lapin", "vélo", "mur", "table", "sac", "pomme"]],
  ["on", ["ballon", "pont", "maison", "bonbon", "mouton", "crayon", "oncle"], ["lapin", "vache", "lune", "moto", "bol", "pomme"]],
  ["ch", ["chat", "cheval", "vache", "chocolat", "mouche", "niche"], ["sac", "singe", "zèbre", "poisson", "lune", "tasse"]],
  ["oi", ["roi", "poire", "boîte", "voiture", "étoile", "oiseau"], ["robot", "pomme", "lit", "moto", "botte", "poule"]],
  ["gn", ["montagne", "peigne", "cygne", "araignée", "ligne"], ["genou", "gâteau", "lune", "gant", "nid"]],
  ["u", ["lune", "mur", "tortue", "jupe", "plume", "rue"], ["loup", "poule", "moto", "lit", "sac", "chat"]],
  ["in", ["lapin", "sapin", "main", "pain", "timbre", "raisin"], ["lune", "ballon", "maman", "vélo", "loup"]],
  ["an", ["maman", "dent", "vent", "enfant", "lampe", "ruban"], ["lapin", "lune", "ballon", "moto", "loup"]],
];

function entendre(): Question {
  const [son, avec, sans] = pick(ENTENDRE);
  if (Math.random() < 0.6) {
    const m = pick(avec);
    return qcm(`Dans quel mot entends-tu le son « <b>${son}</b> » ?`, m, sans, `On entend « ${son} » dans « ${m} ».`, "Dis chaque mot lentement.", 3);
  }
  const m = pick(sans);
  return qcm(`Dans quel mot n’entends-tu <b>pas</b> le son « ${son} » ?`, m, avec, `Il n’y a pas de son « ${son} » dans « ${m} ».`, "Dis chaque mot lentement.", 3);
}

/* m devant m, b, p : [mot à trous (…), lettre]. */
const MBP: readonly (readonly [string, string])[] = [
  ["la…pe", "m"], ["ja…be", "m"], ["ta…bour", "m"], ["po…pier", "m"], ["o…bre", "m"], ["cha…bre", "m"], ["ja…bon", "m"], ["ti…bre", "m"],
  ["no…bre", "m"], ["si…ple", "m"], ["to…ber", "m"], ["tro…pette", "m"], ["e…porter", "m"], ["co…bien", "m"],
  ["cha…ter", "n"], ["mo…ter", "n"], ["ve…tre", "n"], ["pe…te", "n"], ["ro…de", "n"], ["ta…te", "n"], ["di…de", "n"], ["lu…di", "n"], ["e…fant", "n"], ["mo…de", "n"],
];

function mbp(): Question {
  const [trou, l] = pick(MBP);
  const mot = trou.replace("…", l);
  return qcmFixe(
    `Complète le mot avec <b>m</b> ou <b>n</b> : <b>${trou}</b>`,
    l,
    ["m", "n"],
    l === "m" ? `« ${mot} » : devant m, b et p, on écrit « m ».` : `« ${mot} » : on écrit « n », car la lettre suivante n’est ni m, ni b, ni p.`,
    "Regarde la lettre qui suit le trou.",
  );
}

/* Lettre muette finale : [mot, lettre muette, mot de la même famille qui la fait entendre]. */
const MUETTES: readonly (readonly [string, string, string])[] = [
  ["chat", "t", "chaton"], ["lit", "t", "literie"], ["loup", "p", "louve"], ["dos", "s", "dossier"], ["lait", "t", "laitier"],
  ["sirop", "p", "siroter"], ["tapis", "s", "tapisser"], ["canard", "d", "canarder"].slice(0, 2) as unknown as [string, string, string],
  ["grand", "d", "grande"], ["petit", "t", "petite"], ["gros", "s", "grosse"], ["bavard", "d", "bavarde"], ["chaud", "d", "chaude"],
  ["blanc", "c", "blanche"], ["galop", "p", "galoper"], ["bond", "d", "bondir"], ["rang", "g", "ranger"], ["camp", "p", "camper"],
  ["sport", "t", "sportif"], ["haricot", "t", "haricots"].slice(0, 2) as unknown as [string, string, string], ["bois", "s", "boiserie"],
];

function muette(): Question {
  const [mot, l, famille] = pick(MUETTES.filter((x) => x.length === 3));
  return saisie(
    `Quelle lettre ne se prononce pas à la fin du mot <b>${mot}</b> ?`,
    l,
    `« ${mot} » finit par un « ${l} » muet ; on l’entend dans « ${famille} ».`,
    [],
    "Cherche un mot de la même famille, ou le féminin.",
  );
}

/* Combinatoire : [lettres à assembler, syllabe lue, pièges]. */
const FUSION: readonly (readonly [string, string, string, readonly string[]])[] = [
  ["ch", "a", "cha", ["ca", "sa"]], ["m", "ou", "mou", ["mo", "nou"]], ["p", "i", "pi", ["bi", "qi"]], ["l", "u", "lu", ["lo", "lou"]],
  ["r", "o", "ro", ["ra", "or"]], ["v", "é", "vé", ["fé", "ve"]], ["t", "on", "ton", ["tan", "don"]], ["f", "in", "fin", ["fan", "vin"]],
  ["b", "an", "ban", ["dan", "bon"]], ["s", "oi", "soi", ["so", "si"]], ["j", "ou", "jou", ["chou", "jo"]], ["n", "a", "na", ["ma", "an"]],
  ["g", "a", "ga", ["ja", "ca"]], ["d", "é", "dé", ["bé", "té"]], ["qu", "i", "qui", ["ki", "gui"]].slice(0, 0) as unknown as [string, string, string, string[]],
];

function fusion(): Question {
  const [c, v, syl, autres] = pick(FUSION.filter((x) => x.length === 4));
  return qcm(
    `Assemble les lettres <b>${c}</b> et <b>${v}</b> : quelle syllabe lis-tu ?`,
    syl,
    autres,
    `« ${c} » + « ${v} » = « ${syl} ».`,
    undefined,
    3,
  );
}

/** Sons et lettres : correspondance entre ce qu'on entend et ce qu'on écrit. */
export function gen(): Question {
  return tirer([graphie, graphie, entendre, entendre, mbp, muette, fusion]);
}

export const _test = { melange };
