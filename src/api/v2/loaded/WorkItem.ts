import type { WorkItem } from "../../../models/v2/WorkItem";
import type { Loaded, Owned } from "../kernel/loaded";
import type { Activities } from "../WorkItems/Activities";
import type { Attachments } from "../WorkItems/Attachments";
import type { Comments } from "../WorkItems/Comments";
import type { Dependencies } from "../WorkItems/Dependencies";
import type { Links } from "../WorkItems/Links";
import type { Relations } from "../WorkItems/Relations";
import type { WorkLogs } from "../WorkItems/WorkLogs";

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
  /**
   * Comments with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly comments: Owned<Comments, WorkItemIds>;
  /**
   * Attachments with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly attachments: Owned<Attachments, WorkItemIds>;
  /**
   * Links with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly links: Owned<Links, WorkItemIds>;
  /**
   * WorkLogs with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly worklogs: Owned<WorkLogs, WorkItemIds>;
  /**
   * Activities with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly activities: Owned<Activities, WorkItemIds>;
  /**
   * Relations with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly relations: Owned<Relations, WorkItemIds>;
  /**
   * Dependencies with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly dependencies: Owned<Dependencies, WorkItemIds>;
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
