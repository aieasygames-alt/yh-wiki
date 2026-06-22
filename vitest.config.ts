/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.test.{ts,tsx}"],
    coverage: {
      // Coverage thresholds — enforced on `vitest run --coverage`.
      // Started conservative (50% lines / 40% branches) to match current state.
      // Bump these as more tests are added.
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: ["lib/**/*.ts", "components/**/*.{ts,tsx}"],
      exclude: [
        "lib/__tests__/**",
        "components/__tests__/**",
        "**/*.test.{ts,tsx}",
        "lib/placeholder.ts", // visual helper, hard to unit-test
        "lib/map-utils.ts",   // heavy leaflet geometry — covered by E2E
        "lib/use-map-data.ts", // React hook, covered by E2E
      ],
      thresholds: {
        lines: 50,
        functions: 45,
        statements: 50,
        branches: 40,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
});
