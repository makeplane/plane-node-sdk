// Jest setup file for global test configuration
import { config } from './unit/constants';

// Set up global test configuration
beforeAll(() => {
  // Verify required environment variables are set
  const requiredEnvVars = [
    'PLANE_API_KEY',
    'PLANE_BASE_URL',
    'TEST_WORKSPACE_SLUG',
    'TEST_PROJECT_ID',
    'TEST_USER_ID',
    'TEST_WORK_ITEM_ID',
    'TEST_WORK_ITEM_ID_2',
    'TEST_CUSTOMER_ID',
    'TEST_WORK_ITEM_TYPE_ID',
    'TEST_CUSTOM_TEXT_PROPERTY_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }

  console.log('✅ All required environment variables are set');
  console.log(`📋 Testing workspace: ${config.workspaceSlug}`);
});

// Global test timeout
jest.setTimeout(30000);

// Suppress console.log during tests unless in verbose mode
if (!process.env.JEST_VERBOSE) {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}