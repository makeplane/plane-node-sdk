import type { Release } from "../../../models/v2/Release";
import type { Loaded, Owned } from "../kernel/loaded";
import type { Changelog } from "../Releases/Changelog";
import type { Comments } from "../Releases/Comments";
import type { ReleaseLabels } from "../Releases/Labels";
import type { Links } from "../Releases/Links";
import type { ReleaseWorkItems } from "../Releases/WorkItems";

/** The path ids a child of a release row needs, in URL order. Releases are workspace-scoped, so there are two. */
export type ReleaseIds = [slug: string, release: string];

/** The parameter names behind {@link ReleaseIds}, in the same order. */
export const RELEASE_ID_NAMES = ["slug", "release"] as const;

/**
 * Everything a fetched release can reach.
 *
 * **No `tags`.** The release-tag catalog is workspace-level and a release merely points at
 * one through its own `tag_id`, so there is nothing per-release for a row to bind — every
 * method of `ReleaseTags` opens with the slug alone. It therefore hangs off `Workspaces` as
 * `releaseTags`, not off `Releases`. The Python SDK attached it here first and ended up
 * with a `release.tags` property whose every call raised, kept only to satisfy its own
 * navigation sweep; the fix was the attachment, not an exemption, and
 * `tests/unit/v2/loaded-navigation.test.ts` now refuses that shape by name.
 *
 * `labels` is the different case and does belong here: `ReleaseLabels` holds both the
 * workspace-level catalog and the per-release bridge, so a row binds the bridge while the
 * catalog stays flat. It is recorded in that file's `CATALOG_SIBLINGS`.
 */
export interface ReleaseNavigation {
  readonly labels: Owned<ReleaseLabels, ReleaseIds>;
  readonly comments: Owned<Comments, ReleaseIds>;
  readonly links: Owned<Links, ReleaseIds>;
  readonly changelog: Owned<Changelog, ReleaseIds>;
  readonly workItems: Owned<ReleaseWorkItems, ReleaseIds>;
}

/** A fetched release row that is also the place its children live. */
export type LoadedReleaseRow<TRow> = Loaded<TRow, ReleaseNavigation>;

export type LoadedRelease = LoadedReleaseRow<Release>;
