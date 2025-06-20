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
 * @interface PatchedStateRequest
 */
export interface PatchedStateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedStateRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedStateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedStateRequest
     */
    color?: string;
    /**
     * 
     * @type {number}
     * @memberof PatchedStateRequest
     */
    sequence?: number;
    /**
     * 
     * @type {GroupEnum}
     * @memberof PatchedStateRequest
     */
    group?: GroupEnum;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedStateRequest
     */
    isTriage?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedStateRequest
     */
    _default?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PatchedStateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedStateRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the PatchedStateRequest interface.
 */
export function instanceOfPatchedStateRequest(value: object): value is PatchedStateRequest {
    return true;
}

export function PatchedStateRequestFromJSON(json: any): PatchedStateRequest {
    return PatchedStateRequestFromJSONTyped(json, false);
}

export function PatchedStateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedStateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'color': json['color'] == null ? undefined : json['color'],
        'sequence': json['sequence'] == null ? undefined : json['sequence'],
        'group': json['group'] == null ? undefined : GroupEnumFromJSON(json['group']),
        'isTriage': json['is_triage'] == null ? undefined : json['is_triage'],
        '_default': json['default'] == null ? undefined : json['default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function PatchedStateRequestToJSON(json: any): PatchedStateRequest {
    return PatchedStateRequestToJSONTyped(json, false);
}

export function PatchedStateRequestToJSONTyped(value?: PatchedStateRequest | null, ignoreDiscriminator: boolean = false): any {
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

