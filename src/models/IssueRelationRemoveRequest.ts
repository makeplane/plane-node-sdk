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
 * Serializer for removing issue relations.
 * 
 * Removes existing relationships between work items by specifying
 * the related issue ID.
 * @export
 * @interface IssueRelationRemoveRequest
 */
export interface IssueRelationRemoveRequest {
    /**
     * ID of the related work item to remove relation with
     * @type {string}
     * @memberof IssueRelationRemoveRequest
     */
    relatedIssue: string;
}

/**
 * Check if a given object implements the IssueRelationRemoveRequest interface.
 */
export function instanceOfIssueRelationRemoveRequest(value: object): value is IssueRelationRemoveRequest {
    if (!('relatedIssue' in value) || value['relatedIssue'] === undefined) return false;
    return true;
}

export function IssueRelationRemoveRequestFromJSON(json: any): IssueRelationRemoveRequest {
    return IssueRelationRemoveRequestFromJSONTyped(json, false);
}

export function IssueRelationRemoveRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRelationRemoveRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'relatedIssue': json['related_issue'],
    };
}

export function IssueRelationRemoveRequestToJSON(json: any): IssueRelationRemoveRequest {
    return IssueRelationRemoveRequestToJSONTyped(json, false);
}

export function IssueRelationRemoveRequestToJSONTyped(value?: IssueRelationRemoveRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'related_issue': value['relatedIssue'],
    };
}

