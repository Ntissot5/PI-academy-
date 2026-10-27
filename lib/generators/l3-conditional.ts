import { pick } from "../math";
import type { Question } from "./types";

// [type, phrase avec …, verbe, réponse, autres réponses, explication]
const C: [string, string, string, string, string[], string][] = [
  ["zero", "If you heat ice, it … .", "melt", "melts", [], "vérité générale : if + présent, présent"],
  ["zero", "If you mix blue and yellow, you … green.", "get", "get", [], "vérité générale : if + présent, présent"],
  ["zero", "Plants … if they don’t get water.", "die", "die", [], "vérité générale : présent + if + présent"],
  ["first", "If it … tomorrow, we will stay at home.", "rain", "rains", [], "1er conditionnel : if + présent, will + base"],
  ["first", "If you study, you … the test.", "pass", "will pass", ["'ll pass"], "1er conditionnel : if + présent, will + base"],
  ["first", "If we … now, we will catch the bus.", "leave", "leave", [], "1er conditionnel : if + présent (pas de will après if)"],
  ["first", "She … angry if you are late.", "be", "will be", ["'ll be"], "1er conditionnel : will + base, if + présent"],
  ["first", "If Tom … his homework, he can play outside.", "finish", "finishes", [], "1er conditionnel : if + présent (3e personne : -es)"],
  ["second", "If I … rich, I would buy a boat.", "be", "were", ["was"], "2e conditionnel : if + prétérit (were, aussi was), would + base"],
  ["second", "If I had wings, I … to Japan.", "fly", "would fly", ["'d fly"], "2e conditionnel : if + prétérit, would + base"],
  ["second", "If she … more time, she would learn the piano.", "have", "had", [], "2e conditionnel : if + prétérit"],
  ["second", "We … a dog if we lived in a bigger house.", "get", "would get", ["'d get"], "2e conditionnel : would + base, if + prétérit"],
  ["second", "If you … the lottery, what would you do?", "win", "won", [], "2e conditionnel : if + prétérit"],
];

const TYPE: Record<string, string> = { zero: "zero conditional", first: "first conditional", second: "second conditional" };

/** Conditionals : zero, first, second. */
export function gen(): Question {
  const [type, phrase, verbe, a, alt, raison] = pick(C);
  return {
    q: `${TYPE[type]} : <b>${phrase}</b> (${verbe})`,
    txt: 1,
    a,
    accept: alt,
    why: `${phrase.replace(" … .", ` ${a}.`).replace("…", a)} — ${raison}.`,
  };
}
