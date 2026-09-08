# Node SDK variant F — Task 2 report

Branch `feat/silo-1463-node-sdk-v2-flat`, worktree `.worktrees/plane-node-sdk-variant-f`.
Nothing pushed.

## What was migrated

37 classes onto the flat shape, in six commits:

| Commit    | Band                            | Classes                                                                                                                                                                                                                                               |
| --------- | ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `420938f` | read-only workspace             | Artifacts, AuditLogs, PermissionSchemes, Roles, WorkspacePermissions, ProjectPermissions                                                                                                                                                              |
| `f26204e` | workspace + project CRUD leaves | Stickies, Teamspaces, WorkspaceViews, ProjectViews, CustomerProperties, WorkItemRelationDefinitions, WorkspaceWorkItemTemplates, ProjectWorkItemTemplates                                                                                             |
| `4ba4512` | the awkward ones                | Assets, UserAssets, Users, Invitations, WorkspaceMembers, ProjectMembers, WorkspaceWorkItems, GroupSyncConfigResource, GroupSyncProjectMappings, GroupSyncWorkspaceMappings, WorkspaceFeatures, ProjectFeatures, WikiPages, ProjectPages, WebhookLogs |
| `075715f` | remaining project leaves        | Intakes, ProjectWorklogs                                                                                                                                                                                                                              |
| `111221f` | work item children              | Activities, Attachments, Links, WorkLogs, Relations, Dependencies                                                                                                                                                                                     |
| `1f373c1` | docs                            | locator doc comments + `locators.test.ts` framing (no resource changes)                                                                                                                                                                               |

Opt-out list: **84 -> 47**, `UNMIGRATED_CEILING` lowered in step at each commit
(84 → 78 → 70 → 55 → 53 → 47). What remains is exactly task 3's list — the families
and their children (automations, collections, customers, cycles, estimates,
initiatives, milestones, modules, releases, webhooks, workflows, work item types and
properties, and the two workspace-scoped property/type families).

Beyond the mechanical recipe, these stopped hand-rolling `transport.request` and now go
through kernel helpers: the three Artifacts envelopes, both `permissions/me/` singletons,
both `features/` singletons, the group-sync config singleton, `Users.me`,
`Invitations.bulk`, `WorkspaceMembers.remove`, `ProjectWorkItemTemplates.use`,
`ProjectWorklogs.summary`, and `Relations`/`Dependencies` `list`.

Alternate templates moved into `extraPaths` (so `urlFor` builds them _and_ the shape
sweep checks the method against the template it actually uses): `Invitations.bulk`,
`WorkspaceMembers.remove`, `WorkspaceWorkItems.retrieveByIdentifier`.

`ONE_TIME_RESPONSES` in `fields-coverage.test.ts` gained three real entries —
`Assets.create`, `UserAssets.create`, `Attachments.create` — and those three methods
stopped offering `?fields=`. Only `Webhooks.regenerate` is left pre-declared for task 3.

## Gates

- `npx jest tests/unit` — 609 passed, 317 skipped, 63 suites, 0 failures (was 532/317/63).
- `npx tsc --noEmit` — clean.
- `pnpm check:lint` — 165 warnings, 0 errors (baseline held; three transient new warnings
  from unused test constants were fixed rather than absorbed).
- `pnpm check:format` — clean.
- `pnpm build` not run, per the task (export snapshot is task 4's).

I proved the sweeps still bite on this batch rather than trusting them: dropping
`params` from `Teamspaces.create` failed both the `fields` and `expand` sweeps by name,
and renaming `Roles.retrieve`'s `role` to `roleId` failed the naming sweep. Both reverted.

## Where Node forced a different choice than Python

1. **The locators had to keep holding migrated resources.** Python's plan 2 migrated the
   workspace band _and_ wired it onto `Workspaces` in the same plan. Node task 2 must not
   wire the tree (task 4), and Node has no `Workspaces` resource class yet — but
   `path-id-naming.test.ts` requires every resource class to be reachable from a
   constructed `V2Namespace`. So migrated classes stay attached to the retired
   `Workspace`/`Project` locators, now purely as a holding pen: their methods take every
   id per call and the bound scope is inert. `locators.test.ts` previously asserted the
   rule "a family leaves the locator the moment it goes flat", which this batch makes
   false; I rewrote that framing and added a test that passes a slug _differing_ from the
   bound one, proving the held resources behave the migrated way. Task 4 deletes both
   locators.

2. **`LoadedWorkItem` gained six navigation properties.** Migrating the work item
   children makes the navigation sweep demand one property per migrated child, so a
   fetched work item now reaches all seven, not just `comments`. That is the sweep doing
   its job ("fix the resource, never re-add the name"), but it does pre-empt a slice of
   task 3 — no _new_ loaded type was created, only the existing one completed.

3. **`Roles`' collision is a readability fix in Node, not a compile error.** Node's
   filters live in a params object, so a `slug` property would not have clashed with the
   leading `slug` parameter the way Python's keyword argument did. I carried the rename
   anyway — two different things called `slug` in one call is the actual problem — as
   `roleSlug`, mapped back onto the golden's `slug` query key by a small helper, with a
   test asserting the wire parameter is still `?slug=`.

4. **Asset `create` return types were left alone.** Python returns dedicated
   `WorkspaceAssetUploadResult` / `UserAssetUploadResult` models; Node has no such models
   and documents the divergence on the request DTOs instead ("the live view returns
   `{ ..., asset }` — read `.asset`"). Only the `fields` removal was carried over;
   introducing new response models is a modelling change, not a migration.

5. **Python's singleton read verbs were not adopted.** Python calls the features read
   `get`; Node's public method was already `retrieve`, and renaming it would be an
   unrelated API break. `GroupSyncConfigResource.get` keeps its own name, as in Python.

## Could not reconcile with Python

- **`CustomerProperties.find_by_display_name` / the `display_name` filter.** Python has
  both, from a golden whose `CustomerPropertiesListFilters` carries `display_name`. The
  Node SDK's generated `constants.ts` and the `plane-ee` golden in this workspace both
  offer only `count, fields, is_active, is_required, name, offset, order_by, paginate,
per_page, property_type, search` on `customer_properties_list` — `display_name` is a
  projectable _field_ but not a filter. Adding it would have shipped a query parameter
  the server ignores, so I left it out and gave `findByName` a doc comment saying `name`
  is the slugified key. **Worth a look when the Node golden is next regenerated**: if the
  filter appears, add `findByDisplayName` to match Python.
- Naming only, not a behaviour gap: Python's `WorkspaceAssets` is Node's `Assets`, and
  Python's `WorkItemRelations`/`WorkItemDependencies` are Node's `Relations`/
  `Dependencies` (both live under `WorkItems/`, so the short names are unambiguous).

## Not done, deliberately

Tree wiring (task 4), new navigable loaded types for families (task 3), the e2e suite
(deferred), and `pnpm build`.
