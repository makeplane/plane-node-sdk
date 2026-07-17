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
 * Mocked unit tests for Release Links. Every endpoint is nested under a
 * specific release, so release_id must appear in the path.
 */
describe("Release Links (mocked unit)", () => {
  let client: PlaneClient;
  const releaseId = "rel-1";
  const linkId = "lnk-1";

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("create POSTs the link body to the links collection", async () => {
    const link = { id: linkId, release: releaseId, title: "Changelog", url: "https://example.com/cl" };
    mockedAxios.post.mockResolvedValueOnce(axiosResponse(link));

    const result = await client.releases.links.create(MOCK_SLUG, releaseId, {
      title: "Changelog",
      url: "https://example.com/cl",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/links/`),
      { title: "Changelog", url: "https://example.com/cl" },
      withAuthHeaders()
    );
    expect(result).toEqual(link);
  });

  it("retrieve GETs the link detail URL", async () => {
    mockedAxios.get.mockResolvedValueOnce(axiosResponse({ id: linkId }));

    await client.releases.links.retrieve(MOCK_SLUG, releaseId, linkId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/links/${linkId}/`),
      expect.anything()
    );
  });

  it("update PATCHes the link detail URL with the body", async () => {
    mockedAxios.patch.mockResolvedValueOnce(axiosResponse({ id: linkId, title: "Updated" }));

    await client.releases.links.update(MOCK_SLUG, releaseId, linkId, { title: "Updated" });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/links/${linkId}/`),
      { title: "Updated" },
      withAuthHeaders()
    );
  });

  it("delete DELETEs the link detail URL", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.links.delete(MOCK_SLUG, releaseId, linkId);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/links/${linkId}/`),
      expect.anything()
    );
  });

  it("list GETs the links collection", async () => {
    const page = { results: [{ id: linkId }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.links.list(MOCK_SLUG, releaseId, { per_page: 10 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/links/`),
      expect.objectContaining({ params: { per_page: 10 } })
    );
    expect(result).toEqual(page);
  });
});
