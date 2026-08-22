import { PlaneClient } from "../../../../src/client/plane-client";
import { createV2Client } from "./client";
import { V2Env } from "./env";
import { createProject, deleteProject, sweepLeftoverProjects, TestProject } from "./project";

export interface V2Suite {
  client: PlaneClient;
  workspaceSlug: string;
  project: TestProject;
  projectId: string;
  projectKey: string;
}

/**
 * Registers `beforeAll`/`afterAll` creating one project per test file (Jest runs each file in its own process, so nothing is shared).
 */
export function useV2Project(label: string, env: V2Env): V2Suite {
  const suite = {} as V2Suite;

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
  });

  afterAll(async () => {
    if (suite.client && suite.project) {
      await deleteProject(suite.client, env.workspaceSlug, suite.project);
    }
  });

  return suite;
}
