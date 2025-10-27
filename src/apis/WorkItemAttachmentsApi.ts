/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.2
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  IssueAttachment,
  IssueAttachmentUploadRequest,
  RetrieveWorkItemAttachment400Response,
} from '../models/index';
import {
    IssueAttachmentFromJSON,
    IssueAttachmentToJSON,
    IssueAttachmentUploadRequestFromJSON,
    IssueAttachmentUploadRequestToJSON,
    RetrieveWorkItemAttachment400ResponseFromJSON,
    RetrieveWorkItemAttachment400ResponseToJSON,
} from '../models/index';

export interface CreateWorkItemAttachmentRequest {
    issueId: string;
    projectId: string;
    slug: string;
    issueAttachmentUploadRequest: IssueAttachmentUploadRequest;
}

export interface DeleteWorkItemAttachmentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface ListWorkItemAttachmentsRequest {
    issueId: string;
    projectId: string;
    slug: string;
}

export interface RetrieveWorkItemAttachmentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
}

export interface UploadWorkItemAttachmentRequest {
    issueId: string;
    pk: string;
    projectId: string;
    slug: string;
    body?: any | null;
}

/**
 * 
 */
export class WorkItemAttachmentsApi extends runtime.BaseAPI {

    /**
     * Generate presigned URL for uploading file attachments to a work item.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async createWorkItemAttachmentRaw(requestParameters: CreateWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling createWorkItemAttachment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createWorkItemAttachment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createWorkItemAttachment().'
            );
        }

        if (requestParameters['issueAttachmentUploadRequest'] == null) {
            throw new runtime.RequiredError(
                'issueAttachmentUploadRequest',
                'Required parameter "issueAttachmentUploadRequest" was null or undefined when calling createWorkItemAttachment().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-attachments/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssueAttachmentUploadRequestToJSON(requestParameters['issueAttachmentUploadRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Generate presigned URL for uploading file attachments to a work item.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async createWorkItemAttachment(requestParameters: CreateWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createWorkItemAttachmentRaw(requestParameters, initOverrides);
    }

    /**
     * Permanently remove an attachment from a work item. Records deletion activity for audit purposes.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async deleteWorkItemAttachmentRaw(requestParameters: DeleteWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteWorkItemAttachment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteWorkItemAttachment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteWorkItemAttachment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteWorkItemAttachment().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-attachments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove an attachment from a work item. Records deletion activity for audit purposes.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async deleteWorkItemAttachment(requestParameters: DeleteWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteWorkItemAttachmentRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all attachments for a work item.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async listWorkItemAttachmentsRaw(requestParameters: ListWorkItemAttachmentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssueAttachment>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling listWorkItemAttachments().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listWorkItemAttachments().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listWorkItemAttachments().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-attachments/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssueAttachmentFromJSON(jsonValue));
    }

    /**
     * Retrieve all attachments for a work item.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async listWorkItemAttachments(requestParameters: ListWorkItemAttachmentsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssueAttachment> {
        const response = await this.listWorkItemAttachmentsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Download attachment file. Returns a redirect to the presigned download URL.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async retrieveWorkItemAttachmentRaw(requestParameters: RetrieveWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling retrieveWorkItemAttachment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveWorkItemAttachment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveWorkItemAttachment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveWorkItemAttachment().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-attachments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Download attachment file. Returns a redirect to the presigned download URL.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async retrieveWorkItemAttachment(requestParameters: RetrieveWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.retrieveWorkItemAttachmentRaw(requestParameters, initOverrides);
    }

    /**
     * Mark an attachment as uploaded after successful file transfer to storage.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async uploadWorkItemAttachmentRaw(requestParameters: UploadWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling uploadWorkItemAttachment().'
            );
        }

        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling uploadWorkItemAttachment().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling uploadWorkItemAttachment().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling uploadWorkItemAttachment().'
            );
        }

        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        headerParameters['Content-Type'] = 'application/json';

        if (this.configuration && this.configuration.apiKey) {
            headerParameters["X-API-Key"] = await this.configuration.apiKey("X-API-Key"); // ApiKeyAuthentication authentication
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        if (this.configuration && this.configuration.accessToken) {
            // oauth required
            headerParameters["Authorization"] = await this.configuration.accessToken("OAuth2Authentication", []);
        }

        const response = await this.request({
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-attachments/{pk}/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: requestParameters['body'] as any,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Mark an attachment as uploaded after successful file transfer to storage.
     * Endpoints for issue attachment create/update/delete and fetch issue attachment details
     */
    async uploadWorkItemAttachment(requestParameters: UploadWorkItemAttachmentRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.uploadWorkItemAttachmentRaw(requestParameters, initOverrides);
    }

}
