import { PlaneClient } from "../../../src/client/plane-client";
import { AgentRun } from "../../../src/models";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.agentSlug), "Agent Runs API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let agentSlug: string;
  let projectId: string;
  let agentRun: AgentRun;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    agentSlug = config.agentSlug;
    projectId = config.projectId;
  });

  it("should create an agent run", async () => {
    agentRun = await client.agentRuns.create(workspaceSlug, {
      agent_slug: agentSlug,
      project: projectId,
    });

    expect(agentRun).toBeDefined();
    expect(agentRun.id).toBeDefined();
    expect(agentRun.status).toBe("created");
    expect(agentRun.workspace).toBeDefined();
  });

  it("should retrieve an agent run", async () => {
    const retrievedRun = await client.agentRuns.retrieve(workspaceSlug, agentRun.id);

    expect(retrievedRun).toBeDefined();
    expect(retrievedRun.id).toBe(agentRun.id);
    expect(retrievedRun.status).toBeDefined();
  });

  it("should resume an agent run", async () => {
    const resumedRun = await client.agentRuns.resume(workspaceSlug, agentRun.id);

    expect(resumedRun).toBeDefined();
    expect(resumedRun.id).toBe(agentRun.id);
  });
});

