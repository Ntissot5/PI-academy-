import { R, fr, pick, tolAbs } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const ITEMS: [string, string, string[], string][] = [
  ["Quelle est l’unité de la force dans le Système international ?", "Le newton (N)", ["Le kilogramme (kg)", "Le joule (J)", "Le watt (W)"], "Une force se mesure en newtons, avec un dynamomètre."],
  ["La masse d’un astronaute sur la Lune, comparée à sur Terre, est…", "la même", ["6 fois plus petite", "égale à zéro", "6 fois plus grande"], "La masse (quantité de matière) ne change pas ; c’est son poids qui est environ 6 fois plus petit sur la Lune."],
  ["Le poids d’un astronaute sur la Lune, comparé à sur Terre, est…", "environ 6 fois plus petit", ["le même", "6 fois plus grand", "nul"], "L’attraction de la Lune est environ 6 fois plus faible que celle de la Terre."],
  ["Avec quel instrument mesure-t-on un poids (une force) ?", "Un dynamomètre", ["Une balance à plateaux", "Un baromètre", "Un thermomètre"], "Le dynamomètre contient un ressort qui s’allonge selon la force."],
  ["Un livre est posé immobile sur une table. Quelle force compense son poids ?", "La force de soutien de la table (réaction)", ["La force de frottement", "La poussée d’Archimède", "Aucune"], "Immobile : les forces se compensent. La table pousse vers le haut autant que le poids tire vers le bas."],
  ["Un bateau flotte sur l’eau. Quelle force compense son poids ?", "La poussée d’Archimède", ["La force motrice", "Le frottement de l’air", "La force magnétique"], "L’eau pousse le bateau vers le haut."],
  ["Un vélo ralentit quand on arrête de pédaler sur du plat. À cause de quelle force ?", "Les frottements (air, sol)", ["Son poids", "La poussée d’Archimède", "La force de soutien"], "Les frottements s’opposent au mouvement."],
  ["1re loi de Newton : si les forces sur un objet se compensent, l’objet…", "reste immobile ou garde un mouvement rectiligne à vitesse constante", ["accélère toujours", "s’arrête toujours", "tourne en rond"], "C’est le principe d’inertie."],
  ["Dans un bus qui freine brusquement, ton corps part vers l’avant. Pourquoi ?", "Par inertie, ton corps tend à garder sa vitesse", ["Le bus te pousse", "Ton poids augmente", "L’air te pousse"], "Sans force pour le retenir, le corps continue sur sa lancée : d’où la ceinture de sécurité."],
  ["Sur un schéma, comment représente-t-on une force ?", "Par une flèche (direction, sens, intensité)", ["Par un point", "Par un cercle", "Par une ligne pointillée sans flèche"], "La longueur de la flèche représente l’intensité de la force."],
  ["Une voiture qui démarre et prend de la vitesse…", "accélère", ["a une vitesse constante", "est immobile", "freine"], "L’accélération est le changement de vitesse."],
];

/** Cycle 3 · mécanique : vitesse, poids et masse, forces, 1re loi de Newton. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const v = pick([4, 5, 6, 8, 10, 12, 15, 20]), tt = pick([10, 20, 30, 40, 60]);
    return { q: `Un cycliste parcourt ${v * tt} m en ${tt} s. Quelle est sa vitesse moyenne en m/s ?`, txt: 1, a: v, tol: tolAbs(v), why: `v = d ÷ t = ${v * tt} ÷ ${tt} = ${v} m/s.` };
  }
  if (t === 1) {
    const v = pick([50, 60, 80, 90, 100, 120]), h = pick([0.5, 1.5, 2, 2.5, 3]);
    return { q: `Un train roule à ${v} km/h pendant ${fr(h)} h. Quelle distance parcourt-il, en km ?`, txt: 1, a: v * h, tol: tolAbs(v * h), why: `d = v × t = ${v} × ${fr(h)} = ${fr(v * h)} km.` };
  }
  if (t === 2) {
    const ms = pick([5, 10, 15, 20, 25, 30]);
    return { q: `Convertis ${ms} m/s en km/h.`, txt: 1, a: ms * 3.6, tol: tolAbs(ms * 3.6), why: `1 m/s = 3,6 km/h (3600 s dans 1 h, 1000 m dans 1 km). ${ms} × 3,6 = ${fr(ms * 3.6)} km/h.` };
  }
  if (t === 3) {
    const m = pick([0.5, 2, 5, 12, 40, 55, 70]);
    const P = m * 9.81;
    return { q: `Quel est le poids, en newtons, d’un objet de ${fr(m)} kg sur Terre ? (g = 9,81 N/kg)`, txt: 1, a: P, tol: tolAbs(P, 0.01, 0.1), why: `P = m × g = ${fr(m)} × 9,81 ≈ ${fr(P)} N.` };
  }
  if (t === 4) {
    const d = pick([100, 200, 400, 1000, 1500]), tt = pick([20, 25, 40, 50, 80, 100]);
    return { q: `Une coureuse fait ${d} m en ${tt} s. Vitesse moyenne en m/s (arrondie au centième) ?`, txt: 1, a: d / tt, tol: 0.011, why: `v = ${d} ÷ ${tt} ≈ ${fr(d / tt)} m/s.` };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
