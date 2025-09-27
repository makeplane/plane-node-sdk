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
 * Serializer for creating and updating work item labels.
 * 
 * Manages label metadata including colors, descriptions, hierarchy,
 * and sorting for work item categorization and filtering.
 * @export
 * @interface LabelCreateUpdateRequest
 */
export interface LabelCreateUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    color?: string;
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof LabelCreateUpdateRequest
     */
    parent?: string | null;
    /**
     * 
     * @type {number}
     * @memberof LabelCreateUpdateRequest
     */
    sortOrder?: number;
}

/**
 * Check if a given object implements the LabelCreateUpdateRequest interface.
 */
export function instanceOfLabelCreateUpdateRequest(value: object): value is LabelCreateUpdateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function LabelCreateUpdateRequestFromJSON(json: any): LabelCreateUpdateRequest {
    return LabelCreateUpdateRequestFromJSONTyped(json, false);
}

export function LabelCreateUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): LabelCreateUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'color': json['color'] == null ? undefined : json['color'],
        'description': json['description'] == null ? undefined : json['description'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'parent': json['parent'] == null ? undefined : json['parent'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
    };
}

export function LabelCreateUpdateRequestToJSON(json: any): LabelCreateUpdateRequest {
    return LabelCreateUpdateRequestToJSONTyped(json, false);
}

export function LabelCreateUpdateRequestToJSONTyped(value?: LabelCreateUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'color': value['color'],
        'description': value['description'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
        'sort_order': value['sortOrder'],
    };
}

