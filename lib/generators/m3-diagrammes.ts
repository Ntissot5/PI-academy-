import { R, S, fr, pick } from "../math";
import type { Question } from "./types";
import { heure, ville } from "./m3-outils";

const JOURS = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
const TRANSPORTS = ["à pied", "à vélo", "en bus", "en voiture"];

/** Répartit total en n parts entières (au moins 1 chacune). */
function parts(total: number, n: number): number[] {
  const p = Array(n).fill(1);
  for (let i = n; i < total; i++) p[R(0, n - 1)]++;
  return p;
}

/** Lecture de données et diagrammes : moyenne, effectifs, fréquences, diagramme circulaire, horaires, relevés (PER MSN 33, 9e-11e). */
export function gen(): Question {
  const t = R(0, 7);
  if (t === 0 || t === 1) {
    const v = ville();
    let vals: number[];
    let m: number;
    do { m = R(60, 180); vals = Array.from({ length: 4 }, () => R(m - 50, m + 50)); vals.push(5 * m - vals.reduce((s, x) => s + x, 0)); } while (vals[4] < 20 || vals[4] > 260);
    const data = JOURS.map((j, i) => `${j} ${vals[i]}`).join(", ");
    const intro = `Nombre d’entrées à la piscine de ${v} cette semaine : ${data}.`;
    if (t === 0) return { q: `${intro} Quelle est la moyenne d’entrées par jour ?`, txt: 1, a: m, why: `Total : ${vals.join(" + ")} = ${5 * m} ; ${5 * m} ÷ 5 = ${m}.` };
    const k = R(0, 1);
    const max = Math.max(...vals), min = Math.min(...vals);
    if (k === 0) return { q: `${intro} Combien d’entrées y a-t-il eu en tout ?`, txt: 1, a: 5 * m, why: `${vals.join(" + ")} = ${5 * m}.` };
    return { q: `${intro} Quel est l’écart entre le jour le plus fréquenté et le jour le moins fréquenté ?`, txt: 1, a: max - min, why: `Maximum ${max}, minimum ${min} : ${max} − ${min} = ${max - min}.` };
  }
  if (t === 2) {
    const T = pick([20, 25, 50]), p = parts(T, 4), i = R(0, 3);
    return { q: `Dans une classe, on a demandé à ${T} élèves comment ils viennent à l’école : ${TRANSPORTS.map((x, j) => `${x} ${p[j]}`).join(", ")}. Quel pourcentage vient ${TRANSPORTS[i]} ?`, txt: 1, a: (p[i] / T) * 100, why: `${p[i]} sur ${T} : ${p[i]} ÷ ${T} × 100 = ${fr((p[i] / T) * 100)} %.` };
  }
  if (t === 3) {
    const T = pick([20, 24, 30, 36, 40, 60, 72, 90]), p = R(1, T - 1), ang = (p * 360) / T;
    return { q: `Dans un diagramme circulaire qui représente ${T} élèves, quel angle (en degrés) doit avoir le secteur de ${p} élèves ?`, txt: 1, a: ang, hint: "Le disque entier (360°) représente tous les élèves.", why: `1 élève = 360 ÷ ${T} = ${360 / T}° ; ${p} × ${360 / T} = ${ang}°.` };
  }
  if (t === 4) {
    const ang = pick([18, 36, 45, 54, 72, 90, 108, 144, 180]);
    return { q: `Dans un diagramme circulaire, un secteur a un angle de ${ang}°. Quel pourcentage du total représente-t-il ?`, txt: 1, a: (ang / 360) * 100, why: `${ang} ÷ 360 × 100 = ${fr((ang / 360) * 100)} %.` };
  }
  if (t === 5) {
    const dep = R(6 * 60, 20 * 60), d = R(20, 200), arr = dep + d;
    return { q: `D’après l’horaire, un bus part à ${heure(dep)} et arrive à ${heure(arr)}. Combien de minutes dure le trajet ?`, txt: 1, a: d, why: `De ${heure(dep)} à ${heure(arr)} : ${Math.floor(d / 60) ? `${Math.floor(d / 60)} h et ${d % 60} min = ` : ""}${d} min.` };
  }
  if (t === 6) {
    const h = [8, 10, 12, 14, 16], temp = [R(-8, 4)];
    for (let i = 1; i < 5; i++) temp.push(temp[i - 1] + R(-1, 4));
    const i = R(0, 2), j = R(i + 1, 4), d = temp[j] - temp[i];
    return { q: `Températures relevées un jour d’hiver : ${h.map((x, k) => `${x} h : ${S(temp[k])} °C`).join(", ")}. De combien de degrés la température a-t-elle varié entre ${h[i]} h et ${h[j]} h ? (négatif si elle a baissé)`, txt: 1, a: d, why: `${S(temp[j])} − (${S(temp[i])}) = ${S(d)} °C.` };
  }
  const u = pick([2, 5, 10]), c = R(3, 12), noms = ["foot", "basket", "natation", "unihockey"], k = R(0, 3);
  if (R(0, 1)) return { q: `Dans un diagramme en colonnes des sports préférés, un carreau représente ${u} élèves. La colonne « ${noms[k]} » monte à ${c} carreaux. Combien d’élèves cela représente-t-il ?`, txt: 1, a: u * c, why: `${c} × ${u} = ${u * c} élèves.` };
  const eff = parts(R(30, 60), 4);
  const max = Math.max(...eff);
  if (eff.filter((x) => x === max).length > 1) eff[eff.indexOf(max)] += 1;
  const best = eff.indexOf(Math.max(...eff));
  return { q: `Sports préférés d’un groupe d’élèves : ${noms.map((n, i) => `${n} ${eff[i]}`).join(", ")}. Quel sport aura la colonne la plus haute dans un diagramme en colonnes ?`, txt: 1, a: noms[best], choices: [...noms], why: `« ${noms[best]} » a le plus grand effectif (${eff[best]}) : c’est sa colonne qui monte le plus haut.` };
}
