import { PlaneClient } from '../../src/client/plane-client';
import { config } from '../constants';

export async function testCustomers() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;

  const customer = await createCustomer(
    client,
    workspaceSlug,
  );
  console.log('Created customer: ', customer);

  const retrievedCustomer = await retrieveCustomer(
    client,
    workspaceSlug,
    customer.id
  );
  console.log('Retrieved customer: ', retrievedCustomer);

  const updatedCustomer = await updateCustomer(
    client,
    workspaceSlug,
    customer.id
  );
  console.log('Updated customer: ', updatedCustomer);

  const customers = await listCustomers(
    client,
    workspaceSlug,
  );
  console.log('Listed customers: ', customers);

  await deleteCustomer(client, workspaceSlug, customer.id);
  console.log('Deleted customer: ', customer.id);
}

async function createCustomer(
  client: PlaneClient,
  workspaceSlug: string,
) {
  const customer = await client.customers.create(
    workspaceSlug,
    {
      name: `Test Customer ${new Date().getTime()}`,
      description: 'Test Customer Description',
    }
  );
  return customer;
}

async function retrieveCustomer(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string
) {
  const customer = await client.customers.retrieve(
    workspaceSlug,
    customerId
  );
  return customer;
}

async function updateCustomer(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string
) {
  return await client.customers.update(
    workspaceSlug,
    customerId,
    {
      name: `Updated Test Customer ${new Date().getTime()}`,
      description: 'Updated Test Customer Description',
    }
  );
}

async function listCustomers(
  client: PlaneClient,
  workspaceSlug: string,
) {
  const customers = await client.customers.list(
    workspaceSlug,
    {
      limit: 10,
      offset: 0,
    }
  );
  return customers;
}

async function deleteCustomer(
  client: PlaneClient,
  workspaceSlug: string,
  customerId: string
) {
  await client.customers.del(
    workspaceSlug,
    customerId
  );
}

if (require.main === module) {
  testCustomers().catch(console.error);
}
