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
 * Serializer for creating and updating work item labels.
 * 
 * Manages label metadata including colors, descriptions, hierarchy,
 * and sorting for work item categorization and filtering.
 * @export
 * @interface PatchedLabelCreateUpdateRequest
 */
export interface PatchedLabelCreateUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    color?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    parent?: string | null;
    /**
     * 
     * @type {number}
     * @memberof PatchedLabelCreateUpdateRequest
     */
    sortOrder?: number;
}

/**
 * Check if a given object implements the PatchedLabelCreateUpdateRequest interface.
 */
export function instanceOfPatchedLabelCreateUpdateRequest(value: object): value is PatchedLabelCreateUpdateRequest {
    return true;
}

export function PatchedLabelCreateUpdateRequestFromJSON(json: any): PatchedLabelCreateUpdateRequest {
    return PatchedLabelCreateUpdateRequestFromJSONTyped(json, false);
}

export function PatchedLabelCreateUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedLabelCreateUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'color': json['color'] == null ? undefined : json['color'],
        'description': json['description'] == null ? undefined : json['description'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'parent': json['parent'] == null ? undefined : json['parent'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
    };
}

export function PatchedLabelCreateUpdateRequestToJSON(json: any): PatchedLabelCreateUpdateRequest {
    return PatchedLabelCreateUpdateRequestToJSONTyped(json, false);
}

export function PatchedLabelCreateUpdateRequestToJSONTyped(value?: PatchedLabelCreateUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
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

