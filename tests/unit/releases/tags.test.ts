jest.mock("axios");

import type { PlaneClient } from "../../../src/client/plane-client";
import {
  mockedAxios,
  MOCK_SLUG,
  mockUrl,
  axiosResponse,
  createMockClient,
  withAuthHeaders,
} from "../../helpers/mock-axios";

/**
 * Mocked unit tests for Release Tags (workspace-level version identifiers).
 */
describe("Release Tags (mocked unit)", () => {
  let client: PlaneClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("create POSTs to the tags collection", async () => {
    const tag = { id: "tag-1", version: "v2.3.0", workspace: "ws-1" };
    mockedAxios.post.mockResolvedValueOnce(axiosResponse(tag));

    const result = await client.releases.tags.create(MOCK_SLUG, {
      version: "v2.3.0",
      description: "GA",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/tags/`),
      { version: "v2.3.0", description: "GA" },
      withAuthHeaders()
    );
    expect(result).toEqual(tag);
  });

  it("retrieve GETs the tag detail URL", async () => {
    mockedAxios.get.mockResolvedValueOnce(axiosResponse({ id: "tag-1" }));

    await client.releases.tags.retrieve(MOCK_SLUG, "tag-1");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/tags/tag-1/`),
      expect.anything()
    );
  });

  it("update PATCHes the tag detail URL with the body", async () => {
    mockedAxios.patch.mockResolvedValueOnce(axiosResponse({ id: "tag-1", git_tag: "refs/tags/v2.3.0" }));

    await client.releases.tags.update(MOCK_SLUG, "tag-1", { git_tag: "refs/tags/v2.3.0" });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/tags/tag-1/`),
      { git_tag: "refs/tags/v2.3.0" },
      withAuthHeaders()
    );
  });

  it("delete DELETEs the tag detail URL", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.tags.delete(MOCK_SLUG, "tag-1");

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/tags/tag-1/`),
      expect.anything()
    );
  });

  it("list GETs the tags collection and forwards params", async () => {
    const page = { results: [{ id: "tag-1" }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.tags.list(MOCK_SLUG, { per_page: 20 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/tags/`),
      expect.objectContaining({ params: { per_page: 20 } })
    );
    expect(result).toEqual(page);
  });
});
