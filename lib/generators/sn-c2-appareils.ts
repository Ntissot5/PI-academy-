import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Dans quel ordre les aliments passent-ils dans le tube digestif ?", "Bouche, œsophage, estomac, intestin grêle, gros intestin", ["Bouche, estomac, œsophage, gros intestin, intestin grêle", "Bouche, poumons, estomac, intestins", "Œsophage, bouche, intestin grêle, estomac, gros intestin"], "Les aliments descendent de la bouche à l’anus, toujours dans cet ordre."],
  ["Quel tuyau relie la bouche à l’estomac ?", "L’œsophage", ["La trachée", "L’intestin grêle", "Une artère"], "L’œsophage conduit les aliments jusqu’à l’estomac ; la trachée conduit l’air."],
  ["Où les nutriments passent-ils dans le sang ?", "Dans l’intestin grêle", ["Dans l’œsophage", "Dans la bouche", "Dans les poumons"], "La paroi de l’intestin grêle laisse passer les nutriments dans le sang."],
  ["Que font les dents ?", "Elles coupent et broient les aliments", ["Elles digèrent les graisses", "Elles absorbent l’eau", "Elles filtrent le sang"], "C’est la digestion mécanique : mâcher en petits morceaux."],
  ["La salive et les sucs digestifs transforment les aliments. C’est la digestion…", "chimique", ["mécanique", "électrique", "magnétique"], "Mâcher, c’est mécanique ; les sucs qui « découpent » les aliments, c’est chimique."],
  ["Que devient ce que l’intestin n’absorbe pas ?", "Il est éliminé par l’anus (les selles)", ["Il va dans les poumons", "Il reste dans l’estomac pour toujours", "Il devient du sang"], "Les restes non digérés sont éliminés."],
  ["Le sang transporte les nutriments de l’intestin…", "vers toutes les parties du corps", ["seulement vers les dents", "vers l’extérieur du corps", "seulement vers l’estomac"], "L’appareil digestif et l’appareil circulatoire travaillent ensemble."],
  ["Quel est le chemin de l’air quand on inspire ?", "Nez ou bouche, trachée, bronches, poumons", ["Bouche, œsophage, estomac", "Nez, cerveau, poumons", "Poumons, bronches, trachée, nez"], "L’air descend par la trachée, puis les bronches, jusqu’aux poumons."],
  ["Quel gaz de l’air le corps utilise-t-il quand on respire ?", "Le dioxygène (oxygène)", ["Le dioxyde de carbone", "L’hélium", "La vapeur d’eau seulement"], "Les poumons font passer le dioxygène de l’air dans le sang."],
  ["Quel gaz rejette-t-on en expirant, plus que dans l’air qu’on inspire ?", "Le dioxyde de carbone (CO₂)", ["Le dioxygène", "L’azote", "L’hydrogène"], "Le corps produit du CO₂ ; le sang l’apporte aux poumons, qui le rejettent."],
  ["Après une course, ta respiration et ton cœur…", "accélèrent", ["ralentissent", "s’arrêtent un moment", "ne changent pas"], "Les muscles ont besoin de plus d’oxygène : on respire plus vite et le cœur bat plus vite."],
  ["Où peut-on sentir les battements du cœur (le pouls) ?", "Au poignet ou au cou", ["Aux ongles", "Aux cheveux", "Aux dents"], "Le pouls se sent là où une artère passe près de la peau."],
  ["Le cœur bat 20 fois en 15 secondes. Combien de battements par minute ?", "80", ["20", "35", "60"], "1 minute = 4 × 15 s, donc 20 × 4 = 80 battements par minute."],
  ["Le cœur bat 18 fois en 15 secondes. Combien de battements par minute ?", "72", ["18", "54", "90"], "18 × 4 = 72 battements par minute."],
  ["Comment s’appelle l’ensemble des os du corps ?", "Le squelette", ["La musculature", "Le système nerveux", "La peau"], "Le squelette soutient le corps et protège les organes."],
  ["Quel est l’os de la cuisse ?", "Le fémur", ["Le crâne", "La côte", "La vertèbre"], "Le fémur est l’os le plus long du corps."],
  ["Comment s’appelle la colonne d’os de notre dos ?", "La colonne vertébrale", ["Le bassin", "Le fémur", "Le sternum"], "Elle est faite de vertèbres empilées et protège la moelle épinière."],
  ["Quels os forment la cage thoracique ?", "Les côtes (avec le sternum)", ["Les vertèbres du cou", "Les phalanges", "Le fémur et le tibia"], "Les côtes s’attachent à la colonne et au sternum."],
  ["Un endroit où deux os se rejoignent et bougent, c’est…", "une articulation", ["un muscle", "un tendon", "un organe"], "Genou, coude, épaule, hanche : ce sont des articulations."],
  ["Plier le bras au coude, c’est une…", "flexion", ["extension", "rotation complète", "translation"], "Plier = flexion ; tendre = extension."],
  ["Quel muscle se contracte (gonfle) quand tu plies le bras ?", "Le biceps (devant le bras)", ["Le triceps (derrière le bras)", "Le mollet", "Le cœur"], "Le biceps se raccourcit et tire l’avant-bras vers le haut."],
  ["Quel muscle se contracte quand tu tends le bras ?", "Le triceps (derrière le bras)", ["Le biceps", "Le mollet", "Le diaphragme"], "Les muscles marchent par paires : biceps pour plier, triceps pour tendre."],
  ["Qu’est-ce qui attache un muscle à un os ?", "Un tendon", ["Un ongle", "Un nerf", "Une veine"], "Le tendon relie le muscle à l’os, comme une corde."],
  ["Le genou bouge-t-il dans toutes les directions, comme l’épaule ?", "Non, il plie et se tend surtout dans un seul axe", ["Oui, exactement comme l’épaule", "Non, il ne bouge pas du tout", "Oui, il tourne sur lui-même"], "Le genou bouge surtout dans un seul axe ; l’épaule bouge dans plusieurs directions."],
  ["Comme l’Homme, le chat, l’oiseau et le poisson ont…", "un squelette intérieur avec une colonne vertébrale", ["une coquille", "six pattes", "un squelette extérieur"], "Ce sont des vertébrés : ils ont des vertèbres."],
];

/** Cycle 2 · appareils digestif et respiratoire, cœur et pouls, squelette, articulations et muscles. */
export function gen(): Question {
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
