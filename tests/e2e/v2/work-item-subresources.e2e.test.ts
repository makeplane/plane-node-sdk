/**
 * Attachment `create` returns `{ upload_data, asset_id, asset_url, attachment }`, not the golden's bare `WorkItemAttachment`; only create differs.
 */
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("v2 work item sub-resources (live)", () => {
  const suite = useV2Project("wis", env);
  let workItemId: string;

  beforeAll(async () => {
    await suite.client.v2.transport.request(
      "PATCH",
      `/workspaces/${suite.workspaceSlug}/projects/${suite.projectId}/`,
      {
        data: { is_time_tracking_enabled: true },
      }
    );
    const created = await suite.client.v2
      .workspace(suite.workspaceSlug)
      .project(suite.projectId)
      .workItems.create({ name: uniqueName("wis-parent") });
    workItemId = created.id;
  });

  afterAll(async () => {
    if (!workItemId) return;
    // Best-effort: this dev server intermittently answers work-item delete with a
    // transient 403 resolving to 404 shortly after — a live-environment timing
    // quirk, not an SDK defect. Project cleanup cascades regardless.
    await suite.client.v2
      .workspace(suite.workspaceSlug)
      .project(suite.projectId)
      .workItems.delete(workItemId)
      .catch(() => undefined);
  });

  describe("links", () => {
    it("creates, retrieves, updates, deletes", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.links.create(workItemId, {
        url: "https://example.com/doc",
        title: "Design doc",
      });
      expect(created.url).toBe("https://example.com/doc");

      const fetched = await proj.workItems.links.retrieve(workItemId, created.id);
      expect(fetched.title).toBe("Design doc");

      const updated = await proj.workItems.links.update(workItemId, created.id, { title: "Renamed doc" });
      expect(updated.title).toBe("Renamed doc");

      await proj.workItems.links.delete(workItemId, created.id);
      const page = await proj.workItems.links.list(workItemId);
      expect(page.data.some((row) => row.id === created.id)).toBe(false);
    });
  });

  describe("worklogs", () => {
    it("creates, retrieves, updates, deletes (requires is_time_tracking_enabled)", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.worklogs.create(workItemId, { duration: 45, description: "Investigated" });
      expect(created.duration).toBe(45);

      const fetched = await proj.workItems.worklogs.retrieve(workItemId, created.id);
      expect(fetched.description).toBe("Investigated");

      const updated = await proj.workItems.worklogs.update(workItemId, created.id, { duration: 90 });
      expect(updated.duration).toBe(90);

      await proj.workItems.worklogs.delete(workItemId, created.id);
    });
  });

  describe("attachments", () => {
    it("is a two-step upload: create returns upload credentials, update confirms is_uploaded", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const created = await proj.workItems.attachments.create(workItemId, { name: "diagram.png", size: 2048 });

      // See the file's own doc comment for why this reaches into the actual wire
      // shape instead of the SDK's static (golden-derived) WorkItemAttachment type.
      const wrapper = created as unknown as {
        asset_id?: string;
        attachment?: { id: string; name?: string; is_uploaded?: boolean };
      };
      const attachmentId = wrapper.attachment?.id ?? (created as unknown as { id: string }).id;
      expect(attachmentId).toBeTruthy();

      const confirmed = await proj.workItems.attachments.update(workItemId, attachmentId, { is_uploaded: true });
      expect(confirmed.is_uploaded).toBe(true);
      expect(confirmed.name).toBe("diagram.png");

      const fetched = await proj.workItems.attachments.retrieve(workItemId, attachmentId);
      expect(fetched.id).toBe(attachmentId);

      await proj.workItems.attachments.delete(workItemId, attachmentId);
    });
  });

  describe("activities (read-only)", () => {
    it("records the parent work item's creation, and lists/retrieves it", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const page = await proj.workItems.activities.list(workItemId);
      expect(page.data.length).toBeGreaterThan(0);
      const createdActivity = page.data.find((row) => row.verb === "created");
      expect(createdActivity).toBeDefined();

      const fetched = await proj.workItems.activities.retrieve(workItemId, createdActivity!.id);
      expect(fetched.id).toBe(createdActivity!.id);
    });

    it("iterate() follows pages", async () => {
      const proj = suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId);
      const seen: string[] = [];
      for await (const row of proj.workItems.activities.iterate(workItemId, { per_page: 1 })) {
        seen.push(row.id);
      }
      expect(seen.length).toBeGreaterThan(0);
    });
  });
});
