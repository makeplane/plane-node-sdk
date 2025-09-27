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
 * Serializer for project worklog summary with aggregated duration per issue
 * @export
 * @interface ProjectWorklogSummary
 */
export interface ProjectWorklogSummary {
    /**
     * ID of the work item
     * @type {string}
     * @memberof ProjectWorklogSummary
     */
    issueId: string;
    /**
     * Total duration logged for this work item in seconds
     * @type {number}
     * @memberof ProjectWorklogSummary
     */
    duration: number;
}

/**
 * Check if a given object implements the ProjectWorklogSummary interface.
 */
export function instanceOfProjectWorklogSummary(value: object): value is ProjectWorklogSummary {
    if (!('issueId' in value) || value['issueId'] === undefined) return false;
    if (!('duration' in value) || value['duration'] === undefined) return false;
    return true;
}

export function ProjectWorklogSummaryFromJSON(json: any): ProjectWorklogSummary {
    return ProjectWorklogSummaryFromJSONTyped(json, false);
}

export function ProjectWorklogSummaryFromJSONTyped(json: any, ignoreDiscriminator: boolean): ProjectWorklogSummary {
    if (json == null) {
        return json;
    }
    return {
        
        'issueId': json['issue_id'],
        'duration': json['duration'],
    };
}

export function ProjectWorklogSummaryToJSON(json: any): ProjectWorklogSummary {
    return ProjectWorklogSummaryToJSONTyped(json, false);
}

export function ProjectWorklogSummaryToJSONTyped(value?: ProjectWorklogSummary | null, ignoreDiscriminator: boolean = false): any {
    if (value == null) {
        return value;
    }

    return {
        
        'issue_id': value['issueId'],
        'duration': value['duration'],
    };
}

