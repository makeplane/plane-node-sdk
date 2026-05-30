# Migrate build to tsdown and tests to Vitest

**Date:** 2026-05-30
**Status:** Approved
**Scope:** `@makeplane/plane-node-sdk` build + test toolchain

## Goal

Replace the build pipeline (`tsc` + `dts-bundle-generator`) with **tsdown**, and replace
the test runner (**Jest** + **ts-jest**) with **Vitest**. Ship dual ESM + CJS output with a
proper `exports` map while preserving existing CJS consumers and keeping all CI script names
stable.

## Current state

- **Build:** `tsc` compiles CJS only (`module: commonjs`, `main: dist/index.js`), then
  `dts-bundle-generator` produces `dist/types.bundle.d.ts`. That bundled file is **not
  referenced anywhere** (`package.json#types` points at `dist/index.d.ts`), so nothing depends
  on it.
- **Tests:** Jest + ts-jest, 30 `*.test.ts` files. They use **bare globals**
  (`describe`/`it`/`expect`/`beforeAll`/`afterAll`) with **zero `jest.*` API usage** and no
  mocks. `tests/helpers/conditional-tests.ts` exposes `describeIf` built on `describe`/
  `describe.skip`. These are API-integration tests gated on env vars, run sequentially
  (`maxWorkers: 1`) to avoid API rate limits.
- **Env:** No dotenv loader is wired into Jest. CI injects env vars directly via the workflow
  `env:` block. Local runs rely on the shell environment.
- **Source:** `src/index.ts` is a flat barrel of `export { ... }` statements. No
  `__dirname`/`__filename`/`require()`/`import.meta` usage anywhere in `src/`, so the code
  compiles cleanly to either module format.
- **CI:** `.github/workflows/build-test.yaml` runs `check:lint`, `check:format`, `build`,
  `test:e2e`. `.github/workflows/publish-node-sdk.yml` runs `build`.

## Decisions

1. **Output format:** Dual ESM + CJS with a proper `exports` map.
2. **Type declarations:** Use tsdown's built-in bundled `.d.ts`; remove `dts-bundle-generator`
   and the dead `types.bundle.d.ts`.
3. **Test globals:** Enable Vitest `globals: true` so the 30 test files and helpers stay
   untouched.

## Design

### 1. Build — tsdown

New `tsdown.config.ts`:

```ts
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  clean: true,
  sourcemap: true,
  target: "node20",
  outDir: "dist",
});
```

- Emits ESM + CJS bundles plus bundled per-format `.d.ts` in a single pass.
- Package stays CJS-default (no `"type": "module"`) so legacy `main` resolution keeps working.
- `dts-bundle-generator` and `dist/types.bundle.d.ts` are removed.

`package.json` entry points — proper `exports` map with `main`/`module`/`types` retained as
legacy fallbacks:

```jsonc
"main": "./dist/index.js",          // CJS
"module": "./dist/index.mjs",       // ESM
"types": "./dist/index.d.ts",
"exports": {
  ".": {
    "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.js" }
  }
}
```

> The exact emitted filenames (`.mjs`/`.cjs`/`.js`/`.d.mts`/`.d.cts`) MUST be aligned to what
> tsdown actually writes to `dist/`, verified against the built output — not assumed. Adjust
> the `exports` map / `main` / `module` / `types` to match the real filenames.

Scripts:

- `"build": "tsdown"`
- `"dev": "tsdown --watch"`
- Remove `"build:types-bundle"`.

### 2. Tests — Vitest

New `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["tests/**/*.test.ts"],
    testTimeout: 60000,
    fileParallelism: false, // mirrors jest maxWorkers:1 (avoid API rate limits)
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.d.ts"],
      reporter: ["text", "lcov", "html"],
      reportsDirectory: "coverage",
    },
  },
});
```

- `globals: true` → all 30 test files plus `conditional-tests.ts` (`describe.skip`) stay
  untouched.
- Vitest auto-loads `.env.test` into `process.env` for the test mode, so local test env works
  without a separate dotenv setup. CI continues to inject vars via the workflow `env:` block.
  If Vitest does not pick up `.env.test` during verification, add a minimal setup file as a
  fallback.

Scripts — **same names** as today so CI needs no edits:

- `"test": "vitest run"`
- `"test:unit": "vitest run tests/unit"`
- `"test:e2e": "vitest run tests/e2e"`
- `"test:all": "pnpm test:unit && pnpm test:e2e"` (unchanged)
- `"test:watch": "vitest"`
- `"test:coverage": "vitest run --coverage"`

### 3. tsconfig and cleanup

- Rename `tsconfig.jest.json` → `tsconfig.vitest.json`; change `types: ["jest", "node"]` →
  `types: ["vitest/globals", "node"]` for IDE/typecheck support of test globals. (Only
  `jest.config.js` referenced the old file.)
- Delete `jest.config.js`.
- **Dependencies:**
  - Remove: `jest`, `ts-jest` (currently mis-placed in `dependencies` — moving it out is also
    a correctness fix), `@types/jest`, `dts-bundle-generator`.
  - Add (dev): `tsdown`, `vitest`, `@vitest/coverage-v8`.
  - Keep: `typescript` (tsdown uses it for dts generation), `ts-node` (used by examples),
    `oxlint`, `oxfmt`, `@types/node`.
- Update `CLAUDE.md` (and `AGENTS.MD` if it mirrors the same content): "Jest" → "Vitest",
  remove `tsconfig.jest.json` / `ts-jest` references, update the single-test-file command
  example.

### 4. CI impact

No workflow changes required — script names are preserved. `build-test.yaml` (`build`,
`test:e2e`) and `publish-node-sdk.yml` (`build`) keep working unchanged.

## Verification plan

- `pnpm build` succeeds; inspect `dist/` for both ESM and CJS bundles plus `.d.ts` outputs.
  Confirm both `require("@makeplane/plane-node-sdk")` and `import` resolve (smoke check the
  generated `exports` targets exist).
- `pnpm test` runs under Vitest. Without env vars, most `describeIf` suites skip — this still
  proves the runner and global resolution work. With env vars, `pnpm test:e2e` runs the full
  suite.
- `pnpm check:lint` and `pnpm check:format` still pass.
- Confirm no remaining references to Jest, ts-jest, or `dts-bundle-generator` in source,
  config, scripts, or docs.

## Out of scope

- No changes to `src/` runtime code or public API surface.
- No changes to test assertions or test logic.
- No new CI workflows or publish-flow changes.
