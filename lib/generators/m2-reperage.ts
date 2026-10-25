import { R, pick } from "../math";
import { PRENOMS, qcm } from "./m2-outils";
import type { Question } from "./types";

const COL = "ABCDEFGH";
const DIR = ["nord", "est", "sud", "ouest"];
const LE = ["le nord", "l’est", "le sud", "l’ouest"];
const AU = ["au nord", "à l’est", "au sud", "à l’ouest"];
const caseDe = (c: number, l: number): string => `${COL[c]}${l + 1}`;
const accCase = (s: string): string[] => [s.toLowerCase(), `${s[0]} ${s.slice(1)}`, `${s[0]}-${s.slice(1)}`];

/** Repérage : cases d'un quadrillage (lettre + nombre), itinéraires codés, points cardinaux, orientation d'un plan. */
export function gen(): Question {
  const t = R(0, 5);
  if (t === 0) {
    let c: number, l: number, dc: number, dl: number;
    do { c = R(0, 7); l = R(0, 7); dc = R(-4, 4); dl = R(-4, 4); } while ((dc === 0 && dl === 0) || c + dc < 0 || c + dc > 7 || l + dl < 0 || l + dl > 7);
    const mv: string[] = [];
    if (dc) mv.push(`${Math.abs(dc)} case${Math.abs(dc) > 1 ? "s" : ""} vers la ${dc > 0 ? "droite" : "gauche"}`);
    if (dl) mv.push(`${Math.abs(dl)} case${Math.abs(dl) > 1 ? "s" : ""} vers le ${dl > 0 ? "haut" : "bas"}`);
    const a = caseDe(c + dc, l + dl);
    return { q: `Sur un quadrillage, les colonnes vont de A à H (de gauche à droite) et les lignes de 1 à 8 (de bas en haut). ${pick(PRENOMS)} part de la case <b>${caseDe(c, l)}</b> et avance de ${mv.join(" puis de ")}. Quelle est sa case d’arrivée ?`, txt: 1, a, accept: accCase(a), hint: "Une lettre puis un nombre, par ex. C4", why: `Colonne ${COL[c]} → ${COL[c + dc]}, ligne ${l + 1} → ${l + dl + 1} : case ${a}.` };
  }
  if (t === 1) {
    let c: number, l: number, code: string[];
    const F: Record<string, [number, number]> = { "→": [1, 0], "←": [-1, 0], "↑": [0, 1], "↓": [0, -1] };
    for (;;) {
      c = R(1, 6); l = R(1, 6); code = Array.from({ length: R(4, 6) }, () => pick(Object.keys(F)));
      let x = c, y = l, ok = true;
      for (const k of code) { x += F[k][0]; y += F[k][1]; if (x < 0 || x > 7 || y < 0 || y > 7) ok = false; }
      if (ok && (x !== c || y !== l)) break;
    }
    let x = c, y = l;
    for (const k of code) { x += F[k][0]; y += F[k][1]; }
    const a = caseDe(x, y);
    return { q: `Code d’itinéraire : chaque flèche = 1 case (↑ vers le haut, → vers la droite). Colonnes A à H, lignes 1 à 8. Départ en <b>${caseDe(c, l)}</b>, puis <b>${code.join(" ")}</b>. Case d’arrivée ?`, txt: 1, a, accept: accCase(a), hint: "Suis les flèches une à une", why: `${code.filter((k) => k === "→").length} → et ${code.filter((k) => k === "←").length} ← : colonne ${COL[x]} ; ${code.filter((k) => k === "↑").length} ↑ et ${code.filter((k) => k === "↓").length} ↓ : ligne ${y + 1}. Case ${a}.` };
  }
  if (t === 2) {
    const d0 = R(0, 3), tour = pick([1, 2, 3]), sens = pick([1, -1]);
    const d1 = (d0 + sens * tour + 8) % 4;
    const nomTour = tour === 1 ? "un quart de tour" : tour === 2 ? "un demi-tour" : "trois quarts de tour";
    return { q: `Tu regardes vers <b>${LE[d0]}</b>. Tu fais ${nomTour}${tour === 2 ? "" : ` vers la ${sens > 0 ? "droite" : "gauche"}`}. Vers où regardes-tu maintenant ?`, txt: 1, a: DIR[d1], choices: [...DIR], hint: "Nord, est, sud, ouest, dans le sens des aiguilles d’une montre", why: `Dans le sens des aiguilles d’une montre : nord → est → sud → ouest. ${nomTour[0].toUpperCase() + nomTour.slice(1)} depuis ${LE[d0]} mène ${AU[d1]}.` };
  }
  if (t === 3) {
    const lieux = ["la piscine", "la bibliothèque", "la gare", "le stade", "la boulangerie"];
    const L = pick(lieux), pos = R(0, 3);
    const mot = ["au-dessus", "à droite", "au-dessous", "à gauche"][pos];
    return { q: `Sur un plan bien orienté, le nord est en haut. Sur ce plan, ${L} se trouve ${mot} de l’école. Dans quelle direction est ${L} par rapport à l’école ?`, txt: 1, a: DIR[pos], choices: [...DIR], why: `Plan orienté : en haut = nord, à droite = est, en bas = sud, à gauche = ouest. ${mot[0].toUpperCase() + mot.slice(1)}, c’est donc ${LE[pos]}.` };
  }
  if (t === 4) {
    const x1 = R(0, 5), y1 = R(0, 5), x2 = x1 + R(1, 4), y2 = y1 + R(1, 4);
    return { q: `Dans un quartier en quadrillage, tu ne peux marcher que le long des rues (horizontales ou verticales). Combien de pâtés de maisons au minimum pour aller du carrefour (${x1} ; ${y1}) au carrefour (${x2} ; ${y2}) ?`, txt: 1, a: x2 - x1 + y2 - y1, hint: "On ne peut pas couper en diagonale", why: `${x2 - x1} vers la droite + ${y2 - y1} vers le haut = ${x2 - x1 + y2 - y1}.` };
  }
  // problème : retrouver le départ
  let c: number, l: number, dc: number, dl: number;
  do { c = R(0, 7); l = R(0, 7); dc = R(1, 3) * pick([1, -1]); dl = R(1, 3) * pick([1, -1]); } while (c + dc < 0 || c + dc > 7 || l + dl < 0 || l + dl > 7);
  const arr = caseDe(c + dc, l + dl), a = caseDe(c, l);
  return { q: `Colonnes A à H, lignes 1 à 8. Le trésor est en <b>${arr}</b>. Pour l’atteindre, le pirate a fait ${Math.abs(dc)} case${Math.abs(dc) > 1 ? "s" : ""} vers la ${dc > 0 ? "droite" : "gauche"} et ${Math.abs(dl)} vers le ${dl > 0 ? "haut" : "bas"}. D’où est-il parti ?`, txt: 1, a, choices: qcm(a, [caseDe(Math.min(7, Math.max(0, c + 2 * dc)), Math.min(7, Math.max(0, l + 2 * dl))), caseDe(c + dc, l), caseDe(c, l + dl), caseDe(Math.min(7, Math.max(0, c + dc + dc)), l)]), why: `On fait le chemin à l’envers : ${Math.abs(dc)} vers la ${dc > 0 ? "gauche" : "droite"} et ${Math.abs(dl)} vers le ${dl > 0 ? "bas" : "haut"} depuis ${arr} : ${a}.` };
}
