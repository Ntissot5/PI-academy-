// Tableau du prof : élèves × unités, dernière session, élèves bloqués.
const { zurichDate, addDays } = require(`${__hooks}/lib/zurich.js`);

const IDLE_DAYS = 7;
const BOSS_FAILS = 2;

function classeBoard(app, classe) {
  const today = zurichDate(Date.now());
  const limit = addDays(today, -IDLE_DAYS);

  const parcoursIds = classe.getStringSlice("parcours_assignes");
  const parcours = [];
  const unitTitle = {};
  for (const pid of parcoursIds) {
    let p;
    try { p = app.findRecordById("parcours", pid); } catch (_) { continue; }
    const us = app.findRecordsByFilter("unites", "parcours = {:p}", "ordre", 0, 0, { p: pid });
    parcours.push({
      id: p.id, slug: p.getString("slug"), titre: p.getString("titre"), ordre: p.getInt("ordre"),
      matiere: p.getString("matiere"), annee_min: p.getInt("annee_min"), annee_max: p.getInt("annee_max"),
      unites: us.map((u) => {
        unitTitle[u.id] = u.getString("titre");
        return {
          id: u.id, ordre: u.getInt("ordre"), titre: u.getString("titre"), id_generateur: u.getString("id_generateur"), icone: u.getString("icone"),
          statut: u.getString("statut") || "actif", per_codes: u.get("per_codes") || [], annee: u.getString("annee"),
        };
      }),
    });
  }
  parcours.sort((a, b) => a.ordre - b.ordre);

  const eleves = app.findRecordsByFilter("users", 'classe = {:c} && role = "eleve"', "pseudo", 0, 0, { c: classe.id });
  const rows = eleves.map((u) => {
    const progs = app.findRecordsByFilter("progressions", "utilisateur = {:u}", "", 0, 0, { u: u.id });
    const progression = {};
    const raisons = [];
    for (const p of progs) {
      const uid = p.getString("unite");
      progression[uid] = {
        meilleur_entrainement: p.getInt("meilleur_entrainement"),
        meilleur_boss: p.getInt("meilleur_boss"),
        nb_entrainements: p.getInt("nb_entrainements"),
        nb_boss: p.getInt("nb_boss"),
        boss_rates: p.getInt("boss_rates"),
        valide: p.getBool("valide"),
        lecon_lue: p.getBool("lecon_lue"),
      };
      if (!p.getBool("valide") && p.getInt("boss_rates") >= BOSS_FAILS && unitTitle[uid]) {
        raisons.push(`Boss « ${unitTitle[uid]} » raté ${p.getInt("boss_rates")} fois`);
      }
    }
    let last = "";
    try {
      const s = app.findRecordsByFilter("sessions", "utilisateur = {:u}", "-date", 1, 0, { u: u.id });
      if (s.length) last = s[0].getString("date");
    } catch (_) { /* aucune session */ }
    const joined = zurichDate(u.getDateTime("created").unix() * 1000);
    if (last && last < limit) raisons.unshift(`Aucune session depuis ${last.split("-").reverse().join(".")}`);
    else if (!last && joined < limit) raisons.unshift(`Aucune session depuis son arrivée (${IDLE_DAYS}+ jours)`);
    let erreurs = 0;
    try { erreurs = app.countRecords("erreurs", $dbx.hashExp({ utilisateur: u.id })); } catch (_) { /* compte indisponible */ }
    return {
      id: u.id, pseudo: u.getString("pseudo"), xp: u.getInt("xp"), derniere_session: last,
      nouveau: !last && joined >= limit, bloque: raisons.length > 0, raisons: raisons, erreurs: erreurs,
      progression: progression,
    };
  });

  return {
    today: today,
    classe: { id: classe.id, nom: classe.getString("nom"), code: classe.getString("code"), parcours_assignes: parcoursIds },
    parcours: parcours,
    eleves: rows,
  };
}

module.exports = { classeBoard, IDLE_DAYS, BOSS_FAILS };
