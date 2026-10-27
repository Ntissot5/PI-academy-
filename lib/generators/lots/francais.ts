import type { Lot } from "./types";
import { gen as fSyllabes } from "../f-syllabes";
import { gen as fRimes } from "../f-rimes";
import { gen as fLettres } from "../f-lettres";
import { gen as fSons } from "../f-sons";
import { gen as fAlphabet } from "../f-alphabet";
import { gen as fPhraseC1 } from "../f-phrase-c1";
import { gen as fGnC1 } from "../f-gn-c1";
import { gen as fTypes1 } from "../f-types1";
import { gen as fConjC1 } from "../f-conj-c1";
import { gen as fChronologie } from "../f-chronologie";
import { gen as fMotsC1 } from "../f-mots-c1";
import { gen as fLectureC1 } from "../f-lecture-c1";
import { gen as fMajuscules } from "../f-majuscules";
import { gen as fOrthographe } from "../f-orthographe";
import { gen as fHomolex } from "../f-homolex";
import { gen as fPolysemie } from "../f-polysemie";
import { gen as fFonctions1 } from "../f-fonctions1";
import { gen as fFonctions2 } from "../f-fonctions2";
import { gen as fFonctions3 } from "../f-fonctions3";
import { gen1 as fValeurs1, gen2 as fValeurs2 } from "../f-valeurs";
import { gen1 as fGroupes1, gen2 as fGroupes2 } from "../f-groupes";
import { gen1 as fClasses1, gen3 as fClasses3 } from "../f-classes";
import { gen as fSousClasses } from "../f-sous-classes";
import { gen as fTypes2 } from "../f-types2";
import { gen as fPassif } from "../f-passif";
import { gen as fPonctuation } from "../f-ponctuation";
import { gen as fAccordGn } from "../f-accord-gn";
import { gen as fPluriels } from "../f-pluriels";
import { gen as fComposes } from "../f-composes";
import { gen as fAccordSv1 } from "../f-accord-sv1";
import { gen as fAccordSv2 } from "../f-accord-sv2";
import { gen as fAccordSv3 } from "../f-accord-sv3";
import { gen as fAccordPp } from "../f-accord-pp";
import { gen as fPpAvoir } from "../f-pp-avoir";
import { gen as fPpPronominal } from "../f-pp-pronominal";
import { gen as fPpCas } from "../f-pp-cas";
import { gen as fHomophones2 } from "../f-homophones2";
import { gen as fToutMeme } from "../f-tout-meme";
import { gen as fQuelque } from "../f-quelque";
import { gen as fAdjVerbal } from "../f-adj-verbal";
import { gen as fRelations } from "../f-relations";
import { gen as fChampLexical } from "../f-champ-lexical";
import { gen as fSensFigure } from "../f-sens-figure";
import { gen as fFormation } from "../f-formation";
import { gen as fFamilles } from "../f-familles";
import { gen as fDictionnaire } from "../f-dictionnaire";
import { gen as fAdverbesMent } from "../f-adverbes-ment";
import { gen as fEtymologie } from "../f-etymologie";
import { gen as fMetalangage } from "../f-metalangage";
import { gen as fRegistres } from "../f-registres";
import { gen as fFigures1 } from "../f-figures1";
import { gen as fFigures2 } from "../f-figures2";
import { gen as fOrthographe3 } from "../f-orthographe3";
import { analyse as fConjAnalyse, conditionnel as fConditionnel, imperatif as fImperatif, tempsComposes as fTempsComposes, psIl as fPsIl, subjonctif as fSubjonctif, conj9 as fConj9, conj10 as fConj10, conj11 as fConj11, systeme as fConjSysteme } from "../f-conj-temps";
import { gen2 as fValeursTemps2, gen3 as fValeursTemps3 } from "../f-valeurs-temps";
import { gen as fReprises } from "../f-reprises";
import { gen as fConnecteurs } from "../f-connecteurs";
import { gen as fDiscours } from "../f-discours";
import { gen as fEnonciation } from "../f-enonciation";
import { gen as fModalisateurs } from "../f-modalisateurs";
import { gen1 as fPronoms1, gen2 as fPronoms2 } from "../f-pronoms";
import { gen as fRelatives } from "../f-relatives";
import { gen as fPhraseComplexe } from "../f-phrase-complexe";
import { gen as fSubordonnees } from "../f-subordonnees";
import { gen as fLecture2 } from "../f-lecture2";
import { gen as fGenres } from "../f-genres";
import { gen as fRecit } from "../f-recit";
import { gen as fArgumenter } from "../f-argumenter";
import { gen1 as fPoesie1, gen2 as fPoesie2 } from "../f-poesie";
import { gen as fTheatre } from "../f-theatre";
import { gen as fDocumentaire } from "../f-documentaire";

/** Lot « francais » : tout le français du PER, cycles 1 à 3 (voir docs/COMPLETER-LE-PER.md). */
export const LOT: Lot = {
  "f-syllabes": { gen: fSyllabes, label: "Français · syllabes", icon: "note" },
  "f-rimes": { gen: fRimes, label: "Français · rimes", icon: "star" },
  "f-lettres": { gen: fLettres, label: "Français · lettres et mots", icon: "eye" },
  "f-sons": { gen: fSons, label: "Français · sons et graphies", icon: "note" },
  "f-alphabet": { gen: fAlphabet, label: "Français · ordre alphabétique", icon: "folder" },
  "f-phrase-c1": { gen: fPhraseC1, label: "Français · sujet, verbe, groupes (cycle 1)", icon: "pin" },
  "f-gn-c1": { gen: fGnC1, label: "Français · genre et nombre (cycle 1)", icon: "flower" },
  "f-types1": { gen: fTypes1, label: "Français · types et formes de phrase (1)", icon: "mail" },
  "f-conj-c1": { gen: fConjC1, label: "Français · conjugaison (cycle 1)", icon: "cal31" },
  "f-chronologie": { gen: fChronologie, label: "Français · passé, présent, futur", icon: "cal31" },
  "f-mots-c1": { gen: fMotsC1, label: "Français · vocabulaire (cycle 1)", icon: "flower" },
  "f-lecture-c1": { gen: fLectureC1, label: "Français · lire et comprendre (cycle 1)", icon: "report" },
  "f-majuscules": { gen: fMajuscules, label: "Français · majuscules", icon: "pin" },
  "f-orthographe": { gen: fOrthographe, label: "Français · mots fréquents", icon: "note" },
  "f-homolex": { gen: fHomolex, label: "Français · homophones lexicaux", icon: "eye" },
  "f-polysemie": { gen: fPolysemie, label: "Français · mots à plusieurs sens", icon: "molecule" },
  "f-fonctions1": { gen: fFonctions1, label: "Français · fonctions (5e-6e)", icon: "pin" },
  "f-fonctions2": { gen: fFonctions2, label: "Français · fonctions (7e-11e)", icon: "pin" },
  "f-fonctions3": { gen: fFonctions3, label: "Français · attribut du CV, modificateurs", icon: "pin" },
  "f-valeurs1": { gen: fValeurs1, label: "Français · temps, lieu, but", icon: "plane" },
  "f-valeurs2": { gen: fValeurs2, label: "Français · valeurs des compléments", icon: "plane" },
  "f-groupes1": { gen: fGroupes1, label: "Français · groupes de la phrase (1)", icon: "folder" },
  "f-groupes2": { gen: fGroupes2, label: "Français · groupes de la phrase (2)", icon: "folder" },
  "f-classes1": { gen: fClasses1, label: "Français · classes de mots (5e-6e)", icon: "report" },
  "f-classes3": { gen: fClasses3, label: "Français · classes de mots selon l’emploi", icon: "report" },
  "f-sous-classes": { gen: fSousClasses, label: "Français · déterminants, pronoms, degrés", icon: "report" },
  "f-types2": { gen: fTypes2, label: "Français · types et formes de phrase (2)", icon: "mail" },
  "f-passif": { gen: fPassif, label: "Français · forme passive", icon: "mail" },
  "f-ponctuation": { gen: fPonctuation, label: "Français · ponctuation", icon: "note" },
  "f-accord-gn": { gen: fAccordGn, label: "Français · accord dans le groupe nominal", icon: "flower" },
  "f-pluriels": { gen: fPluriels, label: "Français · pluriels, couleurs, féminin", icon: "flower" },
  "f-composes": { gen: fComposes, label: "Français · pluriel des mots composés", icon: "flower" },
  "f-accord-sv1": { gen: fAccordSv1, label: "Français · accord sujet-verbe (1)", icon: "molecule" },
  "f-accord-sv2": { gen: fAccordSv2, label: "Français · accord sujet-verbe (2)", icon: "molecule" },
  "f-accord-sv3": { gen: fAccordSv3, label: "Français · accord avec un collectif", icon: "molecule" },
  "f-accord-pp": { gen: fAccordPp, label: "Français · participe passé (être, avoir)", icon: "cal31" },
  "f-pp-avoir": { gen: fPpAvoir, label: "Français · participe passé avec avoir", icon: "cal31" },
  "f-pp-pronominal": { gen: fPpPronominal, label: "Français · participe des verbes pronominaux", icon: "cal31" },
  "f-pp-cas": { gen: fPpCas, label: "Français · participe passé : cas particuliers", icon: "cal31" },
  "f-homophones2": { gen: fHomophones2, label: "Français · homophones grammaticaux (2)", icon: "eye" },
  "f-tout-meme": { gen: fToutMeme, label: "Français · tout et même", icon: "eye" },
  "f-quelque": { gen: fQuelque, label: "Français · quelque, quoique", icon: "eye" },
  "f-adj-verbal": { gen: fAdjVerbal, label: "Français · participe présent ou adjectif verbal", icon: "eye" },
  "f-relations": { gen: fRelations, label: "Français · synonymes, contraires, génériques", icon: "flower" },
  "f-champ-lexical": { gen: fChampLexical, label: "Français · champ lexical", icon: "flower" },
  "f-sens-figure": { gen: fSensFigure, label: "Français · sens propre et figuré", icon: "molecule" },
  "f-formation": { gen: fFormation, label: "Français · préfixes, suffixes, mots composés", icon: "molecule" },
  "f-familles": { gen: fFamilles, label: "Français · familles de mots", icon: "molecule" },
  "f-dictionnaire": { gen: fDictionnaire, label: "Français · utiliser le dictionnaire", icon: "folder" },
  "f-adverbes-ment": { gen: fAdverbesMent, label: "Français · adverbes en -ment", icon: "note" },
  "f-etymologie": { gen: fEtymologie, label: "Français · racines grecques et latines", icon: "molecule" },
  "f-metalangage": { gen: fMetalangage, label: "Français · mots pour parler de la langue", icon: "laptop" },
  "f-registres": { gen: fRegistres, label: "Français · registres de langue", icon: "mail" },
  "f-figures1": { gen: fFigures1, label: "Français · figures de style (1)", icon: "star" },
  "f-figures2": { gen: fFigures2, label: "Français · figures de style (2)", icon: "star" },
  "f-orthographe3": { gen: fOrthographe3, label: "Français · orthographe des mots difficiles", icon: "note" },
  "f-conj-analyse": { gen: fConjAnalyse, label: "Français · analyser une forme verbale", icon: "laptop" },
  "f-conditionnel": { gen: fConditionnel, label: "Français · conditionnel présent", icon: "plane" },
  "f-imperatif": { gen: fImperatif, label: "Français · impératif", icon: "mail" },
  "f-temps-composes": { gen: fTempsComposes, label: "Français · plus-que-parfait, futur antérieur", icon: "cal31" },
  "f-ps-il": { gen: fPsIl, label: "Français · passé simple (il, ils)", icon: "cal31" },
  "f-subjonctif": { gen: fSubjonctif, label: "Français · subjonctif présent", icon: "note" },
  "f-conj9": { gen: fConj9, label: "Français · conjugaison 9e (tous les temps)", icon: "cal31" },
  "f-conj10": { gen: fConj10, label: "Français · conjugaison 10e", icon: "cal31" },
  "f-conj11": { gen: fConj11, label: "Français · conjugaison 11e", icon: "cal31" },
  "f-conj-systeme": { gen: fConjSysteme, label: "Français · modes et temps", icon: "laptop" },
  "f-valeurs-temps2": { gen: fValeursTemps2, label: "Français · valeurs des temps (2)", icon: "cal31" },
  "f-valeurs-temps3": { gen: fValeursTemps3, label: "Français · valeurs des temps (3)", icon: "cal31" },
  "f-reprises": { gen: fReprises, label: "Français · reprises dans un texte", icon: "report" },
  "f-connecteurs": { gen: fConnecteurs, label: "Français · organisateurs et connecteurs", icon: "plane" },
  "f-discours": { gen: fDiscours, label: "Français · paroles rapportées", icon: "mail" },
  "f-enonciation": { gen: fEnonciation, label: "Français · énonciation", icon: "mail" },
  "f-modalisateurs": { gen: fModalisateurs, label: "Français · modalisateurs", icon: "eye" },
  "f-pronoms1": { gen: fPronoms1, label: "Français · pronominalisation (1)", icon: "pin" },
  "f-pronoms2": { gen: fPronoms2, label: "Français · pronominalisation (2)", icon: "pin" },
  "f-relatives": { gen: fRelatives, label: "Français · pronoms relatifs", icon: "pin" },
  "f-phrase-complexe": { gen: fPhraseComplexe, label: "Français · phrase simple et complexe", icon: "folder" },
  "f-subordonnees": { gen: fSubordonnees, label: "Français · subordonnées", icon: "folder" },
  "f-lecture2": { gen: fLecture2, label: "Français · lire et comprendre (cycle 2)", icon: "report" },
  "f-genres": { gen: fGenres, label: "Français · genres de textes", icon: "report" },
  "f-recit": { gen: fRecit, label: "Français · le récit", icon: "report" },
  "f-argumenter": { gen: fArgumenter, label: "Français · texte qui argumente", icon: "report" },
  "f-poesie1": { gen: fPoesie1, label: "Français · poésie (vers, rimes)", icon: "star" },
  "f-poesie2": { gen: fPoesie2, label: "Français · poésie (sonorités)", icon: "star" },
  "f-theatre": { gen: fTheatre, label: "Français · théâtre", icon: "star" },
  "f-documentaire": { gen: fDocumentaire, label: "Français · texte documentaire", icon: "report" },
};
