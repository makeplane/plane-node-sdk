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
 * Lightweight user serializer for minimal data transfer.
 * 
 * Provides essential user information including names, avatar, and contact details
 * optimized for member lists, assignee displays, and user references.
 * @export
 * @interface UserLite
 */
export interface UserLite {
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly id?: string;
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly firstName?: string;
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly lastName?: string;
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly email?: string | null;
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly avatar?: string;
    /**
     * Avatar URL
     * @type {string}
     * @memberof UserLite
     */
    readonly avatarUrl?: string;
    /**
     * 
     * @type {string}
     * @memberof UserLite
     */
    readonly displayName?: string;
}

/**
 * Check if a given object implements the UserLite interface.
 */
export function instanceOfUserLite(value: object): value is UserLite {
    return true;
}

export function UserLiteFromJSON(json: any): UserLite {
    return UserLiteFromJSONTyped(json, false);
}

export function UserLiteFromJSONTyped(json: any, ignoreDiscriminator: boolean): UserLite {
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
    };
}

export function UserLiteToJSON(json: any): UserLite {
    return UserLiteToJSONTyped(json, false);
}

export function UserLiteToJSONTyped(value?: Omit<UserLite, 'id'|'first_name'|'last_name'|'email'|'avatar'|'avatar_url'|'display_name'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
    };
}

