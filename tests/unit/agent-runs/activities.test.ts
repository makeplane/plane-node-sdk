import { PlaneClient } from "../../../src/client/plane-client";
import { AgentRun, AgentRunActivity } from "../../../src/models";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.agentSlug), "Agent Run Activities API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let agentSlug: string;
  let projectId: string;
  let agentRun: AgentRun;
  let activity: AgentRunActivity;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    agentSlug = config.agentSlug;
    projectId = config.projectId;

    // Create an agent run for testing activities
    agentRun = await client.agentRuns.create(workspaceSlug, {
      agent_slug: agentSlug,
      project: projectId,
    });
  });

  it("should create an agent run activity", async () => {
    activity = await client.agentRuns.activities.create(workspaceSlug, agentRun.id, {
      content: {
        type: "thought",
        body: "Test thought activity",
      },
      type: "thought",
      project: projectId,
    });

    expect(activity).toBeDefined();
    expect(activity.id).toBeDefined();
    expect(activity.type).toBe("thought");
    expect(activity.agent_run).toBe(agentRun.id);
  });

  it("should list agent run activities", async () => {
    const activitiesResponse = await client.agentRuns.activities.list(workspaceSlug, agentRun.id);

    expect(activitiesResponse).toBeDefined();
    expect(Array.isArray(activitiesResponse.results)).toBe(true);
    expect(activitiesResponse.results.length).toBeGreaterThan(0);

    const foundActivity = activitiesResponse.results.find((a) => a.id === activity.id);
    expect(foundActivity).toBeDefined();
  });

  it("should retrieve an agent run activity", async () => {
    const retrievedActivity = await client.agentRuns.activities.retrieve(
      workspaceSlug,
      agentRun.id,
      activity.id
    );

    expect(retrievedActivity).toBeDefined();
    expect(retrievedActivity.id).toBe(activity.id);
    expect(retrievedActivity.type).toBe("thought");
  });

  it("should create an action type activity", async () => {
    const actionActivity = await client.agentRuns.activities.create(workspaceSlug, agentRun.id, {
      content: {
        type: "action",
        action: "create_comment",
        parameters: {
          comment: "Test comment from agent",
        },
      },
      type: "action",
      project: projectId,
    });

    expect(actionActivity).toBeDefined();
    expect(actionActivity.id).toBeDefined();
    expect(actionActivity.type).toBe("action");
  });

  it("should create a response type activity", async () => {
    const responseActivity = await client.agentRuns.activities.create(workspaceSlug, agentRun.id, {
      content: {
        type: "response",
        body: "This is a response from the agent",
      },
      type: "response",
      project: projectId,
    });

    expect(responseActivity).toBeDefined();
    expect(responseActivity.id).toBeDefined();
    expect(responseActivity.type).toBe("response");
  });

  it("should create an elicitation type activity", async () => {
    const elicitationActivity = await client.agentRuns.activities.create(workspaceSlug, agentRun.id, {
      content: {
        type: "elicitation",
        body: "What would you like me to do next?",
      },
      type: "elicitation",
      signal: "select",
      signal_metadata: {
        options: ["option1", "option2"],
      },
      project: projectId,
    });

    expect(elicitationActivity).toBeDefined();
    expect(elicitationActivity.id).toBeDefined();
    expect(elicitationActivity.type).toBe("elicitation");
    expect(elicitationActivity.signal).toBe("select");
  });
});

