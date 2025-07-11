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
 * Serializer for work item search result data formatting.
 * 
 * Provides standardized search result structure including work item identifiers,
 * project context, and workspace information for search API responses.
 * @export
 * @interface IssueSearch
 */
export interface IssueSearch {
    /**
     * Issue ID
     * @type {string}
     * @memberof IssueSearch
     */
    id: string;
    /**
     * Issue name
     * @type {string}
     * @memberof IssueSearch
     */
    name: string;
    /**
     * Issue sequence ID
     * @type {string}
     * @memberof IssueSearch
     */
    sequenceId: string;
    /**
     * Project identifier
     * @type {string}
     * @memberof IssueSearch
     */
    projectIdentifier: string;
    /**
     * Project ID
     * @type {string}
     * @memberof IssueSearch
     */
    projectId: string;
    /**
     * Workspace slug
     * @type {string}
     * @memberof IssueSearch
     */
    workspaceSlug: string;
}

/**
 * Check if a given object implements the IssueSearch interface.
 */
export function instanceOfIssueSearch(value: object): value is IssueSearch {
    if (!('id' in value) || value['id'] === undefined) return false;
    if (!('name' in value) || value['name'] === undefined) return false;
    if (!('sequenceId' in value) || value['sequenceId'] === undefined) return false;
    if (!('projectIdentifier' in value) || value['projectIdentifier'] === undefined) return false;
    if (!('projectId' in value) || value['projectId'] === undefined) return false;
    if (!('workspaceSlug' in value) || value['workspaceSlug'] === undefined) return false;
    return true;
}

export function IssueSearchFromJSON(json: any): IssueSearch {
    return IssueSearchFromJSONTyped(json, false);
}

export function IssueSearchFromJSONTyped(json: any, ignoreDiscriminator: boolean): IssueSearch {
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

export function IssueSearchToJSON(json: any): IssueSearch {
    return IssueSearchToJSONTyped(json, false);
}

export function IssueSearchToJSONTyped(value?: IssueSearch | null, ignoreDiscriminator: boolean = false): any {
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

