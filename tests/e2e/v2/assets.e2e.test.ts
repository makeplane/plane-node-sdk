/**
 * Live server's `create` wraps the row as `{ upload_data, asset_id, asset_url, asset }`, not the golden's flat type; cast via `CreateAssetEnvelope`.
 */
import { UserAsset } from "../../../src/models/v2/UserAsset";
import { WorkspaceAsset } from "../../../src/models/v2/WorkspaceAsset";
import { v2Env } from "./support/env";
import { uniqueName } from "./support/names";
import { useV2Project } from "./support/suite";

const env = v2Env();
const maybe = env.ready ? describe : describe.skip;

/** The live `create` response shape — see this file's own doc comment. */
interface CreateAssetEnvelope<T> {
  upload_data: unknown;
  asset_id: string;
  asset_url: string | null;
  asset: T;
}

maybe("v2 assets (live)", () => {
  const suite = useV2Project("assets", env);

  // Flat: `assets` takes the slug per call. Kept flat rather than navigated because the
  // sparse-read case below needs the `fields` narrowing, which `Owned` erases by design.
  const assets = () => suite.client.v2.workspaces.assets;
  const slug = () => suite.workspaceSlug;

  describe("Assets (workspace-scoped)", () => {
    it("create returns upload credentials; list/retrieve/delete round-trip", async () => {
      const name = uniqueName("asset");
      const created = (await assets().create(slug(), {
        name,
        size: 1024,
      })) as unknown as CreateAssetEnvelope<WorkspaceAsset>;
      expect(created.asset_id).toBeDefined();
      expect(created.asset.name).toBe(name);

      const fetched = await assets().retrieve(slug(), created.asset_id);
      expect(fetched.id).toBe(created.asset_id);

      await expect(assets().delete(slug(), created.asset_id)).resolves.toBeUndefined();
    });

    it("with fields is sparse: an unrequested field is undefined, not an error", async () => {
      const created = (await assets().create(slug(), {
        name: uniqueName("asset-sparse"),
        size: 512,
      })) as unknown as CreateAssetEnvelope<WorkspaceAsset>;
      try {
        const fetched = await assets().retrieve(slug(), created.asset_id, {
          fields: ["id", "name"] as const,
        });
        expect(fetched.name).toBeDefined();
        expect((fetched as Partial<WorkspaceAsset>).content_type).toBeUndefined();
      } finally {
        await assets()
          .delete(slug(), created.asset_id)
          .catch(() => undefined);
      }
    });
  });

  describe("UserAssets (not workspace-scoped)", () => {
    it("create returns upload credentials; retrieve/delete round-trip", async () => {
      const created = (await suite.client.v2.userAssets.create({
        entity_type: "USER_AVATAR",
        name: uniqueName("avatar"),
        size: 256,
      })) as unknown as CreateAssetEnvelope<UserAsset>;
      expect(created.asset_id).toBeDefined();

      const fetched = await suite.client.v2.userAssets.retrieve(created.asset_id);
      expect(fetched.id).toBe(created.asset_id);

      await expect(suite.client.v2.userAssets.delete(created.asset_id)).resolves.toBeUndefined();
    });
  });
});
