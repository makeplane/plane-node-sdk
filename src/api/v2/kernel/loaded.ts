import { Page } from "../../../models/v2/common";
import { V2Resource } from "./resource";

/**
 * What a loaded row remembers besides its own data: which fields the server actually
 * returned, and which path ids produced it.
 *
 * `ids` is in URL order and ends with the row's own id, so a child resource's leading
 * parameters can be filled from it without the caller repeating anything. `idNames` is
 * the parameter name each entry is meant to fill, in the same order — {@link owned}
 * checks a child method's leading parameters against it before prepending anything.
 */
export interface LoadedMeta {
  readonly ids: readonly string[];
  readonly idNames: readonly string[];
  /**
   * The field names the response actually carried (narrowed by the caller's `fields`
   * where one was given; `id` always counts as present).
   *
   * Runtime introspection only. Unlike Python, absence here is **not** what stops a
   * caller reading a field that was never fetched — that is a compile error, because
   * the `fields` overloads return `Pick<Row, F | "id">`. This set exists so code that
   * builds a `fields` list dynamically can still ask what came back.
   */
  readonly present: ReadonlySet<string>;
}

/**
 * A fetched row that is also the place its children live: the row's own fields, one
 * navigation property per child of the resource that fetched it, and {@link LoadedMeta}
 * under `$loaded`.
 *
 * Generic over the row so a projection composes: `Loaded<Pick<Project, "id" | "name">,
 * ProjectNavigation>` is what `projects.list(slug, { fields: ["name"] })` resolves to —
 * navigable, and still narrowed to the two fields that were requested.
 *
 * Navigation properties and `$loaded` are defined non-enumerable, so `{ ...row }`,
 * `Object.keys(row)` and `JSON.stringify(row)` see the plain API row and nothing else.
 */
export type Loaded<TRow, TNavigation> = TRow & TNavigation & { readonly $loaded: LoadedMeta };

/** Any callable, in the position where only its shape matters. */
type AnyFunction = (...args: never[]) => unknown;

/**
 * A child resource with its parent row's path ids already supplied.
 *
 * Generic over the resource **and** over the tuple of ids that are bound: every method
 * keeps its name, loses exactly the leading parameters the ids fill, and keeps the rest
 * of its signature and its return type. `project.states.list()` is `Promise<Page<State>>`,
 * `project.states.retrieve("state-1")` is `Promise<State>`, and `project.states.lst()`
 * does not exist. Non-callable members are dropped: a grandchild resource needs its own
 * row's id, which only that row can supply.
 *
 * **One thing this cannot carry across: a generic overload.** `States.list` declares a
 * `fields` overload whose return type is computed from a type parameter
 * (`Page<Pick<State, F | "id">>`). TypeScript erases type parameters when it infers
 * through a conditional type, so the transform below resolves against the *general*
 * signature and a navigated `list({ fields: [...] })` answers `Page<State>` rather than
 * the narrowed row. Reaching for the narrowed type means calling the resource flat —
 * `v2.projects.states.list(slug, project, { fields: [...] })` — which is why the flat
 * form stays public rather than becoming an implementation detail. (Matching the
 * overload set instead makes this strictly worse, not better: the inference erases `F`
 * to its constraint and answers `Pick<State, every field>`, which claims presence for
 * fields the projection dropped.)
 */
export type Owned<TResource, TIds extends readonly unknown[]> = {
  [K in keyof TResource as TResource[K] extends AnyFunction ? K : never]: TResource[K] extends (
    ...args: [...TIds, ...infer TRest]
  ) => infer TResult
    ? (...args: TRest) => TResult
    : never;
};

/**
 * The kernel's overridable hooks. Abstract or overridden, they land on the *subclass*
 * prototype, past the point the walk below stops, and `protected` leaves no runtime trace
 * — so they have to be named. `loaded-navigation.test.ts` compares an owned view's keys
 * against the child's public methods read off the TypeScript source, which is what caught
 * these leaking onto the view in the first place.
 */
const KERNEL_HOOK_NAMES: ReadonlySet<string> = new Set(["navigationOf", "rowId", "load", "loadPage", "loadIterate"]);

/**
 * Method names to prepend ids onto: the resource's own and any intermediate class's,
 * never the kernel's.
 *
 * `protected` is compile-time only, so the kernel's own helpers are ordinary properties
 * at runtime and would otherwise be wrapped and exposed on the owned view — invisible to
 * the type, but able to shadow a real method name. The walk therefore stops at whichever
 * kernel prototype it reaches rather than filtering by a name list, which stays correct
 * as bases are added.
 */
function publicMethodNames(resource: object): string[] {
  const stopAt: ReadonlySet<unknown> = new Set([V2Resource.prototype, LoadsNavigableRows.prototype, Object.prototype]);
  const names = new Set<string>();
  // Own properties first: a class field assigned an arrow function lives on the instance,
  // not on the prototype, and is just as public as a method.
  for (const [name, value] of Object.entries(resource)) {
    if (typeof value === "function" && !name.startsWith("_")) names.add(name);
  }
  for (
    let prototype = Object.getPrototypeOf(resource) as object | null;
    prototype !== null && !stopAt.has(prototype);
    prototype = Object.getPrototypeOf(prototype) as object | null
  ) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      if (name === "constructor" || name.startsWith("_") || KERNEL_HOOK_NAMES.has(name)) continue;
      const descriptor = Object.getOwnPropertyDescriptor(prototype, name);
      if (descriptor && typeof descriptor.value === "function") names.add(name);
    }
  }
  return [...names].sort();
}

/**
 * The first `count` parameter names of a compiled function, or `undefined` when the
 * source is not shaped like a plain parameter list (a default value that contains a
 * comma or a paren, a destructuring pattern, a native function).
 *
 * Deliberately gives up rather than guessing: the check it feeds refuses a *definite*
 * mismatch and stays quiet otherwise, so a signature this cannot parse never becomes a
 * false alarm. The authoritative version of the same rule is a source-level sweep
 * (`tests/unit/v2/loaded-navigation.test.ts`), which reads the TypeScript rather than the
 * emitted JavaScript.
 */
function leadingParameterNames(fn: AnyFunction, count: number): string[] | undefined {
  const source = Function.prototype.toString.call(fn);
  const open = source.indexOf("(");
  if (open === -1) return undefined;
  let depth = 0;
  let close = -1;
  for (let index = open; index < source.length; index += 1) {
    const character = source[index];
    if (character === "(") depth += 1;
    else if (character === ")") {
      depth -= 1;
      if (depth === 0) {
        close = index;
        break;
      }
    }
  }
  if (close === -1) return undefined;
  const parameters = source
    .slice(open + 1, close)
    .split(",")
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .slice(0, count);
  if (parameters.length < count) return undefined;
  const names = parameters.map((part) => /^([A-Za-z_$][\w$]*)/.exec(part)?.[1]);
  return names.every((name): name is string => name !== undefined) ? names : undefined;
}

/**
 * One `(method, idNames)` pair is only ever checked once — a compiled function's
 * parameter names cannot change. Keyed on the method itself rather than on the class,
 * so replacing a method (a test double, a monkey-patch) is re-checked rather than
 * silently inheriting the original's verdict.
 */
const CHECKED_BINDINGS = new WeakMap<AnyFunction, Set<string>>();

/**
 * Refuse to prepend ids that would land in the wrong parameters.
 *
 * Positional prepending has no way to notice on its own that a resource's leading
 * parameters are ordered differently from the ids being bound: the wrong values would
 * flow into a well-formed but wrong URL with no error at all. TypeScript does not catch
 * it either — every path id is a `string`, so the tuple matches whatever the order.
 */
function assertLeadingParameters(resource: object, name: string, fn: AnyFunction, idNames: readonly string[]): void {
  const key = idNames.join(",");
  const checked = CHECKED_BINDINGS.get(fn) ?? new Set<string>();
  if (checked.has(key)) return;
  const actual = leadingParameterNames(fn, idNames.length);
  if (actual !== undefined && actual.join(",") !== key) {
    throw new TypeError(
      `${resource.constructor.name}.${name}() does not take its leading parameters in the order ` +
        `[${idNames.join(", ")}] that the owning row was built with — found ` +
        `[${actual.join(", ")}] instead. Refusing to prepend ids that would silently ` +
        `land in the wrong parameters.`
    );
  }
  checked.add(key);
  CHECKED_BINDINGS.set(fn, checked);
}

/**
 * What an owned view wraps, under a symbol so it can never collide with a method name and
 * never widens the view's public type.
 *
 * Introspection, and the only way to tell two views apart: sibling resources routinely
 * have identical method names, so a navigation property that wraps the wrong child builds
 * a perfectly well-formed call to the wrong URL and looks right from the outside.
 * `loaded-navigation.test.ts` compares this against the child the resource actually
 * attached — without it, that sweep could not bite, which is what proving it showed.
 */
export const OWNED = Symbol("plane.v2.owned");

export interface OwnedBinding {
  readonly resource: object;
  readonly ids: readonly string[];
  readonly idNames: readonly string[];
}

/** The binding behind an owned view, or `undefined` for anything else. */
export function ownedBinding(view: object): OwnedBinding | undefined {
  return (view as Record<symbol, OwnedBinding | undefined>)[OWNED];
}

/**
 * A view on `resource` with `ids` already supplied: every call prepends them
 * **positionally**, because every flat resource takes its path ids as leading
 * positional parameters.
 */
export function owned<TResource extends object, TIds extends readonly string[]>(
  resource: TResource,
  ids: TIds,
  idNames: readonly string[]
): Owned<TResource, TIds> {
  const view: Record<string, unknown> = {};
  for (const name of publicMethodNames(resource)) {
    const method = (resource as Record<string, unknown>)[name] as AnyFunction;
    view[name] = (...args: unknown[]): unknown => {
      assertLeadingParameters(resource, name, method, idNames);
      return (method as (...callArgs: unknown[]) => unknown).apply(resource, [...ids, ...args]);
    };
  }
  const binding: OwnedBinding = { resource, ids: [...ids], idNames: [...idNames] };
  Object.defineProperty(view, OWNED, { value: binding, enumerable: false });
  return view as Owned<TResource, TIds>;
}

/** Lazy factories, one per navigation property, keyed by the property name it defines. */
export type NavigationFactories<TNavigation> = { [K in keyof TNavigation]: () => TNavigation[K] };

/**
 * Turn a fetched row into a navigable one: its own data, plus one lazily-built
 * navigation property per child, plus `$loaded`.
 *
 * Presence is what the *server returned*, never what the caller asked for. The API
 * defers fields on collection reads even when no `fields=` was passed, so deriving
 * presence from the request would mark every field present. Where the caller did pass
 * `fields`, presence is narrowed to it (plus `id`), so it never over-reports.
 */
export function loadRow<TRow extends object, TNavigation extends object>(
  row: TRow,
  ids: readonly string[],
  idNames: readonly string[],
  navigation: (meta: LoadedMeta) => NavigationFactories<TNavigation>,
  fields?: readonly string[]
): Loaded<TRow, TNavigation> {
  const returned = new Set(Object.keys(row));
  const present =
    fields === undefined ? returned : new Set([...returned].filter((name) => name === "id" || fields.includes(name)));
  const meta: LoadedMeta = { ids: [...ids], idNames: [...idNames], present };

  const loaded = { ...row } as Record<string, unknown>;
  Object.defineProperty(loaded, "$loaded", { value: meta, enumerable: false });
  for (const [name, factory] of Object.entries(navigation(meta)) as [string, () => unknown][]) {
    Object.defineProperty(loaded, name, { get: factory, enumerable: false, configurable: true });
  }
  return loaded as Loaded<TRow, TNavigation>;
}

/** {@link loadRow} across a page, keeping whichever envelope (offset or cursor) came back. */
export function loadPage<TRow extends object, TNavigation extends object>(
  page: Page<TRow>,
  build: (row: TRow) => Loaded<TRow, TNavigation>
): Page<Loaded<TRow, TNavigation>> {
  // The spread preserves the envelope's own paging state (`next`/`next_cursor`/
  // `total_count`); only `data` is replaced. `Page<T>` is a union, so the cast is what
  // tells the checker the envelope did not change shape — only its row type did.
  return { ...page, data: page.data.map(build) } as Page<Loaded<TRow, TNavigation>>;
}

/**
 * Base for a resource whose fetches answer with navigable rows.
 *
 * A subclass declares the ids a child of its rows needs ({@link loadedIdNames}) and how
 * to build the navigation properties ({@link navigationOf}), then routes **every**
 * row-returning method — `retrieve`, `create`, `update`, `upsert`, `list`, `iterate`,
 * `findBy*` — through {@link load}, {@link loadPage} or {@link loadIterate}. A method
 * that returns a plain row instead silently loses navigation, and `iterate` is the one
 * that gets forgotten, which is why it has its own helper here.
 */
export abstract class LoadsNavigableRows<TRead, TWrite, TPatch, TNavigation extends object> extends V2Resource<
  TRead,
  TWrite,
  TPatch
> {
  /**
   * The parameter name of every path id a *child* of one of these rows needs, in URL
   * order, ending with this row's own — `["slug", "project"]` for projects.
   */
  protected abstract loadedIdNames: readonly string[];

  /** The navigation properties a row of this resource carries, as lazy factories. */
  protected abstract navigationOf(meta: LoadedMeta): NavigationFactories<TNavigation>;

  /**
   * The path id a child URL uses for this row — its `id`, unless the resource has a
   * readable key the API accepts in its place (projects override this to prefer
   * `identifier`, so children hit `.../projects/ENG/`, not the UUID).
   */
  protected rowId(row: TRead): string {
    return (row as { id: string }).id;
  }

  /**
   * A fetched row in navigable form. `parentIds` are this resource's own leading path
   * ids in URL order; the row contributes the last one itself, through {@link rowId}.
   */
  protected load<TRow extends object>(
    row: TRow,
    parentIds: readonly string[],
    fields?: readonly string[]
  ): Loaded<TRow, TNavigation> {
    const ids = [...parentIds, this.rowId(row as unknown as TRead)];
    return loadRow(row, ids, this.loadedIdNames, (meta) => this.navigationOf(meta), fields);
  }

  /** {@link load} across a page. */
  protected loadPage<TRow extends object>(
    page: Page<TRow>,
    parentIds: readonly string[],
    fields?: readonly string[]
  ): Page<Loaded<TRow, TNavigation>> {
    return loadPage(page, (row) => this.load(row, parentIds, fields));
  }

  /**
   * {@link load} across an async iterator, lazily.
   *
   * `iterate` returning plain rows while `list` returned navigable ones is a bug the
   * Python port shipped and had to fix: navigation silently disappeared the moment a
   * caller paged instead of taking one page.
   */
  protected async *loadIterate<TRow extends object>(
    rows: AsyncGenerator<TRow>,
    parentIds: readonly string[],
    fields?: readonly string[]
  ): AsyncGenerator<Loaded<TRow, TNavigation>> {
    for await (const row of rows) yield this.load(row, parentIds, fields);
  }
}
