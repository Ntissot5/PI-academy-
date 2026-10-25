import { R, fr, pick } from "../math";
import type { Question } from "./types";
import { arr, duree } from "./m3-outils";

/** Grandeurs quotients (11e) : vitesse moyenne, conversion km/h ↔ m/s, masse volumique, débit. */
export function gen(): Question {
  const t = R(0, 7);
  const tm = pick([30, 45, 60, 90, 120, 150]), v = 4 * R(10, 30), d = (v * tm) / 60;
  if (t === 0) return { q: `Un train parcourt ${fr(d)} km en ${duree(tm)}. Quelle est sa vitesse moyenne en km/h ?`, txt: 1, a: v, hint: "v = d ÷ t, avec t en heures.", why: `${duree(tm)} = ${fr(tm / 60)} h ; ${fr(d)} ÷ ${fr(tm / 60)} = ${v} km/h.` };
  if (t === 1) return { q: `Une voiture roule à ${v} km/h de moyenne pendant ${duree(tm)}. Quelle distance parcourt-elle en km ?`, txt: 1, a: d, why: `d = v · t = ${v} × ${fr(tm / 60)} = ${fr(d)} km.` };
  if (t === 2) return { q: `Un car postal roule à ${v} km/h de moyenne. Combien de minutes lui faut-il pour parcourir ${fr(d)} km ?`, txt: 1, a: tm, why: `t = d ÷ v = ${fr(d)} ÷ ${v} = ${fr(tm / 60)} h = ${tm} min.` };
  if (t === 3) {
    const k = R(1, 8);
    if (R(0, 1)) return { q: `Convertis ${18 * k} km/h en m/s.`, txt: 1, a: 5 * k, hint: "1 m/s = 3,6 km/h.", why: `${18 * k} km/h = ${18 * k} 000 m en 3600 s : ${18 * k} ÷ 3,6 = ${5 * k} m/s.` };
    const n = R(2, 40);
    return { q: `Convertis ${n} m/s en km/h.`, txt: 1, a: arr(n * 3.6), hint: "1 m/s = 3,6 km/h.", why: `${n} m en 1 s → ${n} × 3600 = ${n * 3600} m en 1 h = ${fr(arr(n * 3.6))} km/h.` };
  }
  if (t === 4) {
    const D = pick([60, 120, 180, 240]);
    const div = [20, 30, 40, 60, 80, 90, 120].filter((x) => D % x === 0);
    let v1: number, v2: number, vm: number;
    do { v1 = pick(div); v2 = pick(div); vm = (2 * v1 * v2) / (v1 + v2); } while (v1 === v2 || !Number.isInteger(vm * 100));
    return { q: `Tu fais ${D} km à l’aller à ${v1} km/h, et les mêmes ${D} km au retour à ${v2} km/h. Quelle est ta vitesse moyenne sur tout le trajet, en km/h ?`, txt: 1, a: vm, hint: "Distance totale ÷ temps total (pas la moyenne des vitesses).", why: `Temps : ${D} ÷ ${v1} = ${fr(D / v1)} h et ${D} ÷ ${v2} = ${fr(D / v2)} h. ${2 * D} km ÷ ${fr(D / v1 + D / v2)} h = ${fr(vm)} km/h, et non ${fr((v1 + v2) / 2)}.` };
  }
  if (t === 5) {
    const rho = pick([0.8, 1.2, 2.5, 2.7, 7.8, 8.9, 11.3]), V = 10 * R(1, 50), m = arr(rho * V, 1), k = R(0, 2);
    if (k === 0) return { q: `Un objet plein de ${V} cm³ a une masse de ${fr(m)} g. Quelle est sa masse volumique en g/cm³ ?`, txt: 1, a: rho, hint: "ρ = m ÷ V", why: `ρ = ${fr(m)} ÷ ${V} = ${fr(rho)} g/cm³.` };
    if (k === 1) return { q: `Une matière a une masse volumique de ${fr(rho)} g/cm³. Quelle est la masse en g d’un bloc de ${V} cm³ ?`, txt: 1, a: m, why: `m = ρ · V = ${fr(rho)} × ${V} = ${fr(m)} g.` };
    return { q: `Une matière a une masse volumique de ${fr(rho)} g/cm³. Quel volume en cm³ occupe un bloc de ${fr(m)} g ?`, txt: 1, a: V, why: `V = m ÷ ρ = ${fr(m)} ÷ ${fr(rho)} = ${V} cm³.` };
  }
  const Q = R(5, 30), tt = R(2, 20), Vol = Q * tt;
  if (t === 6) return R(0, 1)
    ? { q: `Un robinet remplit un bassin de ${Vol} L en ${tt} min. Quel est son débit en L/min ?`, txt: 1, a: Q, why: `Débit = volume ÷ temps = ${Vol} ÷ ${tt} = ${Q} L/min.` }
    : { q: `Un robinet a un débit de ${Q} L/min. Combien de minutes faut-il pour remplir un bassin de ${Vol} L ?`, txt: 1, a: tt, why: `Temps = volume ÷ débit = ${Vol} ÷ ${Q} = ${tt} min.` };
  return { q: `Une pompe a un débit de ${Q} L/min. Quel est son débit en L/h ?`, txt: 1, a: Q * 60, why: `1 h = 60 min : ${Q} × 60 = ${Q * 60} L/h.` };
}
