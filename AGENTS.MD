# Plane Node SDK v1

This repository contains the development of a Node.js SDK for Plane, providing a comprehensive TypeScript/JavaScript client for interacting with the Plane API.

## Overview

The SDK is designed to provide a clean, type-safe interface for all Plane API operations, following modern Node.js development practices and patterns.

## Architecture

### Main Client Structure

```typescript
export class PlaneClient {
  config: Configuration;
  workItemsApi: WorkItemsApi;
  workItemTypesApi: WorkItemTypesApi;
  workItemPropertiesApi: WorkItemPropertiesApi;
  projectsApi: ProjectsApi;
  labelsApi: LabelsApi;
  statesApi: StatesApi;
  usersApi: UsersApi;
  membersApi: MembersApi;
  modulesApi: ModulesApi;
  cyclesApi: CyclesApi;

  constructor(config: {
    baseUrl: string;
    apiKey: string;
    accessToken: string;
  }) {
    this.config = new Configuration({
      basePath: config.baseUrl,
      apiKey: config.apiKey,
      accessToken: config.accessToken,
    });

    this.workItemsApi = new WorkItemsApi(this.config);
    this.workItemTypesApi = new WorkItemTypesApi(this.config);
    this.workItemPropertiesApi = new WorkItemPropertiesApi(this.config);
    this.projectsApi = new ProjectsApi(this.config);
    this.labelsApi = new LabelsApi(this.config);
    this.statesApi = new StatesApi(this.config);
    this.usersApi = new UsersApi(this.config);
    this.membersApi = new MembersApi(this.config);
    this.modulesApi = new ModulesApi(this.config);
    this.cyclesApi = new CyclesApi(this.config);
  }
}
```

### Folder Structure
```
src/
    client/
        plane-client.ts
    api/
        BaseResource.ts
        WorkItemApi.ts
        ProjectApi.ts
        ...
    models/
        WorkItem.ts
        Project.ts
    errors/
        PlaneError.ts
        HttpError.ts
        ...
    utils/
        ...
test/
    e2e/
        cycle-creation.ts
```

### BaseResource Architecture

The `BaseResource` class will contain all HTTP logic and be extended by all API resources:

```typescript
// src/api/BaseResource.ts
export abstract class BaseResource {
  protected config: Configuration;
  protected basePath: string;

  constructor(config: Configuration, basePath: string) {
    this.config = config;
    this.basePath = basePath;
  }

  // HTTP Methods
  protected async get<T>(endpoint: string, params?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...(params && { body: JSON.stringify(params) })
    });
    
    return this.handleResponse<T>(response);
  }

  protected async post<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  protected async put<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  protected async patch<T>(endpoint: string, data?: any): Promise<T> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers,
      body: data ? JSON.stringify(data) : undefined
    });
    
    return this.handleResponse<T>(response);
  }

  protected async delete<T>(endpoint: string): Promise<void> {
    const url = this.buildUrl(endpoint);
    const headers = this.getHeaders();
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers
    });
    
    await this.handleResponse<void>(response);
  }

  // Helper methods
  protected buildUrl(endpoint: string): string {
    return `${this.config.basePath}${this.basePath}${endpoint}`;
  }

  protected getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add API Key if available
    if (this.config.apiKey) {
      headers['X-Api-Key'] = this.config.apiKey;
    }

    // Add Access Token if available
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  protected async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  protected handleError(error: any): never {
    // Centralized error handling
    throw error;
  }
}
```

### API Resource Structure

Each resource will have 5 core functionalities by default:
1. Create
2. Update
3. Retrieve
4. List
5. Delete

For each resource, we need to implement the following functions:

```typescript
// src/api/ProjectApi.ts
export class ProjectApi extends BaseResource {
  constructor(config: Configuration) {
    super(config, '/projects');
  }

  async create(createProject: CreateProject): Promise<Project> {
    return this.post<Project>('', createProject);
  }

  async retrieve(projectId: string): Promise<Project> {
    return this.get<Project>(`/${projectId}`);
  }

  async update(projectId: string, updateProject: UpdateProject): Promise<Project> {
    return this.patch<Project>(`/${projectId}`, updateProject);
  }

  async del(projectId: string): Promise<void> {
    return this.delete(`/${projectId}`);
  }

  async list(params?: ListProjectsParams): Promise<Project[]> {
    return this.get<Project[]>('', params);
  }
}
```

### Benefits of BaseResource Approach

1. **Centralized HTTP Logic**: All HTTP requests, error handling, and response processing in one place
2. **Consistent API**: All resources follow the same patterns and conventions
3. **Easy Maintenance**: Changes to HTTP logic automatically apply to all resources
4. **Type Safety**: Generic methods ensure proper typing across all resources
5. **Reduced Duplication**: No need to reimplement HTTP logic for each resource
6. **Easy Testing**: Mock the BaseResource for unit testing individual resources

## Development Guidelines

### Code Standards
- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write comprehensive JSDoc comments
- Implement proper error handling with custom error classes
- Use async/await patterns consistently
- All API URLs should end with /

### Testing Strategy
- Unit tests for individual API methods
- Integration tests for API interactions
- E2E tests for complete workflows
- Mock external API calls in unit tests
- Use Jest as the testing framework

### Error Handling
- Custom error classes in `src/errors/`
- HTTP status code mapping
- Retry logic for transient failures
- Proper error messages and context

## Configuration

### Configuration Class
```typescript
// src/Configuration.ts
export class Configuration {
  public basePath: string;
  public apiKey?: string;
  public accessToken?: string;

  constructor(config: {
    basePath: string;
    apiKey?: string;
    accessToken?: string;
  }) {
    this.basePath = config.basePath;
    this.apiKey = config.apiKey;
    this.accessToken = config.accessToken;
  }
}
```

### Client Initialization
```typescript
import { PlaneClient } from '@plane/node-sdk';

const client = new PlaneClient({
    baseUrl: process.env.PLANE_BASE_URL,
    apiKey: process.env.PLANE_API_KEY,
    accessToken: process.env.PLANE_ACCESS_TOKEN
});
```

## API Resources

### Available Resources
- **WorkItems**: Core issue management
- **Projects**: Project organization
- **Labels**: Issue categorization
- **States**: Workflow management
- **Users**: User management
- **Members**: Team membership
- **Modules**: Feature organization
- **Cycles**: Sprint management
- **WorkItemTypes**: Issue type definitions
- **WorkItemProperties**: Custom properties

### Common Patterns
- All resources extend `BaseResource`
- Consistent parameter naming conventions
- Standardized response types
- Pagination support for list operations
- Filtering and sorting capabilities

## Missing Implementation Details

### Package.json Setup
```json
{
  "name": "@plane/node-sdk",
  "version": "1.0.0",
  "description": "Node.js SDK for Plane API",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write src/**/*.ts"
  },
  "dependencies": {
    "node-fetch": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/jest": "^29.0.0",
    "typescript": "^5.0.0",
    "jest": "^29.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

### TypeScript Configuration
```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

### Error Classes
```typescript
// src/errors/PlaneError.ts
export class PlaneError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = 'PlaneError';
  }
}

// src/errors/HttpError.ts
export class HttpError extends PlaneError {
  constructor(message: string, statusCode: number, public response?: any) {
    super(message, statusCode);
    this.name = 'HttpError';
  }
}
```

### Model Interfaces
```typescript
// src/models/Project.ts
export interface Project {
  id: string;
  name: string;
  description?: string;
  workspace: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProject {
  name: string;
  description?: string;
  workspace: string;
}

export interface UpdateProject {
  name?: string;
  description?: string;
}

export interface ListProjectsParams {
  workspace?: string;
  limit?: number;
  offset?: number;
}
```

### Main Export File
```typescript
// src/index.ts
export { PlaneClient } from './client/plane-client';
export { Configuration } from './Configuration';
export { BaseResource } from './api/BaseResource';

// API Resources
export { ProjectApi } from './api/ProjectApi';
export { WorkItemApi } from './api/WorkItemApi';
// ... other resources

// Models
export * from './models/Project';
export * from './models/WorkItem';
// ... other models

// Errors
export { PlaneError, HttpError } from './errors';
```

## Getting Started

1. Install the package: `npm install @plane/node-sdk`
2. Import and configure the client
3. Use specific API resources for operations
4. Handle errors appropriately
5. Refer to individual resource documentation for detailed usage

## Rules for AI Agents and Models

This section defines the rules and conventions that all AI agents and models must follow when working with the Plane Node SDK v1 codebase.

### Code Quality Standards

#### TypeScript Best Practices
- **Strict Type Safety**: Always use TypeScript with strict mode enabled
- **Interface Definitions**: Define clear interfaces for all data models and API responses
- **Generic Types**: Use generic types for reusable components and API methods
- **Type Guards**: Implement proper type guards for runtime type checking
- **No `any` Types**: Avoid using `any` type; use proper typing or `unknown` with type guards

#### Code Organization
- **Single Responsibility**: Each class and function should have a single, well-defined purpose
- **Abstract Base Classes**: Extend `BaseResource` for all API resources
- **Consistent Naming**: Follow camelCase for methods, PascalCase for classes, and kebab-case for files.

### API Development Rules

#### HTTP Method Conventions
- **GET**: For retrieving data (list, retrieve operations)
- **POST**: For creating new resources
- **PATCH**: For partial updates
- **PUT**: For complete resource replacement
- **DELETE**: For removing resources

#### Endpoint Structure
- All endpoints must end with `/`
- Use RESTful URL patterns: `/resources/{id}/sub-resources`
- Each resource should have methods following these verbs
  - list
  - create
  - retrieve
  - update
  - del
- Implement consistent parameter naming across all endpoints
- Support query parameters for filtering, sorting, and pagination
- Never use the word Issue in endpoint or parameter names. Always use the word Work Item instead.

### Model and Interface Rules

#### Data Model Conventions
- **Immutable Interfaces**: Define read-only interfaces for API responses
- **Create/Update DTOs**: Separate interfaces for create and update operations. Use Pick, Omit and Partial wherever useful to create separate DTOs
- **Optional Fields**: Use optional properties for non-required fields
- **Date Handling**: Use ISO 8601 string format for all date fields
- **ID Fields**: Use string type for all ID fields

#### Validation Rules
- **Input Validation**: Validate all input parameters before API calls
- **Type Checking**: Use TypeScript's type system for compile-time validation
- **Runtime Validation**: Implement runtime validation for external data

### Testing Requirements

#### Test Coverage
- **Unit Tests**: Minimum 80% code coverage for all API methods
- **Integration Tests**: Test complete API workflows
- **E2E Tests**: Test real API interactions with proper mocking
- **Error Scenarios**: Test all error conditions and edge cases

#### Test Structure
- **Test Files**: Use `.test.ts` suffix for test files
- **Mocking**: Mock external dependencies and API calls
- **Fixtures**: Use consistent test data fixtures
- **Assertions**: Use descriptive assertion messages

### Documentation Standards

#### Code Documentation
- **JSDoc Comments**: Document all public methods and classes
- **Parameter Documentation**: Document all parameters and return types
- **Example Usage**: Include usage examples in documentation
- **API Documentation**: Maintain up-to-date API documentation

#### README Requirements
- **Installation Instructions**: Clear setup and installation steps
- **Usage Examples**: Practical code examples
- **Configuration Guide**: Detailed configuration options
- **Troubleshooting**: Common issues and solutions
