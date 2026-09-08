/**
 * create/retrieve/publish/update against a real server; the golden has no delete op, so runs leave artifacts behind.
 *
 * Driven navigated (off a fetched workspace row) rather than flat — see the binding below.
 */
import { Owned } from "../../../src/api/v2/kernel/loaded";
import { Artifacts } from "../../../src/api/v2/Artifacts";
import { WorkspaceIds } from "../../../src/api/v2/loaded/Workspace";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("Artifacts (v2 live)", () => {
  // The navigated way in: a fetched workspace row hands back the artifacts resource with
  // the slug already bound, so every call below is the flat one minus its leading id.
  let resource: Owned<Artifacts, WorkspaceIds>;

  beforeAll(async () => {
    const client = createV2Client(env);
    const workspace = await client.v2.workspaces.retrieve(env.workspaceSlug);
    resource = workspace.artifacts;
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
