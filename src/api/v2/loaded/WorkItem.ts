import type { WorkItem } from "../../../models/v2/WorkItem";
import type { Loaded, Owned } from "../kernel/loaded";
import type { Comments } from "../WorkItems/Comments";

/**
 * The path ids a child of a work item row needs, in URL order, ending with the work
 * item's own. `Owned` drops exactly these from every child method's signature.
 */
export type WorkItemIds = [slug: string, project: string, workItem: string];

/** The parameter names behind {@link WorkItemIds}, in the same order. */
export const WORK_ITEM_ID_NAMES = ["slug", "project", "workItem"] as const;

/**
 * Everything a fetched work item can reach.
 *
 * One property per child `WorkItems` attaches whose own migration is done;
 * `tests/unit/v2/loaded-navigation.test.ts` compares the two sets and fails by name if a
 * migrated child has no way to be reached from a row.
 */
export interface WorkItemNavigation {
  readonly comments: Owned<Comments, WorkItemIds>;
}

/**
 * A fetched work item row that is also the place its children live.
 *
 * Generic over the row so a projection composes: `list(slug, project, { fields: ["name"] })`
 * answers `LoadedWorkItemRow<Pick<WorkItem, "id" | "name">>` — still navigable, still
 * narrowed to what was asked for.
 */
export type LoadedWorkItemRow<TRow> = Loaded<TRow, WorkItemNavigation>;

export type LoadedWorkItem = LoadedWorkItemRow<WorkItem>;
