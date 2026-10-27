import { expect, test } from "@playwright/test";
import { uniqueEmail } from "./helpers";

const PB = process.env.E2E_PB_URL || "http://127.0.0.1:8091";

// Référentiel PER : un parcours par année, notions « Bientôt », texte officiel et répartition cantonale pour les profs,
// filtres de l'espace prof, et refus côté serveur d'une unité sans code PER.
test("PER : parcours par année, Bientôt, texte officiel, filtres prof", async ({ page, request }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/connexion?role=prof");
  await page.fill("#email", uniqueEmail("per"));
  await page.fill("#pw", "mot-de-passe-per");
  await page.fill("#pw2", "mot-de-passe-per");
  await page.getByRole("button", { name: "Créer mon compte prof" }).click();
  await page.waitForURL("**/prof");

  // classe genevoise, filtre par année : seuls les parcours de 10e restent à assigner
  await page.fill("#class-name", "10e A · PER");
  await page.selectOption("#class-canton", "GE");
  await page.getByRole("button", { name: "Créer la classe" }).click();
  await expect(page.locator("#class-code")).toHaveText(/^[A-Z0-9]{6}$/);
  await page.getByLabel("Année").selectOption("10");
  await expect(page.locator(".assign-row", { hasText: "Maths 10e" })).toBeVisible();
  await expect(page.locator(".assign-row", { hasText: "Maths 9e" })).toHaveCount(0);
  await page.locator(".assign-row", { hasText: "Maths 10e" }).locator("input").check();
  // un élève rejoint la classe : le tableau de maîtrise apparaît
  const code = (await page.locator("#class-code").textContent())!.trim();
  expect((await request.post(`${PB}/api/pi/eleve/rejoindre`, { data: { code, pseudo: "Élève-PER", pin: "4321" } })).status()).toBe(200);
  // le tableau de maîtrise montre les codes PER ; les notions « Bientôt » n'ont pas de colonne
  await expect(page.locator(".board th .per-code").first()).toContainText("MSN");
  await page.getByLabel("Code PER").selectOption("MSN 34");
  // seules les unités MSN 34 (et l'examen final, mixte) gardent une colonne
  const cols = page.locator(".board thead th[title] .per-code");
  await expect(cols.first()).toBeVisible();
  for (const t of await cols.allTextContents()) expect(t === "mixte" || t.includes("MSN 34"), t).toBe(true);
  await page.getByLabel("Code PER").selectOption("");

  // Français 10e : les notions de rédaction et d'oral sont « En classe », visibles mais fermées
  await page.goto("/parcours/francais-10e");
  await expect(page.locator(".unit.soon").first()).toContainText("En classe");
  await page.locator(".unit.soon").first().click({ force: true });
  await expect(page.locator(".toast")).toContainText("en classe");
  // Maths 10e : toutes les notions ont leurs exercices
  await page.goto("/parcours/mathematiques-10e");
  await expect(page.locator(".hero h1")).toContainText("programme officiel de 10e");
  await expect(page.locator(".unit.soon")).toHaveCount(0);
  await page.click("#cont");
  await expect(page.locator(".per-line")).toContainText(/MSN 3\d/);
  // texte officiel pour le prof, et répartition genevoise
  await page.locator(".per-off summary").click();
  await expect(page.locator(".per-off")).toContainText("Répartition du canton : Genève");
  await expect(page.locator(".per-off")).toContainText("Plan d’études romand");
  await expect(page.locator(".per-off a", { hasText: "Source" }).first()).toHaveAttribute("href", /portail\.ciip\.ch/);
  await expect(page.locator(".site-foot")).toContainText("© CIIP");

  // serveur : pas d'unité sans code PER, pas de secondaire II hors Prépa EPFL
  const auth = await request.post(`${PB}/api/collections/users/auth-with-password`, { data: { identity: "admin.e2e@example.ch", password: "admin-e2e-2026" } });
  const token = (await auth.json()).token as string;
  const pr = await request.get(`${PB}/api/collections/parcours/records?filter=${encodeURIComponent("slug='mathematiques-10e'")}`);
  const pid = (await pr.json()).items[0].id as string;
  const post = (data: Record<string, unknown>) => request.post(`${PB}/api/collections/unites/records`, { headers: { Authorization: token }, data: { parcours: pid, ordre: 99, titre: "Test", ...data } });
  expect((await post({ id_generateur: "rel" })).status()).toBe(400);
  expect((await post({ id_generateur: "trig", tag: "secondaire_II" })).status()).toBe(400);
  const okRes = await post({ id_generateur: "rel", per_codes: ["MSN 32"], annee: "10e", statut: "actif" });
  expect(okRes.status()).toBe(200);
  await request.delete(`${PB}/api/collections/unites/records/${(await okRes.json()).id}`, { headers: { Authorization: token } });

  expect(errors).toEqual([]);
});
