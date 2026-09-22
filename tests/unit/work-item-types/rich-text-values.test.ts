import nock from "nock";
import { PlaneClient } from "../../../src/client/plane-client";
import { RichTextValue, UpdateWorkItemPropertyValue } from "../../../src/models/WorkItemProperty";

/**
 * A rich text value is an object with `description_html` -- Plane answers a bare string
 * with 400 "Rich text value must be an object". Offline, so it runs without a Plane instance.
 */
const BASE = "https://plane.example.com";
const URL = "/api/v1/workspaces/ws/projects/p/work-items/w/work-item-properties/prop/values/";

const client = new PlaneClient({ apiKey: "k", baseUrl: BASE });

afterEach(() => nock.cleanAll());

async function sent(value: UpdateWorkItemPropertyValue["value"]): Promise<unknown> {
  let body: unknown;
  const scope = nock(BASE)
    .post(URL, (requestBody) => {
      body = requestBody;
      return true;
    })
    .reply(201, { id: "v", property_id: "prop", issue_id: "w", value: "desc-1" });

  await client.workItemProperties.values.create("ws", "p", "w", "prop", { value });

  expect(scope.isDone()).toBe(true);
  return body;
}

describe("Rich text property values", () => {
  it("sends a rich text value as an object", async () => {
    const richText: RichTextValue = { description_html: "<p>Notes</p>" };

    expect(await sent(richText)).toStrictEqual({ value: { description_html: "<p>Notes</p>" } });
  });

  it("leaves the other value types unchanged", async () => {
    expect(await sent("plain")).toStrictEqual({ value: "plain" });
    expect(await sent(true)).toStrictEqual({ value: true });
    expect(await sent(4.5)).toStrictEqual({ value: 4.5 });
    expect(await sent(["a", "b"])).toStrictEqual({ value: ["a", "b"] });
  });

  it("reads a rich text value's HTML from value_detail; value is the stored content's ID", async () => {
    nock(BASE)
      .get(URL)
      .reply(200, {
        id: "v",
        property_id: "prop",
        issue_id: "w",
        value: "desc-1",
        value_type: "uuid",
        value_detail: { id: "desc-1", description_html: "<p>Notes</p>", description_stripped: "Notes" },
      });

    const detail = await client.workItemProperties.values.retrieve("ws", "p", "w", "prop");

    if (Array.isArray(detail)) throw new Error("expected a single value");
    expect(detail.value).toBe("desc-1");
    expect(detail.value_detail?.description_html).toBe("<p>Notes</p>");
    expect(detail.value_detail?.description_stripped).toBe("Notes");
  });

  it("answers a list when the property holds more than one value", async () => {
    nock(BASE)
      .get(URL)
      .reply(200, [
        { id: "v1", property_id: "prop", issue_id: "w", value: "o1" },
        { id: "v2", property_id: "prop", issue_id: "w", value: "o2" },
      ]);

    const values = await client.workItemProperties.values.retrieve("ws", "p", "w", "prop");

    expect(Array.isArray(values) && values.map((v) => v.value)).toEqual(["o1", "o2"]);
  });
});
