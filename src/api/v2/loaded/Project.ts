import type { Project } from "../../../models/v2/Project";
import type { Loaded, Owned } from "../kernel/loaded";
import type { Labels } from "../Labels";
import type { States } from "../States";
import type { WorkItems } from "../WorkItems";

/**
 * The path ids a child of a project row needs, in URL order, ending with the project's
 * own. `Owned` drops exactly these from every child method's signature, so
 * `project.states.retrieve("state-1")` is what is left of
 * `States.retrieve(slug, project, state)`.
 */
export type ProjectIds = [slug: string, project: string];

/** The parameter names behind {@link ProjectIds}, in the same order. */
export const PROJECT_ID_NAMES = ["slug", "project"] as const;

/**
 * Everything a fetched project can reach.
 *
 * One property per child `Projects` attaches whose own migration is done;
 * `tests/unit/v2/loadedNavigation.test.ts` compares the two sets and fails by name if a
 * migrated child has no way to be reached from a row. The Python port shipped a project
 * row that reached 3 of its 15 children with every other test green — this is the check
 * that catches that.
 */
export interface ProjectNavigation {
  readonly states: Owned<States, ProjectIds>;
  readonly labels: Owned<Labels, ProjectIds>;
  readonly workItems: Owned<WorkItems, ProjectIds>;
}

/**
 * A fetched project row that is also the place its children live.
 *
 * Generic over the row so a projection composes: `list(slug, { fields: ["name"] })`
 * answers `LoadedProjectRow<Pick<Project, "id" | "name">>` — still navigable, still
 * narrowed to what was asked for.
 */
export type LoadedProjectRow<TRow> = Loaded<TRow, ProjectNavigation>;

export type LoadedProject = LoadedProjectRow<Project>;
