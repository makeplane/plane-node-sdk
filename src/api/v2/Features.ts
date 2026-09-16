import {
  ProjectFeature,
  UpdateProjectFeature,
  WorkspaceFeature,
  UpdateWorkspaceFeature,
} from "../../models/v2/Feature";
import { AnyOperationId, V2Resource } from "./kernel/resource";

/**
 * A workspace's feature flags.
 *
 * A **singleton**: the row *is* the collection, with no primary key of its own, so both
 * verbs go through the kernel's singleton helpers rather than `doRetrieve`/`doUpdate`,
 * which would append a `{pk}` segment.
 */
export class WorkspaceFeatures extends V2Resource<WorkspaceFeature, never, UpdateWorkspaceFeature> {
  protected path = "/workspaces/{slug}/features/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "workspace_features_retrieve",
    update: "workspace_features_update",
  };

  /** Every feature flag on the workspace. */
  retrieve(slug: string): Promise<WorkspaceFeature> {
    return this.doRetrieveSingleton<WorkspaceFeature>({ slug });
  }

  /** Toggle one or more flags; unnamed flags are left alone. */
  update(slug: string, data: UpdateWorkspaceFeature): Promise<WorkspaceFeature> {
    return this.doUpdateSingleton<WorkspaceFeature>(data, { slug });
  }
}

/** A project's feature flags — the project-scoped twin of {@link WorkspaceFeatures}, and a singleton for the same reason. */
export class ProjectFeatures extends V2Resource<ProjectFeature, never, UpdateProjectFeature> {
  protected path = "/workspaces/{slug}/projects/{project_id}/features/";
  protected operations: Record<string, AnyOperationId> = {
    retrieve: "project_features_retrieve",
    update: "project_features_update",
  };

  /** Every feature flag on the project. */
  retrieve(slug: string, project: string): Promise<ProjectFeature> {
    return this.doRetrieveSingleton<ProjectFeature>({ slug, project_id: project });
  }

  /** Toggle one or more flags; unnamed flags are left alone. */
  update(slug: string, project: string, data: UpdateProjectFeature): Promise<ProjectFeature> {
    return this.doUpdateSingleton<ProjectFeature>(data, { slug, project_id: project });
  }
}
