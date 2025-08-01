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
import type { NetworkEnum } from './NetworkEnum';
import {
    NetworkEnumFromJSON,
    NetworkEnumFromJSONTyped,
    NetworkEnumToJSON,
    NetworkEnumToJSONTyped,
} from './NetworkEnum';
import type { TimezoneEnum } from './TimezoneEnum';
import {
    TimezoneEnumFromJSON,
    TimezoneEnumFromJSONTyped,
    TimezoneEnumToJSON,
    TimezoneEnumToJSONTyped,
} from './TimezoneEnum';

/**
 * Comprehensive project serializer with metrics and member context.
 * 
 * Provides complete project data including member counts, cycle/module totals,
 * deployment status, and user-specific context for project management.
 * @export
 * @interface Project
 */
export interface Project {
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly id?: string;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    readonly totalMembers?: number;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    readonly totalCycles?: number;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    readonly totalModules?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    readonly isMember?: boolean;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    readonly sortOrder?: number;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    readonly memberRole?: number;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    readonly isDeployed?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly coverImageUrl?: string;
    /**
     * 
     * @type {Date}
     * @memberof Project
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Project
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof Project
     */
    readonly deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    description?: string;
    /**
     * 
     * @type {any}
     * @memberof Project
     */
    descriptionText?: any | null;
    /**
     * 
     * @type {any}
     * @memberof Project
     */
    descriptionHtml?: any | null;
    /**
     * 
     * @type {NetworkEnum}
     * @memberof Project
     */
    network?: NetworkEnum;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    identifier: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly emoji?: string | null;
    /**
     * 
     * @type {any}
     * @memberof Project
     */
    iconProp?: any | null;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    moduleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    cycleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    issueViewsView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    pageView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    intakeView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    isTimeTrackingEnabled?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    isIssueTypeEnabled?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof Project
     */
    guestViewAllFeatures?: boolean;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    coverImage?: string | null;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    archiveIn?: number;
    /**
     * 
     * @type {number}
     * @memberof Project
     */
    closeIn?: number;
    /**
     * 
     * @type {any}
     * @memberof Project
     */
    logoProps?: any | null;
    /**
     * 
     * @type {Date}
     * @memberof Project
     */
    archivedAt?: Date | null;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof Project
     */
    timezone?: TimezoneEnum;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    externalId?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    defaultAssignee?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    projectLead?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    coverImageAsset?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    estimate?: string | null;
    /**
     * 
     * @type {string}
     * @memberof Project
     */
    defaultState?: string | null;
}



/**
 * Check if a given object implements the Project interface.
 */
export function instanceOfProject(value: object): value is Project {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('identifier' in value) || value['identifier'] === undefined) return false;
    return true;
}

export function ProjectFromJSON(json: any): Project {
    return ProjectFromJSONTyped(json, false);
}

export function ProjectFromJSONTyped(json: any, ignoreDiscriminator: boolean): Project {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'totalMembers': json['total_members'] == null ? undefined : json['total_members'],
        'totalCycles': json['total_cycles'] == null ? undefined : json['total_cycles'],
        'totalModules': json['total_modules'] == null ? undefined : json['total_modules'],
        'isMember': json['is_member'] == null ? undefined : json['is_member'],
        'sortOrder': json['sort_order'] == null ? undefined : json['sort_order'],
        'memberRole': json['member_role'] == null ? undefined : json['member_role'],
        'isDeployed': json['is_deployed'] == null ? undefined : json['is_deployed'],
        'coverImageUrl': json['cover_image_url'] == null ? undefined : json['cover_image_url'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'descriptionText': json['description_text'] == null ? undefined : json['description_text'],
        'descriptionHtml': json['description_html'] == null ? undefined : json['description_html'],
        'network': json['network'] == null ? undefined : NetworkEnumFromJSON(json['network']),
        'identifier': json['identifier'],
        'emoji': json['emoji'] == null ? undefined : json['emoji'],
        'iconProp': json['icon_prop'] == null ? undefined : json['icon_prop'],
        'moduleView': json['module_view'] == null ? undefined : json['module_view'],
        'cycleView': json['cycle_view'] == null ? undefined : json['cycle_view'],
        'issueViewsView': json['issue_views_view'] == null ? undefined : json['issue_views_view'],
        'pageView': json['page_view'] == null ? undefined : json['page_view'],
        'intakeView': json['intake_view'] == null ? undefined : json['intake_view'],
        'isTimeTrackingEnabled': json['is_time_tracking_enabled'] == null ? undefined : json['is_time_tracking_enabled'],
        'isIssueTypeEnabled': json['is_issue_type_enabled'] == null ? undefined : json['is_issue_type_enabled'],
        'guestViewAllFeatures': json['guest_view_all_features'] == null ? undefined : json['guest_view_all_features'],
        'coverImage': json['cover_image'] == null ? undefined : json['cover_image'],
        'archiveIn': json['archive_in'] == null ? undefined : json['archive_in'],
        'closeIn': json['close_in'] == null ? undefined : json['close_in'],
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'archivedAt': json['archived_at'] == null ? undefined : (new Date(json['archived_at'])),
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'defaultAssignee': json['default_assignee'] == null ? undefined : json['default_assignee'],
        'projectLead': json['project_lead'] == null ? undefined : json['project_lead'],
        'coverImageAsset': json['cover_image_asset'] == null ? undefined : json['cover_image_asset'],
        'estimate': json['estimate'] == null ? undefined : json['estimate'],
        'defaultState': json['default_state'] == null ? undefined : json['default_state'],
    };
}

export function ProjectToJSON(json: any): Project {
    return ProjectToJSONTyped(json, false);
}

export function ProjectToJSONTyped(value?: Omit<Project, 'id'|'total_members'|'total_cycles'|'total_modules'|'is_member'|'sort_order'|'member_role'|'is_deployed'|'cover_image_url'|'created_at'|'updated_at'|'deleted_at'|'emoji'|'created_by'|'updated_by'|'workspace'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'description_text': value['descriptionText'],
        'description_html': value['descriptionHtml'],
        'network': NetworkEnumToJSON(value['network']),
        'identifier': value['identifier'],
        'icon_prop': value['iconProp'],
        'module_view': value['moduleView'],
        'cycle_view': value['cycleView'],
        'issue_views_view': value['issueViewsView'],
        'page_view': value['pageView'],
        'intake_view': value['intakeView'],
        'is_time_tracking_enabled': value['isTimeTrackingEnabled'],
        'is_issue_type_enabled': value['isIssueTypeEnabled'],
        'guest_view_all_features': value['guestViewAllFeatures'],
        'cover_image': value['coverImage'],
        'archive_in': value['archiveIn'],
        'close_in': value['closeIn'],
        'logo_props': value['logoProps'],
        'archived_at': value['archivedAt'] == null ? undefined : ((value['archivedAt'] as any).toISOString()),
        'timezone': TimezoneEnumToJSON(value['timezone']),
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'default_assignee': value['defaultAssignee'],
        'project_lead': value['projectLead'],
        'cover_image_asset': value['coverImageAsset'],
        'estimate': value['estimate'],
        'default_state': value['defaultState'],
    };
}

