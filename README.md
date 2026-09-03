# Plane Node SDK

A comprehensive TypeScript/JavaScript SDK for the Plane API, providing a clean and type-safe interface for all Plane operations.

## Installation

```bash
npm install @makeplane/plane-node-sdk
```

## ⚠️ Version 0.2.0 Breaking Changes

**Important:** Version 0.2.0 introduces breaking changes with new API signatures. If you're migrating from version 0.1.x, please review the following:

- **New PlaneClient Structure**: Instead of importing each API separately, you now use a single `PlaneClient` instance that provides access to all APIs
- **Updated Method Signatures**: Method parameters and return types have been updated for better readability and consistency

**Migration Guide:**

- Replace individual API imports with the new `PlaneClient` approach
- Review the new API documentation for updated method signatures
- Test thoroughly in a development environment before upgrading

## Quick Start

```typescript
import { PlaneClient } from "@plane/node-sdk";

const client = new PlaneClient({
  apiKey: "your-api-key",
});

// Or with custom base URL
const client = new PlaneClient({
  baseUrl: "https://your-custom-api.plane.so",
  accessToken: "your-access-token",
});

// List projects
const projects = await client.projects.list();

// Create a project
const project = await client.projects.create("workspace-slug", {
  name: "My Project",
  description: "A new project",
});
```

## API v2

`client.v2` reaches the v2 surface. The v1 resources on the client are unchanged.

The bound/chained form is the **only** public shape: bind a workspace, then (for
project-scoped resources) a project — both locators do zero I/O, so building the
chain never makes a request on its own.

```ts
import { PlaneClient, v2 } from "@makeplane/plane-node-sdk";

const client = new PlaneClient({ baseUrl: "https://api.plane.so", apiKey: "..." });

// Bind once. `project` accepts a project id or its key (e.g. "ENG").
const ws = client.v2.workspace("acme");
const eng = ws.project("ENG");

// States resolve by name; every method below takes only the arguments the
// workspace/project scope doesn't already supply.
const todo = await eng.states.findByName("Todo");

// Ask for only the fields you need — list/retrieve narrow the return type to match.
// An inline array literal needs no `as const`.
const page = await eng.states.list({ fields: ["id", "name"] });
for (const state of page.data) {
  console.log(state.id, state.name); // typed — only id/name exist on this row
}

// iterate() follows pagination automatically, but always returns the full row type
for await (const state of eng.states.iterate()) {
  console.log(state.id, state.name);
}

await eng.states.create({ name: "In Review", color: "#4ECDC4" });

// Batches report per row; partial success is the default. `raiseForFailures` and the
// other bulk helpers live on the `v2` namespace, not the package root.
const result = await eng.states.bulkCreate([{ name: "QA", color: "#fff" }]);
v2.raiseForFailures(result);

// The 6 operations that aren't workspace-scoped at all stay on the top-level namespace.
await client.v2.users.me();
```

No v2 method takes `workspaceSlug`/`project` — the locator supplies both. Leaf ids
(`workItemId`, `releaseId`, `collectionId`, …) stay as the first positional argument:

```ts
const item = await eng.workItems.create({ name: "Fix login bug", state: "Todo", labels: ["bug"] });
await eng.workItems.comments.list(item.id);
await ws.workItems.retrieveByIdentifier("ENG-12"); // by human key, no project needed
await ws.releases.comments.list(releaseId);
```

**Memberships** are `add`/`remove` on a sub-resource named for the thing being added
(parent id first, then 1..100 ids — an empty or oversized list throws before any
request). Each call sends only its own verb and resolves to the ids the server
actually changed. Properties on a work item type use `link`/`unlink` instead, matching
the web app; `unlink` deletes that property's values on every work item of the type.

```ts
await eng.cycles.workItems.add(cycleId, [item.id]); // -> ["<item id>"]
await eng.modules.workItems.remove(moduleId, [item.id]);
await ws.releases.labels.add(releaseId, [labelId]); // `labels.create` defines, `labels.add` applies
await ws.initiatives.projects.add(initiativeId, [projectId]);
await ws.wiki.collections.members.add(collectionId, [{ member_id: userId, access: 1 }]);
await eng.workItemTypes.properties.link(typeId, [propertyId]);
await eng.workItemTypes.properties.unlink(typeId, propertyId);
```

**Lookups by human key** resolve exactly one row server-side (`NoMatchFoundError` /
`MultipleMatchesFoundError` otherwise): `findByName` wherever the API filters on
`name`, plus `ws.roles.findBySlug("admin", { namespace })`,
`eng.estimates.points.findByKey(estimateId, 3)`, and `findByName(propertyId, name)` on
property options and contexts. On custom properties `name` is the machine key (e.g.
`story_points`), not the label shown in the app.

A field list built at runtime (not a literal) must be typed `StateField[]` /
`LabelField[]` — plain `string[]` is **not** assignable to `readonly StateField[]` and
fails with a long overload-mismatch error:

```ts
import { PlaneClient, v2 } from "@makeplane/plane-node-sdk";

const client = new PlaneClient({ baseUrl: "https://api.plane.so", apiKey: "..." });
const eng = client.v2.workspace("acme").project("ENG");

const wanted: v2.StateField[] = includeColor ? ["id", "name", "color"] : ["id", "name"];
const page = await eng.states.list({ fields: wanted }); // still narrows
```

`"all"` is a legal field value meaning "every field" and correctly yields the full row
type. Sparse responses mean every read field except `id` is optional — check for
`undefined` rather than assuming a field is present.

**Pagination**: `Page<T>` is a union of the offset envelope (`total_count`, `next`) and
the cursor envelope (`has_more`, `next_cursor`) — which one a given `list()` returns
depends on the request's `paginate` param. Narrow it with `v2.isCursorPage` /
`v2.isOffsetPage` before reading an envelope-specific field; reading one without
narrowing first is a compile error, since it may not exist on the other half of the
union:

```ts
import { PlaneClient, v2 } from "@makeplane/plane-node-sdk";

const client = new PlaneClient({ baseUrl: "https://api.plane.so", apiKey: "..." });
const eng = client.v2.workspace("acme").project("ENG");

const page = await eng.states.list();
if (v2.isOffsetPage(page)) {
  console.log(page.total_count); // only reachable once narrowed
} else if (v2.isCursorPage(page)) {
  console.log(page.next_cursor);
}
```

`order_by` is validated the same way `fields` is, against a generated
`StateOrderBy`/`LabelOrderBy` union — an unsupported value throws client-side rather
than reaching the server.

**Wiki**: `ws.wiki.pages` is every global page in the workspace (not one project —
that's `eng.pages`); `ws.wiki.collections` is wiki collections. A page write's
`collection_id` can be omitted for a public page (it lands in the workspace's default
"General" collection); a private page needs an explicit `collection_id` of a
collection the caller owns.

```ts
const ws = client.v2.workspace("acme");
await ws.wiki.pages.create({ name: "Handbook" }); // public page -> default collection
const handbook = await ws.wiki.collections.findByName("Engineering handbook");
await ws.wiki.pages.create({ name: "Runbook", collection_id: handbook.id });
await ws.wiki.collections.default(); // the default collection, resolved via `is_default`
```

**Errors**: `PlaneApiError` — an RFC 9457 problem detail with `.status`, `.type`,
`.code`, `.detail`, `.errors` — plus `NoMatchFoundError` and
`MultipleMatchesFoundError` from `findByName`. A request that never reaches a server
at all (connection refused, DNS failure, timeout, ...) raises `PlaneNetworkError`
instead, carrying the underlying error's message and `.cause`.

**Bulk writes** (`bulkCreate` / `bulkUpdate` / `bulkDelete`) always answer HTTP 200,
even when some rows fail — partial success is the default. Call
`v2.raiseForFailures(result)` to throw, carrying the first failure's `errors`. The cap
is 50 items per call (`v2.BULK_MAX_ITEMS`); an empty batch is rejected client-side (not
a silent no-op).

**Types**: v2 types are reachable through the `v2` and `v2models` namespaces (e.g.
`v2models.State`, `v2.StateField`), and the most common ones are also aliased at the
package root: `V2Label`, `V2State`, `V2Page`, `V2Cycle`, `V2Module`, `V2Milestone`,
`V2ListStatesParams`, `V2ListLabelsParams`. Use those — v2's bare `Label`/`State`/
`Page`/`Cycle`/`Module`/`Milestone` names collide with v1's in the bundled type
definitions, so `import { Label } from "@makeplane/plane-node-sdk"` resolves to
**v1's** shape, not v2's. (`V2Page` is the wiki page model; the pagination envelope
`Page<T>` is aliased separately as `V2PageEnvelope`.)

**Generated data**: `v2.FIELDS` and `v2.ORDER_BY` are the full operation-id -> allowed-
values maps `encodeFields`/`encodeOrderBy` validate against (e.g. `v2.FIELDS["states_list"]`
lists every field `states.list` accepts); `v2.OPENAPI_VERSION` is the api_v2 golden
version the SDK was generated from. All three, plus `v2.BULK_MAX_ITEMS`, are exported
from the `v2` namespace so a caller can enumerate valid values rather than guessing.

## Features

- ✅ TypeScript support with full type safety
- ✅ Centralized HTTP logic with BaseResource
- ✅ Automatic authentication handling
- ✅ Modern async/await patterns
- ✅ Extensible architecture

## API Resources

- **Projects**: Project management and organization
- **WorkItems**: Issue and task management with full CRUD operations
- **WorkItemTypes**: Custom work item type definitions and management
- **WorkItemProperties**: Custom properties for work items
- **Labels**: Issue categorization and tagging
- **States**: Workflow state management
- **Users**: User management and profiles
- **Roles**: Workspace and project role definitions (read-only)
- **Estimates**: Project estimates and estimate points
- **Modules**: Feature organization and module management
- **Cycles**: Sprint and iteration management
- **Customers**: Customer management and operations
- **Pages**: Workspace and project page management
- **Links**: Work item linking and relationships
- **Workspace**: Workspace-level operations
- **Epics**: Epic management and organization
- **Intake**: Intake form and request management
- **Stickies**: Stickies management
- **Teamspaces**: Teamspace management
- **Milestones**: Milestone tracking and management
- **Initiatives**: Initiative management
- **WorkspaceTemplates**: Workspace-level work item, project, and page templates
- **WorkspaceWorkItemTypes**: Workspace-level work item type management with property links
- **WorkspaceWorkItemProperties**: Workspace-level custom property management with options
- **WorkspaceProjectLabels**: Workspace-level project label management
- **WorkspaceProjectStates**: Workspace-level project state management
- **WorkItemRelationDefinitions**: Custom work item relation type definitions
- **Releases**: Release management with tags, labels, item labels, changelog, comments, links, and work items
- **Collections**: Folders that group workspace pages, with member and page management
- **AgentRuns**: AI agent run orchestration and activity tracking
- **Workflows**: Project workflow management with state attachments, transitions, transition hooks, activities, and work item approvals
- **ProjectTemplates**: Work item and page template management per project
- **Features**: Workspace and project features management
- **WorkspaceStates**: Workspace-level (catalog) work-item states under workspace governance — dual-mode reads, governed-only writes
- **WorkspaceWorkflows**: Workspace-level workflow catalog under workspace governance, with chain (states), transitions, usage, activities, and transition hooks
- **WorkItemTypeGovernance**: Governs which workflows a workspace-level work item type may use (any/constrained/required modes), with per-project pins and the project-side pick/fallback-preview endpoints

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Testing

### Setup Test Environment

Before running tests, you need to configure your test environment:

1. **Copy the environment template:**

   ```bash
   cp env.example .env.test
   ```

2. **Update `.env.test` with your test environment values:**

   ```bash
   # Edit the file with your actual test environment details
   nano .env.test
   ```

3. **Required environment variables:**
   - `TEST_WORKSPACE_SLUG`: Your test workspace slug
   - `TEST_PROJECT_ID`: Your test project ID
   - `TEST_USER_ID`: Your test user ID
   - `TEST_WORK_ITEM_ID`: A test work item ID
   - `TEST_CUSTOMER_ID`: A test customer ID
   - And other test-specific IDs as needed

### Running Tests

```bash
# Run all tests (recommended)
npm test
# or
pnpm test

# Run specific test files
pnpx ts-node tests/page.test.ts
# or
pnpm test page.test.ts
```

## License

MIT
