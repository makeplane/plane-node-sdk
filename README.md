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

There are **two ways in**, and they are the same resources either way.

### 1. The flat path — every resource is an attribute, every id an argument

A resource hangs off the namespace at the position its URL puts it, and takes the ids
its URL names as **leading positional arguments**, in path order:

```ts
import { PlaneClient } from "@makeplane/plane-node-sdk";

const client = new PlaneClient({ baseUrl: "https://api.plane.so", apiKey: "..." });

// GET /workspaces/acme/projects/ENG/states/
await client.v2.workspaces.projects.states.list("acme", "ENG");

// GET /workspaces/acme/projects/ENG/work-items/wi-1/comments/
await client.v2.workspaces.projects.workItems.comments.list("acme", "ENG", "wi-1");

// GET /workspaces/acme/teamspaces/
await client.v2.workspaces.teamspaces.list("acme");
```

`project` accepts a project's UUID **or** its readable identifier (`"ENG"`); a work item
can be reached by its human key with `retrieveByIdentifier`. No v2 method takes a
`workspaceSlug` or `project` option object — path ids are positional and always first,
in URL order, and everything else lives in the trailing `params` object.

### 2. Loaded rows — a fetched row is the place its children live

A resource that has children answers **navigable rows** from every row-returning method:
the row's own data, plus one property per child, with the ids that produced it already
supplied. This is the id-consumption rule — _an id is passed once, at the point it is
known_. (A resource with no children — `states`, `labels`, `roles` — answers the plain
model, since there is nothing to reach from it.)

```ts
const workspace = await client.v2.workspaces.retrieve("acme");

await workspace.projects.list(); // no slug
await workspace.teamspaces.list(); // no slug

// And it chains: a fetched project carries both ids.
const eng = await workspace.projects.retrieve("ENG");
await eng.states.list(); // no slug, no project key
await eng.workItems.create({ name: "Fix login bug", state: "Todo", labels: ["bug"] });

// Three levels deep: a fetched work item carries all three.
const item = await eng.workItems.retrieve("wi-1");
await item.comments.list();
```

Chaining works because a row _knows which ids fetched it_. `list` and `iterate` hand back
navigable rows too, so paging does not lose navigation:

```ts
for await (const project of client.v2.workspaces.projects.iterate("acme")) {
  await project.states.list(); // still navigable
}
```

Three details worth knowing:

- **`row.$loaded`** carries `ids`, `idNames` and `present` — the set of field names the
  server actually returned. It and the navigation properties are non-enumerable, so
  `{ ...row }`, `Object.keys(row)` and `JSON.stringify(row)` see the plain API row.
- **A navigation property never shadows a field.** Where a child's natural name is
  already a field of the row, the property is renamed and the field is kept:
  `estimate.estimatePoints` (because `?expand=points` returns a real `points` field) and
  `property.propertyOptions` (likewise `options`). Building a row that would shadow a
  field throws rather than hiding data.
- **Only methods survive navigation.** A grandchild resource is not reachable from a
  view — `project.workItems.comments` does not exist, because a comment needs a work
  item's own id, which only a fetched work item carries. Fetch the work item first.

There is no third form. `client.v2.workspace(slug).project(key)` — the bound locator
chain earlier previews carried — is **deleted**, not deprecated: it bound nothing (every
resource takes its ids per call, so `workspace(slug).roles.list(slug)` passed the slug
twice) and every family it held is on `v2.workspaces` already.

### Field projection is a compile-time promise

`fields` narrows the **return type**, not just the response. Ask for two fields and the
row you get back has two fields plus `id`; reading anything else is a compile error, not
an `undefined` at runtime:

```ts
const page = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: ["id", "name"] });
for (const state of page.data) {
  console.log(state.id, state.name); // typed — only id/name exist on this row
  // console.log(state.color);       // compile error: `color` was not requested
}
```

An inline array literal needs no `as const`. The same holds for `iterate`, for
`retrieve`, and — since it is the same claim — for **writes**: `create`, `update` and
`upsert` accept `fields` and narrow their answer the same way.

```ts
const created = await client.v2.workspaces.projects.states.create(
  "acme",
  "ENG",
  { name: "In Review", color: "#4ECDC4" },
  { fields: ["id", "name"] }
);
console.log(created.name); // narrowed; `created.color` would not compile
```

A field list built at runtime (not a literal) must still be typed as field names — plain
`string[]` is **not** assignable to `readonly StateField[]` and fails with a long
overload-mismatch error. The row is narrowed to the list's **element type**, so type the
variable as narrowly as you actually use it:

```ts
import { PlaneClient, v2 } from "@makeplane/plane-node-sdk";

const client = new PlaneClient({ baseUrl: "https://api.plane.so", apiKey: "..." });

// Narrowed to these two names, even though the value is chosen at run time.
const wanted: ("id" | "name")[] = includeColor ? ["id", "name"] : ["id"];
const page = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: wanted });

// Typed as the whole union instead, this narrows to "every field" — i.e. the full row.
const anything: v2.StateField[] = includeColor ? ["id", "name", "color"] : ["id", "name"];
const unnarrowed = await client.v2.workspaces.projects.states.list("acme", "ENG", { fields: anything });
```

`"all"` is a legal field value meaning "every field" and correctly yields the full row
type. Sparse responses mean every read field except `id` is optional — check for
`undefined` rather than assuming presence, and `row.$loaded.present` answers what
actually came back when the list was built dynamically.

**One limitation, and it is the reason the flat form stays public.** A navigated call
resolves against the general signature, so it accepts `fields` but does **not** narrow:

```ts
const eng = await client.v2.workspaces.projects.retrieve("acme", "ENG");
const listed = await eng.states.list({ fields: ["id", "name"] }); // Page<State>, not narrowed
```

TypeScript erases a type parameter when it infers through the conditional type behind a
navigation property, so the narrowing overload cannot be carried across. Matching the
overload set instead would be worse, not better: the inference would erase `F` to its
constraint and claim _every_ field is present. When you want the narrowed row, call the
resource flat — `client.v2.workspaces.projects.states.list("acme", "ENG", { fields: [...] })`.

### Memberships

Memberships are `add`/`remove` on a sub-resource named for the thing being added — path
ids first, then 1..100 ids (an empty or oversized list throws before any request). Each
call sends only its own verb and resolves to the ids the server actually changed.
Properties on a work item type use `link`/`unlink` instead, matching the web app;
`unlink` deletes that property's values on every work item of the type.

```ts
const v2ns = client.v2;

await v2ns.workspaces.projects.cycles.workItems.add("acme", "ENG", cycleId, [itemId]); // -> ["<item id>"]
await v2ns.workspaces.projects.modules.workItems.remove("acme", "ENG", moduleId, [itemId]);
await v2ns.workspaces.releases.labels.add("acme", releaseId, [labelId]);
await v2ns.workspaces.initiatives.projects.add("acme", initiativeId, [projectId]);
await v2ns.workspaces.wiki.collections.members.add("acme", collectionId, [{ member_id: userId, access: 1 }]);
await v2ns.workspaces.projects.workItemTypes.properties.link("acme", "ENG", typeId, [propertyId]);
await v2ns.workspaces.projects.workItemTypes.properties.unlink("acme", "ENG", typeId, propertyId);
```

`releases.labels` is the one place where a fetched row and the flat path differ: the
class holds both the workspace-level label catalog (`list`/`create`, slug only) and the
per-release bridge. A fetched release binds the bridge, so `release.labels.add(...)`
works and `release.labels.list()` does not type-check — reach the catalog flat.

### Lookups by human key

These resolve exactly one row server-side, throwing `NoMatchFoundError` or
`MultipleMatchesFoundError` otherwise: `findByName` wherever the API filters on `name`,
plus `roles.findBySlug`, `estimates.points.findByKey`, and `findByName` on property
options and contexts. Both errors extend `PlaneError`, not `PlaneApiError`. On custom properties `name` is the machine key (e.g.
`story_points`), not the label shown in the app.

```ts
await client.v2.workspaces.projects.states.findByName("acme", "ENG", "Todo");
await client.v2.workspaces.roles.findBySlug("acme", "admin", { namespace: "workspace" });
await client.v2.workspaces.projects.estimates.points.findByKey("acme", "ENG", estimateId, 3);
```

### Pagination

`Page<T>` is a union of the offset envelope (`total_count`, `next`) and the cursor
envelope (`has_more`, `next_cursor`) — which one a `list()` returns depends on the
request's `paginate` param. Narrow it with `v2.isCursorPage` / `v2.isOffsetPage` before
reading an envelope-specific field; reading one without narrowing is a compile error,
since it may not exist on the other half of the union:

```ts
const page = await client.v2.workspaces.projects.states.list("acme", "ENG");
if (v2.isOffsetPage(page)) {
  console.log(page.total_count); // only reachable once narrowed
} else if (v2.isCursorPage(page)) {
  console.log(page.next_cursor);
}
```

`iterate` follows pages for you and yields rows.

`order_by` is validated the same way `fields` is, against a generated
`StateOrderBy`/`LabelOrderBy` union: a literal outside that union is a compile error, and a
value built at run time is rejected by `encodeOrderBy` client-side rather than reaching
the server as a 400.

### Wiki

`v2.workspaces.wiki.pages` is every global page in the workspace (not one project —
that is `v2.workspaces.projects.pages`); `v2.workspaces.wiki.collections` is wiki collections. A
page write's `collection_id` can be omitted for a public page (it lands in the
workspace's default "General" collection); a private page needs an explicit
`collection_id` of a collection the caller owns.

```ts
const wiki = client.v2.workspaces.wiki;

await wiki.pages.create("acme", { name: "Handbook" }); // public page -> default collection
const handbook = await wiki.collections.findByName("acme", "Engineering handbook");
await wiki.pages.create("acme", { name: "Runbook", collection_id: handbook.id });
await wiki.collections.default("acme"); // the default collection, resolved via `is_default`
```

`wiki` and `groupSync` are grouping nodes, not resources: they consume no path id of
their own, so they are not navigation properties on a fetched workspace row. Reach them
flat.

### Errors

`PlaneApiError` — an RFC 9457 problem detail with `.status`, `.type`, `.code`, `.detail`,
`.errors` — plus `NoMatchFoundError` and `MultipleMatchesFoundError` from the `findBy*`
lookups. A request that never reaches a server at all (connection refused, DNS failure,
timeout, …) raises `PlaneNetworkError`, carrying the underlying error's message and
`.cause`. A call that cannot build a URL because a path id is missing raises
`MissingPathIdError`.

### Bulk writes

`bulkCreate` / `bulkUpdate` / `bulkDelete` always answer HTTP 200, even when some rows
fail — partial success is the default. Call `v2.raiseForFailures(result)` to throw,
carrying the first failure's `errors`. The cap is 50 items per call
(`v2.BULK_MAX_ITEMS`); an empty batch is rejected client-side rather than being a silent
no-op.

```ts
const result = await client.v2.workspaces.projects.states.bulkCreate("acme", "ENG", [{ name: "QA", color: "#ffffff" }]);
v2.raiseForFailures(result);
```

### Types

v2 types are reachable through the `v2` and `v2models` namespaces (e.g. `v2models.State`,
`v2.StateField`), and the most common ones are also aliased at the package root:
`V2Label`, `V2State`, `V2Project`, `V2Workspace`, `V2WorkItem`, `V2Cycle`, `V2Module`,
`V2Milestone`, `V2ListStatesParams`, `V2ListLabelsParams`. Use those — v2's bare
`Label`/`State`/`Project`/`Workspace`/`Page` names collide with v1's in the bundled type
definitions, so `import { Workspace } from "@makeplane/plane-node-sdk"` resolves to
**v1's** shape, not v2's. (`V2Page` is the wiki page model; the pagination envelope
`Page<T>` is aliased separately as `V2PageEnvelope`.)

The types a navigable row resolves to are exported too: `LoadedProject`,
`ProjectNavigation`, `ProjectIds`, `PROJECT_ID_NAMES`, and the same set per family, plus
the `Loaded`, `Owned` and `LoadedMeta` kernel types.

### Generated data

`v2.FIELDS`, `v2.EXPAND` and `v2.ORDER_BY` are the full operation-id → allowed-values
maps the encoders validate against (e.g. `v2.FIELDS["states_list"]` lists every field
`states.list` accepts); `v2.OPENAPI_VERSION` is the api_v2 golden version the SDK was
generated from. All of them, plus `v2.BULK_MAX_ITEMS`, are exported so a caller can
enumerate valid values rather than guessing.

### How this surface is kept honest

The v2 surface is 90 resource classes, and none of it is spot-checked. Six rule sweeps
run over **every** class — enumerated from the TypeScript source, not selected by some
property a class might not have yet — and each is proved by introducing the violation and
watching the sweep name it:

| Sweep                    | What it refuses                                                     |
| ------------------------ | ------------------------------------------------------------------- |
| Call shape               | a method that does not open with its URL's path ids, in path order  |
| `fields` / `expand`      | an operation that offers a projection the SDK does not expose       |
| Query filters            | a `?filter=` the API accepts and no params type declares            |
| `order_by`               | a missing sort order, or a params type pointed at a sibling's enum  |
| Operation correspondence | a method with no `operations` entry, silently exempt from the above |
| Projection soundness     | a method that accepts `fields` and answers the full row anyway      |

Two more sweeps cover the tree rather than the classes: **band completeness** derives, from
each resource's own URL template, which of the two roots it belongs to and requires it to
be attached there (and nothing foreign to be); **navigation completeness** requires a
resource that attaches a migrated child to answer navigable rows, with one property per
child and no property shadowing a real field. Every method also asserts its exact request
URL against a mock server — the one class of error no source-level sweep can catch.

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
