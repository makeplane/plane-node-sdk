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

import { mapValues } from '../runtime';
/**
 * Serializer for asset status updates after successful upload completion.
 * 
 * Handles post-upload asset metadata updates including attribute modifications
 * and upload confirmation for S3-based file storage workflows.
 * @export
 * @interface PatchedAssetUpdateRequest
 */
export interface PatchedAssetUpdateRequest {
    /**
     * Additional attributes to update for the asset
     * @type {any}
     * @memberof PatchedAssetUpdateRequest
     */
    attributes?: any | null;
}

/**
 * Check if a given object implements the PatchedAssetUpdateRequest interface.
 */
export function instanceOfPatchedAssetUpdateRequest(value: object): value is PatchedAssetUpdateRequest {
    return true;
}

export function PatchedAssetUpdateRequestFromJSON(json: any): PatchedAssetUpdateRequest {
    return PatchedAssetUpdateRequestFromJSONTyped(json, false);
}

export function PatchedAssetUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedAssetUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'attributes': json['attributes'] == null ? undefined : json['attributes'],
    };
}

export function PatchedAssetUpdateRequestToJSON(json: any): PatchedAssetUpdateRequest {
    return PatchedAssetUpdateRequestToJSONTyped(json, false);
}

export function PatchedAssetUpdateRequestToJSONTyped(value?: PatchedAssetUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'attributes': value['attributes'],
    };
}

