import { MultipleMatchesFoundError, NoMatchFoundError } from "../../../errors/PlaneApiError";
import { BulkUpdateItem, BulkWriteResponse, Page } from "../../../models/v2/common";
import { BULK_MAX_ITEMS, EXPAND, FIELDS, OPERATION_IDS, ORDER_BY } from "../generated/constants";
import { iterate } from "./pagination";
import { V2Transport } from "./transport";

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

/** Base for every api_v2 resource. `scope` holds path placeholders a locator already bound. */
export abstract class V2Resource<TRead, TWrite, TPatch> {
  protected abstract path: string;
  // `AnyOperationId`, not bare `string`: a typo'd operation id is a compile error
  // instead of silently disabling field/order_by validation for that action.
  protected abstract operations: Record<string, AnyOperationId>;

  /** @param scope Path placeholders already bound by a locator (`{ slug }`, `{ slug, project_id }`). */
  constructor(
    protected transport: V2Transport,
    protected scope: Record<string, string> = {}
  ) {}

  protected collectionUrl(pathParams: Record<string, string>): string {
    return this.urlFor(this.path, pathParams);
  }

  /** Build a URL from an arbitrary template — an escape hatch for cross-family-shaped operations. */
  protected urlFor(template: string, pathParams: Record<string, string>): string {
    const merged = { ...this.scope, ...pathParams };
    return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
      const value = merged[key];
      if (value === undefined) throw new Error(`Missing path parameter '${key}' for ${template}`);
      return encodeURIComponent(value);
    });
  }

  protected detailUrl(pathParams: Record<string, string>): string {
    const { pk } = pathParams;
    if (!pk) throw new Error(`Missing path parameter 'pk' for ${this.path}`);
    return `${this.collectionUrl(pathParams)}${encodeURIComponent(pk)}/`;
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
    return this.transport.request<Page<TRead>>("GET", this.collectionUrl(pathParams), {
      params: this.query(params, "list"),
    });
  }

  // A generator method (`async *`), not a plain method returning `iterate(...)`, so
  // its body doesn't run — and `this.query()` doesn't throw — until the first `.next()`.
  protected async *doIterate(
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): AsyncGenerator<TRead> {
    const url = this.collectionUrl(pathParams);
    const fetch = (query: Record<string, unknown>) =>
      this.transport.request<Page<TRead>>("GET", url, { params: query });
    yield* iterate(fetch, this.query(params, "list"));
  }

  protected async doRetrieve(pathParams: Record<string, string>, params?: Record<string, unknown>): Promise<TRead> {
    return this.transport.request<TRead>("GET", this.detailUrl(pathParams), {
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
    return this.transport.request<TRead>("POST", this.collectionUrl(pathParams), {
      params: this.query(params, "create"),
      data,
    });
  }

  protected async doUpdate(
    data: TPatch,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TRead> {
    return this.transport.request<TRead>("PATCH", this.detailUrl(pathParams), {
      params: this.query(params, "update"),
      data,
    });
  }

  protected async doDelete(pathParams: Record<string, string>): Promise<void> {
    await this.transport.request<void>("DELETE", this.detailUrl(pathParams));
  }

  /** POST a custom verb action on a detail row — `{pk}/{action}/`, e.g. `.../archive/`. */
  protected async doAction<TResult = TRead>(
    action: string,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TResult> {
    return this.transport.request<TResult>("POST", `${this.detailUrl(pathParams)}${action}/`, {
      params: this.query(params, action),
    });
  }

  /** Create, or reconcile an existing row on (external_source, external_id). */
  protected async doUpsert(
    data: TWrite,
    pathParams: Record<string, string>,
    params?: Record<string, unknown>
  ): Promise<TRead> {
    return this.transport.request<TRead>("POST", `${this.collectionUrl(pathParams)}upsert/`, {
      params: this.query(params, "upsert"),
      data,
    });
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
    return this.transport.request<BulkWriteResponse>("POST", `${this.collectionUrl(pathParams)}${action}/`, {
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
