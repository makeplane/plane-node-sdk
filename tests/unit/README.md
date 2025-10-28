# Test Configuration

This directory contains test files and configuration for the Plane Node SDK.

## Test Configuration Setup

The test constants are configurable through environment variables. This allows each developer to use their own test environment without modifying shared files.

### Option 1: Environment Variables (Recommended)

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

### Option 2: .env.test File

Create a `.env.test` file in the project root with your configuration:

```bash
# Copy the example and update with your values
cp env.example .env.test
```

Then update the values in `.env.test` with your test environment details.

### Option 3: Direct File Modification

If you prefer to modify the constants directly, edit `tests/constants.ts` and update the fallback values. Note that this will affect all developers, so use this option carefully.

## Running Tests

After setting up your configuration, run the tests:

```bash
npm test
# or
pnpm test
```

## Default Values

The constants file includes default values that work with the current test environment. If you don't set environment variables, these defaults will be used.
