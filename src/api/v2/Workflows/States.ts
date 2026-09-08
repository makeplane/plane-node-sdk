import { Page } from "../../../models/v2/common";
import { WorkflowState, WorkflowStateAttachRequest, UpdateWorkflowState } from "../../../models/v2/WorkflowState";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";

export type WorkflowStateField = (typeof FIELDS)["workflow_states_list"][number];
export type WorkflowStateOrderBy = (typeof ORDER_BY)["workflow_states_list"][number];

export interface ListWorkflowStatesParams {
  fields?: readonly WorkflowStateField[];
  order_by?: WorkflowStateOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  /** Resume a cursor-paginated walk from a `next_cursor` an earlier page answered with. */
  cursor?: string;
  count?: boolean;
}

/** `?fields=` on a single-row read or write. The golden declares no `?expand=` on this family. */
export interface WorkflowStateShapeParams {
  fields?: readonly WorkflowStateField[];
}

/**
 * Project states attached to a workflow.
 *
 * Reached flat — `v2.workspaces.projects.workflows.states.list(slug, project, workflow)` — or from a
 * fetched workflow: `workflow.states.list()`. The write verb is `attach`, not `create`:
 * the state already exists on the project and this links it into the graph.
 */
export class WorkflowStates extends V2Resource<WorkflowState, WorkflowStateAttachRequest, UpdateWorkflowState> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/{workflow_id}/states/";
  protected operations: Record<string, OperationId> = {
    list: "workflow_states_list",
    retrieve: "workflow_states_retrieve",
    attach: "workflow_states_create",
    update: "workflow_states_partial_update",
    delete: "workflow_states_destroy",
  };

  private _at(slug: string, project: string, workflow: string, workflowState?: string): Record<string, string> {
    const params: Record<string, string> = { slug, project_id: project, workflow_id: workflow };
    if (workflowState !== undefined) params.pk = workflowState;
    return params;
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    slug: string,
    project: string,
    workflow: string,
    params: ListWorkflowStatesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<WorkflowState, F | "id">>>;
  list(
    slug: string,
    project: string,
    workflow: string,
    params?: ListWorkflowStatesParams
  ): Promise<Page<WorkflowState>>;
  list(
    slug: string,
    project: string,
    workflow: string,
    params?: ListWorkflowStatesParams
  ): Promise<Page<WorkflowState>> {
    return this.doList(this._at(slug, project, workflow), params as Record<string, unknown>);
  }

  /** Every workflow state, following pages automatically. */
  iterate<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    slug: string,
    project: string,
    workflow: string,
    params: Omit<ListWorkflowStatesParams, "offset" | "count"> & { fields: readonly F[] }
  ): AsyncGenerator<Pick<WorkflowState, F | "id">>;
  iterate(
    slug: string,
    project: string,
    workflow: string,
    params?: Omit<ListWorkflowStatesParams, "offset" | "count">
  ): AsyncGenerator<WorkflowState>;
  iterate(
    slug: string,
    project: string,
    workflow: string,
    params?: Omit<ListWorkflowStatesParams, "offset" | "count">
  ): AsyncGenerator<WorkflowState> {
    return this.doIterate(this._at(slug, project, workflow), params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<WorkflowState, F | "id">>;
  retrieve(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    params?: { fields?: readonly WorkflowStateField[] }
  ): Promise<WorkflowState>;
  retrieve(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    params?: { fields?: readonly WorkflowStateField[] }
  ): Promise<WorkflowState> {
    return this.doRetrieve(this._at(slug, project, workflow, workflowState), params as Record<string, unknown>);
  }

  /**
   * Attach project states to this workflow; already-attached ids are accepted
   * idempotently. Answers an array, not the single object the golden's `201` implies.
   */
  attach<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    slug: string,
    project: string,
    workflow: string,
    data: WorkflowStateAttachRequest,
    params: WorkflowStateShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkflowState, F | "id">[]>;
  attach(
    slug: string,
    project: string,
    workflow: string,
    data: WorkflowStateAttachRequest,
    params?: WorkflowStateShapeParams
  ): Promise<WorkflowState[]>;
  attach(
    slug: string,
    project: string,
    workflow: string,
    data: WorkflowStateAttachRequest,
    params?: WorkflowStateShapeParams
  ): Promise<WorkflowState[]> {
    return this.doCustomAction<WorkflowState[]>("attach", {
      method: "POST",
      pathParams: this._at(slug, project, workflow),
      data,
      params: params as Record<string, unknown>,
    });
  }

  update<F extends Exclude<WorkflowStateField, "all"> & keyof WorkflowState>(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    data: UpdateWorkflowState,
    params: WorkflowStateShapeParams & { fields: readonly F[] }
  ): Promise<Pick<WorkflowState, F | "id">>;
  update(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    data: UpdateWorkflowState,
    params?: WorkflowStateShapeParams
  ): Promise<WorkflowState>;
  update(
    slug: string,
    project: string,
    workflow: string,
    workflowState: string,
    data: UpdateWorkflowState,
    params?: WorkflowStateShapeParams
  ): Promise<WorkflowState> {
    return this.doUpdate(data, this._at(slug, project, workflow, workflowState), params as Record<string, unknown>);
  }

  delete(slug: string, project: string, workflow: string, workflowState: string): Promise<void> {
    return this.doDelete(this._at(slug, project, workflow, workflowState));
  }
}
