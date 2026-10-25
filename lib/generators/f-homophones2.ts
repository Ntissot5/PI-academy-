import { pick } from "../math";
import { gras, melange } from "./f-outils";
import type { Question } from "./types";

/* [phrase avec ___, bonne réponse, autres, astuce]. */
const ITEMS: readonly (readonly [string, string, readonly string[], string])[] = [
  ["Je ___ ai prêté mes crayons.", "leur", ["leurs"], "Devant un verbe, « leur » est un pronom (= à eux) : il ne prend jamais de s."],
  ["Les élèves rangent ___ cahiers.", "leurs", ["leur"], "Devant un nom pluriel, « leurs » est un déterminant : il s’accorde."],
  ["Mes voisins promènent ___ chien.", "leur", ["leurs"], "Ils ont un seul chien : déterminant au singulier."],
  ["Dis-___ de venir.", "leur", ["leurs"], "Pronom placé après le verbe (dis à eux) : leur."],
  ["___ belle journée !", "Quelle", ["Qu’elle", "Quel"], "« Quelle » est un déterminant exclamatif accordé avec « journée »."],
  ["Je pense ___ viendra demain.", "qu’elle", ["quelle", "quel"], "On peut dire « qu’il viendra » : c’est « que » + « elle »."],
  ["___ livre préfères-tu ?", "Quel", ["Quelle", "Qu’elle"], "« Quel » est un déterminant interrogatif accordé avec « livre » (masculin)."],
  ["Il faut ___ partent tôt.", "qu’elles", ["quelles", "qu’elle"], "On peut dire « qu’ils partent » : c’est « que » + « elles »."],
  ["___ sont tes chansons préférées ?", "Quelles", ["Qu’elles", "Quels"], "« Quelles » est un interrogatif accordé avec « chansons »."],
  ["Il a ___ son goûter.", "mangé", ["manger"], "Après « avoir », c’est le participe passé : on peut dire « il a mordu »."],
  ["Je vais ___ une pomme.", "manger", ["mangé"], "Après « aller », le verbe est à l’infinitif : on peut dire « je vais mordre »."],
  ["Elle veut ___ le piano.", "acheter", ["acheté"], "Après « vouloir », infinitif : « elle veut vendre »."],
  ["Nous avons ___ la fenêtre.", "fermé", ["fermer"], "Après « avoir », participe passé : « nous avons ouvert »."],
  ["Il n’aime ___ le chou ___ les épinards.", "ni", ["n’y"], "« ni … ni » relie deux éléments dans une phrase négative."],
  ["Il ___ a plus de pain.", "n’y", ["ni"], "« n’y » = ne + y (il y a → il n’y a pas)."],
  ["___ a jamais vu autant de neige.", "On n’", ["On"], "La phrase est négative (« jamais ») : il faut « n’ », même si on ne l’entend pas (on remplace par « il » : il n’a jamais vu)."],
  ["___ entend les cloches du village.", "On", ["On n’"], "La phrase est positive : pas de « n’ » (il entend les cloches)."],
  ["___ est pas encore arrivés.", "On n’", ["On"], "« pas » montre une négation : on n’est pas encore arrivés."],
  ["___ est déjà midi.", "C’est", ["S’est", "Ces"], "On peut dire « cela est » : c’est."],
  ["Il ___ blessé en tombant.", "s’est", ["c’est", "ses"], "Verbe pronominal « se blesser » : il s’est blessé (je me suis blessé)."],
  ["Elle ___ levée tôt.", "s’est", ["c’est", "ses"], "Verbe pronominal « se lever » : elle s’est levée."],
  ["___ il pleut, je prends mon parapluie.", "Quand", ["Quant", "Qu’en"], "« Quand » indique le temps : on peut dire « lorsque »."],
  ["___ à moi, je reste ici.", "Quant", ["Quand", "Qu’en"], "« Quant à » = « en ce qui concerne »."],
  ["___ penses-tu ?", "Qu’en", ["Quand", "Quant"], "« Qu’en » = « que » + « en » : que penses-tu de cela ?"],
  ["Il est parti ___ dire au revoir.", "sans", ["s’en", "cent"], "« Sans » est une préposition (le contraire de « avec »)."],
  ["Il ___ va sans rien dire.", "s’en", ["sans", "cent"], "Verbe « s’en aller » : je m’en vais, il s’en va."],
];

/** Homophones grammaticaux (cycle 2-3) : leur/leurs, quel/qu’elle, é/er, ni/n’y, on n’, c’est/s’est, quand/quant/qu’en… */
export function gen(): Question {
  const [p, a, autres, astuce] = pick(ITEMS);
  return { q: gras(p.replace(/___/g, "<b>___</b>")), txt: 1, a, choices: melange([a, ...autres]), why: `« ${a} ». ${astuce}` };
}
