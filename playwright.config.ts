import { defineConfig } from "@playwright/test";
import path from "path";

export default defineConfig({
  testDir: "./e2e",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
  },
  webServer: {
    command: "serve " + path.resolve(__dirname, "out") + " -l 3000",
    port: 3000,
    reuseExistingServer: true,
    timeout: 20000,
  },
});
