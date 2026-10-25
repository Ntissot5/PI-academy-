#!/usr/bin/env node
// Captures comparées prototype ↔ application : accueil, unité, quiz, résultat,
// à 400 px et en desktop, en clair et en sombre. Les deux côtés reçoivent le même état
// de progression et le même tirage aléatoire, pour comparer à contenu égal.
//
//   APP_URL=http://localhost:3000 PB_URL=http://127.0.0.1:8090 \
//   PB_SUPERUSER_EMAIL=… PB_SUPERUSER_PASSWORD=… node scripts/captures.mjs [dossier]
//
// L'application doit être construite avec NEXT_PUBLIC_E2E=1 (pour lire la bonne réponse).

import { chromium } from "@playwright/test";
import { cp, mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = path.resolve(process.argv[2] || path.join(ROOT, "captures"));
const APP = process.env.APP_URL || "http://localhost:3000";
const PB = process.env.PB_URL || "http://127.0.0.1:8090";
const EMAIL = "captures@example.ch", PASSWORD = "captures-2026";

/* ---------- état commun ---------- */
const DAYS = { 0: 12, 1: 25, 2: 20, 3: 8, 5: 22, 9: 15, 12: 6 }; // minutes, il y a N jours
const XP = 520;
const zurich = (offset) => {
  const d = new Date(Date.now() + 864e5 * -offset);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Zurich" }).format(d);
};

async function api(method, p, body, token) {
  const r = await fetch(PB + p, { method, headers: { "Content-Type": "application/json", ...(token && { Authorization: token }) }, body: body && JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${method} ${p} ${r.status} ${JSON.stringify(j)}`);
  return j;
}

async function prepareApp() {
  const su = (await api("POST", "/api/collections/_superusers/auth-with-password", { identity: process.env.PB_SUPERUSER_EMAIL, password: process.env.PB_SUPERUSER_PASSWORD })).token;
  const old = await api("GET", `/api/collections/users/records?filter=${encodeURIComponent(`email="${EMAIL}"`)}`, null, su);
  for (const u of old.items) await api("DELETE", `/api/collections/users/records/${u.id}`, null, su);
  const user = await api("POST", "/api/collections/users/records", { email: EMAIL, password: PASSWORD, passwordConfirm: PASSWORD, role: "adulte", name: "Captures" }, su);
  await api("PATCH", `/api/collections/users/records/${user.id}`, { xp: XP }, su);
  const prepa = (await api("GET", `/api/collections/parcours/records?filter=${encodeURIComponent('slug="prepa-epfl"')}`)).items[0];
  const units = (await api("GET", `/api/collections/unites/records?sort=ordre&perPage=50&filter=${encodeURIComponent(`parcours="${prepa.id}"`)}`)).items;
  const P = [
    { unite: units[0].id, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 9, nb_boss: 1, meilleur_boss: 10, valide: true },
    { unite: units[1].id, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 8, nb_boss: 1, meilleur_boss: 9, valide: true },
    { unite: units[2].id, lecon_lue: true, nb_entrainements: 1, meilleur_entrainement: 9 },
  ];
  for (const p of P) await api("POST", "/api/collections/progressions/records", { ...p, utilisateur: user.id }, su);
  let k = 0;
  for (const [off, min] of Object.entries(DAYS)) {
    await api("POST", "/api/collections/sessions/records", { utilisateur: user.id, serie: `capture${k++}xx`, unite: units[0].id, mode: "entrainement", date: zurich(+off), minutes: min, total: 10, bonnes: 8, terminee: true }, su);
  }
  return Object.keys(DAYS).length * 10;
}

function protoState(answered) {
  const days = {};
  for (const [off, min] of Object.entries(DAYS)) days[zurich(+off)] = min;
  return { xp: XP, pass: { rel: true, frac: true }, best: { rel: 10, frac: 9 }, train: { rel: 9, frac: 8, pow: 9 }, read: { rel: true, frac: true, pow: true }, days, answered };
}

/* ---------- même hasard des deux côtés ---------- */
const SEED = (seed) => {
  let s = seed >>> 0;
  Math.random = () => { s = (s + 0x6d2b79f5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
};

const VIEWS = [
  { name: "400", viewport: { width: 400, height: 860 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: "desktop", viewport: { width: 1280, height: 860 }, deviceScaleFactor: 1 },
];
const THEMES = ["light", "dark"];

async function shoot(page, file) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: file, fullPage: true, animations: "disabled" });
}

/** Répond juste, sauf aux questions listées dans `wrong`. */
async function playSeries(page, getAnswer, wrong) {
  for (let q = 0; q < 10; q++) {
    const a = await getAnswer();
    await page.fill("#ain", wrong.includes(q) ? "999" : a);
    await page.click("#ok");
    await page.click("#ok");
  }
}

/**
 * Le prototype a été validé comme artifact : la plateforme l'enveloppe dans un squelette HTML
 * (doctype, meta viewport, body sans marge). On reproduit cette enveloppe, sinon le fichier brut
 * s'affiche à 980 px de large sur mobile.
 */
async function protoUrl() {
  const dir = await mkdtemp(path.join(os.tmpdir(), "proto-"));
  const html = await readFile(path.join(ROOT, "reference/route-epfl.html"), "utf8");
  await writeFile(path.join(dir, "index.html"),
    '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>body{margin:0}</style></head><body>' + html + "</body></html>");
  await cp(path.join(ROOT, "reference/icons"), path.join(dir, "icons"), { recursive: true });
  return "file://" + path.join(dir, "index.html");
}

async function run() {
  await mkdir(OUT, { recursive: true });
  const PROTO = await protoUrl();
  const browser = await chromium.launch();

  for (const v of VIEWS) for (const theme of THEMES) {
    const answered = await prepareApp(); // état identique pour chaque capture
    const tag = `${v.name}-${theme === "light" ? "clair" : "sombre"}`;

    /* prototype */
    {
      const ctx = await browser.newContext({ ...v, colorScheme: theme, reducedMotion: "reduce", timezoneId: "Europe/Zurich", locale: "fr-CH" });
      const page = await ctx.newPage();
      await page.addInitScript(([st]) => {
        localStorage.setItem("route-epfl-v1", JSON.stringify(st));
      }, [protoState(answered)]);
      await page.goto(PROTO);
      await shoot(page, `${OUT}/accueil-${tag}-prototype.png`);
      await page.click('.unit[data-i="2"]');
      await shoot(page, `${OUT}/unite-${tag}-prototype.png`);
      await page.evaluate(SEED, 42);
      await page.click("#go");
      await shoot(page, `${OUT}/quiz-${tag}-prototype.png`);
      await page.evaluate(() => { window.scrollTo(0, 0); });
      await playSeries(page, () => page.evaluate("fr(Q.cur.a)"), [3, 7]);
      await shoot(page, `${OUT}/resultat-${tag}-prototype.png`);
      await ctx.close();
    }

    /* application */
    {
      const ctx = await browser.newContext({ ...v, colorScheme: theme, reducedMotion: "reduce", timezoneId: "Europe/Zurich", locale: "fr-CH" });
      const page = await ctx.newPage();
      await page.goto(`${APP}/connexion`);
      await page.fill("#email", EMAIL);
      await page.fill("#pw", PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL("**/parcours");
      await page.goto(`${APP}/parcours/prepa-epfl`);
      await page.waitForSelector(".units .unit");
      await shoot(page, `${OUT}/accueil-${tag}-app.png`);
      await page.click(".units .unit >> nth=2");
      await page.waitForSelector(".article");
      await shoot(page, `${OUT}/unite-${tag}-app.png`);
      await page.evaluate(SEED, 42);
      await page.click("#go");
      await page.waitForSelector("#ain");
      await shoot(page, `${OUT}/quiz-${tag}-app.png`);
      await playSeries(page, () => page.evaluate(() => window.__piAnswer), [3, 7]);
      await page.waitForSelector(".res");
      await shoot(page, `${OUT}/resultat-${tag}-app.png`);
      await ctx.close();
    }
    console.log("ok", tag);
  }
  await browser.close();
}

run().catch((e) => { console.error(e); process.exit(1); });
