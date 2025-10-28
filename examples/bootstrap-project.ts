// examples/project-bootstrap.ts
import { CreateWorkItemProperty, PlaneClient, WorkItemProperty } from "../src";

async function bootstrapProject(workspaceSlug: string) {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL || "https://api.plane.so",
  });

  // 1. Create project with advanced configuration
  const project = await client.projects.create(workspaceSlug, {
    name: "New Product Launch Nov 2024",
    identifier: "NPL-11-2024",
    description: "Complete product launch project",
    network: 0, // Public project
    is_issue_type_enabled: true,
    is_time_tracking_enabled: true,
    cycle_view: true,
    module_view: true,
    page_view: true,
  });

  // 2. Set up work item types
  const workItemTypes = [
    { name: "Epic", description: "Large features or initiatives" },
    { name: "Story", description: "User stories and requirements" },
    { name: "Task", description: "Development tasks" },
    { name: "Bug", description: "Issues and bugs" },
    { name: "Sub-task", description: "Smaller work items" },
  ];

  for (const type of workItemTypes) {
    const workItemType = await client.workItemTypes.create(
      workspaceSlug,
      project.id,
      type
    );
    const workItemTypeId = workItemType.id;
    const customProperties: CreateWorkItemProperty[] = [
      {
        name: "Sprint",
        display_name: "Sprint",
        property_type: "TEXT",
        settings: { display_format: "single-line" },
        is_required: false,
      },
    ];
    // 3. Create custom properties
    for (const prop of customProperties) {
      await client.workItemProperties.create(
        workspaceSlug,
        project.id,
        workItemTypeId,
        prop
      );
    }
  }

  // 4. Set up project structure
  const labels = ["Frontend", "Backend", "API", "Database", "UI/UX", "Testing"];
  for (const label of labels) {
    await client.labels.create(workspaceSlug, project.id, { name: label });
  }

  // 5. Create modules
  const modules = [
    { name: "Authentication", description: "User authentication system" },
    { name: "Dashboard", description: "Main dashboard functionality" },
    { name: "API Integration", description: "Third-party API integrations" },
  ];

  for (const module of modules) {
    await client.modules.create(workspaceSlug, project.id, module);
  }

  console.log("✅ Project bootstrap completed successfully!");
}

bootstrapProject("integrations03");
