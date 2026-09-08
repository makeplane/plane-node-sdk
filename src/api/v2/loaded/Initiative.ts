import type { Initiative } from "../../../models/v2/Initiative";
import type { InitiativeLabels } from "../Initiatives/Labels";
import type { InitiativeProjects } from "../Initiatives/Projects";
import type { InitiativeWorkItems } from "../Initiatives/WorkItems";
import type { Loaded, Owned } from "../kernel/loaded";

/** The path ids a child of an initiative row needs, in URL order. Initiatives are workspace-scoped. */
export type InitiativeIds = [slug: string, initiative: string];

/** The parameter names behind {@link InitiativeIds}, in the same order. */
export const INITIATIVE_ID_NAMES = ["slug", "initiative"] as const;

/**
 * Everything a fetched initiative can reach: its three memberships.
 *
 * `labels` is a catalog sibling — `InitiativeLabels` holds both the workspace-level label
 * catalog and the per-initiative bridge, so a row binds the bridge (`add`/`remove`) while
 * the catalog stays flat at `v2.workspaces.initiatives.labels.list(slug)`. Recorded in
 * `CATALOG_SIBLINGS` in `tests/unit/v2/loaded-navigation.test.ts`, with the same reasoning
 * as `Releases.labels`.
 */
export interface InitiativeNavigation {
  readonly labels: Owned<InitiativeLabels, InitiativeIds>;
  readonly projects: Owned<InitiativeProjects, InitiativeIds>;
  readonly workItems: Owned<InitiativeWorkItems, InitiativeIds>;
}

/** A fetched initiative row that is also the place its memberships live. */
export type LoadedInitiativeRow<TRow> = Loaded<TRow, InitiativeNavigation>;

export type LoadedInitiative = LoadedInitiativeRow<Initiative>;
