import type { Estimate } from "../../../models/v2/Estimate";
import type { EstimatePoints } from "../Estimates/Points";
import type { Loaded, Owned } from "../kernel/loaded";

/**
 * The path ids a child of an estimate row needs, in URL order, ending with the estimate's
 * own. `Owned` drops exactly these from every child method's signature, so
 * `estimate.estimatePoints.list()` is what is left of
 * `EstimatePoints.list(slug, project, estimate)`.
 */
export type EstimateIds = [slug: string, project: string, estimate: string];

/** The parameter names behind {@link EstimateIds}, in the same order. */
export const ESTIMATE_ID_NAMES = ["slug", "project", "estimate"] as const;

/**
 * Everything a fetched estimate can reach: the points on its scale.
 *
 * **Not named `points`.** `points` is a real key on an estimate row — the inline point
 * data the server returns for `?expand=points` — so a navigation property of that name
 * would define over it, hiding real data behind a child-resource view while
 * `$loaded.present` went on reporting the key as present. `loadRow` refuses that outright,
 * and `tests/unit/v2/loaded-navigation.test.ts` builds a row carrying every `FIELDS` *and*
 * `EXPAND` key precisely so the refusal fires in CI rather than in a consumer's hands. The
 * mapping is recorded in that file's `NAVIGATION_ALIASES`; the Python SDK needed the same
 * rename, for the same reason, on the same resource.
 */
export interface EstimateNavigation {
  readonly estimatePoints: Owned<EstimatePoints, EstimateIds>;
}

/**
 * A fetched estimate row that is also the place its points live.
 *
 * Generic over the row so a projection composes:
 * `list(slug, project, { fields: ["name"] })` answers
 * `LoadedEstimateRow<Pick<Estimate, "id" | "name">>` — still navigable, still narrowed.
 */
export type LoadedEstimateRow<TRow> = Loaded<TRow, EstimateNavigation>;

export type LoadedEstimate = LoadedEstimateRow<Estimate>;
