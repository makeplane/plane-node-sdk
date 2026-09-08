import { Page } from "../../../models/v2/common";
import { ReleaseLabel, UpdateReleaseLabel, CreateReleaseLabel } from "../../../models/v2/ReleaseLabel";
import { FIELDS, ORDER_BY } from "../generated/constants";
import { AnyOperationId, V2Resource } from "../kernel/resource";

export type ReleaseLabelField = (typeof FIELDS)["release_labels_list"][number];
export type ReleaseLabelOrderBy = (typeof ORDER_BY)["release_labels_list"][number];

export interface ListReleaseLabelsParams {
  fields?: readonly ReleaseLabelField[];
  name?: string;
  search?: string;
  order_by?: ReleaseLabelOrderBy;
  offset?: number;
  per_page?: number;
  /** Set to `"cursor"` to opt into the cursor envelope — see `ListStatesParams.paginate`. */
  paginate?: "cursor";
  count?: boolean;
}

const RELEASE_LABELS_BRIDGE_PATH = "/workspaces/{slug}/releases/{release_id}/labels/";

/** Release label catalog at `ws.releases.labels` — `create` defines a label, `add`/`remove` put one on / take one off a release. */
export class ReleaseLabels extends V2Resource<ReleaseLabel, CreateReleaseLabel, UpdateReleaseLabel> {
  protected path = "/workspaces/{slug}/releases/labels/";
  protected operations: Record<string, AnyOperationId> = {
    list: "release_labels_list",
    retrieve: "release_labels_retrieve",
    create: "release_labels_create",
    update: "release_labels_partial_update",
    delete: "release_labels_destroy",
    manage: "releases_labels",
  };

  /** The row shape returned when `fields` is a literal tuple. `id` is always present. */
  list<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    params: ListReleaseLabelsParams & { fields: readonly F[] }
  ): Promise<Page<Pick<ReleaseLabel, F | "id">>>;
  list(params?: ListReleaseLabelsParams): Promise<Page<ReleaseLabel>>;
  list(params?: ListReleaseLabelsParams): Promise<Page<ReleaseLabel>> {
    return this.doList({}, params as Record<string, unknown>);
  }

  /** Every release label definition, following pages automatically. */
  iterate(params?: ListReleaseLabelsParams): AsyncGenerator<ReleaseLabel> {
    return this.doIterate({}, params as Record<string, unknown>);
  }

  retrieve<F extends Exclude<ReleaseLabelField, "all"> & keyof ReleaseLabel>(
    labelId: string,
    params: { fields: readonly F[] }
  ): Promise<Pick<ReleaseLabel, F | "id">>;
  retrieve(labelId: string, params?: { fields?: readonly ReleaseLabelField[] }): Promise<ReleaseLabel>;
  retrieve(labelId: string, params?: { fields?: readonly ReleaseLabelField[] }): Promise<ReleaseLabel> {
    return this.doRetrieve({ pk: labelId }, params as Record<string, unknown>);
  }

  /** The one release label with this name; throws if none or several match. */
  findByName(name: string): Promise<ReleaseLabel> {
    return this.doFindOne({ name }, {});
  }

  create(data: CreateReleaseLabel, params?: { fields?: readonly ReleaseLabelField[] }): Promise<ReleaseLabel> {
    return this.doCreate(data, {}, params as Record<string, unknown>);
  }

  update(
    labelId: string,
    data: UpdateReleaseLabel,
    params?: { fields?: readonly ReleaseLabelField[] }
  ): Promise<ReleaseLabel> {
    return this.doUpdate(data, { pk: labelId }, params as Record<string, unknown>);
  }

  delete(labelId: string): Promise<void> {
    return this.doDelete({ pk: labelId });
  }

  /** Put catalog labels on a release (1..100 ids); resolves to the ids actually added. */
  add(releaseId: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridgeAt(
      this.urlForTemplate(RELEASE_LABELS_BRIDGE_PATH, "add", { release_id: releaseId }),
      "add",
      labelIds
    );
  }

  /** Take labels off a release (1..100 ids); the catalog entries stay. Resolves to the ids actually removed. */
  remove(releaseId: string, labelIds: readonly string[]): Promise<string[]> {
    return this.doBridgeAt(
      this.urlForTemplate(RELEASE_LABELS_BRIDGE_PATH, "remove", { release_id: releaseId }),
      "remove",
      labelIds
    );
  }
}
