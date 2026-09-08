import type { Project } from "../../../models/v2/Project";
import type { ProjectAutomations } from "../Automations/ProjectAutomations";
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
import type { Workflows } from "../Workflows";

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
 * `tests/unit/v2/bands.test.ts` requires every member of the project band to be attached
 * to `Projects`, and nothing foreign to be.
 */
export interface ProjectNavigation {
  /**
   * States with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly states: Owned<States, ProjectIds>;
  /**
   * Labels with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly labels: Owned<Labels, ProjectIds>;
  /**
   * WorkItems with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItems: Owned<WorkItems, ProjectIds>;
  /**
   * ProjectMembers with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly members: Owned<ProjectMembers, ProjectIds>;
  /**
   * ProjectPages with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly pages: Owned<ProjectPages, ProjectIds>;
  /**
   * ProjectViews with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly views: Owned<ProjectViews, ProjectIds>;
  /**
   * ProjectFeatures with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly features: Owned<ProjectFeatures, ProjectIds>;
  /**
   * ProjectPermissions with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly permissions: Owned<ProjectPermissions, ProjectIds>;
  /**
   * Intakes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly intakes: Owned<Intakes, ProjectIds>;
  /**
   * ProjectWorkItemTemplates with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemTemplates: Owned<ProjectWorkItemTemplates, ProjectIds>;
  /**
   * ProjectWorklogs with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly worklogs: Owned<ProjectWorklogs, ProjectIds>;
  /**
   * Cycles with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly cycles: Owned<Cycles, ProjectIds>;
  /**
   * Modules with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly modules: Owned<Modules, ProjectIds>;
  /**
   * Milestones with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly milestones: Owned<Milestones, ProjectIds>;
  /**
   * Estimates with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly estimates: Owned<Estimates, ProjectIds>;
  /**
   * WorkItemTypes with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemTypes: Owned<WorkItemTypes, ProjectIds>;
  /**
   * WorkItemProperties with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workItemProperties: Owned<WorkItemProperties, ProjectIds>;
  /**
   * Workflows with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly workflows: Owned<Workflows, ProjectIds>;
  /**
   * ProjectAutomations with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly automations: Owned<ProjectAutomations, ProjectIds>;
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
