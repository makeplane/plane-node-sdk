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
import type { IssueRelationCreateRelationTypeEnum } from './IssueRelationCreateRelationTypeEnum';
import {
    IssueRelationCreateRelationTypeEnumFromJSON,
    IssueRelationCreateRelationTypeEnumFromJSONTyped,
    IssueRelationCreateRelationTypeEnumToJSON,
    IssueRelationCreateRelationTypeEnumToJSONTyped,
} from './IssueRelationCreateRelationTypeEnum';

/**
 * Serializer for creating issue relations.
 * 
 * Creates issue relations with the specified relation type and issues.
 * Validates relation types and ensures proper issue ID format.
 * @export
 * @interface IssueRelationCreateRequest
 */
export interface IssueRelationCreateRequest {
    /**
     * Type of relationship between work items
     * 
     * * `blocking` - Blocking
     * * `blocked_by` - Blocked By
     * * `duplicate` - Duplicate
     * * `relates_to` - Relates To
     * * `start_before` - Start Before
     * * `start_after` - Start After
     * * `finish_before` - Finish Before
     * * `finish_after` - Finish After
     * @type {IssueRelationCreateRelationTypeEnum}
     * @memberof IssueRelationCreateRequest
     */
    relationType: IssueRelationCreateRelationTypeEnum;
    /**
     * Array of work item IDs to create relations with
     * @type {Array<string>}
     * @memberof IssueRelationCreateRequest
     */
    issues: Array<string>;
}



/**
 * Check if a given object implements the IssueRelationCreateRequest interface.
 */
export function instanceOfIssueRelationCreateRequest(value: object): value is IssueRelationCreateRequest {
    if (!('relationType' in value) || value['relationType'] === undefined) return false;
    if (!('issues' in value) || value['issues'] === undefined) return false;
    return true;
}

export function IssueRelationCreateRequestFromJSON(json: any): IssueRelationCreateRequest {
    return IssueRelationCreateRequestFromJSONTyped(json, false);
}

export function IssueRelationCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRelationCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'relationType': IssueRelationCreateRelationTypeEnumFromJSON(json['relation_type']),
        'issues': json['issues'],
    };
}

export function IssueRelationCreateRequestToJSON(json: any): IssueRelationCreateRequest {
    return IssueRelationCreateRequestToJSONTyped(json, false);
}

export function IssueRelationCreateRequestToJSONTyped(value?: IssueRelationCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'relation_type': IssueRelationCreateRelationTypeEnumToJSON(value['relationType']),
        'issues': value['issues'],
    };
}

