import { ReleaseChangelog, UpdateReleaseChangelog } from "../../../models/v2/ReleaseChangelog";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** A release's changelog, reached flat as `v2.workspaces.releases.changelog.retrieve(slug, release)`, or from a fetched release as `release.changelog.retrieve()`. A singleton: `GET` auto-creates it empty. */
export class Changelog extends V2Resource<ReleaseChangelog, never, UpdateReleaseChangelog> {
  /** Exported from the v2 barrel as `ReleaseChangelogResource`; `exported-names.test.ts` pins the two together. */
  static readonly publicName = "ReleaseChangelogResource";

  protected path = "/workspaces/{slug}/releases/{release_id}/changelog/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "releases_changelog_retrieve",
    update: "releases_changelog_partial_update",
  };

  /** Get (or auto-create empty) the changelog for this release. */
  retrieve(slug: string, release: string): Promise<ReleaseChangelog> {
    return this.doRetrieveSingleton<ReleaseChangelog>({ slug, release_id: release });
  }

  /** Update the changelog body for this release. */
  update(slug: string, release: string, data: UpdateReleaseChangelog): Promise<ReleaseChangelog> {
    return this.doUpdateSingleton<ReleaseChangelog>(data, { slug, release_id: release });
  }
}
