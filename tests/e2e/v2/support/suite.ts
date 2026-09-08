import { PlaneClient } from "../../../../src/client/plane-client";
import { LoadedProject } from "../../../../src/api/v2/loaded/Project";
import { LoadedWorkspace } from "../../../../src/api/v2/loaded/Workspace";
import { createV2Client } from "./client";
import { V2Env } from "./env";
import { createProject, deleteProject, sweepLeftoverProjects, TestProject } from "./project";

export interface V2Suite {
  client: PlaneClient;
  workspaceSlug: string;
  project: TestProject;
  projectId: string;
  projectKey: string;
  /**
   * The suite's project as a fetched, navigable row — the loaded-row way in.
   *
   * `projectRow.states.list()` is the same call as
   * `client.v2.projects.states.list(workspaceSlug, projectId)`, with the two ids bound.
   * Both shapes are public and neither is a wrapper over the other's HTTP, so a suite
   * that only drives the flat form leaves `owned()`'s id-prepending untested against a
   * real server. Files that read better navigated use this; files that need the `fields`
   * narrowing (which `Owned` erases, by design) must use the flat form.
   */
  projectRow: LoadedProject;
  /** The workspace as a fetched, navigable row. Lazy and memoized — one GET per file, only if asked for. */
  workspace(): Promise<LoadedWorkspace>;
}

/**
 * Registers `beforeAll`/`afterAll` creating one project per test file (Jest runs each file in its own process, so nothing is shared).
 */
export function useV2Project(label: string, env: V2Env): V2Suite {
  const suite = {} as V2Suite;
  let workspacePromise: Promise<LoadedWorkspace> | undefined;

  suite.workspace = (): Promise<LoadedWorkspace> => {
    workspacePromise ??= suite.client.v2.workspaces.retrieve(suite.workspaceSlug);
    return workspacePromise;
  };

  beforeAll(async () => {
    suite.client = createV2Client(env);
    suite.workspaceSlug = env.workspaceSlug;
    // Self-healing: clears out this suite's own leftover projects from a prior
    // crashed/interrupted run before creating a new one — see sweepLeftoverProjects's
    // own doc comment for why this runs per-file rather than once globally.
    await sweepLeftoverProjects(suite.client, env.workspaceSlug);
    suite.project = await createProject(suite.client, env.workspaceSlug, label);
    suite.projectId = suite.project.id;
    suite.projectKey = suite.project.identifier;
    suite.projectRow = suite.project.row;
  });

  afterAll(async () => {
    if (suite.client && suite.project) {
      await deleteProject(suite.client, env.workspaceSlug, suite.project);
    }
  });

  return suite;
}
