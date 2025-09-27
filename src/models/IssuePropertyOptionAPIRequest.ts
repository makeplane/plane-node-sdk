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
 * 
 * @export
 * @interface IssuePropertyOptionAPIRequest
 */
export interface IssuePropertyOptionAPIRequest {
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPIRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPIRequest
     */
    description?: string;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyOptionAPIRequest
     */
    isActive?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof IssuePropertyOptionAPIRequest
     */
    isDefault?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPIRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPIRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssuePropertyOptionAPIRequest
     */
    parent?: string | null;
}

/**
 * Check if a given object implements the IssuePropertyOptionAPIRequest interface.
 */
export function instanceOfIssuePropertyOptionAPIRequest(value: object): value is IssuePropertyOptionAPIRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssuePropertyOptionAPIRequestFromJSON(json: any): IssuePropertyOptionAPIRequest {
    return IssuePropertyOptionAPIRequestFromJSONTyped(json, false);
}

export function IssuePropertyOptionAPIRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssuePropertyOptionAPIRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'isActive': json['is_active'] == null ? undefined : json['is_active'],
        'isDefault': json['is_default'] == null ? undefined : json['is_default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'parent': json['parent'] == null ? undefined : json['parent'],
    };
}

export function IssuePropertyOptionAPIRequestToJSON(json: any): IssuePropertyOptionAPIRequest {
    return IssuePropertyOptionAPIRequestToJSONTyped(json, false);
}

export function IssuePropertyOptionAPIRequestToJSONTyped(value?: IssuePropertyOptionAPIRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'is_active': value['isActive'],
        'is_default': value['isDefault'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
    };
}

