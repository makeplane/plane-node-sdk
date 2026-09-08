import type { Milestone } from "../../../models/v2/Milestone";
import type { MilestoneWorkItems } from "../Milestones/WorkItems";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * The path ids a child of a milestone row needs, in URL order, ending with the milestone's own.
 * `Owned` drops exactly these from every child method's signature, so
 * `milestone.workItems.add(["wi-1"])` is what is left of
 * `MilestoneWorkItems.add(slug, project, milestone, workItemIds)`.
 */
export type MilestoneIds = [slug: string, project: string, milestone: string];

/** The parameter names behind {@link MilestoneIds}, in the same order. */
export const MILESTONE_ID_NAMES = ["slug", "project", "milestone"] as const;

/**
 * Everything a fetched milestone can reach: its work-item membership bridge.
 *
 * One property per child `Milestones` attaches; `tests/unit/v2/loaded-navigation.test.ts`
 * compares the two sets and fails by name if a migrated child has no way to be reached
 * from a row.
 */
export interface MilestoneNavigation {
  readonly workItems: Owned<MilestoneWorkItems, MilestoneIds>;
}

/**
 * A fetched milestone row that is also the place its membership bridge lives.
 *
 * Generic over the row so a projection composes: `list(slug, project, { fields: ["title"] })`
 * answers `LoadedMilestoneRow<Pick<Milestone, "id" | "title">>` — still navigable, still narrowed.
 */
export type LoadedMilestoneRow<TRow> = Loaded<TRow, MilestoneNavigation>;

export type LoadedMilestone = LoadedMilestoneRow<Milestone>;
