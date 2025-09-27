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
  Label,
  LabelCreateUpdateRequest,
  PaginatedLabelResponse,
  PatchedLabelCreateUpdateRequest,
} from '../models/index';
import {
    LabelFromJSON,
    LabelToJSON,
    LabelCreateUpdateRequestFromJSON,
    LabelCreateUpdateRequestToJSON,
    PaginatedLabelResponseFromJSON,
    PaginatedLabelResponseToJSON,
    PatchedLabelCreateUpdateRequestFromJSON,
    PatchedLabelCreateUpdateRequestToJSON,
} from '../models/index';

export interface CreateLabelRequest {
    projectId: string;
    slug: string;
    labelCreateUpdateRequest: LabelCreateUpdateRequest;
}

export interface DeleteLabelRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface GetLabelsRequest {
    pk: string;
    projectId: string;
    slug: string;
}

export interface ListLabelsRequest {
    projectId: string;
    slug: string;
    cursor?: string;
    expand?: string;
    fields?: string;
    orderBy?: string;
    perPage?: number;
}

export interface UpdateLabelRequest {
    pk: string;
    projectId: string;
    slug: string;
    patchedLabelCreateUpdateRequest?: PatchedLabelCreateUpdateRequest;
}

/**
 * 
 */
export class LabelsApi extends runtime.BaseAPI {

    /**
     * Create a new label in the specified project with name, color, and description.
     * Endpoints for label create/update/delete and fetch label details
     */
    async createLabelRaw(requestParameters: CreateLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Label>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createLabel().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createLabel().'
            );
        }

        if (requestParameters['labelCreateUpdateRequest'] == null) {
            throw new runtime.RequiredError(
                'labelCreateUpdateRequest',
                'Required parameter "labelCreateUpdateRequest" was null or undefined when calling createLabel().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/labels/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: LabelCreateUpdateRequestToJSON(requestParameters['labelCreateUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LabelFromJSON(jsonValue));
    }

    /**
     * Create a new label in the specified project with name, color, and description.
     * Endpoints for label create/update/delete and fetch label details
     */
    async createLabel(requestParameters: CreateLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Label> {
        const response = await this.createLabelRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Permanently remove a label from the project. This action cannot be undone.
     * Delete a label
     */
    async deleteLabelRaw(requestParameters: DeleteLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling deleteLabel().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteLabel().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteLabel().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/labels/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Permanently remove a label from the project. This action cannot be undone.
     * Delete a label
     */
    async deleteLabel(requestParameters: DeleteLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteLabelRaw(requestParameters, initOverrides);
    }

    /**
     * Retrieve details of a specific label.
     * Endpoints for label create/update/delete and fetch label details
     */
    async getLabelsRaw(requestParameters: GetLabelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Label>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling getLabels().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling getLabels().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getLabels().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/labels/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LabelFromJSON(jsonValue));
    }

    /**
     * Retrieve details of a specific label.
     * Endpoints for label create/update/delete and fetch label details
     */
    async getLabels(requestParameters: GetLabelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Label> {
        const response = await this.getLabelsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Retrieve all labels in a project. Supports filtering by name and color.
     * Endpoints for label create/update/delete and fetch label details
     */
    async listLabelsRaw(requestParameters: ListLabelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<PaginatedLabelResponse>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listLabels().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listLabels().'
            );
        }

        const queryParameters: any = {};

        if (requestParameters['cursor'] != null) {
            queryParameters['cursor'] = requestParameters['cursor'];
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/labels/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => PaginatedLabelResponseFromJSON(jsonValue));
    }

    /**
     * Retrieve all labels in a project. Supports filtering by name and color.
     * Endpoints for label create/update/delete and fetch label details
     */
    async listLabels(requestParameters: ListLabelsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<PaginatedLabelResponse> {
        const response = await this.listLabelsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Partially update an existing label\'s properties like name, color, or description.
     * Update a label
     */
    async updateLabelRaw(requestParameters: UpdateLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<Label>> {
        if (requestParameters['pk'] == null) {
            throw new runtime.RequiredError(
                'pk',
                'Required parameter "pk" was null or undefined when calling updateLabel().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateLabel().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateLabel().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/labels/{pk}/`.replace(`{${"pk"}}`, encodeURIComponent(String(requestParameters['pk']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedLabelCreateUpdateRequestToJSON(requestParameters['patchedLabelCreateUpdateRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => LabelFromJSON(jsonValue));
    }

    /**
     * Partially update an existing label\'s properties like name, color, or description.
     * Update a label
     */
    async updateLabel(requestParameters: UpdateLabelRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<Label> {
        const response = await this.updateLabelRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
