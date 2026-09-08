import type { Module } from "../../../models/v2/Module";
import type { ModuleWorkItems } from "../Modules/WorkItems";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * The path ids a child of a module row needs, in URL order, ending with the module's own.
 * `Owned` drops exactly these from every child method's signature, so
 * `module.workItems.add(["wi-1"])` is what is left of
 * `ModuleWorkItems.add(slug, project, module, workItemIds)`.
 */
export type ModuleIds = [slug: string, project: string, module: string];

/** The parameter names behind {@link ModuleIds}, in the same order. */
export const MODULE_ID_NAMES = ["slug", "project", "module"] as const;

/**
 * Everything a fetched module can reach: its work-item membership bridge.
 *
 * One property per child `Modules` attaches; `tests/unit/v2/loaded-navigation.test.ts`
 * compares the two sets and fails by name if a migrated child has no way to be reached
 * from a row.
 */
export interface ModuleNavigation {
  readonly workItems: Owned<ModuleWorkItems, ModuleIds>;
}

/**
 * A fetched module row that is also the place its membership bridge lives.
 *
 * Generic over the row so a projection composes: `list(slug, project, { fields: ["name"] })`
 * answers `LoadedModuleRow<Pick<Module, "id" | "name">>` — still navigable, still narrowed.
 */
export type LoadedModuleRow<TRow> = Loaded<TRow, ModuleNavigation>;

export type LoadedModule = LoadedModuleRow<Module>;
