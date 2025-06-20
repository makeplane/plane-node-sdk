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
 * 
 * @export
 * @interface GetWorkspaceMembers200ResponseInner
 */
export interface GetWorkspaceMembers200ResponseInner {
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly firstName?: string;
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly lastName?: string;
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly email?: string | null;
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly avatar?: string;
    /**
     * Avatar URL
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly avatarUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    readonly displayName?: string;
    /**
     * Member role in the workspace
     * @type {number}
     * @memberof GetWorkspaceMembers200ResponseInner
     */
    role?: number;
}

/**
 * Check if a given object implements the GetWorkspaceMembers200ResponseInner interface.
 */
export function instanceOfGetWorkspaceMembers200ResponseInner(value: object): value is GetWorkspaceMembers200ResponseInner {
    return true;
}

export function GetWorkspaceMembers200ResponseInnerFromJSON(json: any): GetWorkspaceMembers200ResponseInner {
    return GetWorkspaceMembers200ResponseInnerFromJSONTyped(json, false);
}

export function GetWorkspaceMembers200ResponseInnerFromJSONTyped(json: any, ignoreDiscriminator: boolean): GetWorkspaceMembers200ResponseInner {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'firstName': json['first_name'] == null ? undefined : json['first_name'],
        'lastName': json['last_name'] == null ? undefined : json['last_name'],
        'email': json['email'] == null ? undefined : json['email'],
        'avatar': json['avatar'] == null ? undefined : json['avatar'],
        'avatarUrl': json['avatar_url'] == null ? undefined : json['avatar_url'],
        'displayName': json['display_name'] == null ? undefined : json['display_name'],
        'role': json['role'] == null ? undefined : json['role'],
    };
}

export function GetWorkspaceMembers200ResponseInnerToJSON(json: any): GetWorkspaceMembers200ResponseInner {
    return GetWorkspaceMembers200ResponseInnerToJSONTyped(json, false);
}

export function GetWorkspaceMembers200ResponseInnerToJSONTyped(value?: Omit<GetWorkspaceMembers200ResponseInner, 'id'|'first_name'|'last_name'|'email'|'avatar'|'avatar_url'|'display_name'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'role': value['role'],
    };
}

