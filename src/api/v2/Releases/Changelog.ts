import { ReleaseChangelog, UpdateReleaseChangelog } from "../../../models/v2/ReleaseChangelog";
import { AnyOperationId, V2Resource } from "../kernel/resource";

/** A release's changelog, at `client.v2.workspace(slug).releases.changelog`. A singleton: `GET` auto-creates it empty. */
export class Changelog extends V2Resource<ReleaseChangelog, never, UpdateReleaseChangelog> {
  protected path = "/workspaces/{slug}/releases/{release_id}/changelog/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "releases_changelog_retrieve",
    update: "releases_changelog_partial_update",
  };

  /** Get (or auto-create empty) the changelog for this release. */
  async retrieve(releaseId: string): Promise<ReleaseChangelog> {
    return this.transport.request<ReleaseChangelog>("GET", this.collectionUrl({ release_id: releaseId }));
  }

  /** Update the changelog body for this release. */
  async update(releaseId: string, data: UpdateReleaseChangelog): Promise<ReleaseChangelog> {
    return this.transport.request<ReleaseChangelog>("PATCH", this.collectionUrl({ release_id: releaseId }), {
      data,
    });
  }
}
