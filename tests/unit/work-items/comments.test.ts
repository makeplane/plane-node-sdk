import { PlaneClient } from "../../../src/client/plane-client";
import { WorkItemComment } from "../../../src/models/Comment";
import { config } from "../constants";
import { createTestClient } from "../../helpers/test-utils";
import { describeIf as describe } from "../../helpers/conditional-tests";

describe(!!(config.workspaceSlug && config.projectId && config.workItemId), "Work Item Comments API Tests", () => {
  let client: PlaneClient;
  let workspaceSlug: string;
  let projectId: string;
  let workItemId: string;
  let comment: WorkItemComment;

  beforeAll(async () => {
    client = createTestClient();
    workspaceSlug = config.workspaceSlug;
    projectId = config.projectId;
    workItemId = config.workItemId;
  });

  afterAll(async () => {
    // Clean up created comment
    if (comment?.id) {
      try {
        await client.workItems.comments.delete(workspaceSlug, projectId, workItemId, comment.id);
      } catch (error) {
        console.warn("Failed to delete comment:", error);
      }
    }
  });

  it("should create a comment", async () => {
    comment = await client.workItems.comments.create(workspaceSlug, projectId, workItemId, {
      comment_html: "<p>Test Comment</p>",
    });

    expect(comment).toBeDefined();
    expect(comment.id).toBeDefined();
    expect(comment.comment_html).toBe("<p>Test Comment</p>");
  });

  it("should retrieve a comment", async () => {
    const retrievedComment = await client.workItems.comments.retrieve(
      workspaceSlug,
      projectId,
      workItemId,
      comment.id!
    );

    expect(retrievedComment).toBeDefined();
    expect(retrievedComment.id).toBe(comment.id);
    expect(retrievedComment.comment_html).toBe(comment.comment_html);
  });

  it("should update a comment", async () => {
    const updatedComment = await client.workItems.comments.update(workspaceSlug, projectId, workItemId, comment.id!, {
      comment_html: "<p>Updated Test Comment</p>",
    });

    expect(updatedComment).toBeDefined();
    expect(updatedComment.id).toBe(comment.id);
    expect(updatedComment.comment_html).toBe("<p>Updated Test Comment</p>");
  });

  it("should list comments", async () => {
    const comments = await client.workItems.comments.list(workspaceSlug, projectId, workItemId);

    expect(comments).toBeDefined();
    expect(Array.isArray(comments.results)).toBe(true);
    expect(comments.results.length).toBeGreaterThan(0);

    const foundComment = comments.results.find((c) => c.id === comment.id);
    expect(foundComment).toBeDefined();
  });
});
