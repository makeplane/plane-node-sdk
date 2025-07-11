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
 * 
 * @export
 * @interface IssueWorkLogAPIRequest
 */
export interface IssueWorkLogAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {number}
     * @memberof IssueWorkLogAPIRequest
     */
    duration?: number;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPIRequest
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueWorkLogAPIRequest
     */
    updatedBy?: string | null;
}

/**
 * Check if a given object implements the IssueWorkLogAPIRequest interface.
 */
export function instanceOfIssueWorkLogAPIRequest(value: object): value is IssueWorkLogAPIRequest {
    return true;
}

export function IssueWorkLogAPIRequestFromJSON(json: any): IssueWorkLogAPIRequest {
    return IssueWorkLogAPIRequestFromJSONTyped(json, false);
}

export function IssueWorkLogAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueWorkLogAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'description': json['description'] == null ? undefined : json['description'],
        'duration': json['duration'] == null ? undefined : json['duration'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
    };
}

export function IssueWorkLogAPIRequestToJSON(json: any): IssueWorkLogAPIRequest {
    return IssueWorkLogAPIRequestToJSONTyped(json, false);
}

export function IssueWorkLogAPIRequestToJSONTyped(value?: IssueWorkLogAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'description': value['description'],
        'duration': value['duration'],
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
    };
}

