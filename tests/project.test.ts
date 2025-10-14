import { PlaneClient } from '../src/client/plane-client';
import { UpdateProject } from '../src/models/Project';
import { config } from './constants';

export async function testProjects() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;

  const project = await createProject(client, workspaceSlug);
  console.log("created project", project);

  const retrievedProject = await retrieveProject(
    client,
    workspaceSlug,
    project.id
  );
  console.log("retrieved project", retrievedProject);

  const updatedProject = await updateProject(
    client,
    workspaceSlug,
    project.id,
    {
      name: 'Updated Test Project',
      description: 'Updated Test Project Description',
    }
  );
  console.log("updated project", updatedProject);

  const projects = await listProjects(client, workspaceSlug);
  console.log("listed projects", projects);

  const members = await getMembers(client, workspaceSlug, project.id);
  console.log("project members", members);

  await deleteProject(client, workspaceSlug, project.id);
  console.log('project deleted', project.id);
}

async function createProject(client: PlaneClient, workspaceSlug: string) {
  const project = await client.projects.create(workspaceSlug, {
    name: 'Test Project',
    description: 'Test Project Description',
  });
  return project;
}

async function retrieveProject(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const project = await client.projects.retrieve(workspaceSlug, projectId);
  return project;
}

async function updateProject(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  project: UpdateProject
) {
  const updatedProject = await client.projects.update(
    workspaceSlug,
    projectId,
    project
  );
  return updatedProject;
}

async function listProjects(client: PlaneClient, workspaceSlug: string) {
  const projects = await client.projects.list(workspaceSlug);
  return projects;
}

async function getMembers(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  const members = await client.projects.getMembers(workspaceSlug, projectId);
  return members;
}

async function deleteProject(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string
) {
  await client.projects.del(workspaceSlug, projectId);
}

if (require.main === module) {
  testProjects().catch(console.error);
}
