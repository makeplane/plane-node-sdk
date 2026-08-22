/**
 * create/retrieve/publish/update against a real server; the golden has no delete op, so runs leave artifacts behind.
 */
import { Artifacts } from "../../../src/api/v2/Artifacts";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Artifacts (v2 live)", () => {
  let resource: Artifacts;

  beforeAll(() => {
    const client = createV2Client(env);
    resource = client.v2.workspace(env.workspaceSlug).artifacts;
  });

  it("creates, retrieves, publishes, updates", async () => {
    const created = await resource.create({
      name: uniqueName("artifact"),
      html: "<p>hello</p>",
    });
    expect(created.is_published).toBe(false);

    const detail = await resource.retrieve(created.id);
    expect(detail.html).toBe("<p>hello</p>");

    const published = await resource.publish(created.id);
    expect(published.is_active).toBe(true);

    const updated = await resource.update(created.id, { html: "<p>updated</p>" });
    expect(updated.current_version).toBeGreaterThan(created.current_version);

    const detailAfterUpdate = await resource.retrieve(created.id);
    expect(detailAfterUpdate.html).toBe("<p>updated</p>");
  });
});
