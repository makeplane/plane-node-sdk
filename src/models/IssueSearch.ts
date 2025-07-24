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
import type { IssueSearchItem } from './IssueSearchItem';
import {
    IssueSearchItemFromJSON,
    IssueSearchItemFromJSONTyped,
    IssueSearchItemToJSON,
    IssueSearchItemToJSONTyped,
} from './IssueSearchItem';

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
     * Array of search result issues
     * @type {Array<IssueSearchItem>}
     * @memberof IssueSearch
     */
    issues: Array<IssueSearchItem>;
}

/**
 * Check if a given object implements the IssueSearch interface.
 */
export function instanceOfIssueSearch(value: object): value is IssueSearch {
    if (!('issues' in value) || value['issues'] === undefined) return false;
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
        
        'issues': ((json['issues'] as Array<any>).map(IssueSearchItemFromJSON)),
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
        
        'issues': ((value['issues'] as Array<any>).map(IssueSearchItemToJSON)),
    };
}

