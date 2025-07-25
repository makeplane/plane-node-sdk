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
 * @interface State
 */
export interface State {
    /**
     * 
     * @type {string}
     * @memberof State
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof State
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof State
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof State
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    color: string;
    /**
     * 
     * @type {number}
     * @memberof State
     */
    sequence?: number;
    /**
     * 
     * @type {GroupEnum}
     * @memberof State
     */
    group?: GroupEnum;
    /**
     * 
     * @type {boolean}
     * @memberof State
     */
    isTriage?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof State
     */
    _default?: boolean;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof State
     */
    readonly workspace?: string;
}



/**
 * Check if a given object implements the State interface.
 */
export function instanceOfState(value: object): value is State {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('color' in value) || value['color'] === undefined) return false;
    return true;
}

export function StateFromJSON(json: any): State {
    return StateFromJSONTyped(json, false);
}

export function StateFromJSONTyped(json: any, ignoreDiscriminator: boolean): State {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'color': json['color'],
        'sequence': json['sequence'] == null ? undefined : json['sequence'],
        'group': json['group'] == null ? undefined : GroupEnumFromJSON(json['group']),
        'isTriage': json['is_triage'] == null ? undefined : json['is_triage'],
        '_default': json['default'] == null ? undefined : json['default'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
    };
}

export function StateToJSON(json: any): State {
    return StateToJSONTyped(json, false);
}

export function StateToJSONTyped(value?: Omit<State, 'id'|'created_at'|'updated_at'|'deleted_at'|'created_by'|'updated_by'|'project'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
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

