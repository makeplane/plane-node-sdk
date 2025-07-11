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
import type { TimezoneEnum } from './TimezoneEnum';
import {
    TimezoneEnumFromJSON,
    TimezoneEnumFromJSONTyped,
    TimezoneEnumToJSON,
    TimezoneEnumToJSONTyped,
} from './TimezoneEnum';

/**
 * Serializer for creating projects with workspace validation.
 * 
 * Handles project creation including identifier validation, member verification,
 * and workspace association for new project initialization.
 * @export
 * @interface ProjectCreateRequest
 */
export interface ProjectCreateRequest {
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    name: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    projectLead?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    defaultAssignee?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    identifier: string;
    /**
     * 
     * @type {any}
     * @memberof ProjectCreateRequest
     */
    iconProp?: any | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    emoji?: string | null;
    /**
     * 
     * @type {string}
     * @memberof ProjectCreateRequest
     */
    coverImage?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    moduleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    cycleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    issueViewsView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    pageView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    intakeView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof ProjectCreateRequest
     */
    guestViewAllFeatures?: boolean;
    /**
     * 
     * @type {number}
     * @memberof ProjectCreateRequest
     */
    archiveIn?: number;
    /**
     * 
     * @type {number}
     * @memberof ProjectCreateRequest
     */
    closeIn?: number;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof ProjectCreateRequest
     */
    timezone?: TimezoneEnum;
}



/**
 * Check if a given object implements the ProjectCreateRequest interface.
 */
export function instanceOfProjectCreateRequest(value: object): value is ProjectCreateRequest {
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('identifier' in value) || value['identifier'] === undefined) return false;
    return true;
}

export function ProjectCreateRequestFromJSON(json: any): ProjectCreateRequest {
    return ProjectCreateRequestFromJSONTyped(json, false);
}

export function ProjectCreateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectCreateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'projectLead': json['project_lead'] == null ? undefined : json['project_lead'],
        'defaultAssignee': json['default_assignee'] == null ? undefined : json['default_assignee'],
        'identifier': json['identifier'],
        'iconProp': json['icon_prop'] == null ? undefined : json['icon_prop'],
        'emoji': json['emoji'] == null ? undefined : json['emoji'],
        'coverImage': json['cover_image'] == null ? undefined : json['cover_image'],
        'moduleView': json['module_view'] == null ? undefined : json['module_view'],
        'cycleView': json['cycle_view'] == null ? undefined : json['cycle_view'],
        'issueViewsView': json['issue_views_view'] == null ? undefined : json['issue_views_view'],
        'pageView': json['page_view'] == null ? undefined : json['page_view'],
        'intakeView': json['intake_view'] == null ? undefined : json['intake_view'],
        'guestViewAllFeatures': json['guest_view_all_features'] == null ? undefined : json['guest_view_all_features'],
        'archiveIn': json['archive_in'] == null ? undefined : json['archive_in'],
        'closeIn': json['close_in'] == null ? undefined : json['close_in'],
        'timezone': json['timezone'] == null ? undefined : TimezoneEnumFromJSON(json['timezone']),
    };
}

export function ProjectCreateRequestToJSON(json: any): ProjectCreateRequest {
    return ProjectCreateRequestToJSONTyped(json, false);
}

export function ProjectCreateRequestToJSONTyped(value?: ProjectCreateRequest | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'name': value['name'],
        'description': value['description'],
        'project_lead': value['projectLead'],
        'default_assignee': value['defaultAssignee'],
        'identifier': value['identifier'],
        'icon_prop': value['iconProp'],
        'emoji': value['emoji'],
        'cover_image': value['coverImage'],
        'module_view': value['moduleView'],
        'cycle_view': value['cycleView'],
        'issue_views_view': value['issueViewsView'],
        'page_view': value['pageView'],
        'intake_view': value['intakeView'],
        'guest_view_all_features': value['guestViewAllFeatures'],
        'archive_in': value['archiveIn'],
        'close_in': value['closeIn'],
        'timezone': TimezoneEnumToJSON(value['timezone']),
    };
}

