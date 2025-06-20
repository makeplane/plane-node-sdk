/* tslint:disable */
/* eslint-disable */
/**
 * The Plane REST API
 * The Plane REST API  Visit our quick start guide and full API documentation at [developers.plane.so](https://developers.plane.so/api-reference/introduction).
 *
 * The version of the API Spec: 0.0.1
 * Contact: support@plane.so
 *
 * NOTE: This class is auto generated.
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';
import type {
  IssuePropertyAPI,
  IssuePropertyAPIRequest,
  IssuePropertyOptionAPI,
  IssuePropertyOptionAPIRequest,
  IssuePropertyValueAPI,
  IssuePropertyValueAPIRequest,
  PatchedIssuePropertyAPIRequest,
  PatchedIssuePropertyOptionAPIRequest,
} from '../models/index';
import {
    IssuePropertyAPIFromJSON,
    IssuePropertyAPIToJSON,
    IssuePropertyAPIRequestFromJSON,
    IssuePropertyAPIRequestToJSON,
    IssuePropertyOptionAPIFromJSON,
    IssuePropertyOptionAPIToJSON,
    IssuePropertyOptionAPIRequestFromJSON,
    IssuePropertyOptionAPIRequestToJSON,
    IssuePropertyValueAPIFromJSON,
    IssuePropertyValueAPIToJSON,
    IssuePropertyValueAPIRequestFromJSON,
    IssuePropertyValueAPIRequestToJSON,
    PatchedIssuePropertyAPIRequestFromJSON,
    PatchedIssuePropertyAPIRequestToJSON,
    PatchedIssuePropertyOptionAPIRequestFromJSON,
    PatchedIssuePropertyOptionAPIRequestToJSON,
} from '../models/index';

export interface CreateIssuePropertyRequest {
    projectId: string;
    slug: string;
    typeId: string;
    issuePropertyAPIRequest: IssuePropertyAPIRequest;
}

export interface CreateIssuePropertyOptionRequest {
    projectId: string;
    propertyId: string;
    slug: string;
    issuePropertyOptionAPIRequest: IssuePropertyOptionAPIRequest;
}

export interface CreateIssuePropertyValueRequest {
    issueId: string;
    projectId: string;
    propertyId: string;
    slug: string;
    issuePropertyValueAPIRequest: IssuePropertyValueAPIRequest;
}

export interface DeleteIssuePropertyRequest {
    projectId: string;
    propertyId: string;
    slug: string;
    typeId: string;
}

export interface DeleteIssuePropertyOptionRequest {
    optionId: string;
    projectId: string;
    propertyId: string;
    slug: string;
}

export interface ListIssuePropertiesRequest {
    projectId: string;
    slug: string;
    typeId: string;
}

export interface ListIssuePropertyOptionsRequest {
    projectId: string;
    propertyId: string;
    slug: string;
}

export interface ListIssuePropertyValuesRequest {
    issueId: string;
    projectId: string;
    propertyId: string;
    slug: string;
}

export interface RetrieveIssuePropertyRequest {
    projectId: string;
    propertyId: string;
    slug: string;
    typeId: string;
}

export interface RetrieveIssuePropertyOptionRequest {
    optionId: string;
    projectId: string;
    propertyId: string;
    slug: string;
}

export interface UpdateIssuePropertyRequest {
    projectId: string;
    propertyId: string;
    slug: string;
    typeId: string;
    patchedIssuePropertyAPIRequest?: PatchedIssuePropertyAPIRequest;
}

export interface UpdateIssuePropertyOptionRequest {
    optionId: string;
    projectId: string;
    propertyId: string;
    slug: string;
    patchedIssuePropertyOptionAPIRequest?: PatchedIssuePropertyOptionAPIRequest;
}

/**
 * 
 */
export class WorkItemPropertiesApi extends runtime.BaseAPI {

    /**
     * Create a new issue property
     * Create a new issue property
     */
    async createIssuePropertyRaw(requestParameters: CreateIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIssueProperty().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIssueProperty().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling createIssueProperty().'
            );
        }

        if (requestParameters['issuePropertyAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'issuePropertyAPIRequest',
                'Required parameter "issuePropertyAPIRequest" was null or undefined when calling createIssueProperty().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/issue-properties/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssuePropertyAPIRequestToJSON(requestParameters['issuePropertyAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyAPIFromJSON(jsonValue));
    }

    /**
     * Create a new issue property
     * Create a new issue property
     */
    async createIssueProperty(requestParameters: CreateIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyAPI> {
        const response = await this.createIssuePropertyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create a new issue property option
     * Create a new issue property option
     */
    async createIssuePropertyOptionRaw(requestParameters: CreateIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyOptionAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIssuePropertyOption().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling createIssuePropertyOption().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIssuePropertyOption().'
            );
        }

        if (requestParameters['issuePropertyOptionAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'issuePropertyOptionAPIRequest',
                'Required parameter "issuePropertyOptionAPIRequest" was null or undefined when calling createIssuePropertyOption().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-properties/{property_id}/options/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssuePropertyOptionAPIRequestToJSON(requestParameters['issuePropertyOptionAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyOptionAPIFromJSON(jsonValue));
    }

    /**
     * Create a new issue property option
     * Create a new issue property option
     */
    async createIssuePropertyOption(requestParameters: CreateIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyOptionAPI> {
        const response = await this.createIssuePropertyOptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Create/update an issue property value
     * Create/update an issue property value
     */
    async createIssuePropertyValueRaw(requestParameters: CreateIssuePropertyValueRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyValueAPI>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling createIssuePropertyValue().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling createIssuePropertyValue().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling createIssuePropertyValue().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createIssuePropertyValue().'
            );
        }

        if (requestParameters['issuePropertyValueAPIRequest'] == null) {
            throw new runtime.RequiredError(
                'issuePropertyValueAPIRequest',
                'Required parameter "issuePropertyValueAPIRequest" was null or undefined when calling createIssuePropertyValue().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-properties/{property_id}/values/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: IssuePropertyValueAPIRequestToJSON(requestParameters['issuePropertyValueAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyValueAPIFromJSON(jsonValue));
    }

    /**
     * Create/update an issue property value
     * Create/update an issue property value
     */
    async createIssuePropertyValue(requestParameters: CreateIssuePropertyValueRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyValueAPI> {
        const response = await this.createIssuePropertyValueRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Delete an issue property
     * Delete an issue property
     */
    async deleteIssuePropertyRaw(requestParameters: DeleteIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteIssueProperty().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling deleteIssueProperty().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteIssueProperty().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling deleteIssueProperty().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/issue-properties/{property_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an issue property
     * Delete an issue property
     */
    async deleteIssueProperty(requestParameters: DeleteIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIssuePropertyRaw(requestParameters, initOverrides);
    }

    /**
     * Delete an issue property option
     * Delete an issue property option
     */
    async deleteIssuePropertyOptionRaw(requestParameters: DeleteIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['optionId'] == null) {
            throw new runtime.RequiredError(
                'optionId',
                'Required parameter "optionId" was null or undefined when calling deleteIssuePropertyOption().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling deleteIssuePropertyOption().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling deleteIssuePropertyOption().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling deleteIssuePropertyOption().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-properties/{property_id}/options/{option_id}/`.replace(`{${"option_id"}}`, encodeURIComponent(String(requestParameters['optionId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete an issue property option
     * Delete an issue property option
     */
    async deleteIssuePropertyOption(requestParameters: DeleteIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteIssuePropertyOptionRaw(requestParameters, initOverrides);
    }

    /**
     * List issue properties
     * List issue properties
     */
    async listIssuePropertiesRaw(requestParameters: ListIssuePropertiesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listIssueProperties().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listIssueProperties().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling listIssueProperties().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/issue-properties/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyAPIFromJSON(jsonValue));
    }

    /**
     * List issue properties
     * List issue properties
     */
    async listIssueProperties(requestParameters: ListIssuePropertiesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyAPI> {
        const response = await this.listIssuePropertiesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List issue property options
     * List issue property options
     */
    async listIssuePropertyOptionsRaw(requestParameters: ListIssuePropertyOptionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyOptionAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listIssuePropertyOptions().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling listIssuePropertyOptions().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listIssuePropertyOptions().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-properties/{property_id}/options/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyOptionAPIFromJSON(jsonValue));
    }

    /**
     * List issue property options
     * List issue property options
     */
    async listIssuePropertyOptions(requestParameters: ListIssuePropertyOptionsRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyOptionAPI> {
        const response = await this.listIssuePropertyOptionsRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * List issue property values
     * List issue property values
     */
    async listIssuePropertyValuesRaw(requestParameters: ListIssuePropertyValuesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyValueAPI>> {
        if (requestParameters['issueId'] == null) {
            throw new runtime.RequiredError(
                'issueId',
                'Required parameter "issueId" was null or undefined when calling listIssuePropertyValues().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling listIssuePropertyValues().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling listIssuePropertyValues().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling listIssuePropertyValues().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issues/{issue_id}/issue-properties/{property_id}/values/`.replace(`{${"issue_id"}}`, encodeURIComponent(String(requestParameters['issueId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyValueAPIFromJSON(jsonValue));
    }

    /**
     * List issue property values
     * List issue property values
     */
    async listIssuePropertyValues(requestParameters: ListIssuePropertyValuesRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyValueAPI> {
        const response = await this.listIssuePropertyValuesRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get issue property by id
     * Get issue property by id
     */
    async retrieveIssuePropertyRaw(requestParameters: RetrieveIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveIssueProperty().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling retrieveIssueProperty().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveIssueProperty().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling retrieveIssueProperty().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/issue-properties/{property_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyAPIFromJSON(jsonValue));
    }

    /**
     * Get issue property by id
     * Get issue property by id
     */
    async retrieveIssueProperty(requestParameters: RetrieveIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyAPI> {
        const response = await this.retrieveIssuePropertyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Get issue property option by id
     * Get issue property option by id
     */
    async retrieveIssuePropertyOptionRaw(requestParameters: RetrieveIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyOptionAPI>> {
        if (requestParameters['optionId'] == null) {
            throw new runtime.RequiredError(
                'optionId',
                'Required parameter "optionId" was null or undefined when calling retrieveIssuePropertyOption().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling retrieveIssuePropertyOption().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling retrieveIssuePropertyOption().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling retrieveIssuePropertyOption().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-properties/{property_id}/options/{option_id}/`.replace(`{${"option_id"}}`, encodeURIComponent(String(requestParameters['optionId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyOptionAPIFromJSON(jsonValue));
    }

    /**
     * Get issue property option by id
     * Get issue property option by id
     */
    async retrieveIssuePropertyOption(requestParameters: RetrieveIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyOptionAPI> {
        const response = await this.retrieveIssuePropertyOptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update an issue property
     * Update an issue property
     */
    async updateIssuePropertyRaw(requestParameters: UpdateIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyAPI>> {
        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIssueProperty().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling updateIssueProperty().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIssueProperty().'
            );
        }

        if (requestParameters['typeId'] == null) {
            throw new runtime.RequiredError(
                'typeId',
                'Required parameter "typeId" was null or undefined when calling updateIssueProperty().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-types/{type_id}/issue-properties/{property_id}/`.replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))).replace(`{${"type_id"}}`, encodeURIComponent(String(requestParameters['typeId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssuePropertyAPIRequestToJSON(requestParameters['patchedIssuePropertyAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyAPIFromJSON(jsonValue));
    }

    /**
     * Update an issue property
     * Update an issue property
     */
    async updateIssueProperty(requestParameters: UpdateIssuePropertyRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyAPI> {
        const response = await this.updateIssuePropertyRaw(requestParameters, initOverrides);
        return await response.value();
    }

    /**
     * Update an issue property option
     * Update an issue property option
     */
    async updateIssuePropertyOptionRaw(requestParameters: UpdateIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<IssuePropertyOptionAPI>> {
        if (requestParameters['optionId'] == null) {
            throw new runtime.RequiredError(
                'optionId',
                'Required parameter "optionId" was null or undefined when calling updateIssuePropertyOption().'
            );
        }

        if (requestParameters['projectId'] == null) {
            throw new runtime.RequiredError(
                'projectId',
                'Required parameter "projectId" was null or undefined when calling updateIssuePropertyOption().'
            );
        }

        if (requestParameters['propertyId'] == null) {
            throw new runtime.RequiredError(
                'propertyId',
                'Required parameter "propertyId" was null or undefined when calling updateIssuePropertyOption().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateIssuePropertyOption().'
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
            path: `/api/v1/workspaces/{slug}/projects/{project_id}/issue-properties/{property_id}/options/{option_id}/`.replace(`{${"option_id"}}`, encodeURIComponent(String(requestParameters['optionId']))).replace(`{${"project_id"}}`, encodeURIComponent(String(requestParameters['projectId']))).replace(`{${"property_id"}}`, encodeURIComponent(String(requestParameters['propertyId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedIssuePropertyOptionAPIRequestToJSON(requestParameters['patchedIssuePropertyOptionAPIRequest']),
        }, initOverrides);

        return new runtime.JSONApiResponse(response, (jsonValue) => IssuePropertyOptionAPIFromJSON(jsonValue));
    }

    /**
     * Update an issue property option
     * Update an issue property option
     */
    async updateIssuePropertyOption(requestParameters: UpdateIssuePropertyOptionRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<IssuePropertyOptionAPI> {
        const response = await this.updateIssuePropertyOptionRaw(requestParameters, initOverrides);
        return await response.value();
    }

}
