# Node SDK variant F — the query-filter sweep, and the workspace root

Branch `feat/silo-1463-node-sdk-v2-flat`, worktree `.worktrees/plane-node-sdk-variant-f`.
Nothing pushed, `pnpm build` deliberately not run. Runs immediately before task 3.

Two commits:

| Commit    | What                                                            |
| --------- | --------------------------------------------------------------- |
| `8898120` | PART 1 — `FILTERS` in the codegen, the fifth sweep, three fixes |
| `6519940` | PART 2 — `workspaces_retrieve`, the workspace root, its ratchet |

Gates: `npx jest tests/unit` **654 passed, 317 skipped, 66 suites, 0 failures** (619/63
before; +35 tests, +3 suites, none removed). `npx tsc --noEmit` clean. `pnpm check:lint`
**165 warnings / 0 errors**. `pnpm check:format` clean.

`UNMIGRATED_RESOURCES` is untouched at **47**. No family was migrated.

---

## PART 1 — the fifth sweep: query filters

### The generator now emits `FILTERS`

`scripts/generate-v2-constants.mjs` collected `fields`/`order_by`/`expand` enums and threw
every other query parameter away. It now also emits `FILTERS`: for each operation, every
`in: "query"` parameter except the three axes with maps of their own and the pagination
envelope (`offset`, `per_page`, `paginate`, `cursor`, `count`). That exclusion list is a
named constant with a doc comment saying a name may only go in it if the SDK handles that
axis somewhere else — never "the SDK does not offer this one".

**62 filter sets, 407 operations.** The generator's own drift guard fails on zero, like the
three that were already there. Regenerating produces a byte-identical file (verified), and
the `Source golden` header still points at `../plane-ee-preview/...`.

### The sweep — `tests/unit/v2/filters-coverage.test.ts`

Every migrated resource method that has an `operations` key whose operation declares
filters must expose every one of them. **57 methods over the migrated set; 122 methods and
413 individual filter assertions over the set actually swept.**

The difference matters and is the one design decision worth calling out. The other four
sweeps run over `migratedEntries()`; this one runs over **`resourceEntries()` — every
class, including the 47 on the opt-out list**. A filter is a property of a params object
whether or not the class has moved to the flat shape, so nothing about this rule depends on
call shape, and running it over the migrated set alone hid `display_name` on both
work-item-property lists behind an opt-out list that is about shape, not capability. That
was not hypothetical: it was the state of the tree when the sweep was first written, and
the migrated-only version passed while the capability was missing. `methodsOffering` grew
an `entries` parameter for this; the default is still `migratedEntries()`.

Two ways a filter counts as exposed, because the SDK really does both:

1. a property of the method's params object — the usual shape;
2. a positional parameter **past the leading path ids** (`Projects.summary(slug, project,
counts)`), where the filter _is_ the argument.

The exclusion in (2) is what makes the `Roles` collision visible instead of accidentally
satisfied: `Roles.list(slug, …)` opens with the _workspace_ slug while `roles_list`
declares a `?slug=` filter meaning the _role's_ slug, and counting that positional
parameter would have let the collision pass while the filter stayed unreachable — which is
the exact shape of the Python defect. How many leading parameters are path ids is derived
(`leadingPathIdCount`: the longest prefix of `expectedLeadingPathIds` the signature actually
opens with), not assumed, so a pre-flat class correctly answers 0 without anyone consulting
the opt-out list.

### The filters the sweep forced into existence — three

| Class                         | Filter         | What was unreachable                                                 |
| ----------------------------- | -------------- | -------------------------------------------------------------------- |
| `States`                      | `group__in`    | "states in any of these groups" — one request the SDK could not make |
| `WorkItemProperties`          | `display_name` | lookup by the label a user can see, not the slugified key            |
| `WorkspaceWorkItemProperties` | `display_name` | same                                                                 |

`group` on `ListStatesParams` was also bare `string` and is now `StateGroup`; `group__in` is
`readonly StateGroup[]` and the kernel comma-joins it, matching the golden's
`explode: false, style: form`.

Both property classes gained `findByDisplayName(displayName)`, mirroring Python's
`plane/api/v2/customer_properties.py` and the `CustomerProperties.findByDisplayName` the
previous pass added. That is a bounded capability addition to two classes, not a migration —
their call shape is untouched and they stay on the opt-out list for task 3.

`CustomerProperties` needed nothing: the previous pass already added `display_name` there
when it refreshed the golden. So of the three property lists the brief predicted, one was
already done and the other two were only reachable because this sweep enumerates rather
than selects.

### The one rename, and why it is not a suppression

`FILTER_ALIASES` has exactly one entry, `Roles.list` / `Roles.iterate` mapping the golden's
`slug` to `roleSlug`. `Roles` already carried that spelling; what is new is that it is now
_held in place from four sides_, which is what stops the next person "simplifying" it back
into the unreachable state Python shipped:

- `unknownMethod` — the entry must name a method the sweep actually reaches;
- `unknownFilter` — it must name a filter that operation really declares;
- `gratuitous` — the golden's own name must genuinely have been taken by a leading path id
  of that very method, so a rename for taste is refused;
- `absent` — the name it claims to expose must really be on the params type.

Plus `unexplained`: the reason string must name the new spelling, and a doc comment in the
class's own source must mention it too — so a reader of `Roles.ts` finds the explanation
without reading the test.

Removing the entry fails (the filter goes unreachable). Removing `roleSlug` from the code
fails (`absent`). Neither half stands alone.

### The opt-out list

`UNEXPOSED_FILTERS` is **empty**, `UNEXPOSED_CEILING = 0`. Nothing in the whole surface
needs one. Its doc comment says an entry needs a reason the _server_ supplies — a filter is
a capability the server already has, so not exposing one makes it unreachable entirely, and
"the type is awkward" is not a reason. It is guarded three ways (`unknown` for an entry the
golden never declared there, `exposed` for one that is reachable after all, `unreasoned`
for a blank reason) and ratcheted, so task 3 writing ~47 classes cannot quietly add to it.

### What was proved — Part 1

Every check was mutated, failed, and reverted.

| #   | Mutation                                                                        | Result                                                                                  |
| --- | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A   | dropped `group__in` from `ListStatesParams` (migrated class)                    | fails, names `States.list()` and `States.iterate()` with the operation id               |
| B   | dropped `display_name` from `WorkspaceWorkItemProperties` (**opted-out** class) | fails, names both methods — the proof the sweep really enumerates past the opt-out list |
| C   | deleted the `Roles.list` alias entry                                            | `Roles.list() — roles_list declares ?slug=, unreachable from the SDK`                   |
| D   | kept the entry, renamed `roleSlug` → `theRoleSlug` (still compiles)             | `absent: ["Roles.list.roleSlug"]` and `unexplained`                                     |
| E   | added a gratuitous alias (`States.list.name` → `stateName`)                     | `gratuitous: ["States.list.name"]`, plus `absent`/`unexplained`                         |
| F   | `UNEXPOSED_FILTERS` with a live filter, a fictional one, a blank reason         | `exposed: [group, search]`, `unknown: [not_a_real_filter]`, `unreasoned: [search]`      |
| G   | a plausible entry against `UNEXPOSED_CEILING = 0`                               | `Expected: <= 0, Received: 1`                                                           |
| H   | an alias for `Nonexistent.list`                                                 | `unknownMethod: ["Nonexistent.list"]`                                                   |
| I   | renamed `Projects.summary`'s `counts` parameter                                 | `Projects.summary() — projects_summary declares ?counts=` — the positional route bites  |
| J   | an alias naming a filter `states_list` does not declare                         | `unknownFilter: ["States.list.nope"]`                                                   |
| R   | made the generator collect no query parameters                                  | codegen exits with the drift message before writing anything                            |

Runtime tests, not just source sweeps: `group__in` reaches the wire as
`?group__in=backlog,started`, and `findByDisplayName` /`list({display_name})` reach it as
`?display_name=Story%20Points` on both property classes. `constants.test.ts` gained three
assertions, including one that `FILTERS["roles_list"]` still contains `slug` — the filter
Python lost is now pinned in the generated data itself.

---

## PART 2 — `workspaces_retrieve` and the workspace root

`GET /workspaces/{slug}/` is implemented. `UNIMPLEMENTED_OPERATIONS` and
`UNIMPLEMENTED_CEILING` are **deleted**, not left as an empty ratchet nobody would notice
filling back up; the doc comment in their place says that if an operation ever genuinely
cannot be implemented, the coverage assertion fails by name and whoever hits it
re-introduces the list _with the guards it had_.

`v2.workspaces.retrieve(slug)` is a singleton read — the slug in the path is the key, so
there is no pk to append — answering a `LoadedWorkspace`.

### The row's navigation count: **17**

```
artifacts, assets, auditLogs, customerProperties, features, invitations, members,
permissionSchemes, permissions, projects, roles, stickies, teamspaces, views,
workItemRelationDefinitions, workItemTemplates, workItems
```

Not Python's 25 (the brief said 27; Python's `Workspaces.__init__` attaches 27 things, two
of which are grouping nodes, so `LoadedWorkspace` has 25 properties). 17 is **exactly the
set that exists here**: every workspace-band class Node has already migrated, plus
`projects`. The remaining 8 are still pre-flat — `Customers`, `Initiatives`, `Releases`,
`Webhooks`, `WorkspaceAutomations`, `WorkspaceWorkItemProperties`, `WorkspaceWorkItemTypes`,
`Collections` — and cannot be navigation properties, because they take their `{slug}` from
the retired locator scope rather than as a leading parameter, so `owned()` has nothing to
bind.

`wiki` and `groupSync` are absent from the row on purpose and permanently: neither is a
`V2Resource` (neither consumes a path id), so neither is a child a loaded row can bind.
Both are attached to the resource and reached flat — `v2.workspaces.groupSync.config.get(slug)`,
`v2.workspaces.wiki.pages.list(slug)`. Same rule Python states.

### The slug, not the id

Children address a workspace by its slug; `/workspaces/<uuid>/projects/` is a well-formed
URL pointing at nothing. `rowId` prefers `row.slug`, and `retrieve` fills the caller's own
argument back in when `fields` projected the slug away — otherwise every child URL would be
`/workspaces/undefined/...`. That does not widen what the caller may read: the narrowing
overload answers `Pick<Workspace, F | "id">`, and `$loaded.present` is still intersected
with the requested `fields` (asserted directly).

### The Python Critical, confirmed caught

Python specified `Workspaces` navigable and shipped it not navigable, and its navigation
sweep could not see the gap because it selected on `loaded_model`. The previous pass's
CRITICAL-1 fix — "any resource with a migrated child must be NAVIGABLE", asserted over
`migratedEntries()` — was checked against this exact resource. Dropping `LoadsNavigableRows`
from `Workspaces` fails with:

```
Workspaces#Workspaces attaches migrated child resource(s) artifacts, assets, auditLogs,
customerProperties, features, invitations, members, permissionSchemes, permissions,
projects, roles, stickies, teamspaces, views, workItemRelationDefinitions,
workItemTemplates, workItems but does not extend LoadsNavigableRows, so a fetched row of
it reaches none of them
```

It catches it, by name, listing all 17.

### The ratchet — `tests/unit/v2/workspace-band.test.ts`

The brief asked that whatever handles the not-yet-migrated children be a ratchet task 3 must
shrink, not a hole it can leave. It is derived, not tabulated. The retiring `Workspace`
locator is the complete list of what the band contains, so the sweep walks it (descending
into grouping nodes, so `wiki.pages` is seen) and asserts both halves:

1. **Migrated means attached.** A class that has left `UNMIGRATED_RESOURCES` and still hangs
   only off the locator is unreachable from `v2.workspaces` and from every fetched row.
   `UNMIGRATED_RESOURCES` may only shrink, so every name that leaves it lands here as a
   failure until the family is attached — at which point `loaded-navigation.test.ts` demands
   the navigation property in the same change. There is no list to keep in step.
2. **Attached means migrated.** A pre-flat class on the flat root can only raise
   `MissingPathIdError`, so attaching the band early to make the tree look done is refused.

Plus a count ratchet (`WORKSPACE_BAND_PENDING_CEILING = 8`) so the sweep says out loud how
much of the band is left.

**This sweep caught a real gap while it was being written.** `WikiPages` is migrated, and my
first cut left `wiki` off the flat root entirely — which would have made a migrated resource
unreachable from every fetched workspace, silently. `Wiki`'s `slug` is now optional so it
constructs flat, and `Workspaces` attaches it.

That drags one pre-flat class along: `wiki.collections`. It is recorded in
`PREFLAT_UNDER_ROOT` with its reason (a grouping node moves whole; `Collections` migrates in
task 3), ratcheted at 1, and guarded three ways. Calling it is not a silent failure —
`formatPath` raises `MissingPathIdError` naming the resource, method, template and the
missing `slug` — and `v2.workspace(slug).wiki.collections` works today.

### What was proved — Part 2

| #   | Mutation                                                                       | Result                                                                                                                                                                                                                     |
| --- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| K   | `Workspaces extends V2Resource` instead of `LoadsNavigableRows`                | the CRITICAL-1 assertion fails naming `Workspaces` and all 17 children (quoted above); the band sweep's own navigability assertion also fails                                                                              |
| L   | attached a migrated child (`extra: Roles`) with no navigation property         | `loaded-navigation` fails: expected set is missing `"extra"`                                                                                                                                                               |
| M   | un-attached `Teamspaces` from the root, left it on the locator                 | `v2.workspace(slug).teamspaces is Teamspaces, which is migrated but is not attached to Workspaces — so it is unreachable from v2.workspaces and from every fetched workspace row`                                          |
| N   | attached pre-flat `Customers` to the flat root                                 | `v2.workspaces.customers is Customers, which still reads its {slug} from the retired locator scope — attached to the flat root it can only raise MissingPathIdError`                                                       |
| O   | `PREFLAT_UNDER_ROOT` with a migrated entry, an unreachable one, a blank reason | `migrated: [artifacts, roles]`, `unreachable: [nowhere.at.all]`, `unreasoned: [artifacts]`                                                                                                                                 |
| P   | removed the slug refill in `retrieve`                                          | the `fields`-projection test fails: `$loaded.ids` is `[undefined]`, not `["acme"]`                                                                                                                                         |
| Q   | emptied `Workspaces.operations`                                                | `Missing (implemented operations with no 'operations' entry anywhere) — 1: workspaces_retrieve`, plus the method→operations sweep naming `Workspaces.retrieve()` — so deleting `UNIMPLEMENTED_OPERATIONS` weakened nothing |

Behaviour is covered by ten tests in `tests/unit/v2/workspaces.test.ts`, including the whole
point of the root: fetch a workspace, reach its projects with no slug, retrieve a project
from that row, list its states with neither id repeated.

---

## Concerns

1. **The `iterate`-style unsoundness in the write methods is still there.** `create` /
   `update` / `upsert` accept `fields` and return the full row on most migrated classes.
   Out of scope by ruling; still ~100 overloads waiting for task 4.
2. **`Workspaces` is navigable but its unmigrated band is not reachable from a row.** Eight
   families are on the locator only. That is recorded and ratcheted rather than hidden, but
   until task 3 lands, `workspace.customers` does not exist while `workspace.projects` does
   — an asymmetry a user will notice before the migration finishes.
3. **`v2.workspaces.wiki.collections` raises rather than works.** One reachable-but-not-yet-
   callable path, named and ratcheted at 1. The alternative was leaving migrated `WikiPages`
   unreachable, which is worse; but it is a rough edge on a brand-new public root and should
   not survive task 3.
4. **`README.md` and `CLAUDE.md` still describe the locator as "the only public shape".** I
   added a workspace-root section to the README and left the rest; both files need a proper
   pass in task 4, and `CLAUDE.md` still lists `del` as a standard method when the code uses
   `delete`.
5. **The export snapshot has not been regenerated.** `pnpm build` was not run per the brief,
   and this change adds several public names (`Workspaces`, `LoadedWorkspace`,
   `WORKSPACE_ID_NAMES`, the `Workspace` v2 model). I added the `V2Workspace` root alias
   that `src/index.ts`'s collision protocol prescribes — v1 exports a `Workspace` _class_ at
   the root — but task 4 must regenerate `types-bundle-exports.snapshot.txt` and confirm.
6. **Nothing sweeps `?order_by=` coverage.** `FILTERS`, `FIELDS` and `EXPAND` all have
   sweeps now; `ORDER_BY` does not. It is the same shape of gap this task closed for
   filters, and it is cheap — one more `methodsOffering` call — but it is not what was
   asked for here.
