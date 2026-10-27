import { expect, test } from "@playwright/test";
import { playSeries, uniqueEmail } from "./helpers";

const PB = process.env.E2E_PB_URL || "http://127.0.0.1:8091";

// Répétition espacée : une unité battue revient « À réviser » le jour prévu ; une révision réussie espace la suivante.
test("révisions : unité due, révision réussie, intervalle allongé ; lecture à voix haute disponible", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const email = uniqueEmail("revision");
  await page.goto("/connexion?role=adulte");
  await page.fill("#email", email);
  await page.fill("#pw", "mot-de-passe-e2e");
  await page.fill("#pw2", "mot-de-passe-e2e");
  await page.getByRole("button", { name: "Créer mon compte" }).click();
  await page.waitForURL("**/parcours");

  // boss de l'unité 1 battu : première révision prévue demain
  await page.goto("/parcours/prepa-epfl/unite/1");
  await page.click("#boss");
  await playSeries(page);
  await expect(page.locator(".res h2")).toHaveText("Boss battu !");

  // on avance l'horloge de la révision (comme si un jour avait passé)
  const su = await request.post(`${PB}/api/collections/_superusers/auth-with-password`, { data: { identity: "e2e@example.ch", password: "e2e-superuser-2026" } });
  const token = (await su.json()).token as string;
  const users = await request.get(`${PB}/api/collections/users/records?filter=${encodeURIComponent(`email='${email}'`)}`, { headers: { Authorization: token } });
  const uid = (await users.json()).items[0].id as string;
  const progs = await request.get(`${PB}/api/collections/progressions/records?filter=${encodeURIComponent(`utilisateur='${uid}' && valide=true`)}`, { headers: { Authorization: token } });
  const prog = (await progs.json()).items[0];
  expect(prog.intervalle).toBe(1);
  await request.patch(`${PB}/api/collections/progressions/records/${prog.id}`, { headers: { Authorization: token }, data: { revision_le: "2026-01-01" } });

  // l'unité apparaît dans « À réviser aujourd'hui »
  await page.goto("/parcours");
  await page.selectOption("#canton", "VD");
  await expect(page.locator(".revisions")).toContainText("Nombres négatifs");
  await page.locator(".rev-row", { hasText: "Nombres négatifs" }).click();
  // lecture à voix haute proposée (si le navigateur a une synthèse vocale)
  const voix = await page.evaluate(() => "speechSynthesis" in window);
  if (voix) await expect(page.locator(".voix-btn")).toBeVisible();
  await playSeries(page);
  await expect(page.locator(".res")).toContainText("Révision réussie : on la revoit dans 3 jours.");

  // et elle ne figure plus dans les révisions du jour
  await page.goto("/parcours");
  await expect(page.locator(".revisions")).toHaveCount(0);
  expect(errors).toEqual([]);
});
