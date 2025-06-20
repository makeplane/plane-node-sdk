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
import type { PriorityEnum } from './PriorityEnum';
import {
    PriorityEnumFromJSON,
    PriorityEnumFromJSONTyped,
    PriorityEnumToJSON,
    PriorityEnumToJSONTyped,
} from './PriorityEnum';

/**
 * Serializer for work item data within intake submissions.
 * 
 * Handles essential work item fields for intake processing including
 * content validation and priority assignment for triage workflows.
 * @export
 * @interface IssueForIntakeRequest
 */
export interface IssueForIntakeRequest {
    /**
     * 
     * @type {string}
     * @memberof IssueForIntakeRequest
     */
    name: string;
    /**
     * 
     * @type {any}
     * @memberof IssueForIntakeRequest
     */
    description?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssueForIntakeRequest
     */
    descriptionHtml?: string;
    /**
     * 
     * @type {PriorityEnum}
     * @memberof IssueForIntakeRequest
     */
    priority?: PriorityEnum;
}



/**
 * Check if a given object implements the IssueForIntakeRequest interface.
 */
export function instanceOfIssueForIntakeRequest(value: object): value is IssueForIntakeRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueForIntakeRequestFromJSON(json: any): IssueForIntakeRequest {
    return IssueForIntakeRequestFromJSONTyped(json, false);
}

export function IssueForIntakeRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueForIntakeRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'priority': json['priority'] == null ? undefined : PriorityEnumFromJSON(json['priority']),
    };
}

export function IssueForIntakeRequestToJSON(json: any): IssueForIntakeRequest {
    return IssueForIntakeRequestToJSONTyped(json, false);
}

export function IssueForIntakeRequestToJSONTyped(value?: IssueForIntakeRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'description_html': value['descriptionHtml'],
        'priority': PriorityEnumToJSON(value['priority']),
    };
}

