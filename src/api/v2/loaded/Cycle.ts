import type { Cycle } from "../../../models/v2/Cycle";
import type { CycleWorkItems } from "../Cycles/WorkItems";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * The path ids a child of a cycle row needs, in URL order, ending with the cycle's own.
 * `Owned` drops exactly these from every child method's signature, so
 * `cycle.workItems.add(["wi-1"])` is what is left of
 * `CycleWorkItems.add(slug, project, cycle, workItemIds)`.
 */
export type CycleIds = [slug: string, project: string, cycle: string];

/** The parameter names behind {@link CycleIds}, in the same order. */
export const CYCLE_ID_NAMES = ["slug", "project", "cycle"] as const;

/**
 * Everything a fetched cycle can reach: its work-item membership bridge.
 *
 * One property per child `Cycles` attaches; `tests/unit/v2/loaded-navigation.test.ts`
 * compares the two sets and fails by name if a migrated child has no way to be reached
 * from a row.
 */
export interface CycleNavigation {
  /**
   * CycleWorkItems with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItems: Owned<CycleWorkItems, CycleIds>;
}

/**
 * A fetched cycle row that is also the place its membership bridge lives.
 *
 * Generic over the row so a projection composes: `list(slug, project, { fields: ["name"] })`
 * answers `LoadedCycleRow<Pick<Cycle, "id" | "name">>` — still navigable, still narrowed.
 */
export type LoadedCycleRow<TRow> = Loaded<TRow, CycleNavigation>;

export type LoadedCycle = LoadedCycleRow<Cycle>;
