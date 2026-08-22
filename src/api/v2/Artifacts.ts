import {
  Artifact,
  ArtifactDetail,
  ArtifactPublishResult,
  UpdateArtifactUpdate,
  ArtifactUpdateResult,
  CreateArtifact,
} from "../../models/v2/Artifact";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** Shareable HTML artifacts (api_v2), at `client.v2.workspace(slug).artifacts`. */
export class Artifacts extends V2Resource<ArtifactDetail, CreateArtifact, UpdateArtifactUpdate> {
  protected path = "/workspaces/{slug}/artifacts/";
  protected operations: Record<string, AnyOperationId> = {
    create: "workspaces_artifacts_create",
    retrieve: "workspaces_artifacts_retrieve",
    publish: "workspaces_artifacts_publish_create",
    update: "workspaces_artifacts_update_partial_update",
  };

  /** Create an artifact. Returns the summary row ({@link Artifact}), not the full detail — `retrieve` for that. */
  async create(data: CreateArtifact): Promise<Artifact> {
    return this.transport.request<Artifact>("POST", this.collectionUrl({}), { data });
  }

  /** The full artifact, including its `html`. */
  async retrieve(artifactId: string): Promise<ArtifactDetail> {
    return this.transport.request<ArtifactDetail>("GET", this.detailUrl({ pk: artifactId }));
  }

  /** Publish the artifact, minting (or reusing) its public anchor. No request body — a plain `doAction`. */
  async publish(artifactId: string): Promise<ArtifactPublishResult> {
    return this.doAction<ArtifactPublishResult>("publish", { pk: artifactId });
  }

  /** Updates `html`/`prompt`, bumping `current_version`. Hand-rolled PATCH-with-body — not `doAction`. */
  async update(artifactId: string, data: UpdateArtifactUpdate): Promise<ArtifactUpdateResult> {
    return this.transport.request<ArtifactUpdateResult>("PATCH", `${this.detailUrl({ pk: artifactId })}update/`, {
      data,
    });
  }
}
