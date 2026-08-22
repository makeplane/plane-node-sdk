/**
 * `is_epic_enabled` silently coerces back to `false` once the workspace owns work item types; tested via `is_milestone_enabled` instead.
 */
import { PlaneClient } from "../../../src/client/plane-client";
import { createV2Client } from "./support/client";
import { v2Env } from "./support/env";
import { useV2Project } from "./support/suite";
import { resolveWorkItemTypeMode } from "./support/work-item-type-mode";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

maybe("WorkspaceFeatures (v2 live)", () => {
  let client: PlaneClient;

  beforeAll(() => {
    client = createV2Client(env);
  });

  it("retrieves, flips one flag, then restores it", async () => {
    const features = client.v2.workspace(env.workspaceSlug).features;
    const before = await features.retrieve();
    const original = before.is_wiki_enabled;

    const toggled = await features.update({ is_wiki_enabled: !original });
    expect(toggled.is_wiki_enabled).toBe(!original);

    const restored = await features.update({ is_wiki_enabled: original });
    expect(restored.is_wiki_enabled).toBe(original);
  });
});

maybe("ProjectFeatures (v2 live)", () => {
  const suite = useV2Project("features", env);
  const features = () => suite.client.v2.workspace(suite.workspaceSlug).project(suite.projectId).features;

  it("retrieves and patches", async () => {
    const before = await features().retrieve();
    expect(typeof before.is_epic_enabled).toBe("boolean");
    expect(typeof before.is_milestone_enabled).toBe("boolean");

    const updated = await features().update({
      is_milestone_enabled: !before.is_milestone_enabled,
    });
    expect(updated.is_milestone_enabled).toBe(!before.is_milestone_enabled);

    // is_epic_enabled: documents the real, mode-dependent behavior instead of
    // assuming either — see this file's own top-of-file note.
    const mode = await resolveWorkItemTypeMode(suite.client, suite.workspaceSlug);
    const epicFlip = await features().update({ is_epic_enabled: true });
    if (mode === "workspace") {
      expect(epicFlip.is_epic_enabled).toBe(false); // coerced off — see the lockout note above
    } else {
      expect(epicFlip.is_epic_enabled).toBe(true);
    }
  });
});
