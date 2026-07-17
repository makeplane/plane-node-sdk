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
 * Mocked unit tests for Release Comments. Every endpoint is nested under a
 * specific release, so release_id must appear in the path.
 */
describe("Release Comments (mocked unit)", () => {
  let client: PlaneClient;
  const releaseId = "rel-1";
  const commentId = "cmt-1";

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("create POSTs comment_html to the comments collection", async () => {
    const comment = { id: commentId, release: releaseId, comment: { description_html: "<p>hi</p>" } };
    mockedAxios.post.mockResolvedValueOnce(axiosResponse(comment));

    const result = await client.releases.comments.create(MOCK_SLUG, releaseId, {
      comment_html: "<p>hi</p>",
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/comments/`),
      { comment_html: "<p>hi</p>" },
      withAuthHeaders()
    );
    expect(result).toEqual(comment);
  });

  it("retrieve GETs the comment detail URL", async () => {
    mockedAxios.get.mockResolvedValueOnce(axiosResponse({ id: commentId }));

    await client.releases.comments.retrieve(MOCK_SLUG, releaseId, commentId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/comments/${commentId}/`),
      expect.anything()
    );
  });

  it("update PATCHes the comment detail URL with the body", async () => {
    mockedAxios.patch.mockResolvedValueOnce(axiosResponse({ id: commentId }));

    await client.releases.comments.update(MOCK_SLUG, releaseId, commentId, {
      comment_html: "<p>edited</p>",
    });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/comments/${commentId}/`),
      { comment_html: "<p>edited</p>" },
      withAuthHeaders()
    );
  });

  it("delete DELETEs the comment detail URL", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.comments.delete(MOCK_SLUG, releaseId, commentId);

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/comments/${commentId}/`),
      expect.anything()
    );
  });

  it("list GETs the comments collection", async () => {
    const page = { results: [{ id: commentId }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.comments.list(MOCK_SLUG, releaseId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/comments/`),
      expect.anything()
    );
    expect(result).toEqual(page);
  });
});
