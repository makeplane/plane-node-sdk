import type { Workflow } from "../../../models/v2/Workflow";
import type { WorkflowStates } from "../Workflows/States";
import type { WorkflowTransitions } from "../Workflows/Transitions";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * The path ids a child of a workflow row needs, in URL order, ending with the workflow's
 * own. `Owned` drops exactly these, so `workflow.states.list()` is what is left of
 * `WorkflowStates.list(slug, project, workflow)`.
 */
export type WorkflowIds = [slug: string, project: string, workflow: string];

/** The parameter names behind {@link WorkflowIds}, in the same order. */
export const WORKFLOW_ID_NAMES = ["slug", "project", "workflow"] as const;

/** Everything a fetched workflow can reach: the two halves of its graph. */
export interface WorkflowNavigation {
  /**
   * WorkflowStates with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly states: Owned<WorkflowStates, WorkflowIds>;
  /**
   * WorkflowTransitions with this row's ids already supplied.
   *
   * `fields` is accepted here and does **not** narrow the return type: TypeScript erases a
   * method's type parameter when it infers through `Owned`'s conditional, so a navigated
   * call answers the full row. Call the resource flat for the narrowed one.
   */
  readonly transitions: Owned<WorkflowTransitions, WorkflowIds>;
}

/** A fetched workflow row that is also the place its graph lives. */
export type LoadedWorkflowRow<TRow> = Loaded<TRow, WorkflowNavigation>;

export type LoadedWorkflow = LoadedWorkflowRow<Workflow>;
