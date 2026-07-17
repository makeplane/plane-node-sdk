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
 * Mocked unit tests for Release Labels: workspace-level CRUD plus the
 * add/remove/list operations that attach labels to a specific release.
 */
describe("Release Labels (mocked unit)", () => {
  let client: PlaneClient;
  const releaseId = "rel-1";

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("create POSTs to the labels collection", async () => {
    const label = { id: "lbl-1", name: "Bugfix", color: "#FF5733", sort_order: 1, workspace: "ws-1" };
    mockedAxios.post.mockResolvedValueOnce(axiosResponse(label));

    const result = await client.releases.labels.create(MOCK_SLUG, {
      name: "Bugfix",
      color: "#FF5733",
      sort_order: 1,
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/labels/`),
      { name: "Bugfix", color: "#FF5733", sort_order: 1 },
      withAuthHeaders()
    );
    expect(result).toEqual(label);
  });

  it("retrieve GETs the label detail URL", async () => {
    mockedAxios.get.mockResolvedValueOnce(axiosResponse({ id: "lbl-1" }));

    await client.releases.labels.retrieve(MOCK_SLUG, "lbl-1");

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/labels/lbl-1/`),
      expect.anything()
    );
  });

  it("update PATCHes the label detail URL with the body", async () => {
    mockedAxios.patch.mockResolvedValueOnce(axiosResponse({ id: "lbl-1", color: "#33FF57" }));

    await client.releases.labels.update(MOCK_SLUG, "lbl-1", { color: "#33FF57" });

    expect(mockedAxios.patch).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/labels/lbl-1/`),
      { color: "#33FF57" },
      withAuthHeaders()
    );
  });

  it("delete DELETEs the label detail URL", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.labels.delete(MOCK_SLUG, "lbl-1");

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/labels/lbl-1/`),
      expect.anything()
    );
  });

  it("list GETs the labels collection", async () => {
    const page = { results: [{ id: "lbl-1" }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.labels.list(MOCK_SLUG, { per_page: 5 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/labels/`),
      expect.objectContaining({ params: { per_page: 5 } })
    );
    expect(result).toEqual(page);
  });

  it("addLabels POSTs label_ids to the release labels URL and returns an array", async () => {
    const labels = [{ id: "lbl-1", name: "Bugfix" }];
    mockedAxios.post.mockResolvedValueOnce(axiosResponse(labels));

    const result = await client.releases.labels.addLabels(MOCK_SLUG, releaseId, {
      label_ids: ["lbl-1"],
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/labels/`),
      { label_ids: ["lbl-1"] },
      withAuthHeaders()
    );
    expect(Array.isArray(result)).toBe(true);
    expect(result).toEqual(labels);
  });

  it("removeLabels DELETEs the release labels URL with label_ids in the body", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.labels.removeLabels(MOCK_SLUG, releaseId, { label_ids: ["lbl-1"] });

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/labels/`),
      expect.objectContaining({ data: { label_ids: ["lbl-1"] } })
    );
  });

  it("listLabels GETs the release labels URL", async () => {
    const page = { results: [{ id: "lbl-1" }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.labels.listLabels(MOCK_SLUG, releaseId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/labels/`),
      expect.anything()
    );
    expect(result).toEqual(page);
  });
});
