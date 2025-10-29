# Unit Tests

This directory contains Jest-based unit tests for the Plane Node SDK. All tests use conditional execution patterns that gracefully skip tests when required configuration is not available.

## Test Structure

All tests follow a consistent pattern:
- Written using Jest with `describe`, `it`, `beforeAll`, and `afterAll` blocks
- Use conditional `describeIf` helper to skip tests when required config is missing
- Include proper cleanup in `afterAll` hooks to remove test data
- Use `randomizeName()` utility to generate unique test data

## Test Configuration

Tests require environment variables to run. If these are not set, the tests will be skipped automatically (no failures).

### Required Environment Variables

Set the following environment variables before running tests:

```bash
export TEST_WORKSPACE_SLUG="your-workspace-slug"
export TEST_PROJECT_ID="your-project-id"
export TEST_USER_ID="your-user-id"
export TEST_WORK_ITEM_ID="your-work-item-id"
export TEST_WORK_ITEM_ID_2="your-second-work-item-id"
export TEST_CUSTOMER_ID="your-customer-id"
export TEST_WORK_ITEM_TYPE_ID="your-work-item-type-id"
export TEST_CUSTOM_TEXT_PROPERTY_ID="your-custom-text-property-id"
```

### Using .env File

Create a `.env` file in the project root with your configuration:

```bash
# Copy the example and update with your values
cp env.example .env
```

Then update the values with your test environment details.

## Running Tests

```bash
# Run all tests
pnpm test

# Run a specific test file
pnpm test label.test.ts

# Run tests in a specific directory
pnpm test customers

# Run tests matching a pattern
pnpm test work-items

# Run tests in watch mode
pnpm test --watch

# Run tests with coverage
pnpm test --coverage
```

## Test Organization

```
tests/unit/
├── constants.ts              # Test configuration
├── helpers/
│   ├── conditional-tests.ts  # Conditional describe helper
│   └── test-utils.ts         # Test utilities
├── customers/                # Customer API tests
├── work-items/               # Work Items API tests
├── work-item-types/          # Work Item Types API tests
├── cycle.test.ts             # Cycle API tests
├── epic.test.ts              # Epic API tests
├── intake.test.ts            # Intake API tests
├── label.test.ts             # Label API tests
├── module.test.ts            # Module API tests
├── oauth.test.ts             # OAuth API tests
├── page.test.ts              # Page API tests
├── project.test.ts           # Project API tests
└── state.test.ts             # State API tests
```

## Test Behavior

- **With Config**: Tests run normally and verify API operations
- **Without Config**: Tests are skipped gracefully (shown as "skipped" in test output)
- **Cleanup**: All tests clean up created resources in `afterAll` hooks
