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
 * Full serializer for work item external links.
 * 
 * Provides complete link information including metadata and timestamps
 * for managing external resource associations with work items.
 * @export
 * @interface IssueLink
 */
export interface IssueLink {
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly id?: string;
    /**
     * 
     * @type {Date}
     * @memberof IssueLink
     */
    readonly createdAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueLink
     */
    readonly updatedAt?: Date;
    /**
     * 
     * @type {Date}
     * @memberof IssueLink
     */
    deletedAt?: Date | null;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    title?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    url: string;
    /**
     * 
     * @type {any}
     * @memberof IssueLink
     */
    metadata?: any | null;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly createdBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly updatedBy?: string | null;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly project?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly workspace?: string;
    /**
     * 
     * @type {string}
     * @memberof IssueLink
     */
    readonly issue?: string;
}

/**
 * Check if a given object implements the IssueLink interface.
 */
export function instanceOfIssueLink(value: object): value is IssueLink {
    if (!('url' in value) || value['url'] === undefined) return false;
    return true;
}

export function IssueLinkFromJSON(json: any): IssueLink {
    return IssueLinkFromJSONTyped(json, false);
}

export function IssueLinkFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueLink {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'] == null ? undefined : json['id'],
        'createdAt': json['created_at'] == null ? undefined : (new Date(json['created_at'])),
        'updatedAt': json['updated_at'] == null ? undefined : (new Date(json['updated_at'])),
        'deletedAt': json['deleted_at'] == null ? undefined : (new Date(json['deleted_at'])),
        'title': json['title'] == null ? undefined : json['title'],
        'url': json['url'],
        'metadata': json['metadata'] == null ? undefined : json['metadata'],
        'createdBy': json['created_by'] == null ? undefined : json['created_by'],
        'updatedBy': json['updated_by'] == null ? undefined : json['updated_by'],
        'project': json['project'] == null ? undefined : json['project'],
        'workspace': json['workspace'] == null ? undefined : json['workspace'],
        'issue': json['issue'] == null ? undefined : json['issue'],
    };
}

export function IssueLinkToJSON(json: any): IssueLink {
    return IssueLinkToJSONTyped(json, false);
}

export function IssueLinkToJSONTyped(value?: Omit<IssueLink, 'id'|'created_at'|'updated_at'|'created_by'|'updated_by'|'project'|'workspace'|'issue'> | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'deleted_at': value['deletedAt'] == null ? undefined : ((value['deletedAt'] as any).toISOString()),
        'title': value['title'],
        'url': value['url'],
        'metadata': value['metadata'],
    };
}

