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
 * Serializer for work item attachment upload request validation.
 * 
 * Handles file upload metadata validation including size, type, and external
 * integration tracking for secure work item document attachment workflows.
 * @export
 * @interface IssueAttachmentUploadRequest
 */
export interface IssueAttachmentUploadRequest {
    /**
     * Original filename of the asset
     * @type {string}
     * @memberof IssueAttachmentUploadRequest
     */
    name: string;
    /**
     * MIME type of the file
     * @type {string}
     * @memberof IssueAttachmentUploadRequest
     */
    type?: string;
    /**
     * File size in bytes
     * @type {number}
     * @memberof IssueAttachmentUploadRequest
     */
    size: number;
    /**
     * External identifier for the asset (for integration tracking)
     * @type {string}
     * @memberof IssueAttachmentUploadRequest
     */
    externalId?: string;
    /**
     * External source system (for integration tracking)
     * @type {string}
     * @memberof IssueAttachmentUploadRequest
     */
    externalSource?: string;
}

/**
 * Check if a given object implements the IssueAttachmentUploadRequest interface.
 */
export function instanceOfIssueAttachmentUploadRequest(value: object): value is IssueAttachmentUploadRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('size' in value) || value['size'] === undefined) return false;
    return true;
}

export function IssueAttachmentUploadRequestFromJSON(json: any): IssueAttachmentUploadRequest {
    return IssueAttachmentUploadRequestFromJSONTyped(json, false);
}

export function IssueAttachmentUploadRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueAttachmentUploadRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'type': json['type'] == null ? undefined : json['type'],
        'size': json['size'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
    };
}

export function IssueAttachmentUploadRequestToJSON(json: any): IssueAttachmentUploadRequest {
    return IssueAttachmentUploadRequestToJSONTyped(json, false);
}

export function IssueAttachmentUploadRequestToJSONTyped(value?: IssueAttachmentUploadRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'type': value['type'],
        'size': value['size'],
        'external_id': value['externalId'],
        'external_source': value['externalSource'],
    };
}

