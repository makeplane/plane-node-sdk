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
import type { AccessEnum } from './AccessEnum';
import {
    AccessEnumFromJSON,
    AccessEnumFromJSONTyped,
    AccessEnumToJSON,
    AccessEnumToJSONTyped,
} from './AccessEnum';

/**
 * Serializer for creating work item comments.
 * 
 * Handles comment creation with JSON and HTML content support,
 * access control, and external integration tracking.
 * @export
 * @interface PatchedIssueCommentCreateRequest
 */
export interface PatchedIssueCommentCreateRequest {
    /**
     * 
     * @type {any}
     * @memberof PatchedIssueCommentCreateRequest
     */
    commentJson?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueCommentCreateRequest
     */
    commentHtml?: string;
    /**
     * 
     * @type {AccessEnum}
     * @memberof PatchedIssueCommentCreateRequest
     */
    access?: AccessEnum;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueCommentCreateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedIssueCommentCreateRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the PatchedIssueCommentCreateRequest interface.
 */
export function instanceOfPatchedIssueCommentCreateRequest(value: object): value is PatchedIssueCommentCreateRequest {
    return true;
}

export function PatchedIssueCommentCreateRequestFromJSON(json: any): PatchedIssueCommentCreateRequest {
    return PatchedIssueCommentCreateRequestFromJSONTyped(json, false);
}

export function PatchedIssueCommentCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedIssueCommentCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'commentJson': json['comment_json'] == null ? undefined : json['comment_json'],
        'commentHtml': json['comment_html'] == null ? undefined : json['comment_html'],
        'access': json['access'] == null ? undefined : AccessEnumFromJSON(json['access']),
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function PatchedIssueCommentCreateRequestToJSON(json: any): PatchedIssueCommentCreateRequest {
    return PatchedIssueCommentCreateRequestToJSONTyped(json, false);
}

export function PatchedIssueCommentCreateRequestToJSONTyped(value?: PatchedIssueCommentCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'comment_json': value['commentJson'],
        'comment_html': value['commentHtml'],
        'access': AccessEnumToJSON(value['access']),
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

