jest.mock("axios");

import type { PlaneClient } from "../../../src/client/plane-client";
import { HttpError } from "../../../src/errors";
import { ReleaseStatus } from "../../../src/models/Release";
import {
  mockedAxios,
  MOCK_SLUG,
  mockUrl,
  axiosResponse,
  createMockClient,
  withAuthHeaders,
} from "../../helpers/mock-axios";

/**
 * Mocked unit tests for the Releases resource. axios is mocked, so these run
 * without any credentials and assert the exact request the SDK builds
 * (URL, verb, body, query) and that it returns the parsed response body.
 * Live-integration counterparts live in tests/unit/release.test.ts.
 */
describe("Releases (mocked unit)", () => {
  let client: PlaneClient;

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("exposes the label/tag/work-item/comment/link sub-resources", () => {
    expect(client.releases.labels).toBeDefined();
    expect(client.releases.tags).toBeDefined();
    expect(client.releases.workItems).toBeDefined();
    expect(client.releases.comments).toBeDefined();
    expect(client.releases.links).toBeDefined();
  });

  describe("create", () => {
    it("POSTs to the releases collection with the given body and returns the release", async () => {
      const release = { id: "rel-1", name: "v1.0.0", status: "unreleased" };
      mockedAxios.post.mockResolvedValueOnce(axiosResponse(release));

      const result = await client.releases.create(MOCK_SLUG, {
        name: "v1.0.0",
        status: ReleaseStatus.UNRELEASED,
        description_html: "<p>notes</p>",
        tag: "tag-1",
      });

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(mockedAxios.post).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/`),
        { name: "v1.0.0", status: "unreleased", description_html: "<p>notes</p>", tag: "tag-1" },
        withAuthHeaders()
      );
      expect(result).toEqual(release);
    });

    it("sends the X-Api-Key auth header", async () => {
      mockedAxios.post.mockResolvedValueOnce(axiosResponse({ id: "rel-1" }));

      await client.releases.create(MOCK_SLUG, { name: "v1.0.0" });

      const options = mockedAxios.post.mock.calls[0][2] as { headers: Record<string, string> };
      expect(options.headers["X-Api-Key"]).toBe("test-api-key");
    });
  });

  describe("retrieve", () => {
    it("GETs the release detail URL", async () => {
      const release = { id: "rel-1", name: "v1.0.0" };
      mockedAxios.get.mockResolvedValueOnce(axiosResponse(release));

      const result = await client.releases.retrieve(MOCK_SLUG, "rel-1");

      expect(mockedAxios.get).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/rel-1/`),
        expect.anything()
      );
      expect(result).toEqual(release);
    });
  });

  describe("update", () => {
    it("PATCHes the release detail URL with the update body", async () => {
      const release = { id: "rel-1", name: "v1.0.1", status: "released" };
      mockedAxios.patch.mockResolvedValueOnce(axiosResponse(release));

      const result = await client.releases.update(MOCK_SLUG, "rel-1", {
        name: "v1.0.1",
        status: ReleaseStatus.RELEASED,
      });

      expect(mockedAxios.patch).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/rel-1/`),
        { name: "v1.0.1", status: "released" },
        withAuthHeaders()
      );
      expect(result).toEqual(release);
    });
  });

  describe("delete", () => {
    it("DELETEs the release detail URL", async () => {
      mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

      await client.releases.delete(MOCK_SLUG, "rel-1");

      expect(mockedAxios.delete).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/rel-1/`),
        expect.anything()
      );
    });
  });

  describe("list", () => {
    it("GETs the releases collection and forwards pagination params", async () => {
      const page = { results: [{ id: "rel-1" }], count: 1, total_count: 1 };
      mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

      const result = await client.releases.list(MOCK_SLUG, { per_page: 10, cursor: "10:0:0" });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/`),
        expect.objectContaining({ params: { per_page: 10, cursor: "10:0:0" } })
      );
      expect(result).toEqual(page);
    });

    it("GETs the releases collection with undefined params when none are given", async () => {
      mockedAxios.get.mockResolvedValueOnce(axiosResponse({ results: [] }));

      await client.releases.list(MOCK_SLUG);

      expect(mockedAxios.get).toHaveBeenCalledWith(
        mockUrl(`/workspaces/${MOCK_SLUG}/releases/`),
        expect.objectContaining({ params: undefined })
      );
    });
  });

  describe("error handling", () => {
    it("wraps axios errors in an HttpError carrying the status code", async () => {
      mockedAxios.isAxiosError.mockReturnValue(true);
      mockedAxios.get.mockRejectedValue({
        response: { status: 404, data: { message: "Not found" } },
        message: "Request failed with status code 404",
      });

      await expect(client.releases.retrieve(MOCK_SLUG, "missing")).rejects.toMatchObject({
        name: "HttpError",
        statusCode: 404,
      });
      await expect(client.releases.retrieve(MOCK_SLUG, "missing")).rejects.toBeInstanceOf(HttpError);
    });
  });
});
