import { Page } from "../../../models/v2/common";
import {
  Initiative,
  InitiativeChildManageRequest,
  InitiativeChildManageResponse,
  UpdateInitiative,
  InitiativeState,
  CreateInitiative,
} from "../../../models/v2/Initiative";
import { EXPAND, FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";
import { V2Transport } from "../kernel/transport";
import { InitiativeLabels } from "./Labels";

export type InitiativeField = (typeof FIELDS)["initiatives_list"][number];
export type InitiativeOrderBy = (typeof ORDER_BY)["initiatives_list"][number];
/** Only `"lead"` is expandable on this resource. */
export type InitiativeExpand = (typeof EXPAND)["initiatives_list"][number];

export interface ListInitiativesParams {
  fields?: readonly InitiativeField[];
  expand?: readonly InitiativeExpand[];
  name?: string;
  lead_id?: string;
  state?: InitiativeState;
  state__in?: readonly InitiativeState[];
  search?: string;
  order_by?: InitiativeOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

/** Workspace initiatives — workspace-scoped, not project-scoped (no `project_id` path segment). */
export class Initiatives extends V2Resource<Initiative, CreateInitiative, UpdateInitiative> {
  protected path = "/workspaces/{slug}/initiatives/";
  protected operations: Record<string, AnyOperationId> = {
    list: "initiatives_list",
    retrieve: "initiatives_retrieve",
    create: "initiatives_create",
    update: "initiatives_partial_update",
    delete: "initiatives_destroy",
    manageLabels: "initiatives_labels",
    manageProjects: "initiatives_projects",
    manageWorkItems: "initiatives_work_items",
  };

  public labels: InitiativeLabels;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    super(transport, scope);
    this.labels = new InitiativeLabels(transport, scope);
  }

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    params: ListInitiativesParams & { fields: readonly F[] }
  ): Promise<Page<Pick<Initiative, F | "id">>>;
  list(params?: ListInitiativesParams): Promise<Page<Initiative>>;
  list(params?: ListInitiativesParams): Promise<Page<Initiative>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every initiative, following pages automatically. */
  iterate(params?: ListInitiativesParams): AsyncGenerator<Initiative> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<InitiativeField, "all"> & keyof Initiative>(
    initiativeId: string,
    params: { fields: readonly F[]; expand?: readonly InitiativeExpand[] }
  ): Promise<Pick<Initiative, F | "id">>;
  retrieve(
    initiativeId: string,
    params?: { fields?: readonly InitiativeField[]; expand?: readonly InitiativeExpand[] }
  ): Promise<Initiative>;
  retrieve(
    initiativeId: string,
    params?: { fields?: readonly InitiativeField[]; expand?: readonly InitiativeExpand[] }
  ): Promise<Initiative> {
    return this.doRetrieve({ pk: initiativeId }, params as Record<string, unknown>);
  }

  /** The one initiative with this name; throws if none or several match. */
  findByName(name: string): Promise<Initiative> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateInitiative, params?: { expand?: readonly InitiativeExpand[] }): Promise<Initiative> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    initiativeId: string,
    data: UpdateInitiative,
    params?: { expand?: readonly InitiativeExpand[] }
  ): Promise<Initiative> {
    return this.doUpdate(data, { pk: initiativeId }, params as Record<string, unknown>);
  }

  delete(initiativeId: string): Promise<void> {
    return this.doDelete({ pk: initiativeId });
  }

  private async manageChild(
    initiativeId: string,
    action: "projects" | "work-items" | "labels",
    data: InitiativeChildManageRequest
  ): Promise<InitiativeChildManageResponse> {
    return this.transport.request<InitiativeChildManageResponse>(
      "POST",
      `${this.detailUrl({ pk: initiativeId })}${action}/`,
      { data }
    );
  }

  /** Bulk add/remove projects; invalid/out-of-workspace ids are silently skipped. */
  manageProjects(initiativeId: string, data: InitiativeChildManageRequest): Promise<InitiativeChildManageResponse> {
    return this.manageChild(initiativeId, "projects", data);
  }

  /** Bulk add/remove work items (any type, including epics); replaces v1 `/epics/`. */
  manageWorkItems(initiativeId: string, data: InitiativeChildManageRequest): Promise<InitiativeChildManageResponse> {
    return this.manageChild(initiativeId, "work-items", data);
  }

  /** Bulk add/remove workspace initiative labels ({@link InitiativeLabels}) on this initiative. */
  manageLabels(initiativeId: string, data: InitiativeChildManageRequest): Promise<InitiativeChildManageResponse> {
    return this.manageChild(initiativeId, "labels", data);
  }
}

export { InitiativeLabels } from "./Labels";
export type { InitiativeLabelField, InitiativeLabelOrderBy, ListInitiativeLabelsParams } from "./Labels";
