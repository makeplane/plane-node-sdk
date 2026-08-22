import { Page } from "../../../models/v2/common";
import { Workflow, UpdateWorkflow, CreateWorkflow } from "../../../models/v2/Workflow";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { OperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { WorkflowStates } from "./States";
import { WorkflowTransitions } from "./Transitions";

export type WorkflowField = (typeof FIELDS)["workflows_list"][number];
export type WorkflowOrderBy = (typeof ORDER_BY)["workflows_list"][number];

export interface ListWorkflowsParams {
  fields?: readonly WorkflowField[];
  search?: string;
  order_by?: WorkflowOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Project workflow graphs — CRUD plus `states`/`transitions` sub-resources. No upsert/bulk-write here. */
export class Workflows extends V2Resource<Workflow, CreateWorkflow, UpdateWorkflow> {
  protected path = "/workspaces/{slug}/projects/{project_id}/workflows/";
  protected operations: Record<string, OperationId> = {
    list: "workflows_list",
    retrieve: "workflows_retrieve",
    create: "workflows_create",
    update: "workflows_partial_update",
    delete: "workflows_destroy",
  };

  public states: WorkflowStates;
  public transitions: WorkflowTransitions;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.states = new WorkflowStates(transport, scope);
    this.transitions = new WorkflowTransitions(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    params: ListWorkflowsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Workflow, F | "id">>>;
  list(params?: ListWorkflowsParams): Promise<Page<Workflow>>;
  list(params?: ListWorkflowsParams): Promise<Page<Workflow>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every workflow, following pages automatically. */
  iterate(params?: ListWorkflowsParams): AsyncGenerator<Workflow> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<WorkflowField, "all"> & keyof Workflow>(
    workflowId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<Workflow, F | "id">>;
  retrieve(workflowId: string, params?: { fields?: readonly WorkflowField[] }): Promise<Workflow>;
  retrieve(workflowId: string, params?: { fields?: readonly WorkflowField[] }): Promise<Workflow> {
    return this.doRetrieve({ pk: workflowId }, params as Record<string, unknown>);
  }

  create(data: CreateWorkflow): Promise<Workflow> {
    return this.doCreate(data, {});
  }

  update(workflowId: string, data: UpdateWorkflow): Promise<Workflow> {
    return this.doUpdate(data, { pk: workflowId });
  }

  delete(workflowId: string): Promise<void> {
    return this.doDelete({ pk: workflowId });
  }
}

export { WorkflowStates } from "./States";
export { WorkflowTransitions } from "./Transitions";
export type { ListWorkflowStatesParams, WorkflowStateField, WorkflowStateOrderBy } from "./States";
export type { ListWorkflowTransitionsParams, WorkflowTransitionField, WorkflowTransitionOrderBy } from "./Transitions";
