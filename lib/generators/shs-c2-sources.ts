import { pick } from "../math";
import type { Question } from "./types";

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);

const TYPES = ["une source historique (trace d’époque)", "une reconstitution (faite plus tard)", "une fiction (histoire inventée)"];
// [document, type (index), explication]
const DOCS: [string, number, string][] = [
  ["une pièce de monnaie romaine trouvée à Avenches", 0, "Elle date de l’époque romaine : c’est une trace directe du passé."],
  ["une lettre écrite en 1848 par un député", 0, "Écrite à l’époque même : c’est une source historique."],
  ["une photographie d’une rue de Lausanne vers 1900", 0, "Prise à l’époque : c’est une source."],
  ["une épée retrouvée dans les ruines d’un château", 0, "Objet de l’époque : c’est une trace archéologique."],
  ["une maquette d’un village lacustre construite pour un musée", 1, "Fabriquée aujourd’hui d’après les fouilles : c’est une reconstitution."],
  ["un dessin moderne montrant un chevalier dans un manuel scolaire", 1, "Dessiné bien après le Moyen Âge : c’est une reconstitution."],
  ["une fête médiévale où des acteurs portent des costumes d’époque", 1, "Elle imite le passé : c’est une reconstitution."],
  ["un dessin animé où un garçon voyage dans le temps chez les dinosaures", 2, "Les humains n’ont jamais vécu avec les dinosaures : c’est une fiction."],
  ["un conte où un dragon garde un château", 2, "Les dragons n’existent pas : c’est une fiction."],
];

const ITEMS: [string, string, string[], string][] = [
  ["Guillaume Tell et la pomme : qu’en disent les historiens ?", "C’est une légende : aucun document de l’époque ne prouve qu’il a existé", ["C’est prouvé par des photos", "Il était roi de France", "Il a écrit la Constitution de 1848"], "Le récit apparaît dans des chroniques écrites longtemps après les faits."],
  ["Les Vikings portaient-ils des casques à cornes ?", "Non, c’est une idée reçue", ["Oui, toujours", "Oui, seulement les enfants", "Oui, pour la pêche"], "Aucun casque à cornes viking n’a été retrouvé ; cette image vient d’opéras et d’illustrations du XIXe siècle."],
  ["Les hommes de la Préhistoire chassaient-ils les dinosaures ?", "Non, les dinosaures avaient disparu des millions d’années avant", ["Oui, souvent", "Oui, avec des fusils", "Seulement en Suisse"], "C’est une représentation erronée fréquente dans les dessins animés."],
  ["Pourquoi le français, l’italien et le romanche ressemblent-ils au latin ?", "C’est un héritage de la présence romaine", ["C’est un hasard", "Ils viennent du grec", "Ils ont été inventés en 1848"], "Ces langues sont issues du latin parlé : un héritage du passé dans la vie actuelle."],
  ["Pourquoi célèbre-t-on la fête nationale suisse le 1er août ?", "En souvenir du Pacte fédéral de 1291", ["Pour la fin de l’hiver", "Pour l’anniversaire de Napoléon", "Pour la naissance du Rhône"], "C’est une commémoration : on rappelle un événement du passé."],
  ["Un monument aux morts dans un village sert surtout à…", "se souvenir des personnes mortes lors de guerres", ["indiquer la direction", "décorer la place", "mesurer le temps"], "C’est un lieu de mémoire."],
  ["Pourquoi trouve-t-on de nombreux objets préhistoriques au fond des lacs suisses ?", "L’eau et la vase les ont protégés de l’air", ["Les gens les y ont jetés exprès", "Les poissons les ont apportés", "Ils sont tombés d’avions"], "Sans air, le bois et les restes se conservent mieux : ce sont des traces précieuses."],
  ["Un archéologue étudie surtout…", "les traces matérielles du passé (objets, ruines)", ["les étoiles", "le climat de demain", "les dinosaures seulement"], "Les paléontologues étudient les fossiles comme les dinosaures ; les archéologues, les traces humaines."],
  ["Deux récits d’un même événement ne disent pas la même chose. Que fait l’historien ?", "Il les compare et cherche d’autres sources", ["Il choisit celui qui lui plaît", "Il invente la suite", "Il les jette"], "Comparer les sources aide à approcher la réalité."],
  ["Le témoignage d’une personne âgée sur son enfance, c’est…", "une source orale", ["une source archéologique", "une fiction", "une reconstitution 3D"], "Les témoignages oraux renseignent sur le passé récent."],
];

/** Cycle 2 · sources, traces et mémoire ; distinguer source, reconstitution et fiction ; mythes et idées reçues. */
export function gen(): Question {
  if (Math.random() < 0.4) {
    const [doc, i, why] = pick(DOCS);
    return { q: `Qu’est-ce que c’est : ${doc} ?`, txt: 1, a: TYPES[i], choices: shuffle([...TYPES]), why };
  }
  const [q, a, faux, why] = pick(ITEMS);
  return { q, txt: 1, a, choices: shuffle([a, ...faux]), why };
}
