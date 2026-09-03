# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is `@makeplane/plane-node-sdk` — a TypeScript SDK for the Plane API. It uses axios for HTTP, targets Node.js >=20, and is managed with pnpm@10.20.0.

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

**API v2** (`src/api/v2/`): the v2 surface, reached as `client.v2`. The bound/chained
form is the only public shape — `client.v2.workspace(slug)` returns a `Workspace`
locator (`src/api/v2/Workspace.ts`), `.project(key)` off of that returns a `Project`
locator (`src/api/v2/Project.ts`); both do zero I/O. `Wiki.ts` is `Workspace.wiki`'s
container (`.pages`/`.collections`). `kernel/` holds the shared machinery (transport,
pagination, generic `V2Resource`, bulk helpers); `generated/constants.ts` is produced
by `pnpm codegen:v2` from the api_v2 OpenAPI golden and must never be hand-edited.
Resources are thin declarations over `V2Resource`, constructed with a `scope`
(`{ slug }` / `{ slug, project_id }`) a locator already bound — `V2Resource`'s
`urlFor` resolves path placeholders from `{...scope, ...pathParams}`, explicit
`pathParams` winning. No public v2 method takes `workspaceSlug`/`project` — the
locator supplies both; leaf ids (`workItemId`, `releaseId`, ...) stay as the first
positional argument. Membership bridges (`{add}`/`{remove}` POSTs answering
`{added}`/`{removed}`) are never `manage*` methods: they are `add(parentId, ids)` /
`remove(parentId, ids)` on a sub-resource named for the noun (`cycles.workItems`,
`initiatives.projects`, `releases.labels`, `wiki.collections.members`), each built on
`V2Resource.doBridge`/`doBridgeAt`, which sends one verb per call, enforces 1..100 ids
client-side and resolves to the plain id array. A bridge verb copies the web app CTA —
properties on a work item type are `link`/`unlink`. Models live in `src/models/v2/`; read models mark every
field except `id` optional, because `?fields=` and collection deferral can omit any
of them. The wiki page model is `Page` (`src/models/v2/Page.ts`) — files that also
need the pagination envelope `Page<T>` (`models/v2/common.ts`) import it under a
local `WikiPage` alias to keep both in scope.

**Models** (`src/models/`): TypeScript interfaces for each entity with separate Create/Update DTOs. Uses `Pick`, `Omit`, and `Partial` for DTO derivation. Notable: `WorkItem` uses a generic expandable fields pattern (`WorkItem<E extends WorkItemExpandableFieldName = never>`).

**Errors** (`src/errors/`): `PlaneError` (base) → `HttpError` (HTTP-specific with status code and response data).

**OAuth**: Standalone `OAuthClient` (`src/client/oauth-client.ts`) handles authorization flows, token exchange, and refresh separately from the main SDK auth.

## Conventions

- All API endpoint URLs must end with `/`
- Standard resource methods: `list`, `create`, `retrieve`, `update`, `del`
- Never use "Issue" in names — always use "Work Item"
- File naming: kebab-case for files, PascalCase for classes, camelCase for methods
- Avoid `any` types; use proper typing or `unknown` with type guards
- Build produces `dist/` with compiled JS, declarations, source maps, and a bundled `types.bundle.d.ts`
