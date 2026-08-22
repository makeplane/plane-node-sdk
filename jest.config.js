module.exports = {
  preset: "ts-jest",
  setupFiles: ["dotenv/config"],
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/__tests__/**/*.ts", "**/?(*.)+(spec|test).ts"],
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.jest.json",
      },
    ],
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts", "!src/**/*.spec.ts"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  // 180s, not 60s: tests/e2e/v2/support/client.ts's rate-limit retry budget needs
  // headroom to actually absorb this dev server's observed 429 Retry-After (56-59s)
  // instead of always losing the race against Jest's own timeout — see that file's
  // own comment. Harmless for every non-live test: they finish in milliseconds
  // regardless of the ceiling.
  testTimeout: 180000,
  verbose: true,
  // Allow tests to run in parallel but with some control
  maxWorkers: 1, // Run tests sequentially to avoid API rate limits
};
