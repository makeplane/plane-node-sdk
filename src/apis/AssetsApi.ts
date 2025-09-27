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
  GenericAssetUploadRequest,
  PatchedAssetUpdateRequest,
  PatchedGenericAssetUpdateRequest,
  UserAssetUploadRequest,
} from '../models/index';
import {
    GenericAssetUploadRequestFromJSON,
    GenericAssetUploadRequestToJSON,
    PatchedAssetUpdateRequestFromJSON,
    PatchedAssetUpdateRequestToJSON,
    PatchedGenericAssetUpdateRequestFromJSON,
    PatchedGenericAssetUpdateRequestToJSON,
    UserAssetUploadRequestFromJSON,
    UserAssetUploadRequestToJSON,
} from '../models/index';

export interface CreateGenericAssetUploadRequest {
    slug: string;
    genericAssetUploadRequest: GenericAssetUploadRequest;
}

export interface CreateUserAssetUploadRequest {
    userAssetUploadRequest: UserAssetUploadRequest;
}

export interface DeleteUserAssetRequest {
    assetId: string;
}

export interface GetGenericAssetRequest {
    assetId: string;
    slug: string;
}

export interface UpdateGenericAssetRequest {
    assetId: string;
    slug: string;
    patchedGenericAssetUpdateRequest?: PatchedGenericAssetUpdateRequest;
}

export interface UpdateUserAssetRequest {
    assetId: string;
    patchedAssetUpdateRequest?: PatchedAssetUpdateRequest;
}

/**
 * 
 */
export class AssetsApi extends runtime.BaseAPI {

    /**
     * Generate presigned URL for generic asset upload
     * Generate presigned URL for generic asset upload
     */
    async createGenericAssetUploadRaw(requestParameters: CreateGenericAssetUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling createGenericAssetUpload().'
            );
        }

        if (requestParameters['genericAssetUploadRequest'] == null) {
            throw new runtime.RequiredError(
                'genericAssetUploadRequest',
                'Required parameter "genericAssetUploadRequest" was null or undefined when calling createGenericAssetUpload().'
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
            path: `/api/v1/workspaces/{slug}/assets/`.replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: GenericAssetUploadRequestToJSON(requestParameters['genericAssetUploadRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Generate presigned URL for generic asset upload
     * Generate presigned URL for generic asset upload
     */
    async createGenericAssetUpload(requestParameters: CreateGenericAssetUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createGenericAssetUploadRaw(requestParameters, initOverrides);
    }

    /**
     * Generate presigned URL for user asset upload
     * Generate presigned URL for user asset upload
     */
    async createUserAssetUploadRaw(requestParameters: CreateUserAssetUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['userAssetUploadRequest'] == null) {
            throw new runtime.RequiredError(
                'userAssetUploadRequest',
                'Required parameter "userAssetUploadRequest" was null or undefined when calling createUserAssetUpload().'
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
            path: `/api/v1/assets/user-assets/`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
            body: UserAssetUploadRequestToJSON(requestParameters['userAssetUploadRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Generate presigned URL for user asset upload
     * Generate presigned URL for user asset upload
     */
    async createUserAssetUpload(requestParameters: CreateUserAssetUploadRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.createUserAssetUploadRaw(requestParameters, initOverrides);
    }

    /**
     * Delete user asset.  Delete a user profile asset (avatar or cover image) and remove its reference from the user profile. This performs a soft delete by marking the asset as deleted and updating the user\'s profile.
     * Delete user asset
     */
    async deleteUserAssetRaw(requestParameters: DeleteUserAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['assetId'] == null) {
            throw new runtime.RequiredError(
                'assetId',
                'Required parameter "assetId" was null or undefined when calling deleteUserAsset().'
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
            path: `/api/v1/assets/user-assets/{asset_id}/`.replace(`{${"asset_id"}}`, encodeURIComponent(String(requestParameters['assetId']))),
            method: 'DELETE',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Delete user asset.  Delete a user profile asset (avatar or cover image) and remove its reference from the user profile. This performs a soft delete by marking the asset as deleted and updating the user\'s profile.
     * Delete user asset
     */
    async deleteUserAsset(requestParameters: DeleteUserAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.deleteUserAssetRaw(requestParameters, initOverrides);
    }

    /**
     * Get presigned URL for asset download
     * Get presigned URL for asset download
     */
    async getGenericAssetRaw(requestParameters: GetGenericAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['assetId'] == null) {
            throw new runtime.RequiredError(
                'assetId',
                'Required parameter "assetId" was null or undefined when calling getGenericAsset().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling getGenericAsset().'
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
            path: `/api/v1/workspaces/{slug}/assets/{asset_id}/`.replace(`{${"asset_id"}}`, encodeURIComponent(String(requestParameters['assetId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Get presigned URL for asset download
     * Get presigned URL for asset download
     */
    async getGenericAsset(requestParameters: GetGenericAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.getGenericAssetRaw(requestParameters, initOverrides);
    }

    /**
     * Update generic asset after upload completion
     * Update generic asset after upload completion
     */
    async updateGenericAssetRaw(requestParameters: UpdateGenericAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['assetId'] == null) {
            throw new runtime.RequiredError(
                'assetId',
                'Required parameter "assetId" was null or undefined when calling updateGenericAsset().'
            );
        }

        if (requestParameters['slug'] == null) {
            throw new runtime.RequiredError(
                'slug',
                'Required parameter "slug" was null or undefined when calling updateGenericAsset().'
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
            path: `/api/v1/workspaces/{slug}/assets/{asset_id}/`.replace(`{${"asset_id"}}`, encodeURIComponent(String(requestParameters['assetId']))).replace(`{${"slug"}}`, encodeURIComponent(String(requestParameters['slug']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedGenericAssetUpdateRequestToJSON(requestParameters['patchedGenericAssetUpdateRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Update generic asset after upload completion
     * Update generic asset after upload completion
     */
    async updateGenericAsset(requestParameters: UpdateGenericAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateGenericAssetRaw(requestParameters, initOverrides);
    }

    /**
     * Mark user asset as uploaded
     * Mark user asset as uploaded
     */
    async updateUserAssetRaw(requestParameters: UpdateUserAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<runtime.ApiResponse<void>> {
        if (requestParameters['assetId'] == null) {
            throw new runtime.RequiredError(
                'assetId',
                'Required parameter "assetId" was null or undefined when calling updateUserAsset().'
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
            path: `/api/v1/assets/user-assets/{asset_id}/`.replace(`{${"asset_id"}}`, encodeURIComponent(String(requestParameters['assetId']))),
            method: 'PATCH',
            headers: headerParameters,
            query: queryParameters,
            body: PatchedAssetUpdateRequestToJSON(requestParameters['patchedAssetUpdateRequest']),
        }, initOverrides);

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Mark user asset as uploaded
     * Mark user asset as uploaded
     */
    async updateUserAsset(requestParameters: UpdateUserAssetRequest, initOverrides?: RequestInit | runtime.InitOverrideFunction): Promise<void> {
        await this.updateUserAssetRaw(requestParameters, initOverrides);
    }

}
