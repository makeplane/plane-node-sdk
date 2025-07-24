## @makeplane/plane-node-sdk@0.1.2

This generator creates TypeScript/JavaScript client that utilizes [Fetch API](https://fetch.spec.whatwg.org/). The generated Node module can be used in the following environments:

Environment
* Node.js
* Webpack
* Browserify

Language level
* ES5 - you must have a Promises/A+ library installed
* ES6

Module system
* CommonJS
* ES6 module system

It can be used in both TypeScript and JavaScript. In TypeScript, the definition will be automatically resolved via `package.json`. ([Reference](https://www.typescriptlang.org/docs/handbook/declaration-files/consumption.html))

### Building

To build and compile the typescript sources to javascript use:
```
npm install
npm run build
```

### Publishing

First build the package then run `npm publish`

### Consuming

navigate to the folder of your consuming project and run one of the following commands.

_published:_

```
npm install @makeplane/plane-node-sdk@0.1.2 --save
```

_unPublished (not recommended):_

```
npm install PATH_TO_GENERATED_PACKAGE --save
```

### Example Usage
```ts
import {
  Configuration,
  ProjectsApi,
  UsersApi,
} from "@makeplane/plane-node-sdk";

async function testPlaneSDK() {
  console.log("🚀 Testing Plane Node SDK...\n");

  try {
    // Create configuration using API Key Authentication
    const config = new Configuration({
      apiKey: "<PLANE_API_KEY>",
    });

    // Create configuration using OAuth Client Credentials Authentication
    // const config = new Configuration({
    //   accessToken: "<PLANE_ACCESS_TOKEN>",
    // });

    console.log("✅ Configuration created successfully");
    console.log(`Base URL: ${config.basePath}\n`);

    // Initialize APIs
    const projectsApi = new ProjectsApi(config);
    const usersApi = new UsersApi(config);

    console.log("✅ APIs initialized successfully\n");

    const user = await usersApi.getCurrentUser();
    console.log(user);

    const projectsResponse = await projectsApi.listProjects({
      slug: "<workspace-slug>",
    });
    for (const project of projectsResponse.results) {
      console.log(`${project.id} - ${project.name}`);
    }
  } catch (error) {
    console.error("❌ Error initializing SDK:", error);
  }
}

// Run the test
testPlaneSDK().catch(console.error);
```