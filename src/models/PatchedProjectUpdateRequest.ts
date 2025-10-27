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
 * Serializer for updating projects with enhanced state and estimation management.
 * 
 * Extends project creation with update-specific validations including default state
 * assignment, estimation configuration, and project setting modifications.
 * @export
 * @interface PatchedProjectUpdateRequest
 */
export interface PatchedProjectUpdateRequest {
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    name?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    description?: string;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    projectLead?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    defaultAssignee?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    identifier?: string;
    /**
     * 
     * @type {any}
     * @memberof PatchedProjectUpdateRequest
     */
    iconProp?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    emoji?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    coverImage?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    moduleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    cycleView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    issueViewsView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    pageView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    intakeView?: boolean;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    guestViewAllFeatures?: boolean;
    /**
     * 
     * @type {number}
     * @memberof PatchedProjectUpdateRequest
     */
    archiveIn?: number;
    /**
     * 
     * @type {number}
     * @memberof PatchedProjectUpdateRequest
     */
    closeIn?: number;
    /**
     * 
     * @type {TimezoneEnum}
     * @memberof PatchedProjectUpdateRequest
     */
    timezone?: TimezoneEnum;
    /**
     * 
     * @type {any}
     * @memberof PatchedProjectUpdateRequest
     */
    logoProps?: any | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    externalSource?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    externalId?: string | null;
    /**
     * 
     * @type {boolean}
     * @memberof PatchedProjectUpdateRequest
     */
    isIssueTypeEnabled?: boolean;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    defaultState?: string | null;
    /**
     * 
     * @type {string}
     * @memberof PatchedProjectUpdateRequest
     */
    estimate?: string | null;
}



/**
 * Check if a given object implements the PatchedProjectUpdateRequest interface.
 */
export function instanceOfPatchedProjectUpdateRequest(value: object): value is PatchedProjectUpdateRequest {
    return true;
}

export function PatchedProjectUpdateRequestFromJSON(json: any): PatchedProjectUpdateRequest {
    return PatchedProjectUpdateRequestFromJSONTyped(json, false);
}

export function PatchedProjectUpdateRequestFromJSONTyped(json: any, ignoreDiscriminator: boolean): PatchedProjectUpdateRequest {
    if (json == null) {
        return json;
    }
    return {
        
        'name': json['name'] == null ? undefined : json['name'],
        'description': json['description'] == null ? undefined : json['description'],
        'projectLead': json['project_lead'] == null ? undefined : json['project_lead'],
        'defaultAssignee': json['default_assignee'] == null ? undefined : json['default_assignee'],
        'identifier': json['identifier'] == null ? undefined : json['identifier'],
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
        'logoProps': json['logo_props'] == null ? undefined : json['logo_props'],
        'externalSource': json['external_source'] == null ? undefined : json['external_source'],
        'externalId': json['external_id'] == null ? undefined : json['external_id'],
        'isIssueTypeEnabled': json['is_issue_type_enabled'] == null ? undefined : json['is_issue_type_enabled'],
        'defaultState': json['default_state'] == null ? undefined : json['default_state'],
        'estimate': json['estimate'] == null ? undefined : json['estimate'],
    };
}

export function PatchedProjectUpdateRequestToJSON(json: any): PatchedProjectUpdateRequest {
    return PatchedProjectUpdateRequestToJSONTyped(json, false);
}

export function PatchedProjectUpdateRequestToJSONTyped(value?: PatchedProjectUpdateRequest | null, ignoreDiscriminator: boolean = false): any {
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
        'logo_props': value['logoProps'],
        'external_source': value['externalSource'],
        'external_id': value['externalId'],
        'is_issue_type_enabled': value['isIssueTypeEnabled'],
        'default_state': value['defaultState'],
        'estimate': value['estimate'],
    };
}

