# Plane Node SDK — guide for agents

`@makeplane/plane-node-sdk` is a handwritten TypeScript client for the Plane API. It uses
axios for HTTP, targets Node.js >= 20, and is managed with pnpm.

## What this document is, and is not

This file carries the **conventions** an agent must follow when changing this repository.
It deliberately does not restate the architecture, because a second description of the
same code is a second thing to keep true, and this one was not kept true: until it was
rewritten, every TypeScript block below described a `fetch`-based `BaseResource`, a
`ProjectApi`/`WorkItemApi` class pair and an `src/Configuration.ts` shaped nothing like
the real one — a design that was sketched and then not built. An agent following it would
have written code the repository rejects.

So the architecture lives in exactly one place per audience, and both are checked:

| Read this | For |
| --- | --- |
| `CLAUDE.md` | the architecture, the v2 kernel, and the sweeps that enforce it |
| `README.md` | the public surface as a user meets it, with worked samples |
| this file | the rules every change is held to |

Every TypeScript fence in all three is compiled against `src/` by
`tests/unit/v2/readme-samples.test.ts`, and every fence must carry a language that gate
recognises. A sample here is checked code, not illustration — which is why the ones this
file used to carry are gone rather than corrected.

## Layout

```text
src/
    index.ts              re-exports everything public
    Configuration.ts      baseUrl + apiKey/accessToken, and validate()
    client/
        plane-client.ts   PlaneClient: every v1 resource, plus `v2`
        oauth-client.ts   OAuthClient, standalone
    api/
        BaseResource.ts   v1 HTTP base (axios)
        WorkItems/        a resource with sub-resources is a directory
        Projects.ts       one without is a file
        v2/               the api_v2 surface; see CLAUDE.md
    models/               interfaces + Create/Update DTOs; models/v2/ for v2
    errors/               PlaneError and its five subclasses
tests/
    unit/                 offline, nock-backed; the v2 rule sweeps live in unit/v2/
    e2e/                  hits a live API, skipped without env vars
examples/
scripts/
```

## The two surfaces

**v1** resources hang off the client by name and take their path ids positionally:

```ts
import { PlaneClient } from "@makeplane/plane-node-sdk";

const v1Client = new PlaneClient({
  baseUrl: process.env.PLANE_BASE_URL,
  apiKey: process.env.PLANE_API_KEY,
});

const workItems = await v1Client.workItems.list("acme", "project-id");
void workItems.results.length;
```

**v2** is reached as `client.v2`, is flat, and answers navigable rows. It has its own
rules — positional path ids in URL order, `fields` narrowing the return type, loaded rows
— all of which `CLAUDE.md` states and the sweeps enforce:

```ts
const project = await client.v2.workspaces.projects.retrieve("acme", "ENG");
const states = await project.states.list();
void states.data.length;
```

Do not add to v2 by pattern-matching an existing class: read `CLAUDE.md` first, then the
sweeps in `tests/unit/v2/`, which will tell you what a new resource must satisfy.

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
