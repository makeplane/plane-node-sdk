import { Page } from "../../../models/v2/common";
import {
  WorkflowTransition,
  UpdateWorkflowTransition,
  CreateWorkflowTransition,
} from "../../../models/v2/WorkflowTransition";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkflowTransitionField = (typeof FIELDS)["workflow_transitions_list"][number];
export type WorkflowTransitionOrderBy = (typeof ORDER_BY)["workflow_transitions_list"][number];

export interface ListWorkflowTransitionsParams {
  fields?: readonly WorkflowTransitionField[];
  order_by?: WorkflowTransitionOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkflowTransitionShapeParams {
  fields?: readonly WorkflowTransitionField[];
}

/**
 * Transition edges of a workflow graph; `create` identifies the source state by its
 * project State id.
 *
 * Reached flat — `v2.workspaces.projects.workflows.transitions.list(slug, project, workflow)` — or
 * from a fetched workflow: `workflow.transitions.list()`.
 */
export class WorkflowTransitions extends V2Resource<
  WorkflowTransition,
  CreateWorkflowTransition,
  UpdateWorkflowTransition
> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/{workflow_id}/state-transitions/";
  protected operations: Record<string, OperationId> = {
    list: "workflow_transitions_list",
    retrieve: "workflow_transitions_retrieve",
    create: "workflow_transitions_create",
    update: "workflow_transitions_partial_update",
    delete: "workflow_transitions_destroy",
  };

  private _at(slug: string, project: string, workflow: string, transition?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, workflow_id: workflow };
    if (transition !== undefined) params.pk = transition;
    return params;
  }

  /**
   * One page of `WorkflowTransition` rows. Use `iterate` to follow pages automatically.
   *
   * @remarks The row shape returned when `fields` is a literal tuple. `id` is always present.
   */
  list<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    slug: string,
    project: string,
    workflow: string,
    params: ListWorkflowTransitionsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkflowTransition, F | "id">>>;
  /** One page of `WorkflowTransition` rows. Use `iterate` to follow pages automatically. */
  list(
    slug: string,
    project: string,
    workflow: string,
    params?: ListWorkflowTransitionsParams
  ): Promise<Page<WorkflowTransition>>;
  list(
    slug: string,
    project: string,
    workflow: string,
    params?: ListWorkflowTransitionsParams
  ): Promise<Page<WorkflowTransition>> {
    return this.doList(this._at(slug, project, workflow), params as Record<string, unknown>);
  }

  /** Every transition, following pages automatically. */
  iterate<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    slug: string,
    project: string,
    workflow: string,
    params: Omit<ListWorkflowTransitionsParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkflowTransition, F | "id">>;
  /** Every transition, following pages automatically. */
  iterate(
    slug: string,
    project: string,
    workflow: string,
    params?: Omit<ListWorkflowTransitionsParams, "offset" | "count">
  ): AsyncGenerator<WorkflowTransition>;
  iterate(
    slug: string,
    project: string,
    workflow: string,
    params?: Omit<ListWorkflowTransitionsParams, "offset" | "count">
  ): AsyncGenerator<WorkflowTransition> {
    return this.doIterate(this._at(slug, project, workflow), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkflowTransition, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    params?: { fields?: readonly WorkflowTransitionField[] }
  ): Promise<WorkflowTransition>;
  retrieve(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    params?: { fields?: readonly WorkflowTransitionField[] }
  ): Promise<WorkflowTransition> {
    return this.doRetrieve(this._at(slug, project, workflow, transition), params as Record<string, unknown>);
  }

  create<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    slug: string,
    project: string,
    workflow: string,
    data: CreateWorkflowTransition,
    params: WorkflowTransitionShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkflowTransition, F | "id">>;
  create(
    slug: string,
    project: string,
    workflow: string,
    data: CreateWorkflowTransition,
    params?: WorkflowTransitionShapeParams
  ): Promise<WorkflowTransition>;
  create(
    slug: string,
    project: string,
    workflow: string,
    data: CreateWorkflowTransition,
    params?: WorkflowTransitionShapeParams
  ): Promise<WorkflowTransition> {
    return this.doCreate(data, this._at(slug, project, workflow), params as Record<string, unknown>);
  }

  update<F extends Exclude<WorkflowTransitionField, "all"> & keyof WorkflowTransition>(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    data: UpdateWorkflowTransition,
    params: WorkflowTransitionShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkflowTransition, F | "id">>;
  update(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    data: UpdateWorkflowTransition,
    params?: WorkflowTransitionShapeParams
  ): Promise<WorkflowTransition>;
  update(
    slug: string,
    project: string,
    workflow: string,
    transition: string,
    data: UpdateWorkflowTransition,
    params?: WorkflowTransitionShapeParams
  ): Promise<WorkflowTransition> {
    return this.doUpdate(data, this._at(slug, project, workflow, transition), params as Record<string, unknown>);
  }

  delete(slug: string, project: string, workflow: string, transition: string): Promise<void> {
    return this.doDelete(this._at(slug, project, workflow, transition));
  }
}
