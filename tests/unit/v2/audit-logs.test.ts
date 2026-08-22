import nock from "nock";
import { Configuration } from "../../../src/Configuration";
import { AuditLogs } from "../../../src/api/v2/AuditLogs";
import { V2Transport } from "../../../src/api/v2/kernel/transport";

const BASE = "https://api.example.com";

const makeLogs = () =>
  new AuditLogs(new V2Transport(new Configuration({ baseUrl: BASE, apiKey: "secret" })), { slug: "acme" });

afterEach(() => nock.cleanAll());

describe("AuditLogs (v2)", () => {
  it("lists audit log entries", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/audit-logs/")
      .reply(200, {
        data: [{ id: "1", event_name: "member.invited", category: "member", outcome: "success" }],
        pagination: { style: "offset" },
        total_count: 1,
      });

    const page = await makeLogs().list();

    expect(page.data[0].category).toBe("member");
  });

  it("filters by category/outcome/actor and date range", async () => {
    const scope = nock(BASE)
      .get("/api/v2/workspaces/acme/audit-logs/")
      .query({
        category: "webhook",
        outcome: "failure",
        actor_id: "user-1",
        created_after: "2026-01-01T00:00:00Z",
        created_before: "2026-02-01T00:00:00Z",
      })
      .reply(200, { data: [], pagination: { style: "offset" } });

    await makeLogs().list({
      category: "webhook",
      outcome: "failure",
      actor_id: "user-1",
      created_after: "2026-01-01T00:00:00Z",
      created_before: "2026-02-01T00:00:00Z",
    });

    expect(scope.isDone()).toBe(true);
  });

  it("retrieves one audit log entry by id", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/audit-logs/evt-1/")
      .reply(200, { id: "evt-1", event_name: "role.updated", sequence_number: 42 });

    const entry = await makeLogs().retrieve("evt-1");

    expect(entry.sequence_number).toBe(42);
  });

  it("rejects an unknown order_by before making the request", async () => {
    await expect(makeLogs().list({ order_by: "event_name" as never })).rejects.toThrow(
      /Unknown order_by 'event_name' for audit_logs_list/
    );
  });

  it("cursor-paginates when asked", async () => {
    nock(BASE)
      .get("/api/v2/workspaces/acme/audit-logs/")
      .query({ paginate: "cursor", order_by: "created_at" })
      .reply(200, { data: [{ id: "1" }], pagination: { style: "cursor" }, has_more: false, next_cursor: null });

    const page = await makeLogs().list({ paginate: "cursor", order_by: "created_at" });

    expect(page.pagination.style).toBe("cursor");
  });
});
