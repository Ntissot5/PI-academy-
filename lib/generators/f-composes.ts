import { pick } from "../math";
import { qcm, tirer } from "./f-outils";
import type { Question } from "./types";

/* [singulier, pluriel, pièges, règle]. */
const NOMS: readonly (readonly [string, string, readonly string[], string])[] = [
  ["un chou-fleur", "des choux-fleurs", ["des chou-fleurs", "des choux-fleur", "des chous-fleurs"], "Deux noms : les deux s’accordent."],
  ["une grand-mère", "des grands-mères", ["des grand-mères", "des grands-mère", "des grande-mères"], "Adjectif + nom : les deux s’accordent (grands-mères)."],
  ["un coffre-fort", "des coffres-forts", ["des coffre-forts", "des coffres-fort", "des coffre-fort"], "Nom + adjectif : les deux s’accordent."],
  ["un arc-en-ciel", "des arcs-en-ciel", ["des arc-en-ciels", "des arcs-en-ciels", "des arc-en-ciel"], "Nom + préposition + nom : seul le premier nom s’accorde."],
  ["un chef-d’œuvre", "des chefs-d’œuvre", ["des chef-d’œuvres", "des chefs-d’œuvres", "des chef-d’œuvre"], "Nom + préposition + nom : seul le premier nom s’accorde."],
  ["un timbre-poste", "des timbres-poste", ["des timbre-postes", "des timbres-postes", "des timbre-poste"], "« Timbre-poste » = timbre pour la poste : seul « timbre » s’accorde."],
  ["un haut-parleur", "des haut-parleurs", ["des hauts-parleurs", "des hauts-parleur", "des haut-parleur"], "« Haut » est ici un adverbe (parler haut) : il reste invariable."],
  ["un sous-marin", "des sous-marins", ["des sous-marin", "des sou-marins", "des sous-marines"], "Préposition + nom : seul le nom s’accorde."],
  ["un avant-bras", "des avant-bras", ["des avants-bras", "des avant-brass", "des avants-bra"], "Préposition + nom déjà terminé par s : rien ne change."],
  ["un cerf-volant", "des cerfs-volants", ["des cerf-volants", "des cerfs-volant", "des cerf-volant"], "Nom + adjectif : les deux s’accordent."],
  ["un rouge-gorge", "des rouges-gorges", ["des rouge-gorges", "des rouges-gorge", "des rouge-gorge"], "Adjectif + nom : les deux s’accordent."],
  ["un tire-bouchon", "des tire-bouchons", ["des tires-bouchons", "des tire-bouchon", "des tires-bouchon"], "Verbe + nom : le verbe reste invariable, le nom s’accorde."],
  ["un porte-clé", "des porte-clés", ["des portes-clés", "des porte-clé", "des portes-clé"], "Verbe + nom : le verbe ne s’accorde jamais."],
  ["un essuie-mains", "des essuie-mains", ["des essuies-mains", "des essuie-main", "des essuies-main"], "Verbe + nom au pluriel (on essuie les mains) : rien ne change."],
  ["un oiseau-mouche", "des oiseaux-mouches", ["des oiseau-mouches", "des oiseaux-mouche", "des oiseau-mouche"], "Deux noms : les deux s’accordent."],
  ["une belle-sœur", "des belles-sœurs", ["des belle-sœurs", "des belles-sœur", "des belle-sœur"], "Adjectif + nom : les deux s’accordent."],
];

function nom(): Question {
  const [s, p, faux, regle] = pick(NOMS);
  return qcm(`Quel est le pluriel de <b>${s}</b> ?`, p, faux, `${p}. ${regle} Le verbe, l’adverbe et la préposition ne s’accordent jamais.`);
}

/* Adjectifs composés : [groupe, bonne forme, pièges, règle]. */
const ADJ: readonly (readonly [string, string, readonly string[], string])[] = [
  ["des bébés (nouveau-né)", "nouveau-nés", ["nouveaux-nés", "nouveau-né", "nouveaux-né"], "« Nouveau » a ici le sens de « nouvellement » : il reste invariable."],
  ["des sauces (aigre-doux)", "aigres-douces", ["aigre-douces", "aigres-doux", "aigre-doux"], "Deux adjectifs : les deux s’accordent."],
  ["des yeux (bleu-vert)", "bleu-vert", ["bleus-verts", "bleu-verts", "bleus-vert"], "Adjectif de couleur composé : invariable."],
  ["des enfants (sourd-muet)", "sourds-muets", ["sourd-muets", "sourds-muet", "sourd-muet"], "Deux adjectifs : les deux s’accordent."],
  ["des personnes (haut placé)", "haut placées", ["hautes placées", "haut placé", "hautes placé"], "« Haut » est un adverbe (placées en haut) : invariable."],
];

function adjectif(): Question {
  const [g, bon, faux, regle] = pick(ADJ);
  const [nom, adj] = g.split(" (");
  return qcm(`Accorde l’adjectif <b>${adj.replace(")", "")}</b> : <b>${nom} …</b>`, bon, faux, `${nom} ${bon}. ${regle}`);
}

/** Pluriel des noms et adjectifs composés. */
export function gen(): Question {
  return tirer([nom, nom, nom, adjectif]);
}
