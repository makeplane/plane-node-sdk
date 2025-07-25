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
import type { ModuleStatusEnum } from './ModuleStatusEnum';
import {
    ModuleStatusEnumFromJSON,
    ModuleStatusEnumFromJSONTyped,
    ModuleStatusEnumToJSON,
    ModuleStatusEnumToJSONTyped,
} from './ModuleStatusEnum';

/**
 * Serializer for updating modules with enhanced validation and member management.
 * 
 * Extends module creation with update-specific validations including member reassignment,
 * name conflict checking, and relationship management for module modifications.
 * @export
 * @interface PatchedModuleUpdateRequest
 */
export interface PatchedModuleUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedModuleUpdateRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedModuleUpdateRequest
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof PatchedModuleUpdateRequest
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof PatchedModuleUpdateRequest
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {ModuleStatusEnum}
     * @memberof PatchedModuleUpdateRequest
     */
    status?: ModuleStatusEnum;
    /**
     * 
     * @type {string}
     * @memberof PatchedModuleUpdateRequest
     */
    lead?: string | null;
    /**
     * 
     * @type {Array<string>}
     * @memberof PatchedModuleUpdateRequest
     */
    members?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof PatchedModuleUpdateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedModuleUpdateRequest
     */
    externalId?: string | null;
}



/**
 * Check if a given object implements the PatchedModuleUpdateRequest interface.
 */
export function instanceOfPatchedModuleUpdateRequest(value: object): value is PatchedModuleUpdateRequest {
    return true;
}

export function PatchedModuleUpdateRequestFromJSON(json: any): PatchedModuleUpdateRequest {
    return PatchedModuleUpdateRequestFromJSONTyped(json, false);
}

export function PatchedModuleUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedModuleUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'targetDate': json['target_date'] == null ? undefined : (new Date(json['target_date'])),
        'status': json['status'] == null ? undefined : ModuleStatusEnumFromJSON(json['status']),
        'lead': json['lead'] == null ? undefined : json['lead'],
        'members': json['members'] == null ? undefined : json['members'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
    };
}

export function PatchedModuleUpdateRequestToJSON(json: any): PatchedModuleUpdateRequest {
    return PatchedModuleUpdateRequestToJSONTyped(json, false);
}

export function PatchedModuleUpdateRequestToJSONTyped(value?: PatchedModuleUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString().substring(0,10)),
        'target_date': value['targetDate'] == null ? undefined : ((value['targetDate'] as any).toISOString().substring(0,10)),
        'status': ModuleStatusEnumToJSON(value['status']),
        'lead': value['lead'],
        'members': value['members'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
    };
}

