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
 * Serializer for cycle-issue relationships with sub-issue counting.
 * 
 * Manages the association between cycles and work items, including
 * hierarchical issue tracking for nested work item structures.
 * @export
 * @interface CycleIssue
 */
export interface CycleIssue {
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    readonly id?: string;
    /**
     * 
     * @type {number}
     * @memberof CycleIssue
     */
    readonly subIssuesCount?: number;
    /**
     * 
     * @type {Date}
     * @memberof CycleIssue
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CycleIssue
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof CycleIssue
     */
    deletedAt: Date | null;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    issue: string;
    /**
     * 
     * @type {string}
     * @memberof CycleIssue
     */
    readonly cycle?: string;
}

/**
 * Check if a given object implements the CycleIssue interface.
 */
export function instanceOfCycleIssue(value: object): value is CycleIssue {
    if (!('deletedAt' in value) || value['deletedAt'] === undefined) return false;
    if (!('issue' in value) || value['issue'] === undefined) return false;
    return true;
}

export function CycleIssueFromJSON(json: any): CycleIssue {
    return CycleIssueFromJSONTyped(json, false);
}

export function CycleIssueFromJSONTyped(json: any, ignoreDiscriminator: boolean): CycleIssue {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'subIssuesCount': json['sub_issues_count'] == null ? undefined : json['sub_issues_count'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': (json['deleted_at'] == null ? null : new Date(json['deleted_at'])),
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'issue': json['issue'],
        'cycle': json['cycle'] == null ? undefined : json['cycle'],
    };
}

export function CycleIssueToJSON(json: any): CycleIssue {
    return CycleIssueToJSONTyped(json, false);
}

export function CycleIssueToJSONTyped(value?: Omit<CycleIssue, 'id'|'sub_issues_count'|'created_at'|'updated_at'|'project'|'workspace'|'cycle'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': (value['deletedAt'] == null ? null : (value['deletedAt'] as any).toISOString()),
        'created_by': value['createdBy'],
        'updated_by': value['updatedBy'],
        'issue': value['issue'],
    };
}

