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
 * Individual issue component for search results.
 * 
 * Provides standardized search result structure including work item identifiers,
 * project context, and workspace information for search API responses.
 * @export
 * @interface IssueSearchItem
 */
export interface IssueSearchItem {
    /**
     * Issue ID
     * @type {string}
     * @memberof IssueSearchItem
     */
    id: string;
    /**
     * Issue name
     * @type {string}
     * @memberof IssueSearchItem
     */
    name: string;
    /**
     * Issue sequence ID
     * @type {string}
     * @memberof IssueSearchItem
     */
    sequenceId: string;
    /**
     * Project identifier
     * @type {string}
     * @memberof IssueSearchItem
     */
    projectIdentifier: string;
    /**
     * Project ID
     * @type {string}
     * @memberof IssueSearchItem
     */
    projectId: string;
    /**
     * Workspace slug
     * @type {string}
     * @memberof IssueSearchItem
     */
    workspaceSlug: string;
}

/**
 * Check if a given object implements the IssueSearchItem interface.
 */
export function instanceOfIssueSearchItem(value: object): value is IssueSearchItem {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('sequenceId' in value) || value['sequenceId'] === undefined) return false;
    if (!('projectIdentifier' in value) || value['projectIdentifier'] === undefined) return false;
    if (!('projectId' in value) || value['projectId'] === undefined) return false;
    if (!('workspaceSlug' in value) || value['workspaceSlug'] === undefined) return false;
    return true;
}

export function IssueSearchItemFromJSON(json: any): IssueSearchItem {
    return IssueSearchItemFromJSONTyped(json, false);
}

export function IssueSearchItemFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueSearchItem {
    if (json == null) {
        return json;
    }
    return {
        
        'id': json['id'],
        'name': json['name'],
        'sequenceId': json['sequence_id'],
        'projectIdentifier': json['project__identifier'],
        'projectId': json['project_id'],
        'workspaceSlug': json['workspace__slug'],
    };
}

export function IssueSearchItemToJSON(json: any): IssueSearchItem {
    return IssueSearchItemToJSONTyped(json, false);
}

export function IssueSearchItemToJSONTyped(value?: IssueSearchItem | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'id': value['id'],
        'name': value['name'],
        'sequence_id': value['sequenceId'],
        'project__identifier': value['projectIdentifier'],
        'project_id': value['projectId'],
        'workspace__slug': value['workspaceSlug'],
    };
}

