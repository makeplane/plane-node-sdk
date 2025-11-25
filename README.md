# Plane Node SDK

A comprehensive TypeScript/JavaScript SDK for the Plane API, providing a clean and type-safe interface for all Plane operations.

## Installation

```bash
npm install @makeplane/plane-node-sdk
```

## ⚠️ Version 0.2.0 Breaking Changes

**Important:** Version 0.2.0 introduces breaking changes with new API signatures. If you're migrating from version 0.1.x, please review the following:

- **New PlaneClient Structure**: Instead of importing each API separately, you now use a single `PlaneClient` instance that provides access to all APIs
- **Updated Method Signatures**: Method parameters and return types have been updated for better readability and consistency

**Migration Guide:**

- Replace individual API imports with the new `PlaneClient` approach
- Review the new API documentation for updated method signatures
- Test thoroughly in a development environment before upgrading

## Quick Start

```typescript
import { PlaneClient } from "@plane/node-sdk";

const client = new PlaneClient({
  apiKey: "your-api-key",
});

// Or with custom base URL
const client = new PlaneClient({
  baseUrl: "https://your-custom-api.plane.so",
  accessToken: "your-access-token",
});

// List projects
const projects = await client.projects.list();

// Create a project
const project = await client.projects.create("workspace-slug", {
  name: "My Project",
  description: "A new project",
});
```

## Features

- ✅ TypeScript support with full type safety
- ✅ Centralized HTTP logic with BaseResource
- ✅ Automatic authentication handling
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
- **Stickies**: Stickies management
- **Teamspaces**: Teamspace management
- **Initiatives**: Initiative management
- **Features**: Workspace and project features management

## Development

```bash
# Install dependencies
pnpm install

# Build the project
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
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

# Run specific test files
pnpx ts-node tests/page.test.ts
# or
pnpm test page.test.ts
```

## License

MIT
