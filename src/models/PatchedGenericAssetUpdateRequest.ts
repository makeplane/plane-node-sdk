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

import { mapValues } from '../runtime';
/**
 * Serializer for generic asset upload confirmation and status management.
 * 
 * Handles post-upload status updates for workspace assets including
 * upload completion marking and metadata finalization.
 * @export
 * @interface PatchedGenericAssetUpdateRequest
 */
export interface PatchedGenericAssetUpdateRequest {
    /**
     * Whether the asset has been successfully uploaded
     * @type {boolean}
     * @memberof PatchedGenericAssetUpdateRequest
     */
    isUploaded?: boolean;
}

/**
 * Check if a given object implements the PatchedGenericAssetUpdateRequest interface.
 */
export function instanceOfPatchedGenericAssetUpdateRequest(value: object): value is PatchedGenericAssetUpdateRequest {
    return true;
}

export function PatchedGenericAssetUpdateRequestFromJSON(json: any): PatchedGenericAssetUpdateRequest {
    return PatchedGenericAssetUpdateRequestFromJSONTyped(json, false);
}

export function PatchedGenericAssetUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedGenericAssetUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'isUploaded': json['is_uploaded'] == null ? undefined : json['is_uploaded'],
    };
}

export function PatchedGenericAssetUpdateRequestToJSON(json: any): PatchedGenericAssetUpdateRequest {
    return PatchedGenericAssetUpdateRequestToJSONTyped(json, false);
}

export function PatchedGenericAssetUpdateRequestToJSONTyped(value?: PatchedGenericAssetUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'is_uploaded': value['isUploaded'],
    };
}

