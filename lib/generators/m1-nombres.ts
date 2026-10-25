import { R } from "../math";
import type { Question } from "./types";
import { lettres, qcm } from "./m1-outils";

const pl = (n: number, mot: string) => `${n} ${mot}${n > 1 ? "s" : ""}`;

/** Dizaines et unités, paquets de 10, nombres en lettres (septante, huitante, nonante), juste avant / juste après, jusqu'à 200 : PER MSN 12, 3e-4e. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const c = Math.random() < 0.3 ? 1 : 0, d = R(c ? 0 : 1, 9), u = R(0, 9), n = 100 * c + 10 * d + u;
    const parts = [pl(d, "dizaine"), pl(u, "unité")];
    if (Math.random() < 0.4) parts.reverse();
    const txt = (c ? "1 centaine, " : "") + parts.join(" et ");
    return { q: `Quel nombre fait <b>${txt}</b> ?`, txt: 1, a: n, hint: "Attention à l’ordre des mots.", why: `${c ? "1 centaine = 100, " : ""}${d} dizaine${d > 1 ? "s" : ""} = ${10 * d}, ${u} unité${u > 1 ? "s" : ""} = ${u} : ${c ? "100 + " : ""}${10 * d} + ${u} = ${n}.` };
  }
  if (t === 1) {
    if (Math.random() < 0.5) {
      const n = R(20, 99), d = Math.floor(n / 10);
      return { q: `Combien de dizaines y a-t-il dans <b>${n}</b> ?`, txt: 1, a: d, why: `${n} = ${10 * d} + ${n % 10} : ${d} dizaines et ${n % 10} unité${n % 10 > 1 ? "s" : ""}.` };
    }
    const n = R(101, 199), dz = Math.random() < 0.5, a = dz ? Math.floor(n / 10) % 10 : n % 10;
    return { q: `Dans <b>${n}</b>, quel est le chiffre des <b>${dz ? "dizaines" : "unités"}</b> ?`, txt: 1, a, why: `${n} : le 1 est le chiffre des centaines, ${Math.floor(n / 10) % 10} celui des dizaines, ${n % 10} celui des unités. Le chiffre des ${dz ? "dizaines" : "unités"} est ${a}.` };
  }
  if (t === 2) {
    const p = R(2, 15), u = R(1, 9), n = 10 * p + u;
    return { q: `Il y a ${p} paquets de 10 🍬 et encore ${u} 🍬 tout seuls. Combien de 🍬 en tout ?`, txt: 1, a: n, why: `${p} paquets de 10, c’est ${10 * p}. ${10 * p} + ${u} = ${n}.` };
  }
  if (t === 3) {
    const n = Math.random() < 0.5 ? R(60, 99) : R(13, 200);
    return { q: `Écris en chiffres : <b>${lettres(n)}</b>`, txt: 1, a: n, why: `${lettres(n)} = ${n}.` };
  }
  if (t === 4) {
    let n: number;
    do n = Math.random() < 0.5 ? R(61, 99) : R(21, 199);
    while (n % 10 === 0 || Math.floor(n / 10) % 10 === n % 10);
    const d = Math.floor(n / 10) % 10, u = n % 10, inv = n < 100 ? 10 * u + d : 100 + 10 * u + d;
    const a = lettres(n);
    return { q: `Comment s’écrit <b>${n}</b> en lettres ?`, txt: 1, a, choices: qcm(a, [lettres(inv), lettres(n + 10 > 200 ? n - 10 : n + 10), lettres(n - 1)]), why: `${n} = ${n >= 100 ? "100 + " : ""}${10 * d} + ${u} : « ${a} ».` };
  }
  if (t === 5) {
    const apres = Math.random() < 0.5;
    const n = apres ? (Math.random() < 0.6 ? 10 * R(2, 19) - 1 : R(10, 198)) : (Math.random() < 0.6 ? 10 * R(2, 20) : R(11, 200));
    const a = apres ? n + 1 : n - 1;
    return { q: `Quel nombre vient juste <b>${apres ? "après" : "avant"}</b> ${n} ?`, txt: 1, a, why: `${apres ? `${n} + 1 = ${a}` : `${n} − 1 = ${a}`}${a % 10 === 0 || n % 10 === 0 ? " : on change de dizaine." : "."}` };
  }
  const d = R(1, 19), u = R(1, 9), n = 10 * d + u;
  return { q: `Devinette : je suis entre ${10 * d} et ${10 * d + 10}. Mon chiffre des unités est ${u}. Qui suis-je ?`, txt: 1, a: n, why: `Entre ${10 * d} et ${10 * d + 10}, il y a ${d} dizaine${d > 1 ? "s" : ""} ; avec ${u} unité${u > 1 ? "s" : ""}, c’est ${n}.` };
}
