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
 * @interface IssueRequest
 */
export interface IssueRequest {
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueRequest
     */
    assignees?: Array<string>;
    /**
     * 
     * @type {Array<string>}
     * @memberof IssueRequest
     */
    labels?: Array<string>;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    typeId?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueRequest
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof IssueRequest
     */
    point?: number | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    descriptionHtml?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    descriptionStripped?: string | null;
    /**
     * 
     * @type {PriorityEnum}
     * @memberof IssueRequest
     */
    priority?: PriorityEnum;
    /**
     * 
     * @type {Date}
     * @memberof IssueRequest
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueRequest
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {number}
     * @memberof IssueRequest
     */
    sequenceId?: number;
    /**
     * 
     * @type {number}
     * @memberof IssueRequest
     */
    sortOrder?: number;
    /**
     * 
     * @type {Date}
     * @memberof IssueRequest
     */
    completedAt?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof IssueRequest
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {boolean}
     * @memberof IssueRequest
     */
    isDraft?: boolean;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    parent?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    state?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    estimatePoint?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueRequest
     */
    type?: string | null;
}



/**
 * Check if a given object implements the IssueRequest interface.
 */
export function instanceOfIssueRequest(value: object): value is IssueRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function IssueRequestFromJSON(json: any): IssueRequest {
    return IssueRequestFromJSONTyped(json, false);
}

export function IssueRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'assignees': json['assignees'] == null ? undefined : json['assignees'],
        'labels': json['labels'] == null ? undefined : json['labels'],
        'typeId': json['type_id'] == null ? undefined : json['type_id'],
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'point': json['point'] == null ? undefined : json['point'],
        'name': json['name'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'descriptionStripped': json['description_stripped'] == null ? undefined : json['description_stripped'],
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
        'parent': json['parent'] == null ? undefined : json['parent'],
        'state': json['state'] == null ? undefined : json['state'],
        'estimatePoint': json['estimate_point'] == null ? undefined : json['estimate_point'],
        'type': json['type'] == null ? undefined : json['type'],
    };
}

export function IssueRequestToJSON(json: any): IssueRequest {
    return IssueRequestToJSONTyped(json, false);
}

export function IssueRequestToJSONTyped(value?: IssueRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'assignees': value['assignees'],
        'labels': value['labels'],
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

