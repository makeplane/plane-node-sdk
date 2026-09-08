# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@makeplane/plane-node-sdk` — a TypeScript SDK for the Plane API. It uses axios for HTTP, targets Node.js >=20, and is managed with pnpm (see `packageManager` in `package.json`).

## Common Commands

```bash
pnpm install              # Install dependencies
pnpm build                # Compile TS + bundle type definitions
pnpm dev                  # Watch mode for development
pnpm test                 # Run all tests (Jest)
pnpm test:unit            # Unit tests only
pnpm test:e2e             # E2E tests only
pnpm test -- --testPathPattern=tests/unit/project  # Run a single test file
pnpm test:coverage        # Run with coverage report
pnpm check:lint           # Lint check (oxlint)
pnpm fix:lint             # Auto-fix lint issues
pnpm check:format         # Format check (oxfmt, 120 char width)
pnpm fix:format           # Auto-format
pnpm codegen:v2 <golden>  # Regenerate src/api/v2/generated/constants.ts from the api_v2 OpenAPI golden
pnpm check:types-bundle   # Compare dist/types.bundle.d.ts's export surface against the snapshot
```

## Testing

Tests live in `tests/unit/` and `tests/e2e/`. Tests require a `.env.test` file (copy from `env.example`) with real workspace/project IDs. Tests run sequentially (`maxWorkers: 1`) to avoid API rate limits. Jest uses `tsconfig.jest.json` via ts-jest.

## Architecture

**Entry point**: `src/index.ts` re-exports everything. The main consumer-facing class is `PlaneClient` (`src/client/plane-client.ts`), which instantiates all API resources with shared `Configuration`.

**BaseResource pattern** (`src/api/BaseResource.ts`): Abstract base class providing HTTP methods (get, post, patch, put, httpDelete) via axios. All API resource classes extend it. Handles both `apiKey` (X-Api-Key header) and `accessToken` (Bearer token) auth. Includes optional request/response logging with sensitive data sanitization.

**API resources** (`src/api/`): Each resource class extends BaseResource. Some have sub-resources as separate classes composed by the parent:

- `WorkItems/` → Comments, Attachments, Activities, Relations, WorkLogs
- `Customers/` → Properties, Requests
- `Teamspaces/` → Members, Projects
- `Initiatives/` → Labels, Projects, Epics
- `AgentRuns/` → Activities
- `WorkItemProperties/` → Options, Values

**API v2** (`src/api/v2/`): the v2 surface, reached as `client.v2`. Two public shapes,
and they are the same objects:

- **Flat.** A resource is a plain attribute at the position its URL puts it
  (`v2.projects.states`, `v2.workspaces.teamspaces`, `v2.projects.workItems.comments`)
  and takes the ids its URL names as **leading positional parameters, in path order**:
  `states.list(slug, project, params?)`. No public v2 method takes a `workspaceSlug`
  or `project` _option_ — path ids are positional and first; leaf ids
  (`workItemId`, `releaseId`, …) are just the last of them.
- **Loaded rows.** Every row-returning method routes through `LoadsNavigableRows`
  (`kernel/loaded.ts`) and answers a `Loaded<Row, Navigation>`: the row's data, one
  non-enumerable navigation property per attached child, and `$loaded`
  (`ids`/`idNames`/`present`). A navigation property is an `Owned<Child, Ids>` view —
  the same methods with the bound ids dropped from the front. `owned()` refuses to
  prepend ids into leading parameters that are named differently, and `loadRow`
  refuses to define a navigation property over a field the response carries (rename it
  and record the rename, as `Estimate.points` → `estimatePoints` and
  `WorkItemProperty.options` → `propertyOptions` did).

`v2.workspaces` and `v2.projects` are the two band roots; `Workspace.ts`/`Project.ts`
are the **deprecated** locator chain, kept only until `tests/e2e/` stops calling them.
`Wiki.ts` and `GroupSync/` are grouping nodes: they consume no path id of their own, so
they are never navigation properties on a row.

`kernel/` holds the shared machinery (transport, pagination, generic `V2Resource`,
bulk helpers, `loaded.ts`); `generated/constants.ts` is produced by `pnpm codegen:v2`
from the api_v2 OpenAPI golden and must never be hand-edited. Resources are thin
declarations over `V2Resource` — a `path` template, an `operations` map from method
name to golden operation id, optional `extraPaths` for a method whose URL is not the
collection (`markDefault`, `regenerateWebhookSecret`, …). `urlFor` resolves path
placeholders from `{...scope, ...pathParams}`, explicit `pathParams` winning.

Membership bridges (`{add}`/`{remove}` POSTs answering `{added}`/`{removed}`) are never
`manage*` methods: they are `add(...pathIds, parentId, ids)` / `remove(...)` on a
sub-resource named for the noun (`cycles.workItems`, `initiatives.projects`,
`releases.labels`, `wiki.collections.members`), each built on
`V2Resource.doBridge`/`doBridgeAt`, which sends one verb per call, enforces 1..100 ids
client-side and resolves to the plain id array. A bridge verb copies the web app CTA —
properties on a work item type are `link`/`unlink`.

**`fields` narrows the return type.** Any method that accepts `fields` declares a
narrowing overload returning `Pick<Row, F | "id">` (or `LoadedXRow<Pick<Row, F | "id">>`,
or `Pick<Row, F | "id">[]`), then a general overload, then the implementation. This
holds for reads _and_ writes — `create`/`update`/`upsert` project too — and
`field-projection.test.ts` enforces it for every method, with no exception list: a
method that cannot narrow must not advertise `fields` (`Webhooks.regenerate` is the
precedent; its `fields` could have projected away the only copy of a secret). The one
place the narrowing does not survive is a _navigated_ call: TypeScript erases the type
parameter through `Owned`'s conditional, so `project.states.list({ fields })` answers
the full row. That is documented on `Owned`, in the README, and pinned in
`navigation-types.test.ts` — and it is why the flat form stays public.

Models live in `src/models/v2/`; read models mark every field except `id` optional,
because `?fields=` and collection deferral can omit any of them. The wiki page model is
`Page` (`src/models/v2/Page.ts`) — files that also need the pagination envelope
`Page<T>` (`models/v2/common.ts`) import it under a local `WikiPage` alias to keep both
in scope.

**The sweeps.** The v2 rules are enforced by enumeration, not by review.
`tests/unit/v2/tree-walk.ts` derives every resource class from the TypeScript AST under
`src/api/v2/` (triangulated against the modules and the public barrel), and six rule
sweeps run over all 90 of them:

| File                                                  | Refuses                                                                                                                                   |
| ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `path-id-naming.test.ts`                              | a method that does not open with its URL's path ids, in path order; also compares entries against the constructed tree in both directions |
| `fields-coverage.test.ts` / `expand-coverage.test.ts` | an operation whose golden `FIELDS`/`EXPAND` entry the SDK does not expose                                                                 |
| `filters-coverage.test.ts`                            | a query filter the API accepts and no params type declares                                                                                |
| `order-by-coverage.test.ts`                           | a missing sort order, or a params type pointed at a sibling operation's enum                                                              |
| `operations-coverage.test.ts`                         | a method with no `operations` entry — which would silently exempt it from all of the above                                                |
| `field-projection.test.ts`                            | a method that accepts `fields` and answers the full row                                                                                   |

Two more cover the tree: `bands.test.ts` derives each band from the resources' own URL
templates and requires every member to be attached to its root (and nothing foreign to
be), and `loaded-navigation.test.ts` requires a resource that attaches a migrated child
to be navigable, with one property per child and no property shadowing a field.
`readme-samples.test.ts` type-checks every fenced `ts` block in `README.md`.

Every exception list in those files is guarded from both ends (an entry naming
something that does not exist fails; an entry that is no longer needed fails) and
ratcheted, so it can only shrink. **When you change a sweep, prove it:** introduce the
violation, watch it fail by name, revert. A sweep that has passed but has never been
shown to fail is not evidence.

**Models** (`src/models/`): TypeScript interfaces for each entity with separate Create/Update DTOs. Uses `Pick`, `Omit`, and `Partial` for DTO derivation. Notable: `WorkItem` uses a generic expandable fields pattern (`WorkItem<E extends WorkItemExpandableFieldName = never>`).

**Errors** (`src/errors/`): `PlaneError` is the base of everything. v1 raises
`HttpError` (status code and response data). v2 raises `PlaneApiError` (an RFC 9457
problem detail), `NoMatchFoundError`/`MultipleMatchesFoundError` from the `findBy*`
lookups, `PlaneNetworkError` for a request that never reached a server, and
`MissingPathIdError` when a URL cannot be built. All five extend `PlaneError`
directly — the lookup errors are _not_ subclasses of `PlaneApiError`, so catching that
alone does not catch them.

**OAuth**: Standalone `OAuthClient` (`src/client/oauth-client.ts`) handles authorization flows, token exchange, and refresh separately from the main SDK auth.

## Conventions

- All API endpoint URLs must end with `/`
- Standard resource methods: `list`, `iterate`, `retrieve`, `create`, `update`, `upsert`, `delete`
  (v1's older classes spell the last one `del`; v2 uses `delete` — follow the code)
- Never use "Issue" in names — always use "Work Item"
- File naming: kebab-case for files, PascalCase for classes, camelCase for methods
- Avoid `any` types; use proper typing or `unknown` with type guards
- Build produces `dist/` with compiled JS, declarations, source maps, and a bundled `types.bundle.d.ts`
