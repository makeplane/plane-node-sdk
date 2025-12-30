import { PlaneClient } from "../../../src/client/plane-client";
import { AgentRun, WorkItem, WorkItemComment } from "../../../src/models";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.agentSlug), "Agent Runs API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let agentSlug: string;
  let projectId: string;
  let agentRun: AgentRun;
  let workItem: WorkItem;
  let comment: WorkItemComment;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    agentSlug = config.agentSlug;
    projectId = config.projectId;
    workItem = await client.workItems.create(workspaceSlug, projectId, {
      name: "Test Work Item",
      description_html: "<p>Test Description</p>",
    });
    comment = await client.workItems.comments.create(workspaceSlug, projectId, workItem.id, {
      comment_html: "<p>Test Comment</p>",
    });
  });

  it("should create an agent run", async () => {
    agentRun = await client.agentRuns.create(workspaceSlug, {
      agent_slug: agentSlug,
      project: projectId,
      comment: comment.id,
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
});

