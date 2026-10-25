import { deBanque, tirer, type Item } from "./f-outils";
import type { Question } from "./types";

const ITEMS: readonly Item[] = [
  ["Dans un livre documentaire, où trouves-tu la liste des chapitres avec leur numéro de page ?", "dans la table des matières", ["dans l’index", "dans le glossaire", "dans la quatrième de couverture"], "La table des matières présente les parties du livre dans l’ordre."],
  ["Dans un livre documentaire, où cherches-tu rapidement un mot précis, classé par ordre alphabétique ?", "dans l’index", ["dans la table des matières", "dans la préface", "dans la légende"], "L’index classe les mots importants par ordre alphabétique, avec leurs pages."],
  ["Le petit texte qui explique une photo ou un schéma s’appelle…", "une légende", ["un titre", "un intertitre", "un index"], "La légende accompagne une illustration."],
  ["Le titre d’une partie à l’intérieur d’un article s’appelle…", "un intertitre", ["une légende", "un chapeau", "une signature"], "L’intertitre annonce le contenu d’une partie."],
  ["Pour montrer l’évolution de la température au fil des mois, la présentation la plus claire est…", "un graphique", ["un poème", "un dialogue", "une liste de courses"], "Un graphique montre des données chiffrées et leur évolution."],
  ["*Le pont a été ouvert le 4 mai.* Cette phrase présente…", "un fait (objectif)", ["un commentaire (subjectif)", "une opinion personnelle", "une question"], "Elle donne une information vérifiable, sans jugement."],
  ["*Ce pont est magnifique et très utile.* Cette phrase présente…", "un commentaire (subjectif)", ["un fait (objectif)", "une définition", "une date"], "« magnifique » exprime un jugement : c’est subjectif."],
  ["*On a observé que les glaciers reculent.* Quel procédé efface l’émetteur ?", "le pronom indéfini « on »", ["le point final", "le verbe au futur", "un adjectif de couleur"], "« On » évite de dire qui parle : le texte paraît plus objectif."],
  ["*Il est constaté que les abeilles disparaissent.* Quel procédé efface l’émetteur ?", "la tournure impersonnelle", ["le discours direct", "la première personne", "une question"], "« Il est constaté que » : tournure impersonnelle, sans « je »."],
  ["*Des mesures ont été effectuées dans le lac.* Quel procédé efface l’émetteur ?", "la forme passive sans complément d’agent", ["l’impératif", "le présent de narration", "une comparaison"], "On ne sait pas qui a effectué les mesures : la forme passive efface l’auteur de l’action."],
  ["Pour vérifier une information trouvée sur Internet, il faut d’abord…", "identifier la source et la comparer à d’autres sources", ["la recopier telle quelle", "vérifier qu’elle a beaucoup de « j’aime »", "choisir la plus courte"], "Une information fiable a une source connue et se retrouve dans d’autres documents sérieux."],
  ["Quelle source est la plus fiable pour connaître la population d’une ville suisse ?", "l’Office fédéral de la statistique", ["un commentaire sur un réseau social", "une publicité", "un forum anonyme"], "Un organisme officiel, spécialisé et identifié, est une source fiable."],
];

/** Le texte qui transmet des savoirs : organisation, présentation de l'information, objectivité, sources. */
export function gen(): Question {
  return tirer([deBanque(ITEMS)]);
}
