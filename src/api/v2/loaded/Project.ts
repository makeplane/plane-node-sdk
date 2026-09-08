import type { Project } from "../../../models/v2/Project";
import type { Cycles } from "../Cycles";
import type { Estimates } from "../Estimates";
import type { ProjectFeatures } from "../Features";
import type { Intakes } from "../Intakes";
import type { Loaded, Owned } from "../kernel/loaded";
import type { Labels } from "../Labels";
import type { ProjectMembers } from "../Members";
import type { Milestones } from "../Milestones";
import type { Modules } from "../Modules";
import type { ProjectPages } from "../Pages";
import type { ProjectPermissions } from "../Permissions";
import type { ProjectWorklogs } from "../ProjectWorklogs";
import type { States } from "../States";
import type { ProjectViews } from "../Views";
import type { ProjectWorkItemTemplates } from "../WorkItemTemplates/ProjectTemplates";
import type { WorkItemProperties } from "../WorkItemProperties";
import type { WorkItems } from "../WorkItems";
import type { WorkItemTypes } from "../WorkItemTypes";

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
 * `tests/unit/v2/loaded-navigation.test.ts` compares the two sets and fails by name if a
 * migrated child has no way to be reached from a row. The Python port shipped a project
 * row that reached 3 of its 15 children with every other test green — this is the check
 * that catches that.
 *
 * The band still on the pre-flat shape is deliberately absent rather than exempt: those
 * classes take their `{slug}`/`{project_id}` from the retired locator scope, so `owned()`
 * has nothing to bind. `tests/unit/v2/bands.test.ts` requires every migrated member of the
 * project band to be attached to `Projects`, and counts the rest against a ratchet.
 */
export interface ProjectNavigation {
  readonly states: Owned<States, ProjectIds>;
  readonly labels: Owned<Labels, ProjectIds>;
  readonly workItems: Owned<WorkItems, ProjectIds>;
  readonly members: Owned<ProjectMembers, ProjectIds>;
  readonly pages: Owned<ProjectPages, ProjectIds>;
  readonly views: Owned<ProjectViews, ProjectIds>;
  readonly features: Owned<ProjectFeatures, ProjectIds>;
  readonly permissions: Owned<ProjectPermissions, ProjectIds>;
  readonly intakes: Owned<Intakes, ProjectIds>;
  readonly workItemTemplates: Owned<ProjectWorkItemTemplates, ProjectIds>;
  readonly worklogs: Owned<ProjectWorklogs, ProjectIds>;
  readonly cycles: Owned<Cycles, ProjectIds>;
  readonly modules: Owned<Modules, ProjectIds>;
  readonly milestones: Owned<Milestones, ProjectIds>;
  readonly estimates: Owned<Estimates, ProjectIds>;
  readonly workItemTypes: Owned<WorkItemTypes, ProjectIds>;
  readonly workItemProperties: Owned<WorkItemProperties, ProjectIds>;
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
