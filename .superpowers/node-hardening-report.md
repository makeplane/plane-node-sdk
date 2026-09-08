# Node SDK variant F — sweep hardening and golden refresh

Branch `feat/silo-1463-node-sdk-v2-flat`, worktree `.worktrees/plane-node-sdk-variant-f`.
Nothing pushed. Runs between task 2 (done) and task 3 (the families and navigable rows).

Five commits:

| Commit    | What                                                                      |
| --------- | ------------------------------------------------------------------------- |
| `4589433` | CRITICAL 1 + IMPORTANT 3 — enumeration holes in two sweeps                |
| `fdd78f2` | IMPORTANT 2 — method -> `operations` correspondence                       |
| `76e24e6` | IMPORTANT 4 + 5 — the two kernel defects                                  |
| `1e3d059` | MINOR 6 — `iterate` projection soundness, plus a sweep for it             |
| `3aab31d` | golden regenerated 406 -> 407, `findByDisplayName` on customer properties |

Gates at the end: `npx jest tests/unit` **619 passed, 317 skipped, 63 suites, 0 failures**
(609 before; +10 new tests, none removed), `npx tsc --noEmit` clean, `pnpm check:lint`
**165 warnings / 0 errors**, `pnpm check:format` clean. `pnpm build` deliberately not run —
the export snapshot is task 4's.

`UNMIGRATED_RESOURCES` is untouched at **47**. No family was migrated.

---

## CRITICAL 1 — the navigation sweep selected instead of enumerating

`tests/unit/v2/loaded-navigation.test.ts`

Every navigation assertion lived inside `describe.each(NAVIGABLE)`, and `NAVIGABLE` comes
from `navigableEntries()`, which filters on `prototype instanceof LoadsNavigableRows`.
Nothing else in the suite reads `childResources`. A task-3 family that migrated its
classes, attached its migrated children, and stayed `extends V2Resource` was therefore
checked by **zero** navigation assertions while every URL test passed.

**Fix.** A new assertion over `migratedEntries()` — not over `NAVIGABLE` — makes attaching a
migrated child the thing that _obliges_ a resource to be navigable. The selected set and the
set the rules apply to can no longer drift apart.

**Proof.** Gave `States` (migrated, `extends V2Resource`, previously childless) a `labels`
child in its constructor. The sweep failed, naming it:

```
States#States attaches migrated child resource(s) labels but does not extend
LoadsNavigableRows, so a fetched row of it reaches none of them
```

Reverted; green again. Note that no other assertion in the file moved — which is the point.

---

## IMPORTANT 2 — a missing `operations` entry silently exempted a method from both option sweeps

`tests/unit/v2/operations-coverage.test.ts`, `tests/unit/v2/tree-walk.ts`

`methodsOffering` does `operationId === undefined → continue`, so a method with no
`operations` key is checked for neither `fields` nor `expand`, and nothing records that it
was skipped. The pre-existing coverage net could not see it: it only asks whether each
golden id is declared _somewhere_, never whether a given method _name_ has a key.

**Fix.** A new assertion: every public method of every migrated resource must resolve to a
key in its own class's `operations` map. Resolution goes through a new
`operationActionFor()` — `iterate` pages `list`, and every `findBy*` is a filtered `list`
through `doFindOne`. That resolver is kept **separate from `ACTION_ALIASES`** on purpose: a
`findBy*` takes the value to match and no params object, so folding it into the option
sweeps would demand a `fields` the wrapper has nowhere to put. Different question, different
map.

**Proof.** Renamed `Projects`' `operations` key `summary` to `summaryTypo` — a change that
leaves `projects_summary` declared, so the existing golden->declared check stays green. It
did stay green, and the new one failed:

```
Projects#Projects.summary() has no `operations` entry (looked for "summary"), so it is
silently exempt from the `fields` and `expand` sweeps
```

That is exactly the divergence the review described. Reverted.

The sweep found no live offenders beyond the ten `findBy*` methods the resolver now accounts
for, which is the answer that matters for task 2's odd-shaped methods:
`retrieveByIdentifier`, `summary`, `roleDistribution` and the bridges all already carry keys.

---

## IMPORTANT 3 — enumeration missed an intermediate base

`tests/unit/v2/path-id-naming.test.ts`, `tests/unit/v2/tree-walk.ts`

`isResourceHeritage` matches the identifiers `V2Resource` and `LoadsNavigableRows` and
nothing else, so a class extending a shared derived base is invisible to the source scan and
therefore to all four sweeps. Being unexported from the barrel hides it from the export
check too, and the tree check ran entries -> reachable only.

**Fix.** The tree comparison is now symmetric: every class reachable from the constructed
`V2Namespace` must appear among the enumerated entries. `isResourceHeritage` gained a doc
comment saying that the reverse assertion is what stands behind its deliberately literal
match — widening the predicate to follow heritage transitively was the alternative, and the
reverse assertion was kept instead because it also catches classes the scan misses for
reasons nobody has thought of yet.

**Proof.** Declared `class StatesProbe extends States {}` (invisible to the name match, not
exported from the barrel) and attached it at `v2.projects.probe`. The assertion failed:

```
StatesProbe — reached at v2.projects.probe, but no entry declares it
```

Reverted.

---

## IMPORTANT 4 — `loadRow` silently shadowed a colliding row field

`src/api/v2/kernel/loaded.ts`, `tests/unit/v2/loaded-navigation.test.ts`

`Object.defineProperty` overwrites the spread data property, so a navigation property named
after a real API field replaced that field while `$loaded.present` went on claiming it
present.

**Proof of the defect, first.** With the check stubbed out and `Projects` given a navigation
property called `name`, a fetched project reported:

```
typeof row.name = object
$loaded.present has name = true
```

Real data replaced by a child-resource view, with the metadata still saying the field is
there.

**Fix, two parts.**

1. `loadRow` now routes both `$loaded` and every navigation property through `defineOver`,
   which throws a `TypeError` naming the property rather than defining over an existing key.
2. `rowOf()` in the sweep built a row with `id` alone, so no assertion could ever have seen a
   collision. A new `fullRowOf()` builds the row the golden says the resource returns —
   every field in `FIELDS[retrieve]` and `FIELDS[list]`, each set to the row's own id so an
   overridden `rowId` (e.g. `Projects`' `identifier`) still yields the expected id — and a
   new per-entry assertion requires building it not to throw.

**Proof of the fix.** With the same colliding `name` property in place, the new sweep failed:

```
Cannot add the navigation property "name" to this row: the API response already carries a
field of that name, and defining over it would hide real data behind a child resource
while `$loaded.present` still reported the field as present. Rename the navigation property.
```

Reverted.

**No collisions exist today.** `Projects` (states, labels, workItems) and `WorkItems`
(comments, attachments, links, worklogs, activities, relations, dependencies) collide with
none of their golden fields, so `NAVIGATION_ALIASES` is still legitimately empty. The two
Python needed — `Estimate.points` and `WorkItemProperty.options` — belong to families still
on the opt-out list, so this will start biting during task 3, which is when it is wanted.

---

## IMPORTANT 5 — `assertLeadingParameters` broke under minification

`src/api/v2/kernel/loaded.ts`, `tests/unit/v2/navigable-rows.test.ts`

The check reads parameter names out of `Function.prototype.toString`. esbuild and terser
both mangle function parameters, so in a minified consumer bundle it saw `[a, b]` against
`[slug, project]`, read that as a _definite_ mismatch, and threw a `TypeError` on every
navigated call — hardest on entirely correct downstream code.

**Fix.** Gated, not warned. A `parameterNameCanary(slugCanary, projectCanary)` lives in the
same file and is mangled by the same pass; `parameterNamesSurvived()` asks whether its own
names came back intact. If they did not, parameter-name introspection tells us nothing here
and the check stands down. Nothing is lost by standing down: `loaded-navigation.test.ts`
enforces the same rule against the TypeScript source, where names cannot be mangled, and is
the authoritative check. The runtime check exists only to also catch a method swapped in
after compilation, and it still does — the pre-existing "refuses to prepend ids into leading
parameters that are ordered differently" test is untouched and still green.

A warning was considered and rejected: it would fire on every correct call in every minified
bundle, which is noise a library has no business emitting.

**Proof.** A new regression test mocks `Function.prototype.toString` to return
`"function(a,b){}"` for everything — the canary included — and asserts a navigated call does
not throw. Deleting the gate line makes that test fail with the old error:

```
States.list() does not take its leading parameters in the order [slug, project] that the
owning row was built with — found [a, b] instead.
```

Gate restored; green.

---

## MINOR 6 — `iterate` accepted `fields` and returned the full row type

`src/api/v2/*` (32 classes), `tests/unit/v2/field-projection.test.ts`,
`tests/unit/v2/tree-walk.ts`

`iterate` took the same `ListXParams` as `list`, `fields` and all, and declared
`AsyncGenerator<FullRow>` — claiming presence for every field the server had just been told
to drop. The same unsoundness that was used to reject matching the overload set in
`Owned<…>` (see the long comment on that type), sitting in the exemplars and copied
outward.

**Fix, expressed as a sweep and applied as 32 edits.** `list` and `iterate` are the same
operation — `ACTION_ALIASES` already maps one onto the other — so a new assertion requires
`iterate` to narrow **exactly where `list` narrows**. That formulation needs no exception
list, because it never asks a class to narrow, only to be consistent with itself, and it
holds for task 3's families without anybody remembering it. `MethodInfo` gained
`returnTypes` (the return type of each declaration, as _written_: resolving it would erase
`F` to its constraint and answer "every field", which is the very unsoundness being looked
for) and `narrowsToRequestedFields()`.

The 32 migrated classes that declare both were then rewritten by codemod to mirror `list`'s
overload set — narrowing overload, general overload, implementation. All 32 had
`list=narrowing, iterate=full`; none had the reverse, so the assertion is symmetric.

**Proof, twice over.**

1. A new runtime test iterates with `fields: ["id", "name"] as const` and marks the
   unrequested field `@ts-expect-error`. Before the change TypeScript reported the directive
   as **unused** — the unsoundness stated as a compiler error. After, it is used.
2. Reverting `Labels.iterate` to its single declaration made the sweep fail:
   `Labels#Labels: list() narrows to the requested fields but iterate() answers the full row`.

**Known adjacent gap, not fixed.** `create`, `update` and `upsert` accept `fields` on most
migrated classes and return the full row, which is the same unsoundness in the write
direction. Fixing it is ~100 further overloads across families task 3 is about to rewrite, so
it was left alone rather than half-done; the sweep above is deliberately scoped to the
`list`/`iterate` pair and does not silently exempt the writes — it simply does not ask about
them. Flagged as a concern below.

---

## The golden

**Before: 406 operations.** `workspaces_retrieve` absent (grep count 0), `display_name`
declared on none of the property list operations. Header pointed at
`../plane-ee/apps/api/plane/api_v2/core/schema/openapi` — the working-tree checkout sitting
on an unrelated branch, which is how the staleness arose.

**After: 407 operations.** Regenerated with
`pnpm codegen:v2 /Users/prashantsurya/Projects/api-development/.worktrees/plane-ee-preview/apps/api/plane/api_v2/core/schema/openapi`
(detached checkout of plane-ee `origin/preview`, verified at 407 operationIds). The
generator reported `407 operation ids, 317 field enums, 67 order_by enums, 95 expand enums`
and the header now records `../plane-ee-preview/...`.

The whole diff to `constants.ts` is three things: the header path, `workspaces_retrieve` in
`OPERATION_IDS`, and its `FIELDS` entry.

**The `display_name` filter does not appear in `constants.ts` at all** — the generator emits
`FIELDS`/`ORDER_BY`/`EXPAND`, never query filters. Confirmed directly against the two
goldens instead:

| operation                             | stale             | preview            |
| ------------------------------------- | ----------------- | ------------------ |
| `customer_properties_list`            | no `display_name` | has `display_name` |
| `work_item_properties_list`           | no `display_name` | has `display_name` |
| `workspace_work_item_properties_list` | no `display_name` | has `display_name` |

Of those three, only `CustomerProperties` is migrated (both work-item-property families are
still on the opt-out list), so `findByDisplayName(slug, displayName)` and a `display_name`
filter on `ListCustomerPropertiesParams` landed there, mirroring Python's
`plane/api/v2/customer_properties.py`, with a unit test asserting the query reaches the wire.

### What the refreshed golden flagged

The `expand` and `fields` sweeps flagged **nothing** new — the fields the refresh added
belong to an operation nobody implements.

The operations-coverage sweep flagged one thing, and it is the real finding:

```
Missing (implemented operations with no 'operations' entry anywhere) — 1:
  workspaces_retrieve
```

`GET /workspaces/{slug}/` exists in the API and has no Node method. Implementing it means
introducing a `Workspaces` resource **and** the `v2.workspaces` attachment point, which
`Workspace.ts`'s own doc comment says arrives "with the tree wiring in the last task of the
variant-F plan". Guessing that root's shape here would pre-empt task 3/4's design, and the
brief is explicit about not migrating task 3's families — so it is **recorded, not
suppressed**, in `UNIMPLEMENTED_OPERATIONS` with its reason, guarded from both ends (an
entry that is not a real golden id fails; an entry that turns out to be implemented fails as
stale) and ratcheted at `UNIMPLEMENTED_CEILING = 1`.

**Proof of the guards.** Added `states_list` (implemented) and `not_a_real_operation`
(fictional); both were named, in the right buckets:

```
actuallyImplemented: ["states_list"]
notInGolden:         ["not_a_real_operation"]
```

Reverted.

---

## Concerns

1. **`workspaces_retrieve` is deferred, not done.** If the caller would rather have it now
   than wait for the tree-wiring task, it is a `Workspaces` resource, a `Workspace` read
   model (fields already in `FIELDS.workspaces_retrieve`), a barrel export and an
   attachment point — and the new CRITICAL-1 assertion will force it to be navigable the
   moment it attaches a migrated child, which is exactly the trap Python fell into with this
   very resource. Say the word and it lands in one commit; the ceiling drops to 0.
2. **The write methods have `iterate`'s old unsoundness.** `create`/`update`/`upsert` accept
   `fields` and return the full row on most migrated classes. Deliberately out of scope
   here; worth a task of its own, and it is ~100 overloads best done after task 3 stops
   rewriting these files.
3. **Nothing sweeps query filters.** `display_name` was unreachable for a year of
   generator runs and only a human comparing two goldens found it, because the generator
   emits `FIELDS`/`ORDER_BY`/`EXPAND` and drops query parameters on the floor. The analogue
   of the `fields`/`expand` sweeps — teach `codegen:v2` to emit a `FILTERS` map, then sweep
   that a migrated method's params type declares every filter its operation offers — would
   have caught it mechanically. That is the highest-value remaining sweep, and it is a
   generator change, so it does not belong in this task.
4. **The golden path is now a worktree-local relative path.** The header reads
   `../plane-ee-preview/...`, which is correct for this workspace and meaningless anywhere
   else. It was already worktree-local before (`../plane-ee/...`); worth deciding once, at
   PR time, what provenance string the repo actually wants.
5. **`CLAUDE.md` in this repo is stale.** It still describes the bound/chained locator form
   as "the only public shape" and lists `del` as a standard method. Untouched here — task 4
   territory — but it will mislead the next reader.
