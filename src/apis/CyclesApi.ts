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
  Cycle,
  CycleCreateRequest,
  CycleIssue,
  CycleIssueRequestRequest,
  PaginatedArchivedCycleResponse,
  PaginatedCycleIssueResponse,
  PaginatedCycleResponse,
  PatchedCycleUpdateRequest,
  TransferCycleIssueRequestRequest,
  TransferCycleWorkItems200Response,
  TransferCycleWorkItems400Response,
} from '../models/index';
import {
    CycleFromJSON,
    CycleToJSON,
    CycleCreateRequestFromJSON,
    CycleCreateRequestToJSON,
    CycleIssueFromJSON,
    CycleIssueToJSON,
    CycleIssueRequestRequestFromJSON,
    CycleIssueRequestRequestToJSON,
    PaginatedArchivedCycleResponseFromJSON,
    PaginatedArchivedCycleResponseToJSON,
    PaginatedCycleIssueResponseFromJSON,
    PaginatedCycleIssueResponseToJSON,
    PaginatedCycleResponseFromJSON,
    PaginatedCycleResponseToJSON,
    PatchedCycleUpdateRequestFromJSON,
    PatchedCycleUpdateRequestToJSON,
    TransferCycleIssueRequestRequestFromJSON,
    TransferCycleIssueRequestRequestToJSON,
    TransferCycleWorkItems200ResponseFromJSON,
    TransferCycleWorkItems200ResponseToJSON,
    TransferCycleWorkItems400ResponseFromJSON,
    TransferCycleWorkItems400ResponseToJSON,
} from '../models/index';

export interface AddCycleWorkItemsRequest {
    cycleId: string;
    projectId: string;
    slug: string;
    cycleIssueRequestRequest: CycleIssueRequestRequest;
}

export interface ArchiveCycleRequest {
    cycleId: string;
    projectId: string;
    slug: string;
}

export interface CreateCycleRequest {
    projectId: string;
    slug: string;
    cycleCreateRequest: CycleCreateRequest;
}

export interface DeleteCycleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface DeleteCycleWorkItemRequest {
    cycleId: string;
    issueId: string;
    projectId: string;
    slug: string;
}

export interface ListArchivedCyclesRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    perPage?: number;
}

export interface ListCycleWorkItemsRequest {
    cycleId: string;
    projectId: string;
    slug: string;
    cursor?: string;
    perPage?: number;
}

export interface ListCyclesRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    cycleView?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface RetrieveCycleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface RetrieveCycleWorkItemRequest {
    cycleId: string;
    issueId: string;
    projectId: string;
    slug: string;
}

export interface TransferCycleWorkItemsRequest {
    cycleId: string;
    projectId: string;
    slug: string;
    transferCycleIssueRequestRequest: TransferCycleIssueRequestRequest;
}

export interface UnarchiveCycleRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface UpdateCycleRequest {
    pk: string;
    projectId: string;
    slug: string;
    patchedCycleUpdateRequest?: PatchedCycleUpdateRequest;
}

/**
 * 
 */
export class CyclesApi extends runtime.BaseAPI {

    /**
     * Assign multiple work items to a cycle. Automatically handles bulk creation and updates with activity tracking.
     * Add Work Items to Cycle
     */
    async addCycleWorkItemsRaw(requestParameters: AddCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Array<CycleIssue>>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling addCycleWorkItems().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling addCycleWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling addCycleWorkItems().'
            );
        }

        if (requestParameters['cycleIssueRequestRequest'] == null) {
            throw new runtime.RequiredError(
                'cycleIssueRequestRequest',
                'Required parameter "cycleIssueRequestRequest" was null or undefined when calling addCycleWorkItems().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CycleIssueRequestRequestToJSON(requestParameters['cycleIssueRequestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(CycleIssueFromJSON));
    }

    /**
     * Assign multiple work items to a cycle. Automatically handles bulk creation and updates with activity tracking.
     * Add Work Items to Cycle
     */
    async addCycleWorkItems(requestParameters: AddCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Array<CycleIssue>> {
        const response = await this.addCycleWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Move a completed cycle to archived status for historical tracking. Only cycles that have ended can be archived.
     * Archive cycle
     */
    async archiveCycleRaw(requestParameters: ArchiveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling archiveCycle().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling archiveCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling archiveCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/archive/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Move a completed cycle to archived status for historical tracking. Only cycles that have ended can be archived.
     * Archive cycle
     */
    async archiveCycle(requestParameters: ArchiveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.archiveCycleRaw(requestParameters, initOverrides);
    }

    /**
     * Create a new development cycle with specified name, description, and date range. Supports external ID tracking for integration purposes.
     * Create cycle
     */
    async createCycleRaw(requestParameters: CreateCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Cycle>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createCycle().'
            );
        }

        if (requestParameters['cycleCreateRequest'] == null) {
            throw new runtime.RequiredError(
                'cycleCreateRequest',
                'Required parameter "cycleCreateRequest" was null or undefined when calling createCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: CycleCreateRequestToJSON(requestParameters['cycleCreateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CycleFromJSON(jsonValue));
    }

    /**
     * Create a new development cycle with specified name, description, and date range. Supports external ID tracking for integration purposes.
     * Create cycle
     */
    async createCycle(requestParameters: CreateCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Cycle> {
        const response = await this.createCycleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a cycle and all its associated issue relationships
     * Delete cycle
     */
    async deleteCycleRaw(requestParameters: DeleteCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteCycle().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a cycle and all its associated issue relationships
     * Delete cycle
     */
    async deleteCycle(requestParameters: DeleteCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteCycleRaw(requestParameters, initOverrides);
    }

    /**
     * Remove a work item from a cycle while keeping the work item in the project.
     * Delete cycle work item
     */
    async deleteCycleWorkItemRaw(requestParameters: DeleteCycleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling deleteCycleWorkItem().'
            );
        }

        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling deleteCycleWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteCycleWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteCycleWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/{issue_id}/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Remove a work item from a cycle while keeping the work item in the project.
     * Delete cycle work item
     */
    async deleteCycleWorkItem(requestParameters: DeleteCycleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteCycleWorkItemRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve all cycles that have been archived in the project.
     * List archived cycles
     */
    async listArchivedCyclesRaw(requestParameters: ListArchivedCyclesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedArchivedCycleResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listArchivedCycles().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listArchivedCycles().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archived-cycles/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedArchivedCycleResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all cycles that have been archived in the project.
     * List archived cycles
     */
    async listArchivedCycles(requestParameters: ListArchivedCyclesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedArchivedCycleResponse> {
        const response = await this.listArchivedCyclesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all work items assigned to a cycle.
     * List cycle work items
     */
    async listCycleWorkItemsRaw(requestParameters: ListCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedCycleIssueResponse>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling listCycleWorkItems().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listCycleWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listCycleWorkItems().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedCycleIssueResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all work items assigned to a cycle.
     * List cycle work items
     */
    async listCycleWorkItems(requestParameters: ListCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedCycleIssueResponse> {
        const response = await this.listCycleWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all cycles in a project. Supports filtering by cycle status like current, upcoming, completed, or draft.
     * List cycles
     */
    async listCyclesRaw(requestParameters: ListCyclesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedCycleResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listCycles().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listCycles().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
        }

        if (requestParameters['cycleView'] != null) {
            queryParameters['cycle_view'] = requestParameters['cycleView'];
        }

        if (requestParameters['expand'] != null) {
            queryParameters['expand'] = requestParameters['expand'];
        }

        if (requestParameters['fields'] != null) {
            queryParameters['fields'] = requestParameters['fields'];
        }

        if (requestParameters['orderBy'] != null) {
            queryParameters['order_by'] = requestParameters['orderBy'];
        }

        if (requestParameters['perPage'] != null) {
            queryParameters['per_page'] = requestParameters['perPage'];
        }

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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedCycleResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all cycles in a project. Supports filtering by cycle status like current, upcoming, completed, or draft.
     * List cycles
     */
    async listCycles(requestParameters: ListCyclesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedCycleResponse> {
        const response = await this.listCyclesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific cycle by its ID. Supports cycle status filtering.
     * Retrieve cycle
     */
    async retrieveCycleRaw(requestParameters: RetrieveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Cycle>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling retrieveCycle().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CycleFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific cycle by its ID. Supports cycle status filtering.
     * Retrieve cycle
     */
    async retrieveCycle(requestParameters: RetrieveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Cycle> {
        const response = await this.retrieveCycleRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve details of a specific cycle work item.
     * Retrieve cycle work item
     */
    async retrieveCycleWorkItemRaw(requestParameters: RetrieveCycleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<CycleIssue>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling retrieveCycleWorkItem().'
            );
        }

        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling retrieveCycleWorkItem().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveCycleWorkItem().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveCycleWorkItem().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/cycle-issues/{issue_id}/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CycleIssueFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific cycle work item.
     * Retrieve cycle work item
     */
    async retrieveCycleWorkItem(requestParameters: RetrieveCycleWorkItemRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<CycleIssue> {
        const response = await this.retrieveCycleWorkItemRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Move incomplete work items from the current cycle to a new target cycle. Captures progress snapshot and transfers only unfinished work items.
     * Transfer cycle work items
     */
    async transferCycleWorkItemsRaw(requestParameters: TransferCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<TransferCycleWorkItems200Response>> {
        if (requestParameters['cycleId'] == null) {
            throw new runtime.RequiredError(
                'cycleId',
                'Required parameter "cycleId" was null or undefined when calling transferCycleWorkItems().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling transferCycleWorkItems().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling transferCycleWorkItems().'
            );
        }

        if (requestParameters['transferCycleIssueRequestRequest'] == null) {
            throw new runtime.RequiredError(
                'transferCycleIssueRequestRequest',
                'Required parameter "transferCycleIssueRequestRequest" was null or undefined when calling transferCycleWorkItems().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{cycle_id}/transfer-issues/`.replace(`{${"cycle_id"}}`, encodeURIComponent(String(requestParameters['cycleId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: TransferCycleIssueRequestRequestToJSON(requestParameters['transferCycleIssueRequestRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => TransferCycleWorkItems200ResponseFromJSON(jsonValue));
    }

    /**
     * Move incomplete work items from the current cycle to a new target cycle. Captures progress snapshot and transfers only unfinished work items.
     * Transfer cycle work items
     */
    async transferCycleWorkItems(requestParameters: TransferCycleWorkItemsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<TransferCycleWorkItems200Response> {
        const response = await this.transferCycleWorkItemsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Restore an archived cycle to active status, making it available for regular use.
     * Unarchive cycle
     */
    async unarchiveCycleRaw(requestParameters: UnarchiveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling unarchiveCycle().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling unarchiveCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling unarchiveCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/archived-cycles/{pk}/unarchive/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Restore an archived cycle to active status, making it available for regular use.
     * Unarchive cycle
     */
    async unarchiveCycle(requestParameters: UnarchiveCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.unarchiveCycleRaw(requestParameters, initOverrides);
    }

    /**
     * Modify an existing cycle\'s properties like name, description, or date range. Completed cycles can only have their sort order changed.
     * Update cycle
     */
    async updateCycleRaw(requestParameters: UpdateCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Cycle>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateCycle().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateCycle().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateCycle().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/cycles/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedCycleUpdateRequestToJSON(requestParameters['patchedCycleUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => CycleFromJSON(jsonValue));
    }

    /**
     * Modify an existing cycle\'s properties like name, description, or date range. Completed cycles can only have their sort order changed.
     * Update cycle
     */
    async updateCycle(requestParameters: UpdateCycleRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Cycle> {
        const response = await this.updateCycleRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
