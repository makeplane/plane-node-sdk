import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Projects on an initiative, at `ws.initiatives.projects`. Invalid/out-of-workspace ids are silently skipped. */
export class InitiativeProjects extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/initiatives/{initiative_id}/projects/";
  protected operations: Record<string, AnyOperationId> = {
    manage: "initiatives_projects",
  };

  /** Add projects to the initiative (1..100 ids); resolves to the ids actually added. */
  add(initiativeId: string, projectIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", projectIds, { initiative_id: initiativeId });
  }

  /** Remove projects from the initiative (1..100 ids); resolves to the ids actually removed. */
  remove(initiativeId: string, projectIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", projectIds, { initiative_id: initiativeId });
  }
}
