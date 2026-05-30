import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 60000,
    fileParallelism: false, // mirrors jest maxWorkers:1 — avoid API rate limits
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts"],
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "coverage",
    },
  },
});
