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
 * Comprehensive module serializer with work item metrics and member management.
 * 
 * Provides complete module data including work item counts by status, member relationships,
 * and progress tracking for feature-based project organization.
 * @export
 * @interface Module
 */
export interface Module {
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    readonly id?: string;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly totalIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly cancelledIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly completedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly startedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly unstartedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    readonly backlogIssues?: number;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    description?: string;
    /**
     * 
     * @type {any}
     * @memberof Module
     */
    descriptionText?: any | null;
    /**
     * 
     * @type {any}
     * @memberof Module
     */
    descriptionHtml?: any | null;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    targetDate?: Date | null;
    /**
     * 
     * @type {ModuleStatusEnum}
     * @memberof Module
     */
    status?: ModuleStatusEnum;
    /**
     * 
     * @type {any}
     * @memberof Module
     */
    viewProps?: any | null;
    /**
     * 
     * @type {number}
     * @memberof Module
     */
    sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    externalId?: string | null;
    /**
     * 
     * @type {Date}
     * @memberof Module
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof Module
     */
    logoProps?: any | null;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof Module
     */
    lead?: string | null;
}



/**
 * Check if a given object implements the Module interface.
 */
export function instanceOfModule(value: object): value is Module {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function ModuleFromJSON(json: any): Module {
    return ModuleFromJSONTyped(json, false);
}

export function ModuleFromJSONTyped(json: any, ignoreDiscriminator: boolean): Module {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'totalIssues': json['total_issues'] == null ? undefined : json['total_issues'],
        'cancelledIssues': json['cancelled_issues'] == null ? undefined : json['cancelled_issues'],
        'completedIssues': json['completed_issues'] == null ? undefined : json['completed_issues'],
        'startedIssues': json['started_issues'] == null ? undefined : json['started_issues'],
        'unstartedIssues': json['unstarted_issues'] == null ? undefined : json['unstarted_issues'],
        'backlogIssues': json['backlog_issues'] == null ? undefined : json['backlog_issues'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'descriptionText': json['description_text'] == null ? undefined : json['description_text'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'targetDate': json['target_date'] == null ? undefined : (new Date(json['target_date'])),
        'status': json['status'] == null ? undefined : ModuleStatusEnumFromJSON(json['status']),
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'lead': json['lead'] == null ? undefined : json['lead'],
    };
}

export function ModuleToJSON(json: any): Module {
    return ModuleToJSONTyped(json, false);
}

export function ModuleToJSONTyped(value?: Omit<Module, 'id'|'total_issues'|'cancelled_issues'|'completed_issues'|'started_issues'|'unstarted_issues'|'backlog_issues'|'created_at'|'updated_at'|'deleted_at'|'created_by'|'updated_by'|'project'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'description_text': value['descriptionText'],
        'description_html': value['descriptionHtml'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString().substring(0,10)),
        'target_date': value['targetDate'] == null ? undefined : ((value['targetDate'] as any).toISOString().substring(0,10)),
        'status': ModuleStatusEnumToJSON(value['status']),
        'view_props': value['viewProps'],
        'sort_order': value['sortOrder'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString()),
        'logo_props': value['logoProps'],
        'lead': value['lead'],
    };
}

