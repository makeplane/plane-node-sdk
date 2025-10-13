import { PlaneClient } from '../../src/client/plane-client';
import { WorkItemCommentUpdateRequest } from '../../src/models/Comment';
import { config } from '../constants';

export async function testComments() {
  const client = new PlaneClient({
    apiKey: process.env.PLANE_API_KEY!,
    baseUrl: process.env.PLANE_BASE_URL!,
    enableLogging: true,
  });

  const workspaceSlug = config.workspaceSlug;
  const projectId = config.projectId;
  const workItemId = config.workItemId;

  const comment = await createComment(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
  console.log('Created comment: ', comment);

  const retrievedComment = await retrieveComment(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    comment.id
  );
  console.log('Retrieved comment: ', retrievedComment);

  const updatedComment = await updateComment(
    client,
    workspaceSlug,
    projectId,
    workItemId,
    comment.id
  );
  console.log('Updated comment: ', updatedComment);

  const comments = await listComments(
    client,
    workspaceSlug,
    projectId,
    workItemId
  );
  console.log('Listed comments: ', comments);

  await deleteComment(client, workspaceSlug, projectId, workItemId, comment.id);
  console.log('Deleted comment: ', comment.id);
}

async function createComment(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const comment = await client.workItems.comments.create(
    workspaceSlug,
    projectId,
    workItemId,
    {
      comment_html: '<p>Test Comment</p>',
    }
  );
  return comment;
}

async function retrieveComment(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  commentId: string
) {
  const comment = await client.workItems.comments.retrieve(
    workspaceSlug,
    projectId,
    workItemId,
    commentId
  );
  return comment;
}

async function updateComment(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  commentId: string
) {
  return await client.workItems.comments.update(
    workspaceSlug,
    projectId,
    workItemId,
    commentId,
    {
      comment_html: '<p>Updated Test Comment</p>',
    }
  );
}

async function listComments(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string
) {
  const comments = await client.workItems.comments.list(
    workspaceSlug,
    projectId,
    workItemId
  );
  return comments;
}

async function deleteComment(
  client: PlaneClient,
  workspaceSlug: string,
  projectId: string,
  workItemId: string,
  commentId: string
) {
  await client.workItems.comments.del(
    workspaceSlug,
    projectId,
    workItemId,
    commentId
  );
}

if (require.main === module) {
  testComments().catch(console.error);
}
