# Plane Node SDK

A comprehensive TypeScript/JavaScript SDK for the Plane API, providing a clean and type-safe interface for all Plane operations.

## Installation

```bash
npm install @plane/node-sdk
```

## Quick Start

```typescript
import { PlaneClient } from '@plane/node-sdk';

const client = new PlaneClient({
  apiKey: 'your-api-key',
  accessToken: 'your-access-token'
});

// Or with custom base URL
const client = new PlaneClient({
  baseUrl: 'https://your-custom-api.plane.so',
  accessToken: 'your-access-token'
});

// Create a project
const project = await client.projectsApi.create({
  name: 'My Project',
  description: 'A new project',
  workspace: 'workspace-id'
});

// List projects
const projects = await client.projectsApi.list();
```

## Features

- ✅ TypeScript support with full type safety
- ✅ Centralized HTTP logic with BaseResource
- ✅ Automatic authentication handling
- ✅ Comprehensive error handling
- ✅ Modern async/await patterns
- ✅ Extensible architecture

## API Resources

- **Projects**: Project management and organization
- **WorkItems**: Issue and task management with full CRUD operations
- **WorkItemTypes**: Custom work item type definitions and management
- **WorkItemProperties**: Custom properties for work items
- **Labels**: Issue categorization and tagging
- **States**: Workflow state management
- **Users**: User management and profiles
- **Members**: Team membership and permissions
- **Modules**: Feature organization and module management
- **Cycles**: Sprint and iteration management
- **Customers**: Customer management and operations
- **Pages**: Workspace and project page management
- **Links**: Work item linking and relationships
- **Workspace**: Workspace-level operations
- **Epics**: Epic management and organization
- **Intake**: Intake form and request management

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run format
```

## Testing

### Setup Test Environment

Before running tests, you need to configure your test environment:

1. **Copy the environment template:**
   ```bash
   cp env.example .env.test
   ```

2. **Update `.env.test` with your test environment values:**
   ```bash
   # Edit the file with your actual test environment details
   nano .env.test
   ```

3. **Required environment variables:**
   - `TEST_WORKSPACE_SLUG`: Your test workspace slug
   - `TEST_PROJECT_ID`: Your test project ID
   - `TEST_USER_ID`: Your test user ID
   - `TEST_WORK_ITEM_ID`: A test work item ID
   - `TEST_CUSTOMER_ID`: A test customer ID
   - And other test-specific IDs as needed

### Running Tests

```bash
# Run all tests (recommended)
npm test
# or
pnpm test

# Run Jest tests only
npm run test:jest

# Run specific Jest test files
ts-node tests/epic.test.ts
```

## License

MIT
