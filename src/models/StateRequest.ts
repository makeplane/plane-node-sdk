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
import type { GroupEnum } from './GroupEnum';
import {
    GroupEnumFromJSON,
    GroupEnumFromJSONTyped,
    GroupEnumToJSON,
    GroupEnumToJSONTyped,
} from './GroupEnum';

/**
 * Serializer for work item states with default state management.
 * 
 * Handles state creation and updates including default state validation
 * and automatic default state switching for workflow management.
 * @export
 * @interface StateRequest
 */
export interface StateRequest {
    /**
     * 
     * @type {string}
     * @memberof StateRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof StateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof StateRequest
     */
    color: string;
    /**
     * 
     * @type {number}
     * @memberof StateRequest
     */
    sequence?: number;
    /**
     * 
     * @type {GroupEnum}
     * @memberof StateRequest
     */
    group?: GroupEnum;
    /**
     * 
     * @type {boolean}
     * @memberof StateRequest
     */
    isTriage?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof StateRequest
     */
    _default?: boolean;
    /**
     * 
     * @type {string}
     * @memberof StateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof StateRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the StateRequest interface.
 */
export function instanceOfStateRequest(value: object): value is StateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('color' in value) || value['color'] === undefined) return false;
    return true;
}

export function StateRequestFromJSON(json: any): StateRequest {
    return StateRequestFromJSONTyped(json, false);
}

export function StateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): StateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'color': json['color'],
        'sequence': json['sequence'] == null ? undefined : json['sequence'],
        'group': json['group'] == null ? undefined : GroupEnumFromJSON(json['group']),
        'isTriage': json['is_triage'] == null ? undefined : json['is_triage'],
        '_default': json['default'] == null ? undefined : json['default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function StateRequestToJSON(json: any): StateRequest {
    return StateRequestToJSONTyped(json, false);
}

export function StateRequestToJSONTyped(value?: StateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'color': value['color'],
        'sequence': value['sequence'],
        'group': GroupEnumToJSON(value['group']),
        'is_triage': value['isTriage'],
        'default': value['_default'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

