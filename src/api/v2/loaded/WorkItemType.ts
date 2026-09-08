import type { WorkItemType } from "../../../models/v2/WorkItemType";
import type { Loaded, Owned } from "../kernel/loaded";
import type { WorkItemTypeProperties } from "../WorkItemTypes/Properties";
import type { WorkspaceWorkItemTypeProperties } from "../WorkspaceWorkItemTypes/Properties";

/**
 * Both scopes live here side by side so they stay diffable: a project-scoped type binds
 * three ids, a workspace-scoped one binds two, and each exposes the same single child.
 * The two are genuinely distinct resources, not a filter on one another.
 */

/** The path ids a child of a project-scoped work item type row needs, in URL order. */
export type WorkItemTypeIds = [slug: string, project: string, type: string];

/** The parameter names behind {@link WorkItemTypeIds}, in the same order. */
export const WORK_ITEM_TYPE_ID_NAMES = ["slug", "project", "type"] as const;

/** Everything a fetched project-scoped work item type can reach: the properties linked to it. */
export interface WorkItemTypeNavigation {
  readonly properties: Owned<WorkItemTypeProperties, WorkItemTypeIds>;
}

/** A fetched project-scoped work item type row that is also the place its properties live. */
export type LoadedWorkItemTypeRow<TRow> = Loaded<TRow, WorkItemTypeNavigation>;

export type LoadedWorkItemType = LoadedWorkItemTypeRow<WorkItemType>;

/** The path ids a child of a workspace-scoped work item type row needs, in URL order. */
export type WorkspaceWorkItemTypeIds = [slug: string, type: string];

/** The parameter names behind {@link WorkspaceWorkItemTypeIds}, in the same order. */
export const WORKSPACE_WORK_ITEM_TYPE_ID_NAMES = ["slug", "type"] as const;

/** Everything a fetched workspace-scoped work item type can reach. */
export interface WorkspaceWorkItemTypeNavigation {
  readonly properties: Owned<WorkspaceWorkItemTypeProperties, WorkspaceWorkItemTypeIds>;
}

/** A fetched workspace-scoped work item type row that is also the place its properties live. */
export type LoadedWorkspaceWorkItemTypeRow<TRow> = Loaded<TRow, WorkspaceWorkItemTypeNavigation>;

export type LoadedWorkspaceWorkItemType = LoadedWorkspaceWorkItemTypeRow<WorkItemType>;
