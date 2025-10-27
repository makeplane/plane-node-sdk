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

/**
 * Comprehensive work item serializer with full relationship management.
 * 
 * Handles complete work item lifecycle including assignees, labels, validation,
 * and related model updates. Supports dynamic field expansion and HTML content processing.
 * @export
 * @interface Issue
 */
export interface Issue {
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    typeId?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof Issue
     */
    point?: number | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    descriptionHtml?: string;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    descriptionStripped?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    readonly descriptionBinary?: string | null;
    /**
     * 
     * @type {PriorityEnum}
     * @memberof Issue
     */
    priority?: PriorityEnum;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof Issue
     */
    sequenceId?: number;
    /**
     * 
     * @type {number}
     * @memberof Issue
     */
    sortOrder?: number;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    completedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Issue
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {boolean}
     * @memberof Issue
     */
    isDraft?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    parent?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    state?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    estimatePoint?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Issue
     */
    type?: string | null;
}



/**
 * Check if a given object implements the Issue interface.
 */
export function instanceOfIssue(value: object): value is Issue {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueFromJSON(json: any): Issue {
    return IssueFromJSONTyped(json, false);
}

export function IssueFromJSONTyped(json: any, ignoreDiscriminator: boolean): Issue {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'typeId': json['type_id'] == null ? undefined : json['type_id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'point': json['point'] == null ? undefined : json['point'],
        'name': json['name'],
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
        'state': json['state'] == null ? undefined : json['state'],
        'estimatePoint': json['estimate_point'] == null ? undefined : json['estimate_point'],
        'type': json['type'] == null ? undefined : json['type'],
    };
}

export function IssueToJSON(json: any): Issue {
    return IssueToJSONTyped(json, false);
}

export function IssueToJSONTyped(value?: Omit<Issue, 'id'|'created_at'|'updated_at'|'description_binary'|'updated_by'|'project'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'type_id': value['typeId'],
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'point': value['point'],
        'name': value['name'],
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
        'created_by': value['createdBy'],
        'parent': value['parent'],
        'state': value['state'],
        'estimate_point': value['estimatePoint'],
        'type': value['type'],
    };
}

