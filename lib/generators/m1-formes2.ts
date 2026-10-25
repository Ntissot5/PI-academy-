import { R, pick } from "../math";
import type { Question } from "./types";
import { frise } from "./m1-formes";
import { melange, qcm, qcmNombre, tirer } from "./m1-outils";

const COUL = ["rouge", "bleu", "vert", "jaune"];
const CARRES: Record<string, string> = { rouge: "🟥", bleu: "🟦", vert: "🟩", jaune: "🟨" };
const RONDS: Record<string, string> = { rouge: "🔴", bleu: "🔵", vert: "🟢", jaune: "🟡" };
const fig = (forme: string, c: string) => (forme === "carré" ? CARRES[c] : RONDS[c]);
// [nom, symbole, côtés, coins]
const POLY: [string, string, number, number][] = [["un triangle", "▲", 3, 3], ["un carré", "■", 4, 4], ["un rectangle", "▬", 4, 4], ["un rond", "●", 0, 0]];

/** Décrire et nommer les formes, trier selon deux critères, composer et transformer des figures : PER MSN 11, 3e-4e. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    const [nom, s, cotes, coins] = pick(POLY), parCotes = Math.random() < 0.5 && cotes > 0;
    const n = parCotes ? cotes : coins;
    return { q: `Combien de <b>${parCotes ? "côtés" : "coins"}</b> a ${nom} ${s} ?`, txt: 1, a: n, why: n === 0 ? "Un rond n’a pas de coin : son bord est tout arrondi." : `On fait le tour ${nom.replace("un ", "d’un ")} en comptant : ${n} ${parCotes ? "côtés" : "coins"}.` };
  }
  if (t === 1) {
    const [c1, c2] = tirer(COUL, 2), [f1, f2] = melange(["carré", "rond"]);
    if (Math.random() < 0.5) {
      const a = fig(f1, c1);
      return { q: `Lequel est un <b>${f1} ${c1}</b> ?`, txt: 1, a, choices: melange([a, fig(f2, c1), fig(f1, c2), fig(f2, c2)]), hint: "Il faut la bonne forme ET la bonne couleur.", why: `${a} est à la fois un ${f1} et ${c1}. ${fig(f2, c1)} a la bonne couleur, mais pas la bonne forme.` };
    }
    const tous = COUL.flatMap((c) => [CARRES[c], RONDS[c]]), cible = fig(f1, c1);
    const rang = Array.from({ length: 8 }, () => pick(tous));
    rang[R(0, 7)] = cible;
    const n = rang.filter((x) => x === cible).length;
    return { q: `Combien de <b>${f1}s ${c1}s</b> ?  ${rang.join(" ")}`, txt: 1, a: n, why: `On ne compte que ceux qui sont ${f1}s ET ${c1}s (${cible}) : il y en a ${n}.` };
  }
  if (t === 2) {
    const s = R(0, 2);
    if (s === 0) return { q: `Combien de faces a un dé 🎲 ?`, txt: 1, a: 6, why: "Un dé est un cube : il a 6 faces carrées, numérotées de 1 à 6." };
    const solides: [string, string][] = [["🥫", "le cylindre"], ["⚽", "la boule"], ["🎲", "le cube"]];
    const [e, a] = pick(solides);
    return { q: `Quel solide ressemble à ${e} ?`, txt: 1, a, choices: melange(solides.map((x) => x[1])), why: `${e} a la forme de ${a.replace("le ", "un ").replace("la ", "une ")}.` };
  }
  if (t === 3) {
    const s = R(0, 2);
    if (s === 0) {
      const n = R(2, 3);
      return { q: `Avec combien de petits carrés ■ peux-tu faire un grand carré de ${n} sur ${n} ?`, txt: 1, ...qcmNombre(n * n, [n + n, n * n + 1], 1, 16), why: `${n} rangées de ${n} petits carrés : ${Array.from({ length: n }, () => n).join(" + ")} = ${n * n}.` };
    }
    if (s === 1) return { q: "Je coupe un carré en deux, d’un coin au coin opposé. J’obtiens deux…", txt: 1, a: "triangles", choices: qcm("triangles", ["carrés", "ronds"]), why: "La ligne d’un coin au coin opposé partage le carré en 2 triangles pareils." };
    return { q: "Je colle deux carrés pareils côte à côte ■■. J’obtiens…", txt: 1, a: "un rectangle", choices: qcm("un rectangle", ["un triangle", "un rond"]), why: "Deux carrés côte à côte forment un rectangle : 2 côtés longs et 2 côtés courts." };
  }
  if (t === 4) {
    const s = R(0, 2);
    if (s === 0) {
      const [f, a] = pick([["▲", "▼"], ["▶", "◀"], ["▼", "▲"], ["◀", "▶"]]);
      return { q: `Je tourne <b>${f}</b> d’un demi-tour. J’obtiens…`, txt: 1, a, choices: qcm(a, [f, ...["▲", "▼", "◀", "▶"]]), why: `Un demi-tour met la pointe de l’autre côté : ${f} devient ${a}. La forme reste un triangle.` };
    }
    if (s === 1) return { q: "Je tourne un triangle. A-t-il toujours 3 côtés ?", txt: 1, a: "oui", choices: ["oui", "non"], why: "Quand on tourne une forme, sa position change, mais pas sa forme : il a toujours 3 côtés." };
    return { q: "Je fais glisser un carré sur la table. Change-t-il de forme ?", txt: 1, a: "non", choices: ["oui", "non"], why: "Glisser change la place de la forme, pas sa forme : c’est toujours un carré." };
  }
  if (Math.random() < 0.5) return frise(["▲", "■", "●", "▬"]);
  const motif = tirer(["▲", "■", "●", "▬"], 3), long = motif.length * 3, trou = R(1, long - 2);
  const a = motif[trou % 3];
  const montre = Array.from({ length: long }, (_, i) => (i === trou ? "<b>?</b>" : motif[i % 3]));
  return { q: `Qu’est-ce qui manque dans la frise ?  ${montre.join(" ")}`, txt: 1, a, choices: melange(motif), why: `Le motif ${motif.join(" ")} se répète : à la place du ?, il faut ${a}.` };
}
