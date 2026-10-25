/// <reference path="../pb_data/types.d.ts" />
// Routes et règles serveur de Pi Academy.
// Rappel goja : chaque handler s'exécute dans sa propre VM, les require() se font donc à l'intérieur.

/* ---------- mots de passe et PIN ---------- */

onRecordCreateRequest((e) => {
  const body = e.requestInfo().body;
  const pw = String(body.password || "");
  if (e.record.getString("role") === "eleve") {
    if (!/^\d{4}$/.test(pw)) throw new BadRequestError("Le PIN fait 4 chiffres.");
  } else if (pw.length < 8) {
    throw new BadRequestError("Ton mot de passe doit faire au moins 8 caractères.");
  }
  e.record.set("xp", 0);
  e.next();
}, "users");

onRecordUpdateRequest((e) => {
  const body = e.requestInfo().body;
  if (body.password !== undefined) {
    const pw = String(body.password);
    if (e.record.getString("role") === "eleve") {
      if (!/^\d{4}$/.test(pw)) throw new BadRequestError("Le PIN fait 4 chiffres.");
    } else if (pw.length < 8) {
      throw new BadRequestError("Ton mot de passe doit faire au moins 8 caractères.");
    }
  }
  e.next();
}, "users");

/* ---------- classes : code à 6 caractères ---------- */

onRecordCreateRequest((e) => {
  // Sans 0/O ni 1/I pour éviter les confusions au tableau.
  const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  for (let i = 0; i < 20; i++) {
    const code = $security.randomStringWithAlphabet(6, ALPHA);
    try {
      $app.findFirstRecordByFilter("classes", "code = {:c}", { c: code });
    } catch (_) {
      e.record.set("code", code);
      break;
    }
  }
  e.next();
}, "classes");

/* ---------- état d'un parcours : unités + progression + stats ---------- */

routerAdd("GET", "/api/pi/etat", (e) => {
  const { userStats } = require(`${__hooks}/lib/stats.js`);
  const { canOpenParcours } = require(`${__hooks}/lib/access.js`);
  const slug = e.request.url.query().get("parcours");
  const stats = userStats($app, e.auth.id);
  if (!slug) return e.json(200, { stats: stats });

  let parcours;
  try {
    parcours = $app.findFirstRecordByFilter("parcours", "slug = {:s}", { s: slug });
  } catch (_) {
    throw new NotFoundError("Parcours introuvable.");
  }
  if (!canOpenParcours($app, e.auth, parcours)) throw new ForbiddenError("Ce parcours n'est pas ouvert pour toi.");

  const unites = $app.findRecordsByFilter("unites", "parcours = {:p}", "ordre", 0, 0, { p: parcours.id });
  const progs = $app.findRecordsByFilter(
    "progressions", "utilisateur = {:u} && unite.parcours = {:p}", "", 0, 0, { u: e.auth.id, p: parcours.id });
  const byUnit = {};
  for (const p of progs) byUnit[p.getString("unite")] = p;

  // Canton effectif : celui du profil, sinon celui de la classe (élèves).
  let canton = e.auth.getString("canton");
  if (!canton && e.auth.getString("classe")) {
    try { canton = $app.findRecordById("classes", e.auth.getString("classe")).getString("canton"); } catch (_) { canton = ""; }
  }
  let matiere = null;
  if (parcours.getString("matiere")) {
    try { const m = $app.findRecordById("matieres", parcours.getString("matiere")); matiere = { slug: m.getString("slug"), nom: m.getString("nom") }; } catch (_) { matiere = null; }
  }

  return e.json(200, {
    stats: stats,
    canton: canton,
    matiere: matiere,
    parcours: parcours,
    unites: unites.map((u) => {
      const p = byUnit[u.id];
      return {
        id: u.id,
        ordre: u.getInt("ordre"),
        id_generateur: u.getString("id_generateur"),
        titre: u.getString("titre"),
        sous_titre: u.getString("sous_titre"),
        regle: u.getString("regle"),
        exemple: u.getString("exemple"),
        image: u.getString("image"),
        piege: u.getString("piege"),
        icone: u.getString("icone"),
        progression: p ? {
          meilleur_entrainement: p.getInt("meilleur_entrainement"),
          meilleur_boss: p.getInt("meilleur_boss"),
          nb_entrainements: p.getInt("nb_entrainements"),
          nb_boss: p.getInt("nb_boss"),
          valide: p.getBool("valide"),
          lecon_lue: p.getBool("lecon_lue"),
        } : null,
      };
    }),
  });
}, $apis.requireAuth("users"));

/* ---------- leçon lue ---------- */

routerAdd("POST", "/api/pi/lecon", (e) => {
  const { canOpenParcours } = require(`${__hooks}/lib/access.js`);
  const body = e.requestInfo().body;
  let unite;
  try { unite = $app.findRecordById("unites", String(body.unite || "")); } catch (_) { throw new NotFoundError("Unité introuvable."); }
  const parcours = $app.findRecordById("parcours", unite.getString("parcours"));
  if (!canOpenParcours($app, e.auth, parcours)) throw new ForbiddenError("Ce parcours n'est pas ouvert pour toi.");

  let p;
  try {
    p = $app.findFirstRecordByFilter("progressions", "utilisateur = {:u} && unite = {:un}", { u: e.auth.id, un: unite.id });
  } catch (_) {
    p = new Record($app.findCollectionByNameOrId("progressions"));
    p.set("utilisateur", e.auth.id);
    p.set("unite", unite.id);
  }
  if (!p.getBool("lecon_lue")) {
    p.set("lecon_lue", true);
    $app.save(p);
  }
  return e.json(200, { ok: true });
}, $apis.requireAuth("users"));

/* ---------- série : enregistrée en cours de route, et à la fin ---------- */
// Le client envoie l'état cumulé de la série (toutes les réponses depuis le début).
// Le serveur n'enregistre que ce qui est nouveau : on peut donc l'appeler à l'abandon,
// quand l'onglet passe en arrière-plan, puis à la fin, sans rien compter deux fois.
// Limite connue (README) : la correction est faite côté client, `ok` lui est fait confiance.

routerAdd("POST", "/api/pi/serie", (e) => {
  const { zurichDate } = require(`${__hooks}/lib/zurich.js`);
  const { userStats } = require(`${__hooks}/lib/stats.js`);
  const { canOpenParcours, cleanStatement, cleanShort } = require(`${__hooks}/lib/access.js`);
  const LEN = 10, PASS = 8, XP_GOOD = 10, XP_BOSS = 100, MAX_MIN = 30;

  const body = e.requestInfo().body;
  const serieId = String(body.serie || "");
  if (!/^[a-z0-9]{8,40}$/.test(serieId)) throw new BadRequestError("Identifiant de série invalide.");
  const mode = body.mode === "boss" ? "boss" : "entrainement";
  const reponses = Array.isArray(body.reponses) ? body.reponses.slice(0, LEN) : [];
  const finished = body.terminee === true && reponses.length === LEN;

  let unite;
  try { unite = $app.findRecordById("unites", String(body.unite || "")); } catch (_) { throw new NotFoundError("Unité introuvable."); }
  const parcours = $app.findRecordById("parcours", unite.getString("parcours"));
  if (!canOpenParcours($app, e.auth, parcours)) throw new ForbiddenError("Ce parcours n'est pas ouvert pour toi.");

  const out = { xp: 0, bonus: 0, valide: false, nouveau: false };

  $app.runInTransaction((tx) => {
    let s;
    try {
      s = tx.findFirstRecordByFilter("sessions", "utilisateur = {:u} && serie = {:s}", { u: e.auth.id, s: serieId });
    } catch (_) {
      s = new Record(tx.findCollectionByNameOrId("sessions"));
      s.set("utilisateur", e.auth.id);
      s.set("serie", serieId);
      s.set("unite", unite.id);
      s.set("mode", mode);
      s.set("date", zurichDate(Date.now()));
    }
    if (s.getString("unite") !== unite.id) throw new BadRequestError("Série déjà liée à une autre unité.");

    const already = s.getInt("total");
    const fresh = reponses.slice(already);
    let good = 0;
    const errCol = tx.findCollectionByNameOrId("erreurs");
    for (const r of fresh) {
      if (r && r.ok === true) { good++; continue; }
      const err = new Record(errCol);
      err.set("utilisateur", e.auth.id);
      err.set("unite", unite.id);
      err.set("enonce", cleanStatement(r && r.enonce));
      err.set("reponse_donnee", cleanShort(r && r.reponse));
      err.set("bonne_reponse", cleanShort(r && r.bonne));
      err.set("date", zurichDate(Date.now()));
      tx.save(err);
    }

    let xp = good * XP_GOOD;
    const minutes = Math.min(Math.max(Number(body.minutes) || 0, s.getFloat("minutes"), 0), MAX_MIN);
    s.set("minutes", Math.round(minutes * 100) / 100);
    s.set("total", Math.max(already, reponses.length));
    s.set("bonnes", s.getInt("bonnes") + good);

    if (finished && !s.getBool("terminee")) {
      s.set("terminee", true);
      const score = s.getInt("bonnes");
      let p;
      try {
        p = tx.findFirstRecordByFilter("progressions", "utilisateur = {:u} && unite = {:un}", { u: e.auth.id, un: unite.id });
      } catch (_) {
        p = new Record(tx.findCollectionByNameOrId("progressions"));
        p.set("utilisateur", e.auth.id);
        p.set("unite", unite.id);
      }
      if (mode === "boss") {
        p.set("nb_boss", p.getInt("nb_boss") + 1);
        p.set("meilleur_boss", Math.max(p.getInt("meilleur_boss"), score));
        if (score >= PASS) {
          out.valide = true;
          if (!p.getBool("valide")) {
            p.set("valide", true);
            xp += XP_BOSS;
            out.bonus = XP_BOSS;
            out.nouveau = true;
          }
        } else {
          p.set("boss_rates", p.getInt("boss_rates") + 1);
        }
      } else {
        p.set("nb_entrainements", p.getInt("nb_entrainements") + 1);
        p.set("meilleur_entrainement", Math.max(p.getInt("meilleur_entrainement"), score));
      }
      tx.save(p);
    }

    s.set("xp_gagne", s.getInt("xp_gagne") + xp);
    tx.save(s);
    if (xp) {
      const u = tx.findRecordById("users", e.auth.id);
      u.set("xp", u.getInt("xp") + xp);
      tx.save(u);
    }
    out.xp = xp;
  });

  out.stats = userStats($app, e.auth.id);
  return e.json(200, out);
}, $apis.requireAuth("users"));

/* ---------- élèves : rejoindre une classe, se connecter ---------- */
// Pas d'e-mail : code de classe + pseudo (unique dans la classe) + PIN à 4 chiffres.
// Le PIN est le mot de passe PocketBase de l'élève (bcrypt). 5 essais ratés → blocage 10 min.

routerAdd("POST", "/api/pi/eleve/rejoindre", (e) => {
  const E = require(`${__hooks}/lib/eleve.js`);
  const body = e.requestInfo().body;
  const code = E.normCode(body.code), pseudo = E.normPseudo(body.pseudo), pin = String(body.pin || "");
  const classe = E.findClasse($app, code);
  if (!classe) throw new BadRequestError("Ce code de classe n’existe pas. Vérifie-le avec ton prof.");
  if (!/^[\p{L}\p{N}][\p{L}\p{N} ._-]{1,23}$/u.test(pseudo)) {
    throw new BadRequestError("Ton pseudo fait 2 à 24 caractères : lettres, chiffres, espace, point, tiret.");
  }
  if (!/^\d{4}$/.test(pin)) throw new BadRequestError("Le PIN fait 4 chiffres.");
  if (E.findEleve($app, classe.id, pseudo)) throw new BadRequestError("Ce pseudo est déjà pris dans ta classe. Choisis-en un autre.");

  const u = new Record($app.findCollectionByNameOrId("users"));
  u.set("role", "eleve");
  u.set("pseudo", pseudo);
  u.set("classe", classe.id);
  u.set("xp", 0);
  u.set("verified", true);
  u.setPassword(pin);
  try {
    $app.save(u);
  } catch (_) {
    throw new BadRequestError("Ce pseudo est déjà pris dans ta classe. Choisis-en un autre.");
  }
  return $apis.recordAuthResponse(e, u, "pin");
});

routerAdd("POST", "/api/pi/eleve/connexion", (e) => {
  const E = require(`${__hooks}/lib/eleve.js`);
  const body = e.requestInfo().body;
  const code = E.normCode(body.code), pseudo = E.normPseudo(body.pseudo), pin = String(body.pin || "");
  const WRONG = "Code de classe, pseudo ou PIN incorrect.";
  const classe = E.findClasse($app, code);
  if (!classe) throw new BadRequestError(WRONG);
  const u = E.findEleve($app, classe.id, pseudo);
  if (!u) throw new BadRequestError(WRONG);

  const left = E.lockedMinutes(u);
  if (left > 0) throw new TooManyRequestsError(`Trop d’essais. Réessaie dans ${left} min, ou demande un nouveau PIN à ton prof.`);

  if (!/^\d{4}$/.test(pin) || !u.validatePassword(pin)) {
    const n = u.getInt("pin_echecs") + 1;
    if (n >= E.MAX_TRIES) {
      u.set("pin_echecs", 0);
      u.set("pin_bloque_jusqua", E.iso(Date.now() + E.LOCK_MIN * 60000));
      $app.save(u);
      throw new TooManyRequestsError(`Trop d’essais. Réessaie dans ${E.LOCK_MIN} min, ou demande un nouveau PIN à ton prof.`);
    }
    u.set("pin_echecs", n);
    $app.save(u);
    const rest = E.MAX_TRIES - n;
    throw new BadRequestError(`${WRONG} Encore ${rest} essai${rest > 1 ? "s" : ""}.`);
  }
  if (u.getInt("pin_echecs") || !u.getDateTime("pin_bloque_jusqua").isZero()) {
    u.set("pin_echecs", 0);
    u.set("pin_bloque_jusqua", "");
    $app.save(u);
  }
  return $apis.recordAuthResponse(e, u, "pin");
});

/* ---------- prof : tableau d'une classe, nouveau PIN ---------- */

routerAdd("GET", "/api/pi/prof/classe/{id}", (e) => {
  const { classeBoard } = require(`${__hooks}/lib/prof.js`);
  let classe;
  try { classe = $app.findRecordById("classes", e.request.pathValue("id")); } catch (_) { throw new NotFoundError("Classe introuvable."); }
  if (classe.getString("prof") !== e.auth.id) throw new NotFoundError("Classe introuvable.");
  return e.json(200, classeBoard($app, classe));
}, $apis.requireAuth("users"));

routerAdd("POST", "/api/pi/prof/eleve/{id}/pin", (e) => {
  const pin = String(e.requestInfo().body.pin || "");
  if (!/^\d{4}$/.test(pin)) throw new BadRequestError("Le PIN fait 4 chiffres.");
  let u;
  try { u = $app.findRecordById("users", e.request.pathValue("id")); } catch (_) { throw new NotFoundError("Élève introuvable."); }
  let ok = false;
  if (u.getString("role") === "eleve" && u.getString("classe")) {
    try { ok = $app.findRecordById("classes", u.getString("classe")).getString("prof") === e.auth.id; } catch (_) { ok = false; }
  }
  if (!ok) throw new NotFoundError("Élève introuvable.");
  u.setPassword(pin);
  u.set("pin_echecs", 0);
  u.set("pin_bloque_jusqua", "");
  $app.save(u);
  return e.json(200, { ok: true });
}, $apis.requireAuth("users"));
