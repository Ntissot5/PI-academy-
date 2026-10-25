import { defineConfig, devices } from "@playwright/test";

// Par défaut, Playwright démarre un PocketBase jetable (port 8091) et l'appli construite avec
// NEXT_PUBLIC_E2E=1 (port 3001). Avec E2E_APP_URL, il réutilise des serveurs déjà lancés.
const external = process.env.E2E_APP_URL;
const APP = external || "http://localhost:3001";

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: { baseURL: APP, timezoneId: "Europe/Zurich", locale: "fr-CH", trace: "retain-on-failure" },
  projects: [{ name: "mobile", use: { ...devices["Pixel 7"], viewport: { width: 400, height: 860 } } }],
  webServer: external ? undefined : [
    { command: "bash scripts/e2e-backend.sh", url: "http://127.0.0.1:8091/api/health", reuseExistingServer: false, timeout: 60_000 },
    {
      command: "npx next build && npx next start -p 3001",
      url: APP,
      reuseExistingServer: false,
      timeout: 240_000,
      env: { NEXT_PUBLIC_E2E: "1", NEXT_PUBLIC_PB_URL: "http://127.0.0.1:8091", NEXT_DIST_DIR: ".next-e2e" },
    },
  ],
});
