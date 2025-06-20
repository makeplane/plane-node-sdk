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
import type { IntakeWorkItemStatusEnum } from './IntakeWorkItemStatusEnum';
import {
    IntakeWorkItemStatusEnumFromJSON,
    IntakeWorkItemStatusEnumFromJSONTyped,
    IntakeWorkItemStatusEnumToJSON,
    IntakeWorkItemStatusEnumToJSONTyped,
} from './IntakeWorkItemStatusEnum';
import type { IssueExpand } from './IssueExpand';
import {
    IssueExpandFromJSON,
    IssueExpandFromJSONTyped,
    IssueExpandToJSON,
    IssueExpandToJSONTyped,
} from './IssueExpand';

/**
 * Comprehensive serializer for intake work items with expanded issue details.
 * 
 * Provides full intake work item data including embedded issue information,
 * status tracking, and triage metadata for issue queue management.
 * @export
 * @interface IntakeIssue
 */
export interface IntakeIssue {
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly id?: string;
    /**
     * 
     * @type {IssueExpand}
     * @memberof IntakeIssue
     */
    readonly issueDetail?: IssueExpand;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly inbox?: string;
    /**
     * 
     * @type {Date}
     * @memberof IntakeIssue
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IntakeIssue
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IntakeIssue
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {IntakeWorkItemStatusEnum}
     * @memberof IntakeIssue
     */
    status?: IntakeWorkItemStatusEnum;
    /**
     * 
     * @type {Date}
     * @memberof IntakeIssue
     */
    snoozedTill?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    source?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    sourceEmail?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    externalId?: string | null;
    /**
     * 
     * @type {any}
     * @memberof IntakeIssue
     */
    extra?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    intake: string;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    readonly issue?: string;
    /**
     * 
     * @type {string}
     * @memberof IntakeIssue
     */
    duplicateTo?: string | null;
}



/**
 * Check if a given object implements the IntakeIssue interface.
 */
export function instanceOfIntakeIssue(value: object): value is IntakeIssue {
    if (!('intake' in value) || value['intake'] === undefined) return false;
    return true;
}

export function IntakeIssueFromJSON(json: any): IntakeIssue {
    return IntakeIssueFromJSONTyped(json, false);
}

export function IntakeIssueFromJSONTyped(json: any, ignoreDiscriminator: boolean): IntakeIssue {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'issueDetail': json['issue_detail'] == null ? undefined : IssueExpandFromJSON(json['issue_detail']),
        'inbox': json['inbox'] == null ? undefined : json['inbox'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'status': json['status'] == null ? undefined : IntakeWorkItemStatusEnumFromJSON(json['status']),
        'snoozedTill': json['snoozed_till'] == null ? undefined : (new Date(json['snoozed_till'])),
        'source': json['source'] == null ? undefined : json['source'],
        'sourceEmail': json['source_email'] == null ? undefined : json['source_email'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'extra': json['extra'] == null ? undefined : json['extra'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'intake': json['intake'],
        'issue': json['issue'] == null ? undefined : json['issue'],
        'duplicateTo': json['duplicate_to'] == null ? undefined : json['duplicate_to'],
    };
}

export function IntakeIssueToJSON(json: any): IntakeIssue {
    return IntakeIssueToJSONTyped(json, false);
}

export function IntakeIssueToJSONTyped(value?: Omit<IntakeIssue, 'id'|'issue_detail'|'inbox'|'created_at'|'updated_at'|'created_by'|'updated_by'|'project'|'workspace'|'issue'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'status': IntakeWorkItemStatusEnumToJSON(value['status']),
        'snoozed_till': value['snoozedTill'] == null ? undefined : ((value['snoozedTill'] as any).toISOString()),
        'source': value['source'],
        'source_email': value['sourceEmail'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'extra': value['extra'],
        'intake': value['intake'],
        'duplicate_to': value['duplicateTo'],
    };
}

