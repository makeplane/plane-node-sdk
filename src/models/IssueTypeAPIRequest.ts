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
 * @interface IssueTypeAPIRequest
 */
export interface IssueTypeAPIRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueTypeAPIRequest
     */
    projectIds?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPIRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssueTypeAPIRequest
     */
    isEpic?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssueTypeAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueTypeAPIRequest
     */
    externalId?: string | null;
}

/**
 * Check if a given object implements the IssueTypeAPIRequest interface.
 */
export function instanceOfIssueTypeAPIRequest(value: object): value is IssueTypeAPIRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueTypeAPIRequestFromJSON(json: any): IssueTypeAPIRequest {
    return IssueTypeAPIRequestFromJSONTyped(json, false);
}

export function IssueTypeAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueTypeAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'projectIds': json['project_ids'] == null ? undefined : json['project_ids'],
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'isEpic': json['is_epic'] == null ? undefined : json['is_epic'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function IssueTypeAPIRequestToJSON(json: any): IssueTypeAPIRequest {
    return IssueTypeAPIRequestToJSONTyped(json, false);
}

export function IssueTypeAPIRequestToJSONTyped(value?: IssueTypeAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'project_ids': value['projectIds'],
        'name': value['name'],
        'description': value['description'],
        'is_epic': value['isEpic'],
        'is_active': value['isActive'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

