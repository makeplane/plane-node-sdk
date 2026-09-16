import { MissingPathIdError } from "../../../errors/MissingPathIdError";
import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../errors/PlaneApiError";
import { BridgeRequest, BridgeResponse } from "../../../models/v2/Bridge";
import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { BULK_MAX_ITEMS, EXPAND, FIELDS, OPERATION_IDS, ORDER_BY } from "../generated/constants";
import { iterate } from "./pagination";
import { V2Transport } from "./transport";

/** Ids per `add`/`remove` bridge call — the API caps each array at 100. */
export const BRIDGE_MAX_IDS = 100;

/** Every operation id `FIELDS`/`ORDER_BY` knows how to validate against. */
export type OperationId = keyof typeof FIELDS;

/** Every operation id in the golden, not just the ones with a `fields` enum (`OperationId` above). */
export type AnyOperationId = (typeof OPERATION_IDS)[number];

/** `["id", "name"]` -> `"id,name"`, rejecting names the operation does not offer; fails closed. */
export function encodeFields(operationId: AnyOperationId, fields: readonly string[]): string {
  const allowed: readonly string[] | undefined = FIELDS[operationId as keyof typeof FIELDS];
  if (!allowed) {
    throw new Error(`Unknown operation id '${operationId}'; cannot validate the fields parameter.`);
  }
  const unknown = fields.filter((field) => !allowed.includes(field));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown field(s) for ${operationId}: ${unknown.join(", ")}. Allowed: ${[...allowed].sort().join(", ")}.`
    );
  }
  return fields.join(",");
}

/** A single `order_by` value, rejecting one the operation does not offer. Same fail-closed contract as `encodeFields`. */
export function encodeOrderBy(operationId: AnyOperationId, value: string): string {
  const allowed = (ORDER_BY as Partial<Record<AnyOperationId, readonly string[]>>)[operationId];
  if (!allowed) {
    throw new Error(`Unknown operation id '${operationId}'; cannot validate the order_by parameter.`);
  }
  if (!allowed.includes(value)) {
    throw new Error(`Unknown order_by '${value}' for ${operationId}. Allowed: ${[...allowed].sort().join(", ")}.`);
  }
  return value;
}

/** `["state", "labels"]` -> `"state,labels"`. `EXPAND` is sparse, so a missing operation id is expected, not a typo. */
export function encodeExpand(operationId: AnyOperationId, values: readonly string[]): string {
  const allowed = (EXPAND as Partial<Record<AnyOperationId, readonly string[]>>)[operationId];
  if (!allowed) {
    throw new Error(`${operationId} does not support the expand parameter.`);
  }
  const unknown = values.filter((value) => !allowed.includes(value));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown expand value(s) for ${operationId}: ${unknown.join(", ")}. Allowed: ${[...allowed].sort().join(", ")}.`
    );
  }
  return values.join(",");
}

/**
 * Base for every api_v2 resource.
 *
 * A resource holds no bound scope of its own: it is constructed with the transport
 * alone and every method takes the ids its URL template names as leading positional
 * parameters, in path order (`states.retrieve(slug, project, state)`). Ids reach the
 * kernel keyed by the template placeholder they fill (`{ slug, project_id: project }`),
 * plus the pseudo-key `pk` for the row's own primary key, which the kernel appends to
 * the collection URL rather than substituting.
 */
export abstract class V2Resource<TRead, TWrite, TPatch> {
  protected abstract path: string;
  /**
   * Per-method override templates: a method whose URL is not built from `path`.
   *
   * A catalog resource bridges `add`/`remove` at its parent's URL
   * (`.../releases/{release_id}/labels/`, not its own `.../releases/labels/`); a report
   * hangs off a sibling collection (`Projects.roleDistribution`). Keyed by method name,
   * so `urlFor(action, ids)` makes the same choice at call time that the sweeps make
   * when they check that method's leading parameters.
   */
  protected extraPaths: Record<string, string> = {};
  // `AnyOperationId`, not bare `string`: a typo'd operation id is a compile error
  // instead of silently disabling field/order_by validation for that action.
  protected abstract operations: Record<string, AnyOperationId>;

  /**
   * A resource is constructed with the transport and nothing else.
   *
   * There is deliberately no bound `scope`. The pre-flat kernel took one — path
   * placeholders a `Workspace`/`Project` locator filled once so methods could omit them —
   * and it went with those locators: every id is a leading positional parameter now, and
   * a second, invisible source of path ids is exactly what made a wrong URL well-formed.
   */
  constructor(protected transport: V2Transport) {}

  /**
   * Fill `template` from `pathParams`, percent-encoding each value so an id can never
   * inject extra URL segments.
   *
   * `action` is the calling method's name and only feeds the error: a template key with
   * no value behind it raises {@link MissingPathIdError}, which names the resource, the
   * method, the template, the missing id and the ids that were supplied. An empty
   * string counts as missing — it would otherwise build `/projects//states/`, a
   * well-formed URL pointing at the wrong thing.
   */
  protected formatPath(template: string, action: string, pathParams: Record<string, string>): string {
    return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
      const value = pathParams[key];
      if (value === undefined || value === null || value === "") {
        const supplied = Object.entries(pathParams)
          .filter(([, candidate]) => candidate !== undefined && candidate !== null && candidate !== "")
          .map(([name]) => name)
          .sort();
        throw new MissingPathIdError(this.constructor.name, action, template, key, supplied);
      }
      return encodeURIComponent(value);
    });
  }

  /** The URL for `action`: its {@link extraPaths} override if it declares one, else `path`. */
  protected urlFor(action: string, pathParams: Record<string, string>): string {
    return this.formatPath(this.extraPaths[action] ?? this.path, action, pathParams);
  }

  protected collectionUrl(pathParams: Record<string, string>, action = "<call>"): string {
    return this.formatPath(this.path, action, pathParams);
  }

  protected detailUrl(pathParams: Record<string, string>, action = "<call>"): string {
    const { pk } = pathParams;
    if (pk === undefined || pk === null || pk === "") {
      throw new MissingPathIdError(
        this.constructor.name,
        action,
        `${this.path}{pk}/`,
        "pk",
        Object.keys(pathParams).sort()
      );
    }
    return `${this.collectionUrl(pathParams, action)}${encodeURIComponent(pk)}/`;
  }

  /** The operation id for `action`, or throw — shared by the `fields` and `order_by` validators below. */
  private requireOperationId(action: string, paramName: string): AnyOperationId {
    const operationId = this.operations[action];
    if (!operationId) {
      throw new Error(
        `${this.constructor.name}.operations has no entry for '${action}'; ` +
          `cannot validate the ${paramName} parameter.`
      );
    }
    return operationId;
  }

  /** Drop undefined, join array values, and validate `fields`/`order_by`/`expand` against the golden. */
  protected query(params: Record<string, unknown> | undefined, action: string): Record<string, unknown> {
    const prepared: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value === undefined || value === null) continue;
      if (key === "fields") {
        prepared[key] = encodeFields(this.requireOperationId(action, "fields"), value as readonly string[]);
      } else if (key === "order_by") {
        prepared[key] = encodeOrderBy(this.requireOperationId(action, "order_by"), value as string);
      } else if (key === "expand") {
        prepared[key] = encodeExpand(this.requireOperationId(action, "expand"), value as readonly string[]);
      } else if (Array.isArray(value)) {
        prepared[key] = value.join(",");
      } else {
        prepared[key] = value;
      }
    }
    return prepared;
  }

  // Declared `async` so a synchronous throw from `query()` is captured into the
  // returned promise's rejection instead of escaping synchronously — a non-async
  // method would throw before constructing a promise, breaking `.rejects.toThrow()`.

  protected async doList(pathParams: Record<string, string>, params?: Record<string, unknown>): Promise<Page<TRead>> {
    return this.transport.request<Page<TRead>>("GET", this.collectionUrl(pathParams, "list"), {
      params: this.query(params, "list"),
    });
  }

  // A generator method (`async *`), not a plain method returning `iterate(...)`, so
  // its body doesn't run — and `this.query()` doesn't throw — until the first `.next()`.
  protected async *doIterate(
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): AsyncGenerator<TRead> {
    const url = this.collectionUrl(pathParams, "iterate");
    const fetch = (query: Record<string, unknown>) =>
      this.transport.request<Page<TRead>>("GET", url, { params: query });
    yield* iterate(fetch, this.query(params, "list"));
  }

  protected async doRetrieve(pathParams: Record<string, string>, params?: Record<string, unknown>): Promise<TRead> {
    return this.transport.request<TRead>("GET", this.detailUrl(pathParams, "retrieve"), {
      params: this.query(params, "retrieve"),
    });
  }

  // Same three request shapes as doList/doIterate/doRetrieve, but against a
  // caller-supplied URL for operations that don't live at collectionUrl/detailUrl.

  protected async doListAt(url: string, action: string, params?: Record<string, unknown>): Promise<Page<TRead>> {
    return this.transport.request<Page<TRead>>("GET", url, { params: this.query(params, action) });
  }

  protected async *doIterateAt(url: string, action: string, params?: Record<string, unknown>): AsyncGenerator<TRead> {
    const fetch = (query: Record<string, unknown>) =>
      this.transport.request<Page<TRead>>("GET", url, { params: query });
    yield* iterate(fetch, this.query(params, action));
  }

  protected async doRetrieveAt(url: string, action: string, params?: Record<string, unknown>): Promise<TRead> {
    return this.transport.request<TRead>("GET", url, { params: this.query(params, action) });
  }

  protected async doCreate(
    data: TWrite,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TRead> {
    return this.transport.request<TRead>("POST", this.collectionUrl(pathParams, "create"), {
      params: this.query(params, "create"),
      data,
    });
  }

  protected async doUpdate(
    data: TPatch,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TRead> {
    return this.transport.request<TRead>("PATCH", this.detailUrl(pathParams, "update"), {
      params: this.query(params, "update"),
      data,
    });
  }

  protected async doDelete(pathParams: Record<string, string>): Promise<void> {
    await this.transport.request<void>("DELETE", this.detailUrl(pathParams, "delete"));
  }

  /** POST a custom verb action on a detail row — `{pk}/{action}/`, e.g. `.../archive/`. */
  protected async doAction<TResult = TRead>(
    action: string,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TResult> {
    return this.transport.request<TResult>("POST", `${this.detailUrl(pathParams, action)}${action}/`, {
      params: this.query(params, action),
    });
  }

  /** Create, or reconcile an existing row on (external_source, external_id). */
  protected async doUpsert(
    data: TWrite,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TRead> {
    return this.transport.request<TRead>("POST", `${this.collectionUrl(pathParams, "upsert")}upsert/`, {
      params: this.query(params, "upsert"),
      data,
    });
  }

  /**
   * GET a route whose row *is* the collection — a workspace (the slug is the key), a
   * feature-toggle set, a group-sync config. There is no pk to append, so this goes
   * through {@link urlFor} (honouring any `extraPaths` override) rather than `detailUrl`.
   */
  protected async doRetrieveSingleton<TResult = TRead>(
    pathParams: Record<string, string>,
    action = "retrieve",
    params?: Record<string, unknown>
  ): Promise<TResult> {
    return this.transport.request<TResult>("GET", this.urlFor(action, pathParams), {
      params: this.query(params, action),
    });
  }

  /** PATCH the counterpart of {@link doRetrieveSingleton}. */
  protected async doUpdateSingleton<TResult = TRead>(
    data: unknown,
    pathParams: Record<string, string>,
    action = "update",
    params?: Record<string, unknown>
  ): Promise<TResult> {
    return this.transport.request<TResult>("PATCH", this.urlFor(action, pathParams), {
      params: this.query(params, action),
      data,
    });
  }

  /**
   * A custom action whose *response envelope* is not this resource's own row, so
   * {@link doAction} cannot type it — a summary, a bulk envelope, a presigned upload, a
   * report.
   *
   * Two URL shapes, matching the two that occur. With `pk`, the verb hangs off a row
   * (`{detailUrl}{action}/`, exactly `doAction`'s URL); without it, the action has a
   * template of its own and goes through {@link urlFor}, which fills its `extraPaths`
   * override or falls back to `path`. Either way `action` keys `operations`, so the
   * query string is validated against the golden like any other call.
   *
   * Prefer `doAction` whenever the response *is* a row of this resource; this is only
   * for the envelopes that are not — it exists so those stop being hand-rolled
   * `transport.request` blocks, one per resource.
   */
  protected async doCustomAction<TResult>(
    action: string,
    options: {
      method?: string;
      pathParams?: Record<string, string>;
      /** Set when the verb hangs off a row: the URL becomes `{detailUrl}{action}/`. */
      pk?: string;
      data?: unknown;
      params?: Record<string, unknown>;
      /** Append `{action}/` to the collection URL instead of overriding the template. */
      onCollection?: boolean;
    } = {}
  ): Promise<TResult> {
    const { method = "POST", pathParams = {}, pk, data, params, onCollection = false } = options;
    const url =
      pk !== undefined
        ? `${this.detailUrl({ ...pathParams, pk }, action)}${action}/`
        : onCollection
          ? `${this.collectionUrl(pathParams, action)}${action}/`
          : this.urlFor(action, pathParams);
    return this.transport.request<TResult>(method, url, { params: this.query(params, action), data });
  }

  /** POST a single-row verb action that answers 204 with no body — the no-response-model twin of {@link doAction}. */
  protected async doVoidAction(action: string, pathParams: Record<string, string>, data?: unknown): Promise<void> {
    await this.transport.request<void>("POST", `${this.detailUrl(pathParams, action)}${action}/`, { data });
  }

  // An empty batch is a client-side error (the API requires `minItems: 1`), rejected
  // before any request goes out; `emptyMessage` matches the live API's own wording.
  private checkCap(count: number, emptyMessage: string): void {
    if (count === 0) {
      throw new Error(emptyMessage);
    }
    if (count > BULK_MAX_ITEMS) {
      throw new Error(`At most ${BULK_MAX_ITEMS} items per call (received ${count}).`);
    }
  }

  private async batch(action: string, body: unknown, pathParams: Record<string, string>): Promise<BulkWriteResponse> {
    return this.transport.request<BulkWriteResponse>("POST", `${this.collectionUrl(pathParams, action)}${action}/`, {
      data: body,
    });
  }

  protected async doBulkCreate(
    items: TWrite[],
    pathParams: Record<string, string>,
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    this.checkCap(items.length, "Provide a non-empty list of write bodies.");
    return this.batch("bulk-create", { items, all_or_none: allOrNone }, pathParams);
  }

  /** Each item is the patch plus the target `id`. Human keys are rejected by the API. */
  protected async doBulkUpdate(
    items: BulkUpdateItem<TPatch>[],
    pathParams: Record<string, string>,
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    this.checkCap(items.length, "Provide a non-empty list of write bodies, each with an id.");
    return this.batch("bulk-update", { items, all_or_none: allOrNone }, pathParams);
  }

  protected async doBulkDelete(
    ids: string[],
    pathParams: Record<string, string>,
    allOrNone = false
  ): Promise<BulkWriteResponse> {
    this.checkCap(ids.length, "Provide a non-empty list of ids.");
    return this.batch("bulk-delete", { ids, all_or_none: allOrNone }, pathParams);
  }

  /**
   * One side of a membership bridge: POST `{ [verb]: items }` to `url` and resolve to the ids the server reports
   * under `added`/`removed` (empty when absent). 1..`BRIDGE_MAX_IDS` items, else a `RangeError` before any request.
   */
  protected async doBridgeAt<TItem>(url: string, verb: "add" | "remove", items: readonly TItem[]): Promise<string[]> {
    if (!Array.isArray(items)) {
      throw new TypeError(`Expected an array of ids to ${verb} (received ${typeof items}).`);
    }
    if (items.length === 0 || items.length > BRIDGE_MAX_IDS) {
      throw new RangeError(
        `Provide between 1 and ${BRIDGE_MAX_IDS} ids to ${verb} per call (received ${items.length}).`
      );
    }
    const body: BridgeRequest<TItem> = { [verb]: [...items] };
    const response = await this.transport.request<BridgeResponse | undefined>("POST", url, { data: body });
    return response?.[verb === "add" ? "added" : "removed"] ?? [];
  }

  /** `doBridgeAt` against this resource's own collection URL — for resources whose `path` *is* the bridge. */
  protected doBridge<TItem>(
    verb: "add" | "remove",
    items: readonly TItem[],
    pathParams: Record<string, string>
  ): Promise<string[]> {
    return this.doBridgeAt(this.urlFor(verb, pathParams), verb, items);
  }

  /** Resolve exactly one row by identity filter, or throw; asks for two to detect ambiguity. */
  protected async doFindOne(filters: Record<string, unknown>, pathParams: Record<string, string>): Promise<TRead> {
    const page = await this.doList(pathParams, { ...filters, per_page: 2, count: false });
    const described = Object.entries(filters)
      .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
      .join(", ");

    if (page.data.length === 0) {
      throw new NoMatchFoundError(`No ${this.constructor.name} matched ${described}.`);
    }
    if (page.data.length > 1) {
      throw new MultipleMatchesFoundError(
        `Multiple rows matched ${described}; use the id instead, or list with the ` + `same filter to see every match.`
      );
    }
    return page.data[0];
  }
}
