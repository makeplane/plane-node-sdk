import { V2Transport } from "../kernel/transport";
import { GroupSyncConfigResource } from "./Config";
import { GroupSyncProjectMappings } from "./ProjectMappings";
import { GroupSyncWorkspaceMappings } from "./WorkspaceMappings";

/** IdP group-sync: the config singleton plus the project- and workspace-level mapping collections. */
export class GroupSync {
  public config: GroupSyncConfigResource;
  public projectMappings: GroupSyncProjectMappings;
  public workspaceMappings: GroupSyncWorkspaceMappings;

  constructor(transport: V2Transport, scope: Record<string, string> = {}) {
    this.config = new GroupSyncConfigResource(transport, scope);
    this.projectMappings = new GroupSyncProjectMappings(transport, scope);
    this.workspaceMappings = new GroupSyncWorkspaceMappings(transport, scope);
  }
}

export { GroupSyncConfigResource } from "./Config";
export { GroupSyncProjectMappings } from "./ProjectMappings";
export type {
  GroupSyncProjectMappingField,
  GroupSyncProjectMappingOrderBy,
  ListGroupSyncProjectMappingsParams,
} from "./ProjectMappings";
export { GroupSyncWorkspaceMappings } from "./WorkspaceMappings";
export type {
  GroupSyncWorkspaceMappingField,
  GroupSyncWorkspaceMappingOrderBy,
  ListGroupSyncWorkspaceMappingsParams,
} from "./WorkspaceMappings";
