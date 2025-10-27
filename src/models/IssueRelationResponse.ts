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
 * Serializer for issue relations response showing grouped relation types.
 * 
 * Returns issue IDs organized by relation type for efficient client-side processing.
 * @export
 * @interface IssueRelationResponse
 */
export interface IssueRelationResponse {
    /**
     * List of issue IDs that are blocking this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    blocking: Array<string>;
    /**
     * List of issue IDs that this issue is blocked by
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    blockedBy: Array<string>;
    /**
     * List of issue IDs that are duplicates of this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    duplicate: Array<string>;
    /**
     * List of issue IDs that relate to this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    relatesTo: Array<string>;
    /**
     * List of issue IDs that start after this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    startAfter: Array<string>;
    /**
     * List of issue IDs that start before this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    startBefore: Array<string>;
    /**
     * List of issue IDs that finish after this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    finishAfter: Array<string>;
    /**
     * List of issue IDs that finish before this issue
     * @type {Array<string>}
     * @memberof IssueRelationResponse
     */
    finishBefore: Array<string>;
}

/**
 * Check if a given object implements the IssueRelationResponse interface.
 */
export function instanceOfIssueRelationResponse(value: object): value is IssueRelationResponse {
    if (!('blocking' in value) || value['blocking'] === undefined) return false;
    if (!('blockedBy' in value) || value['blockedBy'] === undefined) return false;
    if (!('duplicate' in value) || value['duplicate'] === undefined) return false;
    if (!('relatesTo' in value) || value['relatesTo'] === undefined) return false;
    if (!('startAfter' in value) || value['startAfter'] === undefined) return false;
    if (!('startBefore' in value) || value['startBefore'] === undefined) return false;
    if (!('finishAfter' in value) || value['finishAfter'] === undefined) return false;
    if (!('finishBefore' in value) || value['finishBefore'] === undefined) return false;
    return true;
}

export function IssueRelationResponseFromJSON(json: any): IssueRelationResponse {
    return IssueRelationResponseFromJSONTyped(json, false);
}

export function IssueRelationResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRelationResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'blocking': json['blocking'],
        'blockedBy': json['blocked_by'],
        'duplicate': json['duplicate'],
        'relatesTo': json['relates_to'],
        'startAfter': json['start_after'],
        'startBefore': json['start_before'],
        'finishAfter': json['finish_after'],
        'finishBefore': json['finish_before'],
    };
}

export function IssueRelationResponseToJSON(json: any): IssueRelationResponse {
    return IssueRelationResponseToJSONTyped(json, false);
}

export function IssueRelationResponseToJSONTyped(value?: IssueRelationResponse | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'blocking': value['blocking'],
        'blocked_by': value['blockedBy'],
        'duplicate': value['duplicate'],
        'relates_to': value['relatesTo'],
        'start_after': value['startAfter'],
        'start_before': value['startBefore'],
        'finish_after': value['finishAfter'],
        'finish_before': value['finishBefore'],
    };
}

