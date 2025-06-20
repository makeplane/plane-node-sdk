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
import type { TypeEnum } from './TypeEnum';
import {
    TypeEnumFromJSON,
    TypeEnumFromJSONTyped,
    TypeEnumToJSON,
    TypeEnumToJSONTyped,
} from './TypeEnum';
import type { EntityTypeEnum } from './EntityTypeEnum';
import {
    EntityTypeEnumFromJSON,
    EntityTypeEnumFromJSONTyped,
    EntityTypeEnumToJSON,
    EntityTypeEnumToJSONTyped,
} from './EntityTypeEnum';

/**
 * Serializer for user asset upload requests.
 * 
 * This serializer validates the metadata required to generate a presigned URL
 * for uploading user profile assets (avatar or cover image) directly to S3 storage.
 * Supports JPEG, PNG, WebP, JPG, and GIF image formats with size validation.
 * @export
 * @interface UserAssetUploadRequest
 */
export interface UserAssetUploadRequest {
    /**
     * Original filename of the asset
     * @type {string}
     * @memberof UserAssetUploadRequest
     */
    name: string;
    /**
     * MIME type of the file
     * 
     * * `image/jpeg` - JPEG
     * * `image/png` - PNG
     * * `image/webp` - WebP
     * * `image/jpg` - JPG
     * * `image/gif` - GIF
     * @type {TypeEnum}
     * @memberof UserAssetUploadRequest
     */
    type?: TypeEnum;
    /**
     * File size in bytes
     * @type {number}
     * @memberof UserAssetUploadRequest
     */
    size: number;
    /**
     * Type of user asset
     * 
     * * `USER_AVATAR` - User Avatar
     * * `USER_COVER` - User Cover
     * @type {EntityTypeEnum}
     * @memberof UserAssetUploadRequest
     */
    entityType: EntityTypeEnum;
}



/**
 * Check if a given object implements the UserAssetUploadRequest interface.
 */
export function instanceOfUserAssetUploadRequest(value: object): value is UserAssetUploadRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('size' in value) || value['size'] === undefined) return false;
    if (!('entityType' in value) || value['entityType'] === undefined) return false;
    return true;
}

export function UserAssetUploadRequestFromJSON(json: any): UserAssetUploadRequest {
    return UserAssetUploadRequestFromJSONTyped(json, false);
}

export function UserAssetUploadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserAssetUploadRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'type': json['type'] == null ? undefined : TypeEnumFromJSON(json['type']),
        'size': json['size'],
        'entityType': EntityTypeEnumFromJSON(json['entity_type']),
    };
}

export function UserAssetUploadRequestToJSON(json: any): UserAssetUploadRequest {
    return UserAssetUploadRequestToJSONTyped(json, false);
}

export function UserAssetUploadRequestToJSONTyped(value?: UserAssetUploadRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'type': TypeEnumToJSON(value['type']),
        'size': value['size'],
        'entity_type': EntityTypeEnumToJSON(value['entityType']),
    };
}

