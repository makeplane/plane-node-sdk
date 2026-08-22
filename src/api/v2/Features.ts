import {
  ProjectFeature,
  UpdateProjectFeature,
  WorkspaceFeature,
  UpdateWorkspaceFeature,
} from "../../models/v2/Feature";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/** A workspace's feature flags — a singleton, so GET/PATCH are hand-rolled against `collectionUrl` (no `{pk}` segment). */
export class WorkspaceFeatures extends V2Resource<WorkspaceFeature, never, UpdateWorkspaceFeature> {
  protected path = "/workspaces/{slug}/features/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "workspace_features_retrieve",
    update: "workspace_features_update",
  };

  async retrieve(): Promise<WorkspaceFeature> {
    return this.transport.request<WorkspaceFeature>("GET", this.collectionUrl({}));
  }

  async update(data: UpdateWorkspaceFeature): Promise<WorkspaceFeature> {
    return this.transport.request<WorkspaceFeature>("PATCH", this.collectionUrl({}), { data });
  }
}

/** A project's feature flags — same singleton shape as {@link WorkspaceFeatures}. */
export class ProjectFeatures extends V2Resource<ProjectFeature, never, UpdateProjectFeature> {
  protected path = "/workspaces/{slug}/projects/{project_id}/features/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "project_features_retrieve",
    update: "project_features_update",
  };

  async retrieve(): Promise<ProjectFeature> {
    return this.transport.request<ProjectFeature>("GET", this.collectionUrl({}));
  }

  async update(data: UpdateProjectFeature): Promise<ProjectFeature> {
    return this.transport.request<ProjectFeature>("PATCH", this.collectionUrl({}), { data });
  }
}
