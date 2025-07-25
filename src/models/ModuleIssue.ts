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
 * Serializer for module-work item relationships with sub-item counting.
 * 
 * Manages the association between modules and work items, including
 * hierarchical issue tracking for nested work item structures.
 * @export
 * @interface ModuleIssue
 */
export interface ModuleIssue {
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly id?: string;
    /**
     * 
     * @type {number}
     * @memberof ModuleIssue
     */
    readonly subIssuesCount?: number;
    /**
     * 
     * @type {Date}
     * @memberof ModuleIssue
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ModuleIssue
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof ModuleIssue
     */
    deletedAt: Date | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    readonly module?: string;
    /**
     * 
     * @type {string}
     * @memberof ModuleIssue
     */
    issue: string;
}

/**
 * Check if a given object implements the ModuleIssue interface.
 */
export function instanceOfModuleIssue(value: object): value is ModuleIssue {
    if (!('deletedAt' in value) || value['deletedAt'] === undefined) return false;
    if (!('issue' in value) || value['issue'] === undefined) return false;
    return true;
}

export function ModuleIssueFromJSON(json: any): ModuleIssue {
    return ModuleIssueFromJSONTyped(json, false);
}

export function ModuleIssueFromJSONTyped(json: any, ignoreDiscriminator: boolean): ModuleIssue {
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
        'module': json['module'] == null ? undefined : json['module'],
        'issue': json['issue'],
    };
}

export function ModuleIssueToJSON(json: any): ModuleIssue {
    return ModuleIssueToJSONTyped(json, false);
}

export function ModuleIssueToJSONTyped(value?: Omit<ModuleIssue, 'id'|'sub_issues_count'|'created_at'|'updated_at'|'created_by'|'updated_by'|'project'|'workspace'|'module'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': (value['deletedAt'] == null ? null : (value['deletedAt'] as any).toISOString()),
        'issue': value['issue'],
    };
}

