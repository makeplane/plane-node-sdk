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
 * Serializer for generic asset upload requests with project association.
 * 
 * Validates metadata for generating presigned URLs for workspace assets including
 * project association, external system tracking, and file validation for
 * document management and content storage workflows.
 * @export
 * @interface GenericAssetUploadRequest
 */
export interface GenericAssetUploadRequest {
    /**
     * Original filename of the asset
     * @type {string}
     * @memberof GenericAssetUploadRequest
     */
    name: string;
    /**
     * MIME type of the file
     * @type {string}
     * @memberof GenericAssetUploadRequest
     */
    type?: string;
    /**
     * File size in bytes
     * @type {number}
     * @memberof GenericAssetUploadRequest
     */
    size: number;
    /**
     * UUID of the project to associate with the asset
     * @type {string}
     * @memberof GenericAssetUploadRequest
     */
    projectId?: string;
    /**
     * External identifier for the asset (for integration tracking)
     * @type {string}
     * @memberof GenericAssetUploadRequest
     */
    externalId?: string;
    /**
     * External source system (for integration tracking)
     * @type {string}
     * @memberof GenericAssetUploadRequest
     */
    externalSource?: string;
}

/**
 * Check if a given object implements the GenericAssetUploadRequest interface.
 */
export function instanceOfGenericAssetUploadRequest(value: object): value is GenericAssetUploadRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('size' in value) || value['size'] === undefined) return false;
    return true;
}

export function GenericAssetUploadRequestFromJSON(json: any): GenericAssetUploadRequest {
    return GenericAssetUploadRequestFromJSONTyped(json, false);
}

export function GenericAssetUploadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): GenericAssetUploadRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'type': json['type'] == null ? undefined : json['type'],
        'size': json['size'],
        'projectId': json['project_id'] == null ? undefined : json['project_id'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
    };
}

export function GenericAssetUploadRequestToJSON(json: any): GenericAssetUploadRequest {
    return GenericAssetUploadRequestToJSONTyped(json, false);
}

export function GenericAssetUploadRequestToJSONTyped(value?: GenericAssetUploadRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'type': value['type'],
        'size': value['size'],
        'project_id': value['projectId'],
        'external_id': value['externalId'],
        'external_source': value['externalSource'],
    };
}

