# Plane SDK Examples

This directory contains examples demonstrating how to use the Plane Node SDK.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   export PLANE_API_KEY="your-api-key"
   ```

3. Run an example:
   ```bash
   npx ts-node examples/bootstrap-project.ts
   ```

## Logging

The SDK includes built-in request/response logging via axios interceptors. To enable logging:

```typescript
const client = new PlaneClient({
  apiKey: process.env.PLANE_API_KEY!,
  baseUrl: process.env.PLANE_BASE_URL!,
  enableLogging: true, // Enable detailed request/response logs
});
```

When enabled, you'll see detailed logs for:
- 🚀 Request details (method, URL, headers, data)
- ✅ Response details (status, data, headers)
- ❌ Error details (status, error message, response data)

Sensitive information like API keys and authorization tokens are automatically redacted from logs.

## Examples

- **bootstrap-project.ts** - Bootstraps a project in Plane with Work Item Types, Labels etc..

## Adding New Examples

When adding new examples:

1. Create a new `.ts` file in this directory
2. Import the SDK: `import { PlaneClient } from '../../src'`
3. Include proper error handling
4. Add documentation comments
5. Update this README with a description


## Environment Variables

Required environment variables:
- `PLANE_API_KEY` - Your Plane API key
- `PLANE_BASE_URL` - (Optional) Custom Plane instance URL
