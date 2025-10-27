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
import type { TimezoneEnum } from './TimezoneEnum';
import {
    TimezoneEnumFromJSON,
    TimezoneEnumFromJSONTyped,
    TimezoneEnumToJSON,
    TimezoneEnumToJSONTyped,
} from './TimezoneEnum';

/**
 * Cycle serializer with comprehensive project metrics and time tracking.
 * 
 * Provides cycle details including work item counts by status, progress estimates,
 * and time-bound iteration data for project management and sprint planning.
 * @export
 * @interface Cycle
 */
export interface Cycle {
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly id?: string;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly totalIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly cancelledIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly completedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly startedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly unstartedIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly backlogIssues?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly totalEstimates?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly completedEstimates?: number;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    readonly startedEstimates?: number;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    description?: string;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    startDate?: Date | null;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    endDate?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof Cycle
     */
    viewProps?: any | null;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    sortOrder?: number;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    externalId?: string | null;
    /**
     * 
     * @type {any}
     * @memberof Cycle
     */
    progressSnapshot?: any | null;
    /**
     * 
     * @type {Date}
     * @memberof Cycle
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {any}
     * @memberof Cycle
     */
    logoProps?: any | null;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof Cycle
     */
    timezone?: TimezoneEnum;
    /**
     * 
     * @type {number}
     * @memberof Cycle
     */
    version?: number;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof Cycle
     */
    readonly ownedBy?: string;
}



/**
 * Check if a given object implements the Cycle interface.
 */
export function instanceOfCycle(value: object): value is Cycle {
    if (!('name' in value) || value['name'] === undefined) return false;
    return true;
}

export function CycleFromJSON(json: any): Cycle {
    return CycleFromJSONTyped(json, false);
}

export function CycleFromJSONTyped(json: any, ignoreDiscriminator: boolean): Cycle {
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
        'totalEstimates': json['total_estimates'] == null ? undefined : json['total_estimates'],
        'completedEstimates': json['completed_estimates'] == null ? undefined : json['completed_estimates'],
        'startedEstimates': json['started_estimates'] == null ? undefined : json['started_estimates'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'startDate': json['start_date'] == null ? undefined : (new Date(json['start_date'])),
        'endDate': json['end_date'] == null ? undefined : (new Date(json['end_date'])),
        'viewProps': json['view_props'] == null ? undefined : json['view_props'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'progressSnapshot': json['progress_snapshot'] == null ? undefined : json['progress_snapshot'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
        'version': json['version'] == null ? undefined : json['version'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'ownedBy': json['owned_by'] == null ? undefined : json['owned_by'],
    };
}

export function CycleToJSON(json: any): Cycle {
    return CycleToJSONTyped(json, false);
}

export function CycleToJSONTyped(value?: Omit<Cycle, 'id'|'total_issues'|'cancelled_issues'|'completed_issues'|'started_issues'|'unstarted_issues'|'backlog_issues'|'total_estimates'|'completed_estimates'|'started_estimates'|'created_at'|'updated_at'|'deleted_at'|'created_by'|'updated_by'|'project'|'workspace'|'owned_by'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'start_date': value['startDate'] == null ? undefined : ((value['startDate'] as any).toISOString()),
        'end_date': value['endDate'] == null ? undefined : ((value['endDate'] as any).toISOString()),
        'view_props': value['viewProps'],
        'sort_order': value['sortOrder'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'progress_snapshot': value['progressSnapshot'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString()),
        'logo_props': value['logoProps'],
        'timezone': TimezoneEnumToJSON(value['timezone']),
        'version': value['version'],
    };
}

