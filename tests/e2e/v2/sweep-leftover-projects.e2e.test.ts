/**
 * Regression: the sweep once matched only identifier/name prefix, deleting a live 90-second-old project. See `sweepLeftoverProjects`.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { createProject, sweepLeftoverProjects, TestProject } from "./support/project";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

const THIRTY_ONE_MINUTES_MS = 31 * 60 * 1000;

maybe("v2 sweepLeftoverProjects age gate (live)", () => {
  let client: PlaneClient;
  let project: TestProject;

  beforeAll(() => {
    client = createV2Client(env);
  });

  afterEach(async () => {
    if (project) {
      await client.v2.transport
        .request("DELETE", `/workspaces/${env.workspaceSlug}/projects/${project.id}/`)
        .catch(() => undefined);
    }
  });

  it("does NOT sweep a project that only looks a few minutes old (the incident this guards against)", async () => {
    project = await createProject(client, env.workspaceSlug, "sweep-fresh");

    await sweepLeftoverProjects(client, env.workspaceSlug, Date.now());

    // The assertion that matters: a real GET against the live server, not just
    // trusting the sweep's own return count.
    await expect(
      client.v2.transport.request("GET", `/workspaces/${env.workspaceSlug}/projects/${project.id}/`)
    ).resolves.toMatchObject({ id: project.id });
  });

  it("DOES sweep a project once it is provably older than the threshold (the guard still guards)", async () => {
    project = await createProject(client, env.workspaceSlug, "sweep-stale");

    const asIfThirtyOneMinutesLater = Date.now() + THIRTY_ONE_MINUTES_MS;
    const swept = await sweepLeftoverProjects(client, env.workspaceSlug, asIfThirtyOneMinutesLater);

    expect(swept).toBeGreaterThanOrEqual(1);
    await expect(
      client.v2.transport.request("GET", `/workspaces/${env.workspaceSlug}/projects/${project.id}/`)
    ).rejects.toThrow();
  });
});
