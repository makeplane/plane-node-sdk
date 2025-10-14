import { PlaneClient } from '../../src/client/plane-client';
import { config } from '../constants';

export async function testCustomersPropertiesOptionsAndValues() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const customerId = config.customerId;

  const customerProperty = await createCustomerProperty(
    client,
    workspaceSlug,
  );
  console.log('Created customer property: ', customerProperty);

  if (!customerProperty.id) {
    throw new Error('Customer property ID is required');
  }

  const retrievedCustomerProperty = await retrieveCustomerProperty(
    client,
    workspaceSlug,
    customerProperty.id
  );
  console.log('Retrieved customer property: ', retrievedCustomerProperty);

  const updatedCustomerProperty = await updateCustomerProperty(
    client,
    workspaceSlug,
    customerProperty.id
  );
  console.log('Updated customer property: ', updatedCustomerProperty);

  const customerProperties = await listCustomerProperties(
    client,
    workspaceSlug,
  );
  console.log('Listed customer properties: ', customerProperties);


  // before deleting we test the property values
  const customerPropertyValue = await updateCustomerPropertyValue(
    client,
    workspaceSlug,
    customerId,
    customerProperty.id
  );
  console.log('Updated customer property value: ', customerProperty.id, customerPropertyValue);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const allCustomerPropertyValues = await listCustomerPropertyValues(
    client,
    workspaceSlug,
    customerId
  );
  console.log('Listed customer property values: ', allCustomerPropertyValues);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const retrievedCustomerPropertyValue = await retrieveCustomerPropertyValue(
    client,
    workspaceSlug,
    customerId,
    customerProperty.id,
  );
  console.log('Retrieved customer property value: ', retrievedCustomerPropertyValue);

  
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await deleteCustomerProperty(client, workspaceSlug, customerProperty.id);
  console.log('Deleted customer property: ', customerProperty.id);
}

// ===== CUSTOMER PROPERTY API METHODS ===== 
async function createCustomerProperty(
  client: PlaneClient,
  workspaceSlug: string,
) {
  const customerProperty = await client.customers.properties.createPropertyDefinition(
    workspaceSlug,
    {
      name: `test-customer-property-${new Date().getTime()}`,
      display_name: `Test Customer Property ${new Date().getTime()}`,
      description: 'Test Customer Property Description',
      property_type: 'TEXT',
    }
  );
  return customerProperty;
}

async function retrieveCustomerProperty(
  client: PlaneClient,
  workspaceSlug: string,
  propertyId: string,
) {
  const customerProperty = await client.customers.properties.retrievePropertyDefinition(
    workspaceSlug,
    propertyId,
  );
  return customerProperty;
}

async function updateCustomerProperty(
  client: PlaneClient,
  workspaceSlug: string,
  propertyId: string,
) {
  return await client.customers.properties.updatePropertyDefinition(
    workspaceSlug,
    propertyId,
    {
      display_name: `Updated Test Customer Property ${new Date().getTime()}`,
      description: 'Updated Test Customer Property Description',
    }
  );
}

async function listCustomerProperties(
  client: PlaneClient,
  workspaceSlug: string,
) {
  return await client.customers.properties.listPropertyDefinitions(
    workspaceSlug,
    {
      limit: 10,
      offset: 0,
    }
  );
}

async function deleteCustomerProperty(
  client: PlaneClient,
  workspaceSlug: string,
  propertyId: string,
) {
  return await client.customers.properties.deletePropertyDefinition(
    workspaceSlug,
    propertyId,
  );
}

// ===== CUSTOMER PROPERTY VALUES API METHODS =====
async function updateCustomerPropertyValue(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  propertyId: string,
) {
  return await client.customers.properties.updateValue(
    workspaceSlug,
    customerId,
    propertyId,
    {
      values: ['Property Value Updated'],
    }
  );
}

async function listCustomerPropertyValues(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
) {
  return await client.customers.properties.listValues(
    workspaceSlug,
    customerId,
  );
}

async function retrieveCustomerPropertyValue(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string,
  propertyId: string,
) {
  return await client.customers.properties.retrieveValue(
    workspaceSlug,
    customerId,
    propertyId,
  );
}

if (require.main === module) {
  testCustomersPropertiesOptionsAndValues().catch(console.error);
}
