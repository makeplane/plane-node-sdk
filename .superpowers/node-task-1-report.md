# Variant F — Node SDK — Task 1 report

Branch `feat/silo-1463-node-sdk-v2-flat`, worktree `.worktrees/plane-node-sdk-variant-f`.
Nothing pushed.

## Commits

| sha       | what                                                                |
| --------- | ------------------------------------------------------------------- |
| `611c2b4` | kernel reshaped for the flat path shape                             |
| `f85e889` | loaded-row machinery, typed through generics                        |
| `74ce55d` | the five exemplars + the flat tree root                             |
| `b2ed095` | the four rule sweeps + the enumeration behind them                  |
| `4678640` | sweeps check every overload's parameter names (found while proving) |
| `3a6bd77` | owned views record what they wrap (found while proving)             |

## Gates

| gate                                | result                                                           |
| ----------------------------------- | ---------------------------------------------------------------- |
| `npx jest tests/unit`               | **532 passed, 317 skipped, 63 suites** (baseline 473 / 317 / 58) |
| `npx tsc --noEmit -p tsconfig.json` | clean                                                            |
| `pnpm check:lint`                   | **165 warnings, 0 errors** (baseline)                            |
| `pnpm check:format`                 | clean                                                            |
| `pnpm check:types-bundle`           | see below — deferred to task 4 by instruction                    |

`pnpm check:types-bundle` is not a type check; it is the export-snapshot comparison and it
reads `dist/`, so it cannot run without a build. Run out of curiosity (`npx tsc` +
`pnpm build:types-bundle` + the check, no `--write`), it reports **21 additions and 0
removals** — every new v2 export from this task and nothing lost. `npx tsc --noEmit` is the
type gate that actually ran, and it is clean. The snapshot is regenerated intentionally at
the end of task 4, as instructed.

## What was built

### 1. Kernel (`src/api/v2/kernel/resource.ts`)

- **`extraPaths` + `urlFor(action, ids)`** — a method whose URL is not built from the class
  `path` declares its own template keyed by method name, so `urlFor` makes the same choice
  at call time that the sweeps make when they read it. The five existing hand-rolled
  template call sites moved to `urlForTemplate(template, action, ids)`, which is the raw
  filler they were really using. `Projects.roleDistribution` is the first real consumer.
- **`MissingPathIdError`** (`src/errors/MissingPathIdError.ts`) — names the resource, the
  method, the template, the missing id and the ids that _were_ supplied, and carries each
  as a field. An empty string counts as missing: it would otherwise build
  `/projects//states/`, a well-formed URL pointing somewhere else. This is the thing Python
  shipped bare and had to repair a wave later.
- **`doRetrieveSingleton` / `doUpdateSingleton` / `doCustomAction` / `doVoidAction`** — the
  four request shapes that were being hand-rolled as `transport.request` blocks, one
  resource at a time. `Projects.summary`, `roleDistribution`, `archive` and `unarchive` now
  go through them, so their query strings are validated against the golden like any other
  call (they were not before).
- **`scope` survives on the constructor**, marked retired — see "Where Node forced a
  different choice" below.

### 2. Loaded rows (`src/api/v2/kernel/loaded.ts`, `src/api/v2/loaded/`)

- `Loaded<TRow, TNavigation>` = the row's fields + one navigation property per child +
  `$loaded` (ids, id names, and the field names the server actually returned, narrowed by
  the caller's `fields`). Navigation and `$loaded` are **non-enumerable**, so `{...row}`,
  `Object.keys` and `JSON.stringify` still see the plain API row.
- `Owned<TResource, TIds>` — the load-bearing type. A mapped type over the child resource
  that drops exactly the leading parameters the bound ids fill and keeps everything else.
- `LoadsNavigableRows` — `load` / `loadPage` / `loadIterate`, plus the `rowId` hook
  (`Projects` overrides it to prefer the readable identifier).
- `owned()` at runtime prepends ids positionally, refuses a definite parameter-name
  mismatch, and records its binding under a symbol.

### 3. Exemplars

`States`, `Labels`, `Projects`, `WorkItems`, `WorkItems/Comments`, plus
`loaded/Project.ts` and `loaded/WorkItem.ts`. Every row-returning method on `Projects` and
`WorkItems` — `retrieve`, `create`, `update`, `upsert`, `findByName`, `list`, `iterate` —
goes through the loader, and the loader is given the caller's `fields`.

The tree gained its flat root: `v2.projects` → `states` / `labels` / `workItems` →
`comments`. A family joins the flat tree and leaves the `workspace(slug).project(key)`
locator chain in the same move, so neither shape is ever a stale copy;
`locators.test.ts` pins both halves, including that `ws.projects` / `proj.states` are gone.

### 4. Sweeps

`tests/unit/v2/tree-walk.ts` (shared, not collected) plus `path-id-naming.test.ts`,
`fields-coverage.test.ts`, `expand-coverage.test.ts`, `loaded-navigation.test.ts`.

The swept set is **every resource class declared under `src/api/v2/` (89), minus an
explicit opt-out list (84)**. TypeScript has no `pkgutil`, so the enumeration is
triangulated from three derivations that must agree — the TypeScript AST's
`class X extends V2Resource` declarations, the modules those files export, and the public
barrel — with a fourth check that the constructed tree reaches every one of them.
Classes are keyed `<module>#<ClassName>`, because `Comments` and `Links` each name two
different resources and a name-keyed set would silently hold one of each pair.

Signatures come from the TypeScript AST, not the emitted JavaScript: type erasure destroys
parameter types, overloads and doc comments, and parameter _names_ are the rule being
enforced. One shared `ts.Program` costs ~0.4s for all four sweeps.

`UNMIGRATED_CEILING = 84` is the ratchet. Lower it as tasks 2 and 3 migrate families;
never raise it.

## Sweep proofs

Every proof introduced a real violation, ran the sweep, and reverted with
`git checkout -- src tests`. Two mutations were rejected as **inconclusive** because they
did not compile, and were replaced with type-valid ones — a mutation that breaks `tsc`
proves nothing about the sweep.

| #   | violation introduced                                                     | sweep             | result                                                                  |
| --- | ------------------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------- |
| 1   | `States.retrieve`'s pk renamed `stateId` on the first overload           | path-id-naming    | fails: `States.retrieve(stateId)`                                       |
| 2   | `Labels.list(project, slug, …)` — leading ids transposed                 | path-id-naming    | fails: `expected to open [slug, project]`                               |
| 3   | `States#States` added back to the opt-out list                           | path-id-naming    | fails twice: the ratchet, and "already-migrated class stays opted out"  |
| 4   | `export { States }` removed from the barrel                              | path-id-naming    | fails: `unexported: ["States"]`                                         |
| 5   | `Projects` stops attaching `labels`                                      | path-id-naming    | fails: `Labels#Labels` unreachable from the tree                        |
| 6   | `expand` removed from `ListWorkItemsParams`                              | expand-coverage   | fails: `WorkItems.list`, `WorkItems.iterate`                            |
| 7   | `Projects.create` can no longer be given `fields`                        | fields-coverage   | fails, naming the projection the golden offers                          |
| 8   | `ProjectNavigation` loses `workItems` while `Projects` still attaches it | loaded-navigation | fails twice: completeness, and the per-child check                      |
| 9   | `labels` navigation wraps `this.states`                                  | loaded-navigation | fails on binding identity                                               |
| 10  | `Comments.iterate(project, slug, workItem)`                              | loaded-navigation | fails: `opens [project, slug, workItem], not [slug, project, workItem]` |
| 11  | `Projects.iterate` returns plain rows                                    | navigable-rows    | fails: navigation lost when paging                                      |

**Three defects the proofs found, all fixed and committed:**

1. **Proof 1 initially passed.** The sweep read only the _first_ declaration's parameter
   names, so renaming the implementation signature alone left it green. An overload set can
   disagree with itself; every declaration is now checked (`4678640`).
2. **Proof 9 initially passed.** "Wraps its own child" compared method names, and sibling
   resources routinely have identical method sets — `owned(this.states, …)` under `labels`
   builds a well-formed call to the wrong URL. Owned views now carry their binding under a
   symbol and the sweep compares identity (`3a6bd77`).
3. **The tree walk skipped `GroupSync`'s config singleton**, because it skipped the
   attribute _name_ `config` as plumbing. 88 of 89 classes looked like all of them. Plumbing
   is now skipped by type (`V2Transport` / `Configuration` instances). Found by asserting
   tree/source agreement rather than assuming it.

The navigation sweep also bit on first run, before any deliberate mutation: owned views
were exposing the kernel's `protected` hooks (`load`, `loadPage`, `loadIterate`, `rowId`,
`navigationOf`), which `protected` cannot prevent at runtime. Fixed by stopping the
prototype walk at the kernel bases plus naming the overridable hooks.

## Where Node forced a different choice than Python

1. **A generic overload cannot survive the `Owned` transform.** TypeScript erases type
   parameters when it infers through a conditional type, so a navigated
   `project.states.list({ fields: […] })` resolves to `Page<State>`, not the narrowed row;
   the flat call `v2.projects.states.list(slug, project, { fields: […] })` keeps the
   projection. Matching the overload _set_ instead is strictly worse, not better — I tested
   it: the inference erases `F` to its constraint and answers
   `Pick<State, every field>`, which claims presence for the fields the projection dropped.
   Documented on the type itself. Python has no compile-time projection at all, so this is
   the ceiling of the transform rather than a regression. Everything else the task asked for
   holds: `project.states.list()` is `Page<State>`, `retrieve("s-1")` is `State`,
   `project.states.lst()` is a `tsc` error, an extra argument is a `tsc` error, and a
   grandchild that needs its own row's id is not on the parent's view. Pinned with a
   bidirectional `Exact<>` check, because a one-way `extends` assertion passes for `any`.
2. **`scope` had to stay on the `V2Resource` constructor.** Removing the second constructor
   parameter is a hard compile error at ~45 locator call sites and would strand 84
   unmigrated classes at once. It is marked retired in its doc comment, migrated resources
   pass nothing, and the locators plus the parameter go together in task 4. Python could
   stage this with a decorator and placeholders; TypeScript's arity checking cannot.
3. **`collectionUrl`/`detailUrl` take `action` as an optional trailing argument**, not
   Python's positional-only leading one — a leading parameter would have broken 46 existing
   call sites for no benefit. The `doX` helpers pass it for free.
4. **No `FieldNotRequested`, no `Proxy`** — as ruled. `$loaded.present` exists for runtime
   introspection only, and its doc comment says so, so nobody mistakes it for the
   enforcement mechanism.
5. **The `fields`/`expand` sweeps read types, not bodies.** In Node the params object
   reaches the kernel as one blob, so declaring the property _is_ what makes the option
   reachable and validated. Python's second check ("is the parameter actually threaded into
   `params`?") has nothing left to check here.
6. **Path-id parameter names are camelCase.** `expectedLeadingPathIds` drops the golden's
   `_id` and camel-cases the rest (`{work_item_id}` → `workItem`); templates keep the
   golden's spelling.

## Known state left for later tasks

- **The e2e suite does not type-check** (`tests/e2e/v2/*` still calls
  `ws.projects` / `proj.states` / `proj.workItems`). Deferred by the plan's own
  "Deferred by design" note — a pre-PR pass, as in Python. It does not affect
  `npx jest tests/unit`, which never loads those files.
- **The six unmigrated work-item sub-resources** (`attachments`, `links`, `worklogs`,
  `activities`, `relations`, `dependencies`) are still attached to `WorkItems` but are no
  longer reachable through the `Project` locator, so calling them now raises a
  `MissingPathIdError` that names exactly what is missing. Their own unit tests construct
  them directly with a scope and still pass. Tasks 2/3 migrate them; the navigation sweep
  will demand a navigation property for each the moment it leaves the opt-out list.
- `ONE_TIME_RESPONSES` and `NAVIGATION_ALIASES` are empty, each with the entries the Python
  port needed written into the doc comment so the next task copies the reasoning rather than
  re-deciding it.
