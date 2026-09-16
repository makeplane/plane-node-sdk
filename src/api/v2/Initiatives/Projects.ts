import { AnyOperationId, V2Resource } from "../kernel/resource";

/** Projects on an initiative, reached flat as `v2.workspaces.initiatives.projects.add(slug, initiative, ids)`, or from a fetched initiative as `initiative.projects.add(ids)`. Invalid/out-of-workspace ids are silently skipped. */
export class InitiativeProjects extends V2Resource<never, never, never> {
  protected path = "/workspaces/{slug}/initiatives/{initiative_id}/projects/";
  protected operations: Record<string, AnyOperationId> = {
    // One operation, two verbs — see `CycleWorkItems.operations`.
    add: "initiatives_projects",
    remove: "initiatives_projects",
  };

  /** Add projects to the initiative (1..100 ids); resolves to the ids actually added. */
  add(slug: string, initiative: string, projectIds: readonly string[]): Promise<string[]> {
    return this.doBridge("add", projectIds, { slug, initiative_id: initiative });
  }

  /** Remove projects from the initiative (1..100 ids); resolves to the ids actually removed. */
  remove(slug: string, initiative: string, projectIds: readonly string[]): Promise<string[]> {
    return this.doBridge("remove", projectIds, { slug, initiative_id: initiative });
  }
}
