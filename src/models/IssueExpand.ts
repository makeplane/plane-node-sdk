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
import type { PriorityEnum } from './PriorityEnum';
import {
    PriorityEnumFromJSON,
    PriorityEnumFromJSONTyped,
    PriorityEnumToJSON,
    PriorityEnumToJSONTyped,
} from './PriorityEnum';
import type { StateLite } from './StateLite';
import {
    StateLiteFromJSON,
    StateLiteFromJSONTyped,
    StateLiteToJSON,
    StateLiteToJSONTyped,
} from './StateLite';
import type { CycleLite } from './CycleLite';
import {
    CycleLiteFromJSON,
    CycleLiteFromJSONTyped,
    CycleLiteToJSON,
    CycleLiteToJSONTyped,
} from './CycleLite';
import type { ModuleLite } from './ModuleLite';
import {
    ModuleLiteFromJSON,
    ModuleLiteFromJSONTyped,
    ModuleLiteToJSON,
    ModuleLiteToJSONTyped,
} from './ModuleLite';

/**
 * Extended work item serializer with full relationship expansion.
 * 
 * Provides work items with expanded related data including cycles, modules,
 * labels, assignees, and states for comprehensive data representation.
 * @export
 * @interface IssueExpand
 */
export interface IssueExpand {
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly id?: string;
    /**
     * 
     * @type {CycleLite}
     * @memberof IssueExpand
     */
    readonly cycle?: CycleLite;
    /**
     * 
     * @type {ModuleLite}
     * @memberof IssueExpand
     */
    readonly module?: ModuleLite;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly labels?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly assignees?: string;
    /**
     * 
     * @type {StateLite}
     * @memberof IssueExpand
     */
    readonly state?: StateLite;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof IssueExpand
     */
    point?: number | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    name: string;
    /**
     * 
     * @type {any}
     * @memberof IssueExpand
     */
    description?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    descriptionHtml?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    descriptionStripped?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly descriptionBinary?: string | null;
    /**
     * 
     * @type {PriorityEnum}
     * @memberof IssueExpand
     */
    priority?: PriorityEnum;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof IssueExpand
     */
    sequenceId?: number;
    /**
     * 
     * @type {number}
     * @memberof IssueExpand
     */
    sortOrder?: number;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    completedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueExpand
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssueExpand
     */
    isDraft?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    parent?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    estimatePoint?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueExpand
     */
    type?: string | null;
}



/**
 * Check if a given object implements the IssueExpand interface.
 */
export function instanceOfIssueExpand(value: object): value is IssueExpand {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueExpandFromJSON(json: any): IssueExpand {
    return IssueExpandFromJSONTyped(json, false);
}

export function IssueExpandFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueExpand {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'cycle': json['cycle'] == null ? undefined : CycleLiteFromJSON(json['cycle']),
        'module': json['module'] == null ? undefined : ModuleLiteFromJSON(json['module']),
        'labels': json['labels'] == null ? undefined : json['labels'],
        'assignees': json['assignees'] == null ? undefined : json['assignees'],
        'state': json['state'] == null ? undefined : StateLiteFromJSON(json['state']),
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'point': json['point'] == null ? undefined : json['point'],
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'descriptionStripped': json['description_stripped'] == null ? undefined : json['description_stripped'],
        'descriptionBinary': json['description_binary'] == null ? undefined : json['description_binary'],
        'priority': json['priority'] == null ? undefined : PriorityEnumFromJSON(json['priority']),
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'targetDate': json['target_date'] == null ? undefined : (new Date(json['target_date'])),
        'sequenceId': json['sequence_id'] == null ? undefined : json['sequence_id'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'completedAt': json['completed_at'] == null ? undefined : (new Date(json['completed_at'])),
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'isDraft': json['is_draft'] == null ? undefined : json['is_draft'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'parent': json['parent'] == null ? undefined : json['parent'],
        'estimatePoint': json['estimate_point'] == null ? undefined : json['estimate_point'],
        'type': json['type'] == null ? undefined : json['type'],
    };
}

export function IssueExpandToJSON(json: any): IssueExpand {
    return IssueExpandToJSONTyped(json, false);
}

export function IssueExpandToJSONTyped(value?: Omit<IssueExpand, 'id'|'cycle'|'module'|'labels'|'assignees'|'state'|'created_at'|'updated_at'|'description_binary'|'created_by'|'updated_by'|'project'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'point': value['point'],
        'name': value['name'],
        'description': value['description'],
        'description_html': value['descriptionHtml'],
        'description_stripped': value['descriptionStripped'],
        'priority': PriorityEnumToJSON(value['priority']),
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString().substring(0,10)),
        'target_date': value['targetDate'] == null ? undefined : ((value['targetDate'] as any).toISOString().substring(0,10)),
        'sequence_id': value['sequenceId'],
        'sort_order': value['sortOrder'],
        'completed_at': value['completedAt'] == null ? undefined : ((value['completedAt'] as any).toISOString()),
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString().substring(0,10)),
        'is_draft': value['isDraft'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'parent': value['parent'],
        'estimate_point': value['estimatePoint'],
        'type': value['type'],
    };
}

