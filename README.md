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
  apiKey: 'your-api-key',
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
- **WorkItems**: Issue and task management (coming soon)
- **Labels**: Issue categorization (coming soon)
- **States**: Workflow management (coming soon)
- **Users**: User management (coming soon)
- **Members**: Team membership (coming soon)
- **Modules**: Feature organization (coming soon)
- **Cycles**: Sprint management (coming soon)

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

## License

MIT
