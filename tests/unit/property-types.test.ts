import {
  CreateCustomerPropertyRequest,
  CustomerProperty,
  UpdateCustomerPropertyRequest,
} from "../../src/models/Customer";
import {
  CustomerPropertyType,
  CustomerRelationType,
  PropertyRelationType,
  PropertyType,
} from "../../src/models/common";
import { WorkItemProperty } from "../../src/models/WorkItemProperty";

/**
 * Property and relation type unions. Customer properties take Plane's customer set, not
 * the work item one: Plane answers FORMULA/CASCADING on a customer property, or a
 * RELEASE/RICH_TEXT customer relation, with a 400.
 *
 * These are compile-time checks -- ts-jest type-checks this file, so each
 * `@ts-expect-error` fails the suite if the line it guards stops being an error.
 */
describe("Customer property types", () => {
  // One literal per `@ts-expect-error`: a directive covering two values would stay
  // satisfied if only one of them were wrongly admitted.
  it("refuses FORMULA", () => {
    const create: CreateCustomerPropertyRequest = {
      display_name: "Score",
      // @ts-expect-error FORMULA is a work item property type only
      property_type: "FORMULA",
    };
    const update: UpdateCustomerPropertyRequest = {
      // @ts-expect-error FORMULA is a work item property type only
      property_type: "FORMULA",
    };

    expect([create.property_type, update.property_type]).toEqual(["FORMULA", "FORMULA"]);
  });

  it("refuses CASCADING", () => {
    const create: CreateCustomerPropertyRequest = {
      display_name: "Region",
      // @ts-expect-error CASCADING is a work item property type only
      property_type: "CASCADING",
    };
    const update: UpdateCustomerPropertyRequest = {
      // @ts-expect-error CASCADING is a work item property type only
      property_type: "CASCADING",
    };

    expect([create.property_type, update.property_type]).toEqual(["CASCADING", "CASCADING"]);
  });

  it("refuses a RELEASE relation", () => {
    const create: CreateCustomerPropertyRequest = {
      display_name: "Release",
      property_type: "RELATION",
      // @ts-expect-error a customer property relates only to a work item or a user
      relation_type: "RELEASE",
    };

    expect(create.relation_type).toBe("RELEASE");
  });

  it("refuses a RICH_TEXT relation", () => {
    const create: CreateCustomerPropertyRequest = {
      display_name: "Notes",
      property_type: "RELATION",
      // @ts-expect-error a customer property relates only to a work item or a user
      relation_type: "RICH_TEXT",
    };

    expect(create.relation_type).toBe("RICH_TEXT");
  });

  it("accepts every customer type, including URL, EMAIL and FILE", () => {
    const types: CustomerPropertyType[] = ["TEXT", "DATETIME", "DECIMAL", "BOOLEAN", "OPTION", "RELATION"];
    const added: CustomerPropertyType[] = ["URL", "EMAIL", "FILE"];
    const relations: CustomerRelationType[] = ["ISSUE", "USER"];

    const read: Pick<CustomerProperty, "property_type" | "relation_type"> = {
      property_type: "EMAIL",
      relation_type: "USER",
    };

    expect([...types, ...added]).toHaveLength(9);
    expect(relations).toHaveLength(2);
    expect(read.property_type).toBe("EMAIL");
  });

  it("still takes a shared work item type the customer set includes", () => {
    const shared = "RELATION" satisfies PropertyType;
    const sharedRelation = "USER" satisfies PropertyRelationType;

    const create: CreateCustomerPropertyRequest = { property_type: shared, relation_type: sharedRelation };

    expect(create).toStrictEqual({ property_type: "RELATION", relation_type: "USER" });
  });

  it("refuses an unnarrowed work item type, which may be one the customer set lacks", () => {
    const wide = "FORMULA" as PropertyType;

    // @ts-expect-error PropertyType includes FORMULA and CASCADING
    const create: CreateCustomerPropertyRequest = { property_type: wide };

    expect(create.property_type).toBe("FORMULA");
  });

  it("is a subset of the work item types", () => {
    const customerType: CustomerPropertyType = "FILE";
    const customerRelation: CustomerRelationType = "ISSUE";

    const asWorkItemType: PropertyType = customerType;
    const asWorkItemRelation: PropertyRelationType = customerRelation;

    expect([asWorkItemType, asWorkItemRelation]).toEqual(["FILE", "ISSUE"]);
  });
});

describe("Work item property types", () => {
  it("types a CASCADING property", () => {
    const property: Pick<WorkItemProperty, "property_type"> = { property_type: "CASCADING" };

    expect(property.property_type).toBe("CASCADING");
  });

  it("types FORMULA, URL, EMAIL and FILE properties", () => {
    const types: PropertyType[] = ["FORMULA", "URL", "EMAIL", "FILE"];

    expect(types).toHaveLength(4);
  });

  it("treats RICH_TEXT as a relation type, not a property type", () => {
    const relation: PropertyRelationType = "RICH_TEXT";
    // @ts-expect-error RICH_TEXT is a relation type; the property is RELATION
    const propertyType: PropertyType = "RICH_TEXT";

    const property: Pick<WorkItemProperty, "property_type" | "relation_type"> = {
      property_type: "RELATION",
      relation_type: "RICH_TEXT",
    };

    expect([relation, propertyType, property.relation_type]).toEqual(["RICH_TEXT", "RICH_TEXT", "RICH_TEXT"]);
  });

  it("types a RELEASE relation", () => {
    const relation: PropertyRelationType = "RELEASE";

    expect(relation).toBe("RELEASE");
  });
});
