import {
  Artifact,
  ArtifactDetail,
  ArtifactPublishResult,
  UpdateArtifactUpdate,
  ArtifactUpdateResult,
  CreateArtifact,
} from "../../models/v2/Artifact";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/**
 * Shareable HTML artifacts — the Plane Intelligence generate/publish/host flow.
 *
 * Only `create`/`retrieve`/`publish`/`update` exist, and each answers a different
 * envelope, so three of the four go through the kernel's custom-action helper rather
 * than the CRUD verbs.
 */
export class Artifacts extends V2Resource<ArtifactDetail, CreateArtifact, UpdateArtifactUpdate> {
  protected path = "/workspaces/{slug}/artifacts/";
  protected operations: Record<string, AnyOperationId> = {
    create: "workspaces_artifacts_create",
    retrieve: "workspaces_artifacts_retrieve",
    publish: "workspaces_artifacts_publish_create",
    update: "workspaces_artifacts_update_partial_update",
  };

  /** Create an artifact. Returns the summary row ({@link Artifact}), not the full detail — `retrieve` for that. */
  create(slug: string, data: CreateArtifact): Promise<Artifact> {
    return this.doCustomAction<Artifact>("create", { pathParams: { slug }, data });
  }

  /** The full artifact, including its `html`. */
  retrieve(slug: string, artifact: string): Promise<ArtifactDetail> {
    return this.doRetrieve({ slug, pk: artifact });
  }

  /** Publish the artifact, minting (or reusing) its public anchor. No request body. */
  publish(slug: string, artifact: string): Promise<ArtifactPublishResult> {
    return this.doCustomAction<ArtifactPublishResult>("publish", { pathParams: { slug }, pk: artifact });
  }

  /**
   * Append a new HTML version, bumping `current_version` — each call replaces the
   * document wholesale; there is no true partial update. A PATCH to `{detail}/update/`
   * answering an update envelope rather than a row.
   */
  update(slug: string, artifact: string, data: UpdateArtifactUpdate): Promise<ArtifactUpdateResult> {
    return this.doCustomAction<ArtifactUpdateResult>("update", {
      method: "PATCH",
      pathParams: { slug },
      pk: artifact,
      data,
    });
  }
}
