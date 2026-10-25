import { R, pick } from "../math";
import { PRENOMS, nb, qcm } from "./m2-outils";
import type { Question } from "./types";

/** Dénombrer : groupements par 10, 100, 1000, constituer une collection, compter de n en n, estimer, l'infiniment grand et petit. */
export function gen(): Question {
  const t = R(0, 6);
  if (t === 0) {
    const m = R(0, 6), c = R(1, 9), d = R(0, 9), u = R(0, 9);
    const obj = pick([
      [["cartons de 1000 feuilles", "carton de 1000 feuilles"], ["paquets de 100", "paquet de 100"], ["paquets de 10", "paquet de 10"], ["feuilles seules", "feuille seule"]],
      [["caisses de 1000 trombones", "caisse de 1000 trombones"], ["boîtes de 100", "boîte de 100"], ["sachets de 10", "sachet de 10"], ["trombones seuls", "trombone seul"]],
      [["cartons de 1000 billes", "carton de 1000 billes"], ["sacs de 100", "sac de 100"], ["filets de 10", "filet de 10"], ["billes seules", "bille seule"]],
    ]);
    const parts = [[m, obj[0]], [c, obj[1]], [d, obj[2]], [u, obj[3]]].filter(([n]) => n) as [number, string[]][];
    const n = m * 1000 + c * 100 + d * 10 + u;
    return { q: `Il y a ${parts.map(([k, o]) => `${k} ${k === 1 ? o[1] : o[0]}`).join(", ")}. Combien d’objets en tout ?`, txt: 1, a: n, hint: "Milliers, centaines, dizaines, unités", why: `${m ? `${m} × 1000 + ` : ""}${c} × 100 + ${d} × 10 + ${u} = ${nb(n)}.` };
  }
  if (t === 1) {
    const n = R(1100, 9999), k = R(0, 1);
    if (k === 0) return { q: `Tu dois préparer ${nb(n)} feuilles avec des paquets de 100 et des feuilles seules. Combien de paquets de 100 au maximum peux-tu utiliser ?`, txt: 1, a: Math.floor(n / 100), hint: "Combien de centaines dans ce nombre ?", why: `${nb(n)} contient ${Math.floor(n / 100)} centaines entières ; il reste ${n % 100} feuilles seules.` };
    const c = Math.floor(n / 100);
    return { q: `${pick(PRENOMS)} veut une collection de ${nb(n)} timbres. Elle ou il a déjà ${c} carnets de 100 timbres. Combien de timbres manque-t-il ?`, txt: 1, a: n - c * 100, why: `${c} carnets = ${nb(c * 100)} timbres ; ${nb(n)} − ${nb(c * 100)} = ${n - c * 100}.` };
  }
  if (t === 2) {
    const pas = pick([1, 10, 100, 1000]), rec = Math.random() < 0.4, k = R(3, 6);
    const d = rec ? R(5000, 9999) : R(1000, 8000), a = rec ? d - (k - 1) * pas : d + (k - 1) * pas;
    const deb = [0, 1, 2].map((i) => nb(rec ? d - i * pas : d + i * pas)).join(", ");
    return { q: `On compte de ${nb(pas)} en ${nb(pas)} en ${rec ? "reculant" : "avançant"} : ${deb}, … Quel est le ${k}e nombre ?`, txt: 1, a, hint: "Attention au passage de la centaine ou du millier", why: `Le ${k}e nombre est ${k - 1} pas après le premier : ${nb(d)} ${rec ? "−" : "+"} ${k - 1} × ${nb(pas)} = ${nb(a)}.` };
  }
  if (t === 3) {
    let a: number, b: number, p: number;
    do { a = R(8, 60); b = R(11, 95); p = a * b; } while (String(p)[1] === "4" || String(p)[1] === "5");
    const ord = 10 ** (String(p).length - 1), env = Math.round(p / ord) * ord;
    const obj = pick([["rangées", "bonbons", "Un bocal contient"], ["étagères", "livres", "Une bibliothèque a"], ["rangs", "spectateurs", "Une salle de concert a"]]);
    const ch = [env / 100, env / 10, env, env * 10].filter((x) => x >= 1).map((x) => `environ ${nb(x)}`);
    return { q: `${obj[2]} ${a} ${obj[0]} d’environ ${b} ${obj[1]}. Estime le nombre de ${obj[1]}.`, txt: 1, a: `environ ${nb(env)}`, choices: qcm(`environ ${nb(env)}`, ch), hint: "Arrondis, puis multiplie de tête", why: `${a} × ${b} = ${nb(p)}, donc environ ${nb(env)}. Les autres propositions sont 10 ou 100 fois trop petites ou trop grandes.` };
  }
  if (t === 4) {
    const it = pick([
      ["Quel nombre vient juste après 999 999 ?", 1000000, "999 999 + 1 = 1 000 000 : un million."],
      ["Combien de zéros faut-il pour écrire un milliard en chiffres ?", 9, "Un milliard = 1 000 000 000 : 9 zéros (mille millions)."],
      ["Combien de zéros faut-il pour écrire un million en chiffres ?", 6, "Un million = 1 000 000 : 6 zéros."],
      ["Un million, c’est combien de milliers ?", 1000, "1 000 000 = 1000 × 1000."],
      ["Un milliard, c’est combien de millions ?", 1000, "1 000 000 000 = 1000 × 1 000 000."],
      ["Quel nombre vient juste avant 1 000 000 ?", 999999, "1 000 000 − 1 = 999 999."],
      ["Combien de centaines y a-t-il dans un million ?", 10000, "1 000 000 : 100 = 10 000."],
    ] as [string, number, string][]);
    return { q: it[0], txt: 1, a: it[1], why: it[2] };
  }
  if (t === 5) {
    const a = "non, on peut toujours ajouter 1";
    return { q: "Existe-t-il un nombre entier plus grand que tous les autres ?", txt: 1, a, choices: qcm(a, ["oui, c’est un milliard", "oui, c’est le plus grand nombre de la calculatrice", "oui, c’est 999 999 999"]), why: "Quel que soit le nombre, on peut lui ajouter 1 et en obtenir un plus grand : la suite des nombres ne s’arrête jamais." };
  }
  const it = pick([
    ["Combien de millièmes y a-t-il dans un dixième ?", 100, "1 dixième = 10 centièmes = 100 millièmes."],
    ["Combien de centièmes y a-t-il dans un dixième ?", 10, "1 dixième = 10 centièmes."],
    ["Combien de millièmes y a-t-il dans une unité ?", 1000, "1 = 1000 millièmes."],
    ["Combien de nombres à deux décimales y a-t-il entre 0,1 et 0,2 (sans compter 0,1 et 0,2) ?", 9, "0,11 ; 0,12 ; … ; 0,19 : 9 nombres."],
    ["Combien de nombres à trois décimales y a-t-il entre 0,01 et 0,02 (sans compter 0,01 et 0,02) ?", 9, "0,011 ; 0,012 ; … ; 0,019 : 9 nombres."],
  ] as [string, number, string][]);
  if (Math.random() < 0.3) {
    const a = "oui, par exemple 0,105";
    return { q: "Peut-on trouver un nombre entre 0,1 et 0,11 ?", txt: 1, a, choices: qcm(a, ["non, ils se suivent", "oui, par exemple 0,12", "non, il n’y a rien entre les deux"]), why: "0,1 = 0,100 et 0,11 = 0,110 : 0,105 est entre les deux. Entre deux nombres décimaux, on peut toujours en glisser un autre." };
  }
  return { q: it[0], txt: 1, a: it[1], why: it[2] };
}
