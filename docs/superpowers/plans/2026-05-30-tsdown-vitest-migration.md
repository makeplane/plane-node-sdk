# tsdown + Vitest Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the build pipeline (`tsc` + `dts-bundle-generator`) with **tsdown** emitting dual ESM+CJS, and replace the test runner (**Jest** + **ts-jest**) with **Vitest**, keeping all CI script names stable.

**Architecture:** tsdown bundles `src/index.ts` into ESM + CJS + bundled `.d.ts` in one pass; `package.json` gains a dual `exports` map. Vitest runs the existing 30 integration test files unchanged via `globals: true`, sequentially (`fileParallelism: false`) to respect API rate limits. CI gets a pinned Node version because tsdown requires Node ≥22.18.

**Tech Stack:** tsdown 0.22.1, Vitest 4.1.7, @vitest/coverage-v8 4.1.7, TypeScript 5.9.3, pnpm 11.5.0, Node ≥22.18 (build/dev), axios (runtime).

**Reference spec:** `docs/superpowers/specs/2026-05-30-tsdown-vitest-migration-design.md`

**Working branch:** `chore/tsdown-vitest-migration` (already created; the design spec is the first commit).

---

## Critical context for the implementer

- **Do not edit any file under `src/`.** No runtime/public-API changes. No test-logic changes.
- The 30 `tests/**/*.test.ts` files use **bare globals** (`describe`/`it`/`expect`/`beforeAll`/`afterAll`) and **zero `jest.*` APIs**. `tests/helpers/conditional-tests.ts` uses `describe`/`describe.skip`. These must keep working untouched via Vitest `globals: true`.
- Most tests are gated by `describeIf(condition, ...)` on env vars; **without env vars they skip**. A run that reports many skipped suites but **0 failures** is success for the runner itself.
- tsdown is **build-time only** — it does NOT change the published SDK's consumer runtime requirement. Keep `package.json#engines.node` at `">=20.0.0"`.
- The working tree already has an unrelated, uncommitted `env.example` → `.env.example` rename. **Do not stage or touch it.** Stage only the exact files named in each task.

## File structure

- **Create:** `tsdown.config.ts` — build config (entry, formats, dts, target).
- **Create:** `vitest.config.ts` — test config (globals, include, sequential, coverage).
- **Modify:** `package.json` — scripts, deps, `main`/`module`/`types`/`exports`.
- **Rename + modify:** `tsconfig.jest.json` → `tsconfig.vitest.json` — swap `types` to `vitest/globals`.
- **Delete:** `jest.config.js`.
- **Modify:** `.github/workflows/build-test.yaml` — pin `node-version: "22"`.
- **Modify:** `CLAUDE.md` — Vitest/tsdown command + convention updates.
- **Modify:** `AGENTS.MD` — single testing-framework directive line only.

---

## Task 1: Build migration — tsdown emitting dual ESM + CJS

**Files:**
- Create: `tsdown.config.ts`
- Modify: `package.json` (scripts `build`/`dev`/`build:types-bundle`, deps, `main`/`module`/`types`/`exports`)
- Remove dep: `dts-bundle-generator`
- Add dep: `tsdown`

- [ ] **Step 1: Remove the old build tool and add tsdown**

Run:
```bash
pnpm remove dts-bundle-generator
pnpm add -D tsdown
```
Expected: `pnpm-lock.yaml` updates; `tsdown` appears under `devDependencies` in `package.json` (version `^0.22.1` or similar); `dts-bundle-generator` is gone.

- [ ] **Step 2: Create the tsdown config**

Create `tsdown.config.ts`:
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

- [ ] **Step 3: Update build/dev scripts in `package.json`**

Replace the `build:types-bundle`, `build`, and `dev` script lines. Before:
```jsonc
"build:types-bundle": "dts-bundle-generator --no-check -o dist/types.bundle.d.ts dist/index.d.ts",
"build": "tsc && pnpm run build:types-bundle",
"dev": "tsc --watch",
```
After (delete the `build:types-bundle` line entirely):
```jsonc
"build": "tsdown",
"dev": "tsdown --watch",
```

- [ ] **Step 4: Run the build and inspect the real output filenames**

Run:
```bash
pnpm build && ls -1 dist
```
Expected: build succeeds with no errors. Note the **exact** emitted filenames — tsdown with `format: ["esm","cjs"]` and a CommonJS-default package typically emits:
- `index.js` (CJS) and `index.mjs` (ESM)
- declaration files such as `index.d.ts` plus `index.d.mts` / `index.d.cts`
- `.map` sourcemap files

**Record the actual filenames you see** — Step 5 must match them exactly, not the assumed names.

- [ ] **Step 5: Set `main`/`module`/`types`/`exports` to match the real output**

In `package.json`, replace:
```jsonc
"main": "dist/index.js",
"types": "dist/index.d.ts",
```
with (adjust every right-hand path to the **actual** filenames from Step 4):
```jsonc
"main": "./dist/index.js",
"module": "./dist/index.mjs",
"types": "./dist/index.d.ts",
"exports": {
  ".": {
    "import": { "types": "./dist/index.d.mts", "default": "./dist/index.mjs" },
    "require": { "types": "./dist/index.d.cts", "default": "./dist/index.js" }
  }
},
```
If tsdown emitted a single `index.d.ts` instead of per-format `.d.mts`/`.d.cts`, point both `types` keys at `./dist/index.d.ts`. Every path in `exports` MUST correspond to a file that exists in `dist/`.

- [ ] **Step 6: Verify both module resolutions work**

Run:
```bash
node -e "const sdk = require('./dist/index.js'); if (!sdk.PlaneClient) throw new Error('CJS missing PlaneClient'); console.log('CJS ok:', typeof sdk.PlaneClient);"
node --input-type=module -e "import('./dist/index.mjs').then(m => { if (!m.PlaneClient) throw new Error('ESM missing PlaneClient'); console.log('ESM ok:', typeof m.PlaneClient); })"
```
Expected: prints `CJS ok: function` and `ESM ok: function`. (Use the exact `.mjs`/`.js` names from Step 4.)

- [ ] **Step 7: Confirm no stale build artifacts/tooling remain**

Run:
```bash
test ! -f dist/types.bundle.d.ts && echo "no stale bundle ok"
grep -rn "dts-bundle-generator\|build:types-bundle\|types.bundle" package.json tsdown.config.ts || echo "no stale refs ok"
```
Expected: both print their `ok` message.

- [ ] **Step 8: Commit**

```bash
git add tsdown.config.ts package.json pnpm-lock.yaml
git commit -m "build: replace tsc + dts-bundle-generator with tsdown (dual ESM+CJS)"
```

---

## Task 2: Test migration — Vitest replaces Jest + ts-jest

**Files:**
- Create: `vitest.config.ts`
- Rename: `tsconfig.jest.json` → `tsconfig.vitest.json` (and edit `types`)
- Delete: `jest.config.js`
- Modify: `package.json` (test scripts, deps)
- Remove deps: `jest`, `ts-jest`, `@types/jest`
- Add deps: `vitest`, `@vitest/coverage-v8`

- [ ] **Step 1: Swap test-runner dependencies**

Run:
```bash
pnpm remove jest ts-jest @types/jest
pnpm add -D vitest @vitest/coverage-v8
```
Expected: `jest`, `ts-jest`, `@types/jest` removed from both `dependencies` and `devDependencies`; `vitest` and `@vitest/coverage-v8` added under `devDependencies` at matching versions (`4.1.7` / `^4.1.7`). (Note: `ts-jest` was previously mis-placed under `dependencies` — removing it from there is intended.)

- [ ] **Step 2: Create the Vitest config**

Create `vitest.config.ts`:
```ts
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
```

- [ ] **Step 3: Rename the test tsconfig and switch globals types**

Run:
```bash
git mv tsconfig.jest.json tsconfig.vitest.json
```
Then in `tsconfig.vitest.json` change:
```jsonc
"types": ["jest", "node"]
```
to:
```jsonc
"types": ["vitest/globals", "node"]
```

- [ ] **Step 4: Delete the Jest config**

Run:
```bash
git rm jest.config.js
```
Expected: `jest.config.js` removed.

- [ ] **Step 5: Update test scripts in `package.json`**

Replace the test script block. Before:
```jsonc
"test": "jest",
"test:unit": "jest --testPathPattern=tests/unit",
"test:e2e": "jest --testPathPattern=tests/e2e",
"test:all": "pnpm test:unit && pnpm test:e2e",
"test:watch": "jest --watch",
"test:coverage": "jest --coverage",
```
After (same script names — CI depends on them):
```jsonc
"test": "vitest run",
"test:unit": "vitest run tests/unit",
"test:e2e": "vitest run tests/e2e",
"test:all": "pnpm test:unit && pnpm test:e2e",
"test:watch": "vitest",
"test:coverage": "vitest run --coverage",
```

- [ ] **Step 6: Verify the runner collects and runs all suites**

Run:
```bash
pnpm test
```
Expected: Vitest starts, collects **all 30** `tests/**/*.test.ts` files, and finishes with **0 failures**. Without env vars most suites report as skipped (via `describeIf`) — that is the expected pass state. There must be **no** "describe is not defined" / "expect is not defined" errors (those would mean `globals: true` isn't applied).

- [ ] **Step 7: Verify the unit/e2e path filters work**

Run:
```bash
pnpm test:unit
pnpm test:e2e
```
Expected: `test:unit` runs only files under `tests/unit/`; `test:e2e` runs only files under `tests/e2e/`. Both end with 0 failures.

- [ ] **Step 8: Verify coverage wiring**

Run:
```bash
pnpm test:coverage
```
Expected: a coverage table prints (v8 provider) and a `coverage/` directory is produced. No config errors about the coverage provider.

- [ ] **Step 9: Confirm no Jest references remain**

Run:
```bash
grep -rniE "jest|ts-jest" package.json vitest.config.ts tsconfig.vitest.json tsconfig.json || echo "no jest refs ok"
test ! -f jest.config.js && test ! -f tsconfig.jest.json && echo "old files gone ok"
```
Expected: both print their `ok` message.

- [ ] **Step 10: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts tsconfig.vitest.json
git add -u   # records the tsconfig.jest.json -> tsconfig.vitest.json rename and jest.config.js deletion
git commit -m "test: migrate from jest/ts-jest to vitest"
```

---

## Task 3: Pin CI Node version for tsdown

**Files:**
- Modify: `.github/workflows/build-test.yaml`

**Why:** tsdown 0.22.1 requires Node `^22.18.0 || >=24.0.0`. `build-test.yaml` currently uses `actions/setup-node@v4` with no `node-version`, so it falls back to the runner default (Node 20) and tsdown's `pnpm build` step would fail. (The `publish-node-sdk.yml` workflow already pins Node 24 — no change needed there.)

- [ ] **Step 1: Pin the Node version in the build-test workflow**

In `.github/workflows/build-test.yaml`, change:
```yaml
      - name: Set up Node.js
        uses: actions/setup-node@v4
```
to:
```yaml
      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "22"
```

- [ ] **Step 2: Validate the workflow YAML is well-formed**

Run:
```bash
node -e "const fs=require('fs');const s=fs.readFileSync('.github/workflows/build-test.yaml','utf8');if(!/node-version:\s*\x22?22\x22?/.test(s))throw new Error('node-version not set');console.log('workflow pin ok')"
```
Expected: prints `workflow pin ok`.

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/build-test.yaml
git commit -m "ci: pin Node 22 in build-test workflow for tsdown"
```

---

## Task 4: Update documentation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `AGENTS.MD` (one line only)

- [ ] **Step 1: Update the build/test description in `CLAUDE.md`**

In the Project Overview line, change `managed with pnpm@10.20.0` only if inaccurate — leave version text as-is unless it is wrong. Then update the Common Commands block. Change:
```
pnpm test                 # Run all tests (Jest)
```
to:
```
pnpm test                 # Run all tests (Vitest)
```

- [ ] **Step 2: Update the Testing section in `CLAUDE.md`**

Change:
```
pnpm test -- --testPathPattern=tests/unit/project  # Run a single test file
```
to:
```
pnpm test tests/unit/project  # Run a single test file (path filter)
```
And change the sentence:
```
Tests run sequentially (`maxWorkers: 1`) to avoid API rate limits. Jest uses `tsconfig.jest.json` via ts-jest.
```
to:
```
Tests run sequentially (`fileParallelism: false`) to avoid API rate limits. Vitest reads `vitest.config.ts` with `globals: true`; test-time TypeScript globals come from `tsconfig.vitest.json`. Building requires Node ≥22.18 (tsdown); the published SDK still supports Node ≥20 at runtime.
```

- [ ] **Step 3: Update the build description in `CLAUDE.md`**

Find the Architecture/Conventions note:
```
- Build produces `dist/` with compiled JS, declarations, source maps, and a bundled `types.bundle.d.ts`
```
and change it to:
```
- Build (tsdown) produces `dist/` with dual ESM (`.mjs`) + CJS (`.js`) bundles, bundled type declarations, and source maps, exposed via the `exports` map in `package.json`
```

- [ ] **Step 4: Update the testing-framework directive in `AGENTS.MD`**

Change the single line:
```
- Use Jest as the testing framework
```
to:
```
- Use Vitest as the testing framework
```
Leave the rest of `AGENTS.MD` untouched (its package.json/tsconfig examples are already out of sync with the real repo and are out of scope for this migration).

- [ ] **Step 5: Verify the docs no longer claim Jest/tsc for the live workflow**

Run:
```bash
grep -niE "jest|ts-jest|tsconfig.jest|types.bundle|build:types-bundle" CLAUDE.md || echo "CLAUDE.md clean ok"
grep -niE "Use Jest as the testing framework" AGENTS.MD || echo "AGENTS.MD directive updated ok"
```
Expected: both print their `ok` message.

- [ ] **Step 6: Commit**

```bash
git add CLAUDE.md AGENTS.MD
git commit -m "docs: update build/test references for tsdown + vitest"
```

---

## Task 5: Full verification sweep

**Files:** none (verification only; commit only if a fix is needed)

- [ ] **Step 1: Clean rebuild from scratch**

Run:
```bash
rm -rf dist && pnpm build && ls -1 dist
```
Expected: succeeds; `dist/` contains the ESM bundle, CJS bundle, and `.d.ts` declaration file(s) matching the `exports` map set in Task 1.

- [ ] **Step 2: Run the whole test runner**

Run:
```bash
pnpm test
```
Expected: all 30 suites collected, **0 failures** (skips allowed when env unset).

- [ ] **Step 3: Lint and format still pass**

Run:
```bash
pnpm check:lint && pnpm check:format
```
Expected: both pass. If `check:format` flags the two new config files, run `pnpm fix:format`, then `git add -u && git commit -m "style: format tsdown/vitest config"`.

- [ ] **Step 4: Repo-wide grep for any leftover migration references**

Run:
```bash
grep -rniE "ts-jest|dts-bundle-generator|jest.config|tsconfig.jest|types.bundle" \
  --include="*.json" --include="*.ts" --include="*.js" --include="*.md" \
  --include="*.yaml" --include="*.yml" . \
  | grep -v node_modules | grep -v "/dist/" | grep -v "docs/superpowers/" \
  || echo "no leftover refs ok"
```
Expected: prints `no leftover refs ok`. (Matches inside `docs/superpowers/` specs/plans and historical text are fine and excluded.)

- [ ] **Step 5: Verify the package would publish the right files**

Run:
```bash
npm pack --dry-run 2>&1 | grep -E "dist/|package size|Tarball" | head -40
```
Expected: the tarball includes `dist/` (both module formats + declarations) and `README.md`, per the `files` field. No `tests/` or config files included.

---

## Self-review notes (author)

- **Spec coverage:** Build→tsdown (Task 1), dual ESM+CJS exports (Task 1 Steps 5–6), drop dts-bundle-generator + dead bundle (Task 1 Steps 1,7), Vitest with globals (Task 2), `fileParallelism:false` sequential (Task 2 Step 2 config), stable script names (Task 2 Step 5), tsconfig rename (Task 2 Step 3), dependency add/remove incl. ts-jest mis-placement fix (Tasks 1–2), docs (Task 4), verification (Task 5). **Added beyond spec:** Task 3 (CI Node pin) — the spec assumed no CI changes, but tsdown's Node ≥22.18 requirement forces pinning `build-test.yaml`. This supersedes the spec's "no workflow changes" claim for that one file.
- **Filename risk:** tsdown's exact emitted `.d.mts`/`.d.cts`/`.mjs` names are verified against real output (Task 1 Step 4) before the `exports` map is written (Step 5) — not assumed.
- **Env loading:** Relied-upon Vitest `.env.test` auto-load is not blocking — CI injects env via the workflow `env:` block, and unset env simply skips suites. No task depends on local dotenv working.
