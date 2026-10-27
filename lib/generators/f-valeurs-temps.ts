import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const C2: readonly Item[] = [
  ["*Il pleuvait depuis le matin. Tout à coup, le tonnerre gronda.* Pourquoi « pleuvait » est-il à l’imparfait ?", "il décrit l’arrière-plan, une action qui dure", ["il raconte une action soudaine", "il exprime un ordre", "il exprime l’avenir"], "L’imparfait décrit le décor ou une action qui dure ; le passé simple (gronda) raconte une action soudaine de premier plan."],
  ["*Il pleuvait depuis le matin. Tout à coup, le tonnerre gronda.* Pourquoi « gronda » est-il au passé simple ?", "il raconte une action soudaine, de premier plan", ["il décrit le décor", "il exprime une habitude", "il exprime une vérité générale"], "Le passé simple fait avancer le récit ; l’imparfait décrit l’arrière-plan."],
  ["*Mon chat fait sa toilette.* Le présent exprime…", "une action en train de se faire", ["une vérité générale", "une habitude passée", "un futur proche"], "Présent temporel : l’action se passe au moment où l’on parle."],
  ["*Le chat est un mammifère.* Le présent exprime…", "une vérité générale", ["une action en train de se faire", "un futur proche", "une action passée"], "Présent atemporel : c’est vrai tout le temps."],
  ["*Lorsque je me suis réveillé, il avait neigé.* L’action « avait neigé » est…", "antérieure au réveil", ["simultanée au réveil", "postérieure au réveil"], "Le plus-que-parfait exprime une action accomplie avant une autre action passée."],
  ["*Lorsque je me suis réveillé, il neigeait.* L’action « neigeait » est…", "simultanée au réveil", ["antérieure au réveil", "postérieure au réveil"], "L’imparfait exprime une action en cours au même moment."],
  ["*Quand tu auras fini, tu pourras sortir.* L’action « auras fini » est…", "antérieure à « pourras sortir »", ["simultanée à « pourras sortir »", "postérieure à « pourras sortir »"], "Le futur antérieur exprime une action future accomplie avant une autre."],
  ["*Si j’avais le temps, je viendrais.* Le conditionnel exprime…", "une action soumise à une condition", ["un fait certain", "un ordre", "une action passée"], "Valeur modale du conditionnel : l’action dépend d’une condition."],
  ["*Il a dit qu’il viendrait.* Le conditionnel « viendrait » exprime…", "un futur vu depuis le passé", ["une condition", "un souhait poli", "une action certaine"], "Valeur temporelle : c’est le futur dans le passé."],
  ["*Je voudrais un verre d’eau, s’il vous plaît.* Le conditionnel exprime…", "une demande polie", ["un futur dans le passé", "une condition", "une action passée"], "Le conditionnel de politesse atténue la demande."],
];
const C3: readonly Item[] = [
  ["Dans un récit au passé, *Il faisait nuit. Soudain, un cri retentit.* « faisait » est à l’imparfait parce qu’il…", "décrit le décor, l’arrière-plan", ["raconte une action soudaine", "exprime une vérité générale", "donne un ordre"], "Imparfait : arrière-plan, description, durée. Passé simple : actions de premier plan."],
  ["Dans *Il faisait nuit. Soudain, un cri retentit.*, « retentit » est au passé simple parce qu’il…", "raconte une action ponctuelle de premier plan", ["décrit le décor", "exprime une habitude", "exprime un futur"], "Le passé simple fait avancer le récit."],
  ["*En 1291, les Waldstätten concluent une alliance.* Quel est ce présent ?", "un présent de narration", ["un présent de vérité générale", "un présent d’habitude", "un présent d’énonciation"], "Le présent de narration raconte un fait passé pour le rendre plus vivant."],
  ["*Chaque matin, je prends le bus de 7 h 20.* Quel est ce présent ?", "un présent d’habitude", ["un présent de narration", "un présent de vérité générale", "un présent d’énonciation"], "Il exprime une action qui se répète."],
  ["*L’eau bout à 100 degrés au niveau de la mer.* Quel est ce présent ?", "un présent de vérité générale", ["un présent d’habitude", "un présent de narration", "un futur proche"], "C’est vrai en tout temps."],
  ["*Attends, j’arrive !* Quel est ce présent ?", "un présent à valeur de futur proche", ["un présent de vérité générale", "un présent de narration", "un présent d’habitude"], "« j’arrive » annonce une action qui va se produire tout de suite."],
  ["Choisis la bonne forme : *Il savait que son ami … la veille.* (antériorité)", "était parti", ["partira", "partirait", "part"], "Une action antérieure à une action passée se met au plus-que-parfait."],
  ["Choisis la bonne forme : *Elle pensait que le train … bientôt.* (postériorité)", "arriverait", ["arrivera", "était arrivé", "arrive"], "Une action postérieure à une action passée se met au conditionnel présent (futur du passé)."],
  ["Choisis la bonne forme : *Je crois qu’il … en ce moment.* (simultanéité)", "dort", ["dormait", "avait dormi", "dormirait"], "Verbe principal au présent, simultanéité : présent."],
];

export function gen2(): Question {
  return tirer([deBanque(C2)]);
}

/** Valeurs des temps : présent, imparfait / passé simple, concordance des temps. */
export function gen3(): Question {
  return tirer([deBanque(C3), deBanque(C3), deBanque(C2)]);
}
