import type { WorkItemProperty } from "../../../models/v2/WorkItemProperty";
import type { Loaded, Owned } from "../kernel/loaded";
import type { WorkItemPropertyOptions } from "../WorkItemProperties/Options";
import type { WorkItemPropertyContexts } from "../WorkspaceWorkItemProperties/Contexts";
import type { WorkspaceWorkItemPropertyOptions } from "../WorkspaceWorkItemProperties/Options";

/**
 * Both scopes live here side by side so they stay diffable: a project-scoped property
 * binds three ids and reaches its options; a workspace-scoped one binds two and also
 * reaches its contexts.
 *
 * **Neither names its options child `options`.** `options` is a real field on a work item
 * property row — the inlined choices an OPTION-typed property carries — so a navigation
 * property of that name would define over it, hiding real data behind a child-resource
 * view while `$loaded.present` went on reporting the field as present. `loadRow` refuses
 * that outright and `tests/unit/v2/loaded-navigation.test.ts` builds a row carrying every
 * field the golden declares so the refusal fires in CI. The mapping is recorded in that
 * file's `NAVIGATION_ALIASES`; the Python SDK needed the same rename on both classes.
 */

/** The path ids a child of a project-scoped work item property row needs, in URL order. */
export type WorkItemPropertyIds = [slug: string, project: string, property: string];

/** The parameter names behind {@link WorkItemPropertyIds}, in the same order. */
export const WORK_ITEM_PROPERTY_ID_NAMES = ["slug", "project", "property"] as const;

/** Everything a fetched project-scoped work item property can reach. */
export interface WorkItemPropertyNavigation {
  readonly propertyOptions: Owned<WorkItemPropertyOptions, WorkItemPropertyIds>;
}

/** A fetched project-scoped work item property row that is also the place its options live. */
export type LoadedWorkItemPropertyRow<TRow> = Loaded<TRow, WorkItemPropertyNavigation>;

export type LoadedWorkItemProperty = LoadedWorkItemPropertyRow<WorkItemProperty>;

/** The path ids a child of a workspace-scoped work item property row needs, in URL order. */
export type WorkspaceWorkItemPropertyIds = [slug: string, property: string];

/** The parameter names behind {@link WorkspaceWorkItemPropertyIds}, in the same order. */
export const WORKSPACE_WORK_ITEM_PROPERTY_ID_NAMES = ["slug", "property"] as const;

/** Everything a fetched workspace-scoped work item property can reach. */
export interface WorkspaceWorkItemPropertyNavigation {
  readonly propertyOptions: Owned<WorkspaceWorkItemPropertyOptions, WorkspaceWorkItemPropertyIds>;
  readonly contexts: Owned<WorkItemPropertyContexts, WorkspaceWorkItemPropertyIds>;
}

/** A fetched workspace-scoped work item property row that is also the place its options and contexts live. */
export type LoadedWorkspaceWorkItemPropertyRow<TRow> = Loaded<TRow, WorkspaceWorkItemPropertyNavigation>;

export type LoadedWorkspaceWorkItemProperty = LoadedWorkspaceWorkItemPropertyRow<WorkItemProperty>;
