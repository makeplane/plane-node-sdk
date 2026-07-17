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
 * Mocked unit tests for Release Work Items. Verifies the `work_item_ids`
 * payload key and the distinct return shapes (add -> {message}, list ->
 * paginated {id, project_id, name}, remove -> void).
 */
describe("Release Work Items (mocked unit)", () => {
  let client: PlaneClient;
  const releaseId = "rel-1";

  beforeEach(() => {
    jest.clearAllMocks();
    client = createMockClient();
  });

  it("list GETs the work-items URL and returns the paginated rows", async () => {
    const page = { results: [{ id: "wi-1", project_id: "proj-1", name: "Fix login" }], count: 1 };
    mockedAxios.get.mockResolvedValueOnce(axiosResponse(page));

    const result = await client.releases.workItems.list(MOCK_SLUG, releaseId, { per_page: 20 });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/work-items/`),
      expect.objectContaining({ params: { per_page: 20 } })
    );
    expect(result).toEqual(page);
  });

  it("add POSTs work_item_ids and returns the message body", async () => {
    mockedAxios.post.mockResolvedValueOnce(axiosResponse({ message: "Work items added successfully" }));

    const result = await client.releases.workItems.add(MOCK_SLUG, releaseId, {
      work_item_ids: ["wi-1", "wi-2"],
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/work-items/`),
      { work_item_ids: ["wi-1", "wi-2"] },
      withAuthHeaders()
    );
    expect(result).toEqual({ message: "Work items added successfully" });
  });

  it("remove DELETEs the work-items URL with work_item_ids in the body", async () => {
    mockedAxios.delete.mockResolvedValueOnce(axiosResponse(undefined));

    await client.releases.workItems.remove(MOCK_SLUG, releaseId, { work_item_ids: ["wi-1"] });

    expect(mockedAxios.delete).toHaveBeenCalledWith(
      mockUrl(`/workspaces/${MOCK_SLUG}/releases/${releaseId}/work-items/`),
      expect.objectContaining({ data: { work_item_ids: ["wi-1"] } })
    );
  });
});
